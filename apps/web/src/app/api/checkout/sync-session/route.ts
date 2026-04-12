import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { fulfillCardPurchase } from '@/lib/fulfill-card-purchase'
import { getSessionStatus, isStripeSessionProcessed } from '@/lib/custodial-store'
import { getStripeSecretKey } from '@/lib/stripe-server'

/**
 * Called from the browser after Stripe Checkout redirect.
 * Fulfills the mint when webhooks cannot reach localhost (dev) or as a backup to the webhook.
 */
export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { sessionId?: string }
    const sessionId = body.sessionId
    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json({ error: 'sessionId required' }, { status: 400 })
    }

    if (getSessionStatus(sessionId)?.state === 'complete') {
      return NextResponse.json({ ok: true, source: 'already_complete' })
    }

    if (isStripeSessionProcessed(sessionId)) {
      return NextResponse.json({ ok: true, source: 'already_processed' })
    }

    const secret = getStripeSecretKey()
    if (!secret) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
    }

    const stripe = new Stripe(secret)
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ ok: false, reason: 'not_paid' }, { status: 400 })
    }

    const hexId = session.metadata?.hexId
    const email = session.metadata?.email
    const transferToken = session.metadata?.transferToken
    if (!hexId || !email || !transferToken) {
      return NextResponse.json({ error: 'Checkout session missing metadata' }, { status: 400 })
    }

    await fulfillCardPurchase({
      stripeSessionId: sessionId,
      hexId,
      email,
      transferToken,
    })

    return NextResponse.json({ ok: true, source: 'fulfilled' })
  } catch (e) {
    console.error('[sync-session]', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Sync failed' },
      { status: 500 }
    )
  }
}
