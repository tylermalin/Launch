/**
 * Sensor quote/lead capture.
 *   POST { name, email, org?, message? } → store a lead in KV.
 *   GET  (x-admin-secret) → list leads, newest first.
 */
import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { kv } from '@/lib/kv'
import { sendEmail, emailLayout, escapeHtml, ADMIN_NOTIFY_EMAIL } from '@/lib/email'

export const runtime = 'nodejs'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const INDEX = 'sensors:quotes'
const key = (id: string) => `sensors:quote:${id}`

type Quote = { id: string; name: string; email: string; org: string; message: string; createdAt: number }

export async function POST(req: Request) {
  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const name = String(body.name ?? '').trim()
  const email = String(body.email ?? '').trim().toLowerCase()
  if (!name || !email) return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: 'Please enter a valid email' }, { status: 400 })

  const quote: Quote = {
    id: randomUUID(),
    name: name.slice(0, 120),
    email: email.slice(0, 200),
    org: String(body.org ?? '').trim().slice(0, 200),
    message: String(body.message ?? '').trim().slice(0, 2000),
    createdAt: Date.now(),
  }

  try {
    await kv.set(key(quote.id), quote)
    await kv.sadd(INDEX, quote.id)
  } catch (e) {
    console.error('[sensors/quote] persist failed', e)
    return NextResponse.json({ error: 'Could not save — please try again' }, { status: 500 })
  }

  // Notify the team + confirm to the lead. Never block the response on email.
  await Promise.allSettled([
    sendEmail({
      to: ADMIN_NOTIFY_EMAIL,
      replyTo: quote.email,
      subject: `New sensor quote — ${quote.name}${quote.org ? ` (${quote.org})` : ''}`,
      html: emailLayout('New sensor quote request', `
        <p><strong>Name:</strong> ${escapeHtml(quote.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(quote.email)}</p>
        ${quote.org ? `<p><strong>Organization:</strong> ${escapeHtml(quote.org)}</p>` : ''}
        ${quote.message ? `<p><strong>Message:</strong><br/>${escapeHtml(quote.message)}</p>` : ''}`),
    }),
    sendEmail({
      to: quote.email,
      subject: 'Thanks for your interest in Mālama sensors',
      html: emailLayout(`Thanks, ${escapeHtml(quote.name.split(' ')[0] || quote.name)}`, `
        <p>We received your request about the Mālama sensor system. The sensors are in active
        development — our team will reach out as they move toward deployment.</p>
        <p>In the meantime, explore the live network at
        <a href="https://launch.malamalabs.com">launch.malamalabs.com</a>.</p>`),
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
  const quotes = (await Promise.all(ids.map((id) => kv.get<Quote>(key(id))))).filter(Boolean) as Quote[]
  quotes.sort((a, b) => b.createdAt - a.createdAt)
  return NextResponse.json({ quotes, count: quotes.length })
}
