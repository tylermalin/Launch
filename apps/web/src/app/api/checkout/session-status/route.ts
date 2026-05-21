import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { reconcilePaidCheckoutSession } from '@/lib/checkout-reconcile'
import type { CustodialRecord } from '@/lib/custodial-store'
import { getSessionStatus } from '@/lib/custodial-store'
import { getStripeSecretKey } from '@/lib/stripe-server'
import { requireGenesisContract } from '@/lib/genesis-contract'

export const runtime = 'nodejs'

const GENESIS_CONTRACT = requireGenesisContract()

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('session_id')
  if (!sessionId) {
    return NextResponse.json({ error: 'session_id required' }, { status: 400 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const respondAwaitingMagic = (p: { transferToken: string }, stripeCheckoutSessionId: string) =>
    NextResponse.json({
      state: 'awaiting_magic',
      transferToken: p.transferToken,
      stripeCheckoutSessionId,
      launchUrl: `${appUrl}/launch?token=${encodeURIComponent(p.transferToken)}&session_id=${encodeURIComponent(stripeCheckoutSessionId)}`,
      message:
        'Payment received. Open Launch App and sign in with Magic using the same email you used at checkout.',
    })

  const respondComplete = (rec: CustodialRecord) =>
    NextResponse.json({
      state: 'complete',
      claimId: rec.claimId,
      hexId: rec.hexId,
      email: rec.email,
      custody: rec.custody,
      custodialAddress: rec.address,
      evmTokenId: rec.evmTokenId,
      txHash: rec.txHash,
      explorerUrl: `https://sepolia.basescan.org/tx/${rec.txHash}`,
      openSeaUrl: `https://testnets.opensea.io/assets/base-sepolia/${GENESIS_CONTRACT}/${rec.evmTokenId}`,
      transferUrl:
        rec.custody === 'server'
          ? `${appUrl}/custodial/transfer?claimId=${encodeURIComponent(rec.claimId)}&token=${encodeURIComponent(rec.transferToken)}`
          : rec.stripeCheckoutSessionId
            ? `${appUrl}/launch?token=${encodeURIComponent(rec.transferToken)}&session_id=${encodeURIComponent(rec.stripeCheckoutSessionId)}`
            : `${appUrl}/launch?token=${encodeURIComponent(rec.transferToken)}`,
      launchUrl:
        rec.custody === 'magic' && rec.stripeCheckoutSessionId
          ? `${appUrl}/launch?token=${encodeURIComponent(rec.transferToken)}&session_id=${encodeURIComponent(rec.stripeCheckoutSessionId)}`
          : `${appUrl}/launch?token=${encodeURIComponent(rec.transferToken)}`,
    })

  let local = getSessionStatus(sessionId)
  if (local?.state === 'awaiting_magic') {
    return respondAwaitingMagic(local.pending, sessionId)
  }
  if (local?.state === 'complete' && local.record) {
    return respondComplete(local.record)
  }
  if (local?.state === 'error') {
    return NextResponse.json({ state: 'error', error: local.error ?? 'Processing failed' })
  }

  /** Stripe paid but this server has no terminal state yet (first poll, sync missed, or cold instance). */
  await reconcilePaidCheckoutSession(sessionId)

  local = getSessionStatus(sessionId)
  if (local?.state === 'awaiting_magic') {
    return respondAwaitingMagic(local.pending, sessionId)
  }
  if (local?.state === 'complete' && local.record) {
    return respondComplete(local.record)
  }
  if (local?.state === 'error') {
    return NextResponse.json({ state: 'error', error: local.error ?? 'Processing failed' })
  }

  const secret = getStripeSecretKey()
  if (!secret) {
    return NextResponse.json({ state: 'error', error: 'Stripe not configured' }, { status: 503 })
  }

  const stripe = new Stripe(secret)
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.payment_status !== 'paid') {
      return NextResponse.json({
        state: session.status === 'open' ? 'pending' : 'unpaid',
      })
    }
    return NextResponse.json({
      state: 'processing',
      message: 'Payment received — minting your NFT…',
    })
  } catch {
    return NextResponse.json({ state: 'error', error: 'Invalid session' }, { status: 404 })
  }
}
