/**
 * GET /api/partners/me?address=0x...
 *
 * Returns full KOL stats for the given wallet address.
 * Used by the partner dashboard after wallet connect.
 *
 * Returns 404 if no partner account is linked to the address.
 * No secret required — stats are read-only and tied to a public wallet address.
 */

import { NextResponse } from 'next/server'
import { getKOLByWallet, getKOLStats, buildReferralUrl, buildVanityUrl } from '@/lib/kol-registry'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const address = searchParams.get('address')

  if (!address || !address.startsWith('0x')) {
    return NextResponse.json({ error: 'address param required (0x…)' }, { status: 400 })
  }

  const partner = await getKOLByWallet(address)
  if (!partner) {
    return NextResponse.json({ error: 'No partner account found for this wallet' }, { status: 404 })
  }

  if (!partner.approved) {
    return NextResponse.json({
      error: 'Your application is pending review. We will notify you within 24 hours.',
      status: 'pending',
      partner: { id: partner.id, displayName: partner.displayName, approved: false },
    }, { status: 403 })
  }

  const stats = await getKOLStats(partner.id)
  if (!stats) {
    return NextResponse.json({ error: 'Partner data unavailable' }, { status: 500 })
  }

  return NextResponse.json({
    ...stats,
    referralUrl: buildReferralUrl(partner.id),
    vanityUrl: buildVanityUrl(partner.id),
  })
}
