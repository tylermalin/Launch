import { NextResponse } from 'next/server'
import { issueClaim, bindEvmTokenToClaim, updateClaimTxHash } from '@/lib/genesis-claim-registry'
import { adminMintToAddress } from '@/lib/admin-genesis-mint'
import type { CustodialRecord } from '@/lib/custodial-store'
import {
  removePendingMagicPurchase,
  saveCustodialRecord,
  setSessionComplete,
  markStripeSessionProcessed,
  unlockHexForMagicCheckout,
} from '@/lib/custodial-store'
import { verifyMagicDidToken } from '@/lib/magic-server'
import { resolvePendingMagicPurchase } from '@/lib/resolve-pending-magic'

export const runtime = 'nodejs'

/**
 * After Stripe payment (magic custody), user completes Magic Email OTP and sends DID token + transfer token.
 * Server verifies Magic, matches email to the paid purchase, mints NFT to the Magic wallet.
 * If in-memory pending was lost (dev restart), pass `stripeSessionId` (cs_…) to recover from Stripe.
 */
export async function POST(req: Request) {
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
          {
            error:
              'Transfer token does not match this Stripe session. Use the link from card-complete or add ?session_id=cs_…',
          },
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
        {
          error:
            'No pending purchase in memory (e.g. dev server restarted). Use /launch?token=…&session_id=cs_… — session_id is in your browser URL on card-complete after Stripe (e.g. …/presale/card-complete?session_id=cs_…).',
        },
        { status: 404 }
      )
    }
    const pending = resolved.pending

    const { email, publicAddress } = await verifyMagicDidToken(didToken)
    if (email !== pending.email) {
      return NextResponse.json(
        {
          error:
            'Signed-in Magic email must match the email used at checkout. Use the same address you entered when paying with card.',
        },
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

    const { txHash, tokenId } = await adminMintToAddress({
      hexId: pending.hexId,
      recipient: publicAddress,
    })

    await bindEvmTokenToClaim(claimId, tokenId)
    await updateClaimTxHash({ claimId, txHash })

    const record: CustodialRecord = {
      claimId,
      hexId: pending.hexId,
      email: pending.email,
      address: publicAddress,
      encryptedPrivateKey: '',
      transferToken: pending.transferToken,
      evmTokenId: tokenId,
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

    return NextResponse.json({
      ok: true,
      claimId,
      hexId: pending.hexId,
      address: publicAddress,
      evmTokenId: tokenId,
      txHash,
    })
  } catch (e) {
    console.error('[magic-claim]', e)
    const msg = e instanceof Error ? e.message : 'Claim failed'
    return NextResponse.json({ error: msg }, { status: 502 })
  }
}
