import Stripe from 'stripe'
import { getStripeSecretKey } from '@/lib/stripe-server'
import {
  getCustodialByTransferToken,
  getPendingMagicByTransferToken,
  savePendingMagicPurchase,
  setSessionAwaitingMagic,
  type PendingMagicCardPurchase,
} from '@/lib/custodial-store'

/**
 * Resolve pending Magic checkout: KV store, or recover from Stripe after cold start.
 */
export async function resolvePendingMagicPurchase(
  transferToken: string,
  stripeCheckoutSessionId?: string | null,
): Promise<
  | { ok: true; pending: PendingMagicCardPurchase }
  | {
      ok: false
      reason: 'not_found' | 'already_claimed' | 'stripe_error' | 'not_paid' | 'metadata_mismatch'
    }
> {
  const rec = await getCustodialByTransferToken(transferToken)
  if (rec?.custody === 'magic') {
    return { ok: false, reason: 'already_claimed' }
  }

  let pending = await getPendingMagicByTransferToken(transferToken)
  if (pending) {
    return { ok: true, pending }
  }

  const sid = stripeCheckoutSessionId?.trim()
  if (!sid) {
    return { ok: false, reason: 'not_found' }
  }

  const secret = getStripeSecretKey()
  if (!secret) {
    return { ok: false, reason: 'stripe_error' }
  }

  const stripe = new Stripe(secret)
  let session: Stripe.Checkout.Session
  try {
    session = await stripe.checkout.sessions.retrieve(sid)
  } catch {
    return { ok: false, reason: 'stripe_error' }
  }

  if (session.payment_status !== 'paid') {
    return { ok: false, reason: 'not_paid' }
  }

  const meta = session.metadata
  const metaToken = meta?.transferToken?.trim()
  if (!metaToken || metaToken !== transferToken) {
    return { ok: false, reason: 'metadata_mismatch' }
  }

  const hexId = meta?.hexId
  const email = meta?.email?.toLowerCase().trim()
  if (!hexId || !email) {
    return { ok: false, reason: 'metadata_mismatch' }
  }

  pending = {
    stripeSessionId: session.id,
    hexId,
    email,
    transferToken: metaToken,
    createdAt: new Date().toISOString(),
  }
  await savePendingMagicPurchase(pending)
  await setSessionAwaitingMagic(session.id, pending)
  return { ok: true, pending }
}
