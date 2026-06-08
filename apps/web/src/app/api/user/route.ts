/**
 * /api/user
 *
 * GET   — return the current user's account (email session required)
 * PATCH — link an EVM or Cardano wallet address to the account
 *
 * Body for PATCH: { evmAddress?: string; cardanoAddress?: string }
 */

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { parseEmailSessionToken } from '@/lib/email-session'
import {
  getUserByEmail,
  upsertUserAccount,
  type UserAccount,
} from '@/lib/user-account'

async function getSessionEmail(): Promise<string | null> {
  const jar = await cookies()
  const raw = jar.get('malama_email_session')?.value
  if (!raw) return null
  const parsed = parseEmailSessionToken(raw)
  return parsed?.email?.toLowerCase() ?? null
}

// ── GET ───────────────────────────────────────────────────────────────────────

export async function GET(): Promise<NextResponse> {
  const email = await getSessionEmail()
  if (!email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const account = await getUserByEmail(email)

  // If first request before any purchase, account may not exist yet — create it
  const resolved: UserAccount = account ?? await upsertUserAccount({ email })

  return NextResponse.json({ account: resolved })
}

// ── PATCH ─────────────────────────────────────────────────────────────────────

export async function PATCH(req: NextRequest): Promise<NextResponse> {
  const email = await getSessionEmail()
  if (!email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  let body: { evmAddress?: string; cardanoAddress?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { evmAddress, cardanoAddress } = body
  if (!evmAddress && !cardanoAddress) {
    return NextResponse.json(
      { error: 'evmAddress or cardanoAddress required' },
      { status: 400 },
    )
  }

  const account = await upsertUserAccount({ email, evmAddress, cardanoAddress })
  return NextResponse.json({ account })
}
