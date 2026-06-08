import { NextResponse } from 'next/server'
import { createEmailSessionToken } from '@/lib/email-session'
import { upsertUserAccount } from '@/lib/user-account'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: Request) {
  let body: { email?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 })
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  // Create account on first sign-in; no-op (merge) on subsequent logins
  await upsertUserAccount({ email: email.toLowerCase() }).catch((err) =>
    console.error('[email-session] user account upsert failed:', err)
  )

  const token = createEmailSessionToken(email)
  const res = NextResponse.json({ ok: true, email: email.toLowerCase() })
  res.cookies.set('malama_email_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
  return res
}
