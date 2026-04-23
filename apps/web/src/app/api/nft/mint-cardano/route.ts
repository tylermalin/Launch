import { NextResponse } from 'next/server'
import { getClaimByClaimId, getClaimByHex, issueClaim } from '@/lib/genesis-claim-registry'

/**
 * POST /api/nft/mint-cardano
 * Server-side Cardano CIP-25 NFT mint using MeshSDK + treasury mnemonic.
 * If BLOCKFROST_API_KEY or TREASURY_MNEMONIC are missing, returns a simulated
 * result (consistent with the EVM adminMintToAddress simulation mode).
 *
 * Body: { hexId, cardanoAddress, claimId }
 */
export const runtime = 'nodejs'

// CIP-25 enforces a 64-byte limit per metadatum string value.
// Split any string that exceeds 64 bytes into an array of ≤64-byte chunks.
// Cardano wallets and explorers reassemble array values transparently.
const cip25Str = (str: string): string | string[] => {
  if (Buffer.byteLength(str, 'utf8') <= 64) return str
  const chunks: string[] = []
  let remaining = str
  while (remaining.length > 0) {
    let end = remaining.length
    while (end > 0 && Buffer.byteLength(remaining.slice(0, end), 'utf8') > 64) end--
    chunks.push(remaining.slice(0, end))
    remaining = remaining.slice(end)
  }
  return chunks
}

export async function POST(req: Request) {
  try {
    const { hexId, cardanoAddress, claimId } = await req.json()

    if (!hexId || !cardanoAddress || !claimId) {
      return NextResponse.json(
        { error: 'Missing required fields: hexId, cardanoAddress, claimId' },
        { status: 400 }
      )
    }

    // Resolve claim — in dev the in-memory registry resets on server restart,
    // so fall back to hex lookup then re-issue rather than hard-failing with 404.
    let claim = claimId ? getClaimByClaimId(claimId) : null

    if (!claim) {
      // Maybe the server restarted; try looking up by hex
      const existing = getClaimByHex(hexId)
      if (existing && (existing.chain === 'cardano' || existing.chain === 'base')) {
        claim = existing
      } else {
        // Re-issue a fresh Cardano claim
        const issued = issueClaim(hexId, 'cardano', cardanoAddress)
        if (!issued.ok) {
          return NextResponse.json(
            { error: issued.error ?? 'Hex already claimed on another chain' },
            { status: 409 }
          )
        }
        claim = issued.claim
      }
    }

    const editionNumber = claim.editionNumber
    const mnemonic = process.env.TREASURY_MNEMONIC
    const blockfrostKey = process.env.BLOCKFROST_API_KEY

    // Dev simulation — mirrors EVM adminMintToAddress behaviour
    if (!mnemonic || !blockfrostKey) {
      const missing = [!mnemonic && 'TREASURY_MNEMONIC', !blockfrostKey && 'BLOCKFROST_API_KEY']
        .filter(Boolean)
        .join(', ')
      console.warn(`⚠️  CARDANO MINT SIMULATED (missing: ${missing}). Set env vars for real minting.`)
      await new Promise((r) => setTimeout(r, 1500))
      const mockTxHash = `mock_cardano_${hexId}_${Date.now()}`
      return NextResponse.json({
        success: true,
        simulated: true,
        txHash: mockTxHash,
        claimId,
        editionNumber,
        tokenName: `MalamaHexNode${String(editionNumber).padStart(3, '0')}`,
        explorerUrl: `https://preview.cardanoscan.io/transaction/${mockTxHash}`,
        cnftUrl: `https://preview.cexplorer.io/tx/${mockTxHash}`,
      })
    }

    const {
      MeshWallet,
      BlockfrostProvider,
      MeshTxBuilder,
      resolveNativeScriptHash,
      resolveNativeScriptHex,
      resolvePaymentKeyHash,
      stringToHex,
    } = await import('@meshsdk/core')

    const blockchainProvider = new BlockfrostProvider(blockfrostKey)

    const wallet = new MeshWallet({
      networkId: 0, // 0 = testnet/preprod
      fetcher: blockchainProvider,
      submitter: blockchainProvider,
      key: {
        type: 'mnemonic',
        words: mnemonic.replace(/"/g, '').trim().split(/\s+/),
      },
    })

    const changeAddress = await wallet.getChangeAddress()

    // Build NativeScript object (single-sig policy locked to treasury key).
    // ForgeScript.withOneSignature returns a string in v1.x, but resolveNativeScriptHash/Hex
    // require the NativeScript object — so we build it directly.
    const keyHash = resolvePaymentKeyHash(changeAddress)
    const nativeScript = { type: 'sig' as const, keyHash }
    const policyId = resolveNativeScriptHash(nativeScript)
    const scriptCbor = resolveNativeScriptHex(nativeScript)

    const genPad = String(editionNumber).padStart(3, '0')
    const tokenNameRaw = `MalamaHexNode${genPad}`
    const assetNameHex = stringToHex(tokenNameRaw)

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://malamalaunch.vercel.app'
    const imageUrl = `${baseUrl}/api/nft/${editionNumber}/image?hexId=${encodeURIComponent(hexId)}&chain=cardano&claimId=${encodeURIComponent(claimId)}`

    const cip25Metadata = {
      [policyId]: {
        [tokenNameRaw]: {
          name: cip25Str(`Malama Hex Node License ${claimId}`),
          image: cip25Str(imageUrl),
          mediaType: 'image/svg+xml',
          description: cip25Str(`Mālama Genesis validator node (Cardano cohort). Claim ${claimId}. Territory: ${hexId}.`),
          claimId,
          hexId,
          editionNumber,
          edition: 'Mālama Genesis',
          cohort: '200 Cardano',
          mlmaAllocation: '62500',
          vestingSchedule: cip25Str('25% at boot, 75% over 12 months'),
        },
      },
    }

    const utxos = await wallet.getUtxos()

    const txBuilder = new MeshTxBuilder({
      fetcher: blockchainProvider,
      submitter: blockchainProvider,
    })

    const unsignedTx = await txBuilder
      .mint('1', policyId, assetNameHex)
      .mintingScript(scriptCbor)
      .metadataValue(721, cip25Metadata)
      .txOut(cardanoAddress, [{ unit: `${policyId}${assetNameHex}`, quantity: '1' }])
      .changeAddress(changeAddress)
      .selectUtxosFrom(utxos)
      .complete()

    const signedTx = await wallet.signTx(unsignedTx)
    const txHash = await wallet.submitTx(signedTx)

    // Non-blocking: update claim record with tx hash
    fetch(`${baseUrl}/api/nft/claim`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ claimId, txHash }),
    }).catch(() => {})

    return NextResponse.json({
      success: true,
      simulated: false,
      txHash,
      claimId,
      editionNumber,
      tokenName: tokenNameRaw,
      explorerUrl: `https://preview.cardanoscan.io/transaction/${txHash}`,
      cnftUrl: `https://preview.cexplorer.io/tx/${txHash}`,
    })

  } catch (err: any) {
    console.error('[/api/nft/mint-cardano]', err)
    return NextResponse.json(
      { error: err?.message ?? 'Cardano mint failed' },
      { status: 500 }
    )
  }
}
