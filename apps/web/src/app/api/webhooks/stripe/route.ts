import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { fulfillCardPurchase } from '@/lib/fulfill-card-purchase'
import { isStripeSessionProcessed } from '@/lib/custodial-store'
import { getStripeSecretKey } from '@/lib/stripe-server'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  const key = getStripeSecretKey()
  if (!secret || !key) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 })
  }

  const raw = await req.text()
  const stripe = new Stripe(key)
  let event: Stripe.Event
  try {
    const sig = req.headers.get('stripe-signature')
    if (!sig) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }
    event = stripe.webhooks.constructEvent(raw, sig, secret)
  } catch (e) {
    console.error('[stripe webhook] signature', e)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true })
  }

  const session = event.data.object as Stripe.Checkout.Session
  const sessionId = session.id
  if (isStripeSessionProcessed(sessionId)) {
    return NextResponse.json({ received: true, duplicate: true })
  }

  const hexId = session.metadata?.hexId
  const email = session.metadata?.email
  const transferToken = session.metadata?.transferToken
  if (!hexId || !email || !transferToken) {
    console.error('[stripe webhook] missing metadata', session.metadata)
    return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
  }

  const paid = session.payment_status === 'paid'
  if (!paid) {
    return NextResponse.json({ received: true, skipped: true })
  }

  await fulfillCardPurchase({
    stripeSessionId: sessionId,
    hexId,
    email,
    transferToken,
  })

  return NextResponse.json({ received: true })
}
