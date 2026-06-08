import { NextResponse } from 'next/server'
import {
  issueClaim,
  getClaimByHex,
  getClaimByClaimId,
  getStats,
  updateClaimTxHash,
  bindEvmTokenToClaim,
  releaseClaim,
} from '@/lib/genesis-claim-registry'
import { getCustodialRecordsByEmail } from '@/lib/custodial-store'
import { upsertUserAccount } from '@/lib/user-account'
import nativeHexesData from '@/data/genesis-native-hexes.json'

const NATIVE_HEX_SET = new Set(Object.keys(nativeHexesData as Record<string, unknown>))

// ─────────────────────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const { hexId, chain, buyerAddress } = await req.json()

    if (!hexId || !chain || !buyerAddress) {
      return NextResponse.json(
        { error: 'Missing required fields: hexId, chain, buyerAddress' },
        { status: 400 },
      )
    }

    if (chain !== 'base' && chain !== 'cardano') {
      return NextResponse.json(
        { error: 'chain must be "base" or "cardano"' },
        { status: 400 },
      )
    }

    // Native-reserved hexes are held for Native Tribes first — not publicly claimable.
    if (NATIVE_HEX_SET.has(hexId)) {
      return NextResponse.json(
        { error: 'This hex is on tribal land and reserved for Native Tribes', nativeReserved: true },
        { status: 403 },
      )
    }

    const result = await issueClaim(hexId, chain, buyerAddress)
    if (!result.ok) {
      if (result.existing) {
        return NextResponse.json(
          {
            error: 'Hex already claimed',
            claimedOnChain: result.existing.chain,
            claimId: result.existing.claimId,
            editionNumber: result.existing.editionNumber,
          },
          { status: 409 },
        )
      }
      return NextResponse.json({ error: result.error }, { status: 410 })
    }

    const { claim } = result

    // Upsert user account — wallet address is the anchor for direct crypto purchases
    const accountOpts =
      claim.chain === 'base'
        ? { evmAddress: buyerAddress, hexId: claim.hexId }
        : { cardanoAddress: buyerAddress, hexId: claim.hexId }
    upsertUserAccount(accountOpts).catch((err) =>
      console.error('[/api/nft/claim] user account upsert failed:', err)
    )

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
        { status: 400 },
      )
    }

    const updated = await updateClaimTxHash({ claimId, hexId, txHash })
    if (!updated) {
      return NextResponse.json({ error: 'Claim not found' }, { status: 404 })
    }

    if (typeof tokenId === 'number' && claimId) {
      await bindEvmTokenToClaim(claimId, tokenId)
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
  const email = searchParams.get('email')

  if (!hexId && !claimId && !email) {
    const { total, issued, remaining } = await getStats()
    return NextResponse.json({ total, issued, remaining })
  }

  if (email) {
    const records = await getCustodialRecordsByEmail(email)
    return NextResponse.json({ claims: records })
  }

  if (claimId) {
    const claim = await getClaimByClaimId(claimId)
    if (!claim) {
      return NextResponse.json({ claimed: false }, { status: 404 })
    }
    return NextResponse.json({ claimed: true, ...claim })
  }

  const claim = hexId ? await getClaimByHex(hexId) : undefined
  return NextResponse.json({
    claimed: !!claim,
    ...(claim ?? {}),
  })
}

// ─── Admin: release a (non-minted) hex reservation ──────────────────────────
// Clears a stuck/abandoned reservation so the hex can be claimed again.
// Guarded by x-admin-secret. Refuses to release a minted hex.
//   curl -X DELETE "$URL/api/nft/claim?hexId=<hex>" -H "x-admin-secret: $ADMIN_SECRET"
export async function DELETE(req: Request) {
  const secret = process.env.ADMIN_SECRET?.trim()
  if (!secret || req.headers.get('x-admin-secret')?.trim() !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { searchParams } = new URL(req.url)
  const hexId = searchParams.get('hexId')
  if (!hexId) {
    return NextResponse.json({ error: 'hexId query param required' }, { status: 400 })
  }
  const result = await releaseClaim(hexId)
  if (!result.ok) {
    return NextResponse.json({ error: result.reason ?? 'Could not release' }, { status: 409 })
  }
  return NextResponse.json({ ok: true, released: hexId })
}
