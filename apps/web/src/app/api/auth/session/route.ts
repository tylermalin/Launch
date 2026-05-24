import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { parseEmailSessionToken } from '@/lib/email-session'

export async function GET() {
  const jar = await cookies()
  const raw = jar.get('malama_email_session')?.value
  if (!raw) {
    return NextResponse.json({ email: null, sub: null, auth: null, user: null })
  }
  const parsed = parseEmailSessionToken(raw)
  return NextResponse.json({
    email: parsed?.email ?? null,
    sub:   null,
    auth:  parsed ? ('email' as const) : null,
    user:  null,
  })
}
