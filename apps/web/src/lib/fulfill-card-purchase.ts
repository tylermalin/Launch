import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { issueClaim, bindEvmTokenToClaim, updateClaimTxHash } from '@/lib/genesis-claim-registry'
import { encryptPrivateKeyHex } from '@/lib/wallet-crypto'
import { adminMintToAddress } from '@/lib/admin-genesis-mint'
import { getCardCustodyMode } from '@/lib/card-custody'
import type { CustodialRecord } from '@/lib/custodial-store'
import {
  saveCustodialRecord,
  markStripeSessionProcessed,
  setSessionComplete,
  setSessionError,
  setPendingStripeFulfillment,
  getPendingStripeFulfillment,
  clearPendingStripeFulfillment,
  getSessionStatus,
  isStripeSessionProcessed,
  savePendingMagicPurchase,
  setSessionAwaitingMagic,
  getPendingMagicBySession,
  unlockHexForMagicCheckout,
} from '@/lib/custodial-store'
import { issueKOLCommission } from '@/lib/kol-registry'
import { upsertUserAccount } from '@/lib/user-account'

const SALE_AMOUNT_USD = 2000

const fulfillmentLocks = new Set<string>()

export async function fulfillCardPurchase(opts: {
  stripeSessionId: string
  hexId: string
  email: string
  transferToken: string
  /** KOL partner id captured from ?ref= cookie at checkout time */
  referrerId?: string
}): Promise<void> {
  const { stripeSessionId, hexId, email, transferToken, referrerId } = opts

  if (await isStripeSessionProcessed(stripeSessionId)) return
  if ((await getSessionStatus(stripeSessionId))?.state === 'complete') return
  if (fulfillmentLocks.has(stripeSessionId)) return
  fulfillmentLocks.add(stripeSessionId)

  try {
    if (getCardCustodyMode() === 'magic') {
      if (await getPendingMagicBySession(stripeSessionId)) return
      if ((await getSessionStatus(stripeSessionId))?.state === 'awaiting_magic') return
      const hasMagicSecret =
        Boolean(process.env.MAGIC_SECRET_KEY?.trim()) || Boolean(process.env.MAGIC_SECRET?.trim())
      if (!hasMagicSecret) {
        await setSessionError(
          stripeSessionId,
          'Magic server key not configured (set MAGIC_SECRET_KEY for DID verification)',
        )
        await unlockHexForMagicCheckout(hexId, stripeSessionId)
        return
      }
      const pending = {
        stripeSessionId,
        hexId,
        email,
        transferToken,
        referrerId,
        createdAt: new Date().toISOString(),
      }
      await savePendingMagicPurchase(pending)
      await setSessionAwaitingMagic(stripeSessionId, pending)
      return
    }

    let pk: `0x${string}`
    let claimId: string
    let address: `0x${string}`

    const pending = await getPendingStripeFulfillment(stripeSessionId)
    if (pending && pending.hexId === hexId && pending.transferToken === transferToken) {
      pk = pending.privateKey
      claimId = pending.claimId
      address = pending.address
    } else {
      pk = generatePrivateKey()
      const account = privateKeyToAccount(pk)
      address = account.address

      const reserved = await issueClaim(hexId, 'base', address, referrerId)
      if (!reserved.ok) {
        const msg =
          reserved.error === 'Hex already claimed'
            ? 'Hex already claimed'
            : reserved.error ?? 'Could not reserve hex'
        await setSessionError(stripeSessionId, msg)
        return
      }

      claimId = reserved.claim.claimId
      await setPendingStripeFulfillment(stripeSessionId, {
        hexId,
        claimId,
        email,
        address,
        privateKey: pk,
        transferToken,
        referrerId,
      })
    }

    const encryptedPrivateKey = encryptPrivateKeyHex(pk)

    const { txHash, tokenId } = await adminMintToAddress({
      hexId,
      recipient: address,
    })

    await bindEvmTokenToClaim(claimId, tokenId)
    await updateClaimTxHash({ claimId, txHash })

    const record: CustodialRecord = {
      claimId,
      hexId,
      email,
      address,
      encryptedPrivateKey,
      transferToken,
      evmTokenId: tokenId,
      txHash,
      createdAt: new Date().toISOString(),
      custody: 'server',
      referrerId,
    }

    await clearPendingStripeFulfillment(stripeSessionId)
    await saveCustodialRecord(record)
    await setSessionComplete(stripeSessionId, record)
    await markStripeSessionProcessed(stripeSessionId)

    // Upsert user account — email is the anchor for card purchases
    await upsertUserAccount({ email, evmAddress: address, hexId }).catch((err) =>
      console.error('[fulfillCardPurchase] user account upsert failed:', err)
    )

    // Issue KOL commission if a referrer was captured — fire-and-forget, non-blocking
    if (referrerId) {
      issueKOLCommission({
        kolId: referrerId,
        claimId,
        hexId,
        buyerEmail: email,
        chain: 'base',
        saleAmountUsd: SALE_AMOUNT_USD,
        stripeSessionId,
      }).catch((err) => {
        console.error('[fulfillCardPurchase] KOL commission error:', err)
      })
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Mint failed'
    console.error('[fulfillCardPurchase]', e)
    await setSessionError(stripeSessionId, msg)
  } finally {
    fulfillmentLocks.delete(stripeSessionId)
  }
}
