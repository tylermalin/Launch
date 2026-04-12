import { NextResponse } from 'next/server'
import { getClaimByClaimId } from '@/lib/genesis-claim-registry'

/**
 * POST /api/nft/mint-cardano
 * Server-side Cardano CIP-25 NFT mint using MeshSDK + treasury mnemonic.
 *
 * Body: { hexId, cardanoAddress, claimId }
 */
export async function POST(req: Request) {
  try {
    const { hexId, cardanoAddress, claimId } = await req.json()

    if (!hexId || !cardanoAddress || !claimId) {
      return NextResponse.json(
        { error: 'Missing required fields: hexId, cardanoAddress, claimId' },
        { status: 400 }
      )
    }

    const claim = getClaimByClaimId(claimId)
    if (!claim) {
      return NextResponse.json({ error: 'Unknown claimId' }, { status: 404 })
    }
    if (claim.hexId !== hexId) {
      return NextResponse.json({ error: 'claimId does not match hexId' }, { status: 400 })
    }
    if (claim.chain !== 'cardano') {
      return NextResponse.json({ error: 'claim is not a Cardano reservation' }, { status: 400 })
    }

    const editionNumber = claim.editionNumber

    const mnemonic = process.env.TREASURY_MNEMONIC
    const blockfrostKey = process.env.BLOCKFROST_API_KEY

    if (!mnemonic || !blockfrostKey) {
      return NextResponse.json(
        { error: 'Server wallet not configured' },
        { status: 500 }
      )
    }

    const { MeshWallet, Transaction, ForgeScript } = await import('@meshsdk/core')

    const wallet = new MeshWallet({
      networkId: 0,
      fetcher: { blockfrostProjectId: blockfrostKey, isTestnet: true } as any,
      submitter: { blockfrostProjectId: blockfrostKey, isTestnet: true } as any,
      key: {
        type: 'mnemonic',
        words: mnemonic.replace(/"/g, '').split(' '),
      },
    })

    const changeAddress = await wallet.getChangeAddress()
    const forgingScript = ForgeScript.withOneSignature(changeAddress)

    const genPad = String(editionNumber).padStart(3, '0')
    const tokenNameRaw = `MalamaHexNode${genPad}`
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://malamalaunch.vercel.app'
    const imageUrl = `${baseUrl}/api/nft/${editionNumber}/image?hexId=${encodeURIComponent(hexId)}&chain=cardano&claimId=${encodeURIComponent(claimId)}`

    const metadata = {
      name: `Mālama Hex Node License ${claimId}`,
      image: imageUrl,
      mediaType: 'image/svg+xml',
      description: `Genesis 200 validator node. Claim ${claimId}. Territory: ${hexId}. Exclusive geographic rights on the Mālama DePIN network.`,
      claimId,
      hexId,
      editionNumber,
      edition: 'Genesis 200',
      mlmaAllocation: '125000',
      vestingSchedule: '25% at boot, 75% over 12 months',
    }

    const tx = new Transaction({ initiator: wallet })
    tx.mintAsset(forgingScript, {
      assetName: tokenNameRaw,
      assetQuantity: '1',
      metadata,
      label: '721',
      recipient: cardanoAddress,
    })

    const unsignedTx = await tx.build()
    const signedTx = await wallet.signTx(unsignedTx)
    const txHash = await wallet.submitTx(signedTx)

    await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/api/nft/claim`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ claimId, txHash }),
    }).catch(() => {})

    return NextResponse.json({
      success: true,
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
