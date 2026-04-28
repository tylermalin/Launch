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

const KOL_ID_RE = /^[a-zA-Z0-9_-]{1,48}$/

export const runtime = 'nodejs'

const PRICE_CENTS = 200_000 // $2,000.00

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

    const items = buildGenesisHexListItems(regionsData)
    const item = items.find((i) => i.hexId === hexId)
    if (!item || item.sold || item.status !== 'available') {
      return NextResponse.json({ error: 'This hex is not available for purchase' }, { status: 400 })
    }
    if (getClaimByHex(hexId)) {
      return NextResponse.json({ error: 'This hex is already reserved' }, { status: 409 })
    }
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const transferToken = randomUUID()

    const stripe = new Stripe(secret)

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: emailNorm,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: PRICE_CENTS,
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
        if (!lockHexForMagicCheckout(hexId, session.id)) {
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
