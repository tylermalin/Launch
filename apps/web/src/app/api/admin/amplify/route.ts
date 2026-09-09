/**
 * Admin Amplify config — get/set the channel copy + hashtag partners see.
 *
 * GET  /api/admin/amplify   → current overrides
 * POST /api/admin/amplify   → save overrides { hashtag?, posts?: {channel: text} }
 *
 * Auth: `x-admin-secret: <ADMIN_SECRET>` (same as /api/admin/kol, /api/admin/payouts).
 */

import { NextResponse } from 'next/server'
import { getAmplifyOverrides, setAmplifyOverrides } from '@/lib/amplify-config'

export const runtime = 'nodejs'

function checkAdmin(req: Request): boolean {
  const secret = process.env.ADMIN_SECRET?.trim()
  if (!secret) return false
  return req.headers.get('x-admin-secret')?.trim() === secret
}

export async function GET(req: Request) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json({ config: await getAmplifyOverrides() })
}

export async function POST(req: Request) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const config = await setAmplifyOverrides(body)
  return NextResponse.json({ ok: true, config })
}
