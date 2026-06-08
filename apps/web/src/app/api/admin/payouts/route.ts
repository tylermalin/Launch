/**
 * Admin payout API (external, x-admin-secret). Thin wrapper over lib/payouts-admin,
 * which the email-session admin proxy also calls directly.
 *
 * GET  → pending payouts overview
 * POST → execute a batch  body: { approvedBy?, commissionIds?, kolId? }
 */
import { NextResponse } from 'next/server'
import { getPayoutsOverview, runPayoutBatch } from '@/lib/payouts-admin'

export const runtime = 'nodejs'

function checkAdmin(req: Request): boolean {
  const secret = process.env.ADMIN_SECRET?.trim()
  if (!secret) return false
  return req.headers.get('x-admin-secret')?.trim() === secret
}

export async function GET(req: Request) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    return NextResponse.json(await getPayoutsOverview())
  } catch (e) {
    console.error('[admin/payouts GET]', e)
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  let body: { approvedBy?: string; commissionIds?: string[]; kolId?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  try {
    const r = await runPayoutBatch({ approvedBy: body.approvedBy, commissionIds: body.commissionIds, kolId: body.kolId })
    return NextResponse.json(r.body, { status: r.status })
  } catch (e) {
    console.error('[admin/payouts POST]', e)
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Server error' }, { status: 500 })
  }
}
