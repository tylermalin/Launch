import { NextResponse } from 'next/server'
import {
  issueClaim,
  getClaimByHex,
  getClaimByClaimId,
  getStats,
  updateClaimTxHash,
  bindEvmTokenToClaim,
} from '@/lib/genesis-claim-registry'

// ─────────────────────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const { hexId, chain, buyerAddress } = await req.json()

    if (!hexId || !chain || !buyerAddress) {
      return NextResponse.json(
        { error: 'Missing required fields: hexId, chain, buyerAddress' },
        { status: 400 }
      )
    }

    if (chain !== 'base' && chain !== 'cardano') {
      return NextResponse.json(
        { error: 'chain must be "base" or "cardano"' },
        { status: 400 }
      )
    }

    const result = issueClaim(hexId, chain, buyerAddress)
    if (!result.ok) {
      if (result.existing) {
        return NextResponse.json(
          {
            error: 'Hex already claimed',
            claimedOnChain: result.existing.chain,
            claimId: result.existing.claimId,
            editionNumber: result.existing.editionNumber,
          },
          { status: 409 }
        )
      }
      return NextResponse.json({ error: result.error }, { status: 410 })
    }

    const { claim } = result
    return NextResponse.json({
      success: true,
      claimId: claim.claimId,
      editionNumber: claim.editionNumber,
      hexId: claim.hexId,
      chain: claim.chain,
    })
  } catch (err) {
    console.error('[/api/nft/claim]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ─── Update claim (tx hash, optional EVM token binding) ─────────────────────
export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { txHash, claimId, hexId, tokenId } = body as {
      txHash?: string
      claimId?: string
      hexId?: string
      tokenId?: number
    }

    if (!txHash || (!claimId && !hexId)) {
      return NextResponse.json(
        { error: 'Missing txHash and (claimId or hexId)' },
        { status: 400 }
      )
    }

    const updated = updateClaimTxHash({ claimId, hexId, txHash })
    if (!updated) {
      return NextResponse.json({ error: 'Claim not found' }, { status: 404 })
    }

    if (typeof tokenId === 'number' && claimId) {
      bindEvmTokenToClaim(claimId, tokenId)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ─── Lookup remaining capacity or a specific claim ───────────────────────────
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const hexId = searchParams.get('hexId')
  const claimId = searchParams.get('claimId')

  if (!hexId && !claimId) {
    const { total, issued, remaining } = getStats()
    return NextResponse.json({ total, issued, remaining })
  }

  if (claimId) {
    const claim = getClaimByClaimId(claimId)
    if (!claim) {
      return NextResponse.json({ claimed: false }, { status: 404 })
    }
    return NextResponse.json({ claimed: true, ...claim })
  }

  const claim = hexId ? getClaimByHex(hexId) : undefined
  return NextResponse.json({
    claimed: !!claim,
    ...(claim ?? {}),
  })
}
