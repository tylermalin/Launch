import { NextResponse } from 'next/server'
import { getClaimForEvmToken, MALAMA_GENESIS_WALLET } from '@/lib/genesis-claim-registry'
import { resolveNftDisplayEdition, resolveNftZone } from '@/lib/nft-zone'
import { NFT_PREVIEW_TOKEN_ID } from '@/lib/nft-preview'

/** ERC-721 `tokenURI` — tokenId is the on-chain Base token id */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ tokenId: string }> }
) {
  const { searchParams } = new URL(req.url)
  const hexFromQuery = searchParams.get('hexId')
  const { tokenId } = await params
  const claim = getClaimForEvmToken(Number(tokenId))
  const malamaCustody =
    claim?.buyerAddress?.toLowerCase() === MALAMA_GENESIS_WALLET.toLowerCase()

  const hexId = claim?.hexId ?? hexFromQuery ?? `genesis-${tokenId}`
  const parsedTokenId = Number(tokenId)
  const zone = resolveNftZone(hexId)
  const edition = resolveNftDisplayEdition(hexId, claim, Number.isFinite(parsedTokenId) ? parsedTokenId : 0)
  const chain   = claim?.chain ?? 'base'
  const txHash  = claim?.txHash ?? null
  const claimId = claim?.claimId ?? null

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://malamalaunch.vercel.app'

  const imageQuery = new URLSearchParams({
    hexId,
    chain: 'base',
    ...(claimId ? { claimId } : {}),
  })

  const onChainTokenLabel =
    claim?.evmTokenId != null
      ? String(claim.evmTokenId)
      : parsedTokenId === NFT_PREVIEW_TOKEN_ID
        ? 'Not minted (metadata preview)'
        : String(tokenId)

  return NextResponse.json({
    name: claim
      ? `Mālama Hex Node License ${claim.claimId}`
      : `Mālama Hex Node License · #${String(edition).padStart(3, '0')} (${zone})`,
    description: `Genesis 200 validator node license. ${claimId ? `Claim ${claimId}. ` : ''}Territory: ${hexId} (${zone}). Exclusive geographic rights on the Mālama DePIN network. 125,000 MLMA allocation vests at first hardware boot. Revenue begins October 2026.`,
    image: `${baseUrl}/api/nft/${tokenId}/image?${imageQuery.toString()}`,
    external_url: `${baseUrl}/map`,
    animation_url: null,
    attributes: [
      ...(claimId ? [{ trait_type: 'Claim ID', value: claimId }] : []),
      ...(malamaCustody
        ? [{ trait_type: 'Custody', value: 'Mālama Wallet (protocol reserve)' }]
        : []),
      { trait_type: 'Hex ID', value: hexId },
      { trait_type: 'Zone', value: zone },
      { trait_type: 'Edition #', value: edition, display_type: 'number' },
      { trait_type: 'Edition', value: 'Genesis 200' },
      { trait_type: 'Chain', value: chain === 'base' ? 'Base (EVM)' : 'Cardano' },
      { trait_type: 'On-chain token', value: onChainTokenLabel },
      { trait_type: 'MLMA Allocation', value: '125,000 MLMA' },
      { trait_type: 'Entry Price', value: '$2,000 USDC' },
      { trait_type: 'Vesting', value: '25% at boot · 75% over 12 months' },
      { trait_type: 'Revenue Start', value: 'October 2026' },
      { trait_type: 'Status', value: claim?.txHash ? 'Minted' : 'Reserved' },
      ...(txHash ? [{ trait_type: 'Transaction', value: txHash }] : []),
    ],
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    }
  })
}
