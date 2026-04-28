/**
 * Admin KOL management API
 *
 * GET  /api/admin/kol               → list all KOLs with stats
 * POST /api/admin/kol               → register a new KOL partner
 *
 * Auth: requires `x-admin-secret: <ADMIN_SECRET>` header.
 * Set ADMIN_SECRET in Vercel env vars.
 */

import { NextResponse } from 'next/server'
import {
  listKOLs,
  registerKOL,
  getKOLStats,
  buildReferralUrl,
  buildVanityUrl,
} from '@/lib/kol-registry'

export const runtime = 'nodejs'

function checkAdmin(req: Request): boolean {
  const secret = process.env.ADMIN_SECRET?.trim()
  if (!secret) return false
  return req.headers.get('x-admin-secret')?.trim() === secret
}

// GET /api/admin/kol — list all partners with aggregated stats
export async function GET(req: Request) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const partners = await listKOLs()
  const stats = await Promise.all(partners.map((p) => getKOLStats(p.id)))

  const response = stats.map((s) => {
    if (!s) return null
    return {
      ...s,
      referralUrl: buildReferralUrl(s.partner.id),
      vanityUrl: buildVanityUrl(s.partner.id),
    }
  }).filter(Boolean)

  return NextResponse.json({ partners: response, count: response.length })
}

// POST /api/admin/kol — register a new KOL
export async function POST(req: Request) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { id, walletAddress, displayName, email, bio, twitterHandle, commissionBps, approved } = body

  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'id is required (URL-safe slug)' }, { status: 400 })
  }
  if (!walletAddress || typeof walletAddress !== 'string') {
    return NextResponse.json({ error: 'walletAddress is required' }, { status: 400 })
  }
  if (!displayName || typeof displayName !== 'string') {
    return NextResponse.json({ error: 'displayName is required' }, { status: 400 })
  }

  const partner = await registerKOL({
    id: String(id),
    walletAddress: String(walletAddress),
    displayName: String(displayName),
    email: email ? String(email) : undefined,
    bio: bio ? String(bio) : undefined,
    twitterHandle: twitterHandle ? String(twitterHandle) : undefined,
    commissionBps: typeof commissionBps === 'number' ? commissionBps : 1000,
    approved: approved === true,
  })

  return NextResponse.json({
    partner,
    referralUrl: buildReferralUrl(partner.id),
    vanityUrl: buildVanityUrl(partner.id),
  })
}
