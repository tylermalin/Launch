/**
 * /api/shipping
 *
 * GET  ?claimId=<id>   → { address: ShippingAddress | null }
 * GET  ?email=<email>  → { address: ShippingAddress | null }
 * POST body { claimId, email, fullName, line1, line2?, city, state, postalCode, country, phone? }
 *      → { ok: true, address: ShippingAddress }
 *
 * Auth on POST: verify claimId+email match the custodial record when the in-memory
 * store is warm. On a cold serverless start the record may be absent — we accept the
 * submission anyway because the claimId is a non-guessable value issued by our own
 * checkout flow, providing implicit authorization.
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  getShippingAddressByClaim,
  getShippingAddressByEmail,
  saveShippingAddress,
  type ShippingAddress,
} from '@/lib/shipping-store'
import { getCustodialByClaimId } from '@/lib/custodial-store'

// ─── GET ─────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const claimId = searchParams.get('claimId')
  const email = searchParams.get('email')

  if (claimId) {
    const address = await getShippingAddressByClaim(claimId)
    return NextResponse.json({ address })
  }

  if (email) {
    const address = await getShippingAddressByEmail(email)
    return NextResponse.json({ address })
  }

  return NextResponse.json({ error: 'claimId or email query parameter required' }, { status: 400 })
}

// ─── POST ────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const {
    claimId,
    email,
    fullName,
    line1,
    line2,
    city,
    state,
    postalCode,
    country,
    phone,
  } = body as {
    claimId?: string
    email?: string
    fullName?: string
    line1?: string
    line2?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
    phone?: string
  }

  // Required fields
  if (!claimId || !email || !fullName || !line1 || !city || !state || !postalCode || !country) {
    return NextResponse.json(
      { error: 'fullName, line1, city, state, postalCode, country, claimId, and email are required' },
      { status: 400 },
    )
  }

  // Best-effort auth: if the in-memory custodial store is warm, verify the email matches.
  const record = getCustodialByClaimId(claimId)
  if (record && record.email.toLowerCase() !== email.toLowerCase().trim()) {
    return NextResponse.json({ error: 'Email does not match this claim' }, { status: 403 })
  }

  const addr: ShippingAddress = {
    fullName: String(fullName).trim(),
    line1: String(line1).trim(),
    line2: line2 ? String(line2).trim() || undefined : undefined,
    city: String(city).trim(),
    state: String(state).trim(),
    postalCode: String(postalCode).trim(),
    country: String(country).trim(),
    phone: phone ? String(phone).trim() || undefined : undefined,
    savedAt: new Date().toISOString(),
    claimId: String(claimId),
    email: String(email).toLowerCase().trim(),
  }

  await saveShippingAddress(addr)
  return NextResponse.json({ ok: true, address: addr })
}
