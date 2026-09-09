/**
 * Data Solutions buyer-access request.
 *   POST { email, name?, org?, useCase?, message? } → store + notify via Resend.
 *   GET  (x-admin-secret) → list requests, newest first.
 */
import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { kv } from '@/lib/kv'
import { sendEmail, emailLayout, escapeHtml, ADMIN_NOTIFY_EMAIL } from '@/lib/email'

export const runtime = 'nodejs'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const INDEX = 'data:requests'
const key = (id: string) => `data:request:${id}`

type DataRequest = { id: string; email: string; name: string; org: string; useCase: string; message: string; createdAt: number }

export async function POST(req: Request) {
  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const email = String(body.email ?? '').trim().toLowerCase()
  if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: 'Please enter a valid email' }, { status: 400 })

  const reqRow: DataRequest = {
    id: randomUUID(),
    email: email.slice(0, 200),
    name: String(body.name ?? '').trim().slice(0, 120),
    org: String(body.org ?? '').trim().slice(0, 200),
    useCase: String(body.useCase ?? '').trim().slice(0, 120),
    message: String(body.message ?? '').trim().slice(0, 2000),
    createdAt: Date.now(),
  }

  try {
    await kv.set(key(reqRow.id), reqRow)
    await kv.sadd(INDEX, reqRow.id)
  } catch (e) {
    console.error('[data-solutions/request] persist failed', e)
    return NextResponse.json({ error: 'Could not save — please try again' }, { status: 500 })
  }

  await Promise.allSettled([
    sendEmail({
      to: ADMIN_NOTIFY_EMAIL,
      replyTo: reqRow.email,
      subject: `Data Solutions request — ${reqRow.name || reqRow.email}${reqRow.org ? ` (${reqRow.org})` : ''}`,
      html: emailLayout('New Data Solutions buyer request', `
        <p><strong>Email:</strong> ${escapeHtml(reqRow.email)}</p>
        ${reqRow.name ? `<p><strong>Name:</strong> ${escapeHtml(reqRow.name)}</p>` : ''}
        ${reqRow.org ? `<p><strong>Organization:</strong> ${escapeHtml(reqRow.org)}</p>` : ''}
        ${reqRow.useCase ? `<p><strong>Primary use case:</strong> ${escapeHtml(reqRow.useCase)}</p>` : ''}
        ${reqRow.message ? `<p><strong>Message:</strong><br/>${escapeHtml(reqRow.message)}</p>` : ''}`),
    }),
    sendEmail({
      to: reqRow.email,
      subject: 'Your Mālama Data Solutions request',
      html: emailLayout(reqRow.name ? `Thanks, ${escapeHtml(reqRow.name.split(' ')[0])}` : 'Request received', `
        <p>We received your request for access to Mālama Labs Data Solutions. Our data team will
        reach out to scope datasets, coverage, and API access for your use case.</p>
        <p>Mālama Labs — the Physical Data Oracle for environmental markets.</p>`),
    }),
  ])

  return NextResponse.json({ ok: true })
}

export async function GET(req: Request) {
  const secret = process.env.ADMIN_SECRET?.trim()
  if (!secret || req.headers.get('x-admin-secret')?.trim() !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const ids = await kv.smembers(INDEX)
  const rows = (await Promise.all(ids.map((id) => kv.get<DataRequest>(key(id)).catch(() => null)))).filter(Boolean) as DataRequest[]
  rows.sort((a, b) => b.createdAt - a.createdAt)
  return NextResponse.json({ requests: rows, count: rows.length })
}
