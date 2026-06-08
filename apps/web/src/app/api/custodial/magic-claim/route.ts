import { NextResponse } from 'next/server'
import { issueClaim, bindEvmTokenToClaim, updateClaimTxHash, releaseClaim } from '@/lib/genesis-claim-registry'
import { adminMintToAddress, resolveTokenIdFromTx } from '@/lib/admin-genesis-mint'
import type { CustodialRecord } from '@/lib/custodial-store'
import {
  removePendingMagicPurchase,
  saveCustodialRecord,
  setSessionComplete,
  markStripeSessionProcessed,
  unlockHexForMagicCheckout,
} from '@/lib/custodial-store'
import { verifyMagicDidToken } from '@/lib/magic-server'
import { upsertUserAccount } from '@/lib/user-account'
import { resolvePendingMagicPurchase } from '@/lib/resolve-pending-magic'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  // Track a reservation so a failed mint can release it (else retries 409 forever).
  let reservedHexId: string | null = null
  try {
    const body = (await req.json()) as {
      didToken?: string
      transferToken?: string
      stripeSessionId?: string
    }
    const didToken = typeof body.didToken === 'string' ? body.didToken.trim() : ''
    const transferToken = typeof body.transferToken === 'string' ? body.transferToken.trim() : ''
    const stripeSessionId =
      typeof body.stripeSessionId === 'string' ? body.stripeSessionId.trim() : undefined

    if (!didToken || !transferToken) {
      return NextResponse.json({ error: 'didToken and transferToken are required' }, { status: 400 })
    }

    const resolved = await resolvePendingMagicPurchase(transferToken, stripeSessionId ?? null)
    if (!resolved.ok) {
      if (resolved.reason === 'already_claimed') {
        return NextResponse.json(
          { error: 'This purchase was already claimed. Your NFT should be in your Magic wallet.' },
          { status: 409 }
        )
      }
      if (resolved.reason === 'metadata_mismatch') {
        return NextResponse.json(
          { error: 'Transfer token does not match this Stripe session. Use the link from card-complete or add ?session_id=cs_.' },
          { status: 400 }
        )
      }
      if (resolved.reason === 'not_paid') {
        return NextResponse.json({ error: 'This Stripe session is not paid yet.' }, { status: 400 })
      }
      if (resolved.reason === 'stripe_error') {
        return NextResponse.json(
          { error: 'Could not load Stripe session. Check STRIPE_SECRET_KEY and session id.' },
          { status: 502 }
        )
      }
      return NextResponse.json(
        { error: 'No pending purchase in memory. Use /launch?token=.&session_id=cs_. from card-complete.' },
        { status: 404 }
      )
    }
    const pending = resolved.pending

    const { email, publicAddress } = await verifyMagicDidToken(didToken)
    if (email !== pending.email) {
      return NextResponse.json(
        { error: 'Signed-in Magic email must match the email used at checkout.' },
        { status: 403 }
      )
    }

    const reserved = await issueClaim(pending.hexId, 'base', publicAddress)
    if (!reserved.ok) {
      return NextResponse.json(
        { error: reserved.error ?? 'Could not reserve hex — it may no longer be available.' },
        { status: 409 }
      )
    }

    const claimId = reserved.claim.claimId
    reservedHexId = pending.hexId

    // Broadcast the mint. Returns on tx hash; tokenId unknown until receipt.
    const { txHash } = await adminMintToAddress({
      hexId: pending.hexId,
      recipient: publicAddress,
    })

    // PERSIST IMMEDIATELY on txHash, before any receipt wait, so a slow
    // receipt can never strand the record. tokenId backfilled below.
    await updateClaimTxHash({ claimId, txHash })

    const record: CustodialRecord = {
      claimId,
      hexId: pending.hexId,
      email: pending.email,
      address: publicAddress,
      encryptedPrivateKey: '',
      transferToken: pending.transferToken,
      evmTokenId: 0,
      txHash,
      createdAt: new Date().toISOString(),
      custody: 'magic',
      stripeCheckoutSessionId: pending.stripeSessionId,
    }

    await removePendingMagicPurchase(pending)
    await unlockHexForMagicCheckout(pending.hexId, pending.stripeSessionId)
    await saveCustodialRecord(record)
    await setSessionComplete(pending.stripeSessionId, record)
    await markStripeSessionProcessed(pending.stripeSessionId)

    await upsertUserAccount({
      email: pending.email,
      evmAddress: publicAddress,
      hexId: pending.hexId,
    }).catch((err) => console.error('[magic-claim] user account upsert failed:', err))

    // Backfill tokenId from the NodeSecured event. Inline attempt with a budget;
    // if the receipt is not ready, fire-and-forget so the response returns fast.
    const tokenId = await resolveTokenIdFromTx(txHash)
    if (tokenId !== null) {
      await bindEvmTokenToClaim(claimId, tokenId)
    } else {
      void resolveTokenIdFromTx(txHash).then((tid) => {
        if (tid !== null) bindEvmTokenToClaim(claimId, tid).catch(() => {})
      })
    }

    return NextResponse.json({
      ok: true,
      claimId,
      hexId: pending.hexId,
      address: publicAddress,
      evmTokenId: tokenId ?? 0,
      txHash,
    })
  } catch (e) {
    console.error('[magic-claim]', e)
    // Free the reservation so the buyer can retry. releaseClaim self-guards and
    // refuses to release a hex that actually minted (txHash/tokenId present).
    if (reservedHexId) {
      const r = await releaseClaim(reservedHexId).catch(() => null)
      if (r && !r.ok) console.warn('[magic-claim] reservation kept (already minted):', reservedHexId)
    }
    const msg = e instanceof Error ? e.message : 'Claim failed'
    return NextResponse.json({ error: msg }, { status: 502 })
  }
}
