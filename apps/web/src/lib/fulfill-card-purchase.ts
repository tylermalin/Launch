import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { issueClaim, bindEvmTokenToClaim, updateClaimTxHash } from '@/lib/genesis-claim-registry'
import { encryptPrivateKeyHex } from '@/lib/wallet-crypto'
import { adminMintToAddress } from '@/lib/admin-genesis-mint'
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
} from '@/lib/custodial-store'

const fulfillmentLocks = new Set<string>()

export async function fulfillCardPurchase(opts: {
  stripeSessionId: string
  hexId: string
  email: string
  transferToken: string
}): Promise<void> {
  const { stripeSessionId, hexId, email, transferToken } = opts

  if (isStripeSessionProcessed(stripeSessionId)) return
  if (getSessionStatus(stripeSessionId)?.state === 'complete') return
  if (fulfillmentLocks.has(stripeSessionId)) return
  fulfillmentLocks.add(stripeSessionId)

  try {
    let pk: `0x${string}`
    let claimId: string
    let address: `0x${string}`

    const pending = getPendingStripeFulfillment(stripeSessionId)
    if (pending && pending.hexId === hexId && pending.transferToken === transferToken) {
      pk = pending.privateKey
      claimId = pending.claimId
      address = pending.address
    } else {
      pk = generatePrivateKey()
      const account = privateKeyToAccount(pk)
      address = account.address

      const reserved = issueClaim(hexId, 'base', address)
      if (!reserved.ok) {
        const msg =
          reserved.error === 'Hex already claimed'
            ? 'Hex already claimed'
            : reserved.error ?? 'Could not reserve hex'
        setSessionError(stripeSessionId, msg)
        return
      }

      claimId = reserved.claim.claimId
      setPendingStripeFulfillment(stripeSessionId, {
        hexId,
        claimId,
        email,
        address,
        privateKey: pk,
        transferToken,
      })
    }

    const encryptedPrivateKey = encryptPrivateKeyHex(pk)

    const { txHash, tokenId } = await adminMintToAddress({
      hexId,
      recipient: address,
    })

    bindEvmTokenToClaim(claimId, tokenId)
    updateClaimTxHash({ claimId, txHash })

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
    }

    clearPendingStripeFulfillment(stripeSessionId)
    saveCustodialRecord(record)
    setSessionComplete(stripeSessionId, record)
    markStripeSessionProcessed(stripeSessionId)
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Mint failed'
    console.error('[fulfillCardPurchase]', e)
    setSessionError(stripeSessionId, msg)
  } finally {
    fulfillmentLocks.delete(stripeSessionId)
  }
}
