/**
 * POST /api/partners/apply
 *
 * Public endpoint — creates a pending KOL partner application.
 * Admin approves via PATCH /api/admin/kol/[id].
 *
 * Auto-generates a slug from the display name (e.g. "Tyler Malin" → "tyler-malin").
 */

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { registerKOL, getKOLByWallet, buildReferralUrl, buildVanityUrl } from '@/lib/kol-registry'
import { parseEmailSessionToken } from '@/lib/email-session'
import { makeUserId } from '@/lib/user-account'

export const runtime = 'nodejs'

const clean = (v: unknown): string | undefined => {
  if (typeof v !== 'string') return undefined
  const t = v.trim().replace(/^@/, '')
  return t || undefined
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 32)
}

export async function POST(req: Request) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { displayName, email, walletAddress, twitterHandle, bio, promoMethod, telegram, linkedin, reddit } = body

  // Associate with the signed-in account when present (email session cookie).
  let sessionEmail: string | undefined
  try {
    const raw = (await cookies()).get('malama_email_session')?.value
    if (raw) sessionEmail = parseEmailSessionToken(raw)?.email?.toLowerCase()
  } catch { /* no session — public application */ }
  const resolvedEmail = sessionEmail ?? (email ? String(email).trim().toLowerCase() : undefined)

  if (!displayName || typeof displayName !== 'string' || !displayName.trim()) {
    return NextResponse.json({ error: 'displayName is required' }, { status: 400 })
  }
  if (!walletAddress || typeof walletAddress !== 'string' || !walletAddress.startsWith('0x')) {
    return NextResponse.json({ error: 'A valid Base wallet address (0x…) is required' }, { status: 400 })
  }
  if (!promoMethod || typeof promoMethod !== 'string' || !promoMethod.trim()) {
    return NextResponse.json({ error: 'Please describe how you will promote Mālama' }, { status: 400 })
  }

  // Check if wallet already registered
  const existing = await getKOLByWallet(walletAddress as string)
  if (existing) {
    return NextResponse.json(
      { error: 'A partner account already exists for this wallet address' },
      { status: 409 }
    )
  }

  // Generate a unique slug
  const base = slugify(String(displayName))
  const id = base || `partner-${Date.now().toString(36)}`

  const partner = await registerKOL({
    id,
    walletAddress: String(walletAddress),
    displayName: String(displayName).trim(),
    email: resolvedEmail,
    twitterHandle: clean(twitterHandle),
    telegram: clean(telegram),
    linkedin: clean(linkedin),
    reddit: clean(reddit),
    bio: bio ? String(bio).trim() : undefined,
    promoMethod: promoMethod ? String(promoMethod).trim() : undefined,
    userId: resolvedEmail ? makeUserId(resolvedEmail) : undefined,
    commissionBps: 1000, // default 10% — admin can adjust
    approved: false,     // requires admin approval
  })

  console.log(`[partners/apply] New application: ${partner.id} (${walletAddress})`)

  return NextResponse.json({
    id: partner.id,
    referralUrl: buildReferralUrl(partner.id),
    vanityUrl: buildVanityUrl(partner.id),
    approved: false,
    message: 'Application received! We review within 24 hours.',
  })
}
