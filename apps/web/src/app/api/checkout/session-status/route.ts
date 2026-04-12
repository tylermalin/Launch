import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getSessionStatus } from '@/lib/custodial-store'
import { getStripeSecretKey } from '@/lib/stripe-server'

export const runtime = 'nodejs'

const GENESIS_CONTRACT = (process.env.NEXT_PUBLIC_GENESIS_CONTRACT_ADDRESS ??
  '0x2222222222222222222222222222222222222222') as `0x${string}`

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('session_id')
  if (!sessionId) {
    return NextResponse.json({ error: 'session_id required' }, { status: 400 })
  }

  const local = getSessionStatus(sessionId)
  if (local?.state === 'complete' && local.record) {
    const r = local.record
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    return NextResponse.json({
      state: 'complete',
      claimId: r.claimId,
      hexId: r.hexId,
      email: r.email,
      custodialAddress: r.address,
      evmTokenId: r.evmTokenId,
      txHash: r.txHash,
      explorerUrl: `https://sepolia.basescan.org/tx/${r.txHash}`,
      openSeaUrl: `https://testnets.opensea.io/assets/base-sepolia/${GENESIS_CONTRACT}/${r.evmTokenId}`,
      transferUrl: `${appUrl}/custodial/transfer?claimId=${encodeURIComponent(r.claimId)}&token=${encodeURIComponent(r.transferToken)}`,
    })
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
