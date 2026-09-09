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
    const owns = await ownsGenesisHex(request.url, cookie)
    if (!owns) {
      const dest = new URL('/auth', request.url)
      dest.searchParams.set('from', pathname + url.search)
      return NextResponse.redirect(dest)
    }
  }

  // The partner/commission program is closed with the sales pause. Any stray old
  // link (/partners, /partners/apply, /partners/dashboard) redirects to home.
  if (pathname === '/partners' || pathname.startsWith('/partners/')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Old /auth/* deep links redirect to the dashboard (kept from before).
  if (pathname.startsWith('/auth/')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

// Strict holder check: the signed-in account must own at least one Genesis hex.
// (Verified against /api/user, whose account carries the authoritative hexIds.)
async function ownsGenesisHex(reqUrl: string, cookie: string): Promise<boolean> {
  if (!cookie.includes('malama_email_session=')) return false
  try {
    const res = await fetch(new URL('/api/user', reqUrl), {
      headers: { cookie },
      cache: 'no-store',
    })
    if (!res.ok) return false
    const data = (await res.json()) as { account?: { hexIds?: string[] } }
    return (data.account?.hexIds?.length ?? 0) > 0
  } catch {
    return false
  }
}

export const config = {
  matcher: [
    '/docs/pricing',
    '/docs/pricing/:path*',
    '/docs/pricing-roi',
    '/docs/pricing-roi/:path*',
    '/legal/hex-node-purchase',
    '/legal/hex-node-purchase/:path*',
    '/partners',
    '/partners/:path*',
    '/auth/:path*',
  ],
}
