import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import Stripe from 'stripe'
import { cookies } from 'next/headers'
import regionsData from '@/data/regions.json'
import { buildGenesisHexListItems } from '@/lib/genesis-hexes'
import { getClaimByHex } from '@/lib/genesis-claim-registry'
import { setSessionProcessing, lockHexForMagicCheckout } from '@/lib/custodial-store'
import { getCardCustodyMode } from '@/lib/card-custody'
import { getStripeSecretKey } from '@/lib/stripe-server'
import { resolveAppUrl } from '@/lib/resolve-app-url'

const KOL_ID_RE = /^[a-zA-Z0-9_-]{1,48}$/

export const runtime = 'nodejs'

const PRICE_CENTS = 200_000 // $2,000.00

/**
 * Resolve the checkout amount in cents.
 *
 * For safe end-to-end LIVE testing, set CHECKOUT_TEST_PRICE_CENTS (e.g. 100 = $1.00)
 * in a test/staging env so a real card flow can be exercised without a $2,000 charge.
 * Safety: defaults to PRICE_CENTS if unset/invalid, and is clamped to
 * [50 (Stripe USD minimum), PRICE_CENTS] so it can never exceed the real price.
 * Logs a loud warning whenever the override is active — UNSET IT IN PRODUCTION.
 */
function resolveUnitAmount(): number {
  const raw = process.env.CHECKOUT_TEST_PRICE_CENTS
  if (!raw) return PRICE_CENTS
  const cents = Number.parseInt(raw, 10)
  if (!Number.isFinite(cents) || cents < 50 || cents > PRICE_CENTS) return PRICE_CENTS
  console.warn(
    `[checkout/create-session] ⚠️ TEST PRICE OVERRIDE active: $${(cents / 100).toFixed(2)} ` +
      `(CHECKOUT_TEST_PRICE_CENTS=${cents}). This must be UNSET in production.`
  )
  return cents
}

export async function POST(req: Request) {
  try {
    const secret = getStripeSecretKey()
    if (!secret) {
      return NextResponse.json(
        { error: 'Card payments are not configured (set NEXT_PRIVATE_STRIPE_KEY or STRIPE_SECRET_KEY).' },
        { status: 503 }
      )
    }

    const { hexId, email, referrerId: bodyRef } = (await req.json()) as {
      hexId?: string
      email?: string
      referrerId?: string
    }
    if (!hexId || !email) {
      return NextResponse.json({ error: 'hexId and email are required' }, { status: 400 })
    }

    // Resolve referrer: body param takes precedence over cookie (cookie set by ReferralCapture)
    const cookieStore = await cookies()
    const cookieRef = cookieStore.get('malama_ref')?.value
    const rawRef = bodyRef || cookieRef
    const referrerId = rawRef && KOL_ID_RE.test(rawRef) ? rawRef : undefined
    const emailNorm = email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNorm)) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    const items = await buildGenesisHexListItems(regionsData)
    const item = items.find((i) => i.hexId === hexId)
    if (!item || item.sold || item.status !== 'available') {
      return NextResponse.json({ error: 'This hex is not available for purchase' }, { status: 400 })
    }
    if (await getClaimByHex(hexId)) {
      return NextResponse.json({ error: 'This hex is already reserved' }, { status: 409 })
    }
    const appUrl = resolveAppUrl(req)
    const transferToken = randomUUID()

    const stripe = new Stripe(secret)

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: emailNorm,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: resolveUnitAmount(),
            product_data: {
              name: 'Mālama Genesis Hex Node License',
              description: `H3 territory: ${hexId.slice(0, 18)}…`,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/presale/card-complete?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/presale?hex=${encodeURIComponent(hexId)}`,
      metadata: {
        hexId,
        email: emailNorm,
        transferToken,
        ...(referrerId ? { referrerId } : {}),
      },
    })

    if (session.id) {
      setSessionProcessing(session.id)
      if (getCardCustodyMode() === 'magic') {
        if (!(await lockHexForMagicCheckout(hexId, session.id))) {
          try {
            await stripe.checkout.sessions.expire(session.id)
          } catch {
            /* best effort — avoid orphan paid-less session */
          }
          return NextResponse.json(
            { error: 'This hex is already held by another active card checkout' },
            { status: 409 }
          )
        }
      }
    }

    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (e) {
    console.error('[checkout/create-session]', e)
    return NextResponse.json({ error: 'Could not start checkout' }, { status: 500 })
  }
}
