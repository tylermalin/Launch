import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import Stripe from 'stripe'
import regionsData from '@/data/regions.json'
import { buildGenesisHexListItems } from '@/lib/genesis-hexes'
import { getClaimByHex } from '@/lib/genesis-claim-registry'
import { setSessionProcessing } from '@/lib/custodial-store'
import { getStripeSecretKey } from '@/lib/stripe-server'

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

    const { hexId, email } = (await req.json()) as { hexId?: string; email?: string }
    if (!hexId || !email) {
      return NextResponse.json({ error: 'hexId and email are required' }, { status: 400 })
    }
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
      },
    })

    if (session.id) {
      setSessionProcessing(session.id)
    }

    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (e) {
    console.error('[checkout/create-session]', e)
    return NextResponse.json({ error: 'Could not start checkout' }, { status: 500 })
  }
}
