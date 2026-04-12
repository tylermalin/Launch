import { NextResponse } from 'next/server'
import { getClaimForEvmToken } from '@/lib/genesis-claim-registry'

// Zone lookup from hex prefix (matches the hex API)
const ZONE_MAP: Record<string, string> = {
  '8648': 'Idaho',
  '8729': 'Los Angeles',
  '872a': 'Los Angeles',
  '8728': 'Los Angeles',
  '8826': 'New York City',
  '8827': 'New York City',
  '8831': 'New York City',
  '8830': 'New York City',
  '8c1f': 'London',
  '8c19': 'London',
  '8c37': 'London',
  '8c2f': 'Tokyo',
  '8c30': 'Tokyo',
  '8c31': 'Tokyo',
  '8828': 'San Francisco',
  '8829': 'San Francisco',
  '8c65': 'Sydney',
  '8c60': 'Singapore',
  '8c61': 'Singapore',
}

function getZone(hexId: string): string {
  const prefix = hexId.slice(0, 4).toLowerCase()
  for (const [key, zone] of Object.entries(ZONE_MAP)) {
    if (hexId.toLowerCase().startsWith(key)) return zone
  }
  return 'Genesis Zone'
}

/** ERC-721 `tokenURI` — tokenId is the on-chain Base token id */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ tokenId: string }> }
) {
  const { tokenId } = await params
  const claim = getClaimForEvmToken(Number(tokenId))

  const hexId   = claim?.hexId ?? `genesis-${tokenId}`
  const zone    = getZone(hexId)
  const edition = claim?.editionNumber ?? Number(tokenId)
  const chain   = claim?.chain ?? 'base'
  const txHash  = claim?.txHash ?? null
  const claimId = claim?.claimId ?? null

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://malamalaunch.vercel.app'

  const imageQuery = new URLSearchParams({
    hexId,
    chain: 'base',
    ...(claimId ? { claimId } : {}),
  })

  return NextResponse.json({
    name: claim
      ? `Mālama Hex Node License ${claim.claimId}`
      : `Mālama Hex Node License #${String(edition).padStart(3, '0')}`,
    description: `Genesis 200 validator node license. ${claimId ? `Claim ${claimId}. ` : ''}Territory: ${hexId} (${zone}). Exclusive geographic rights on the Mālama DePIN network. 125,000 MLMA allocation vests at first hardware boot. Revenue begins October 2026.`,
    image: `${baseUrl}/api/nft/${tokenId}/image?${imageQuery.toString()}`,
    external_url: `${baseUrl}/map`,
    animation_url: null,
    attributes: [
      ...(claimId ? [{ trait_type: 'Claim ID', value: claimId }] : []),
      { trait_type: 'Hex ID', value: hexId },
      { trait_type: 'Zone', value: zone },
      { trait_type: 'Edition #', value: edition, display_type: 'number' },
      { trait_type: 'Edition', value: 'Genesis 200' },
      { trait_type: 'Chain', value: chain === 'base' ? 'Base (EVM)' : 'Cardano' },
      { trait_type: 'On-chain token', value: String(tokenId) },
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
