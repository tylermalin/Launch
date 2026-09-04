import { NextResponse } from 'next/server'

// The site is public. Only pricing and the purchase agreement are restricted —
// reachable to logged-in holders (existing holders sign in via /auth). Everything
// else (home, explorer, docs, /presale register-interest) is open.
const HOLDER_ONLY = ['/docs/pricing', '/docs/pricing-roi', '/legal/hex-node-purchase']

export async function proxy(request: Request) {
  const url = new URL(request.url)
  const { pathname } = url

  if (HOLDER_ONLY.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    const cookie = request.headers.get('cookie') ?? ''
    const loggedIn = cookie
      .split(';')
      .some((c) => c.trim().startsWith('malama_email_session='))
    if (!loggedIn) {
      const dest = new URL('/auth', request.url)
      dest.searchParams.set('from', pathname + url.search)
      return NextResponse.redirect(dest)
    }
  }

  // Old /auth/* deep links redirect to the dashboard (kept from before).
  if (pathname.startsWith('/auth/')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/docs/pricing',
    '/docs/pricing/:path*',
    '/docs/pricing-roi',
    '/docs/pricing-roi/:path*',
    '/legal/hex-node-purchase',
    '/legal/hex-node-purchase/:path*',
    '/auth/:path*',
  ],
}
