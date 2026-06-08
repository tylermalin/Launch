import { NextResponse } from 'next/server'

const ACCESS_COOKIE = 'malama_access'
const ACCESS_VALUE  = 'ml-launch-2026-authorized'

// Paths that bypass the password gate entirely
// Static assets (logo, brand images, PDFs, fonts, etc.) must bypass the gate —
// otherwise the password page's own <img src="/logo-mark.png"> gets 307'd to
// /password and renders broken.
const STATIC_ASSET_RE = /\.(png|jpe?g|gif|svg|webp|avif|ico|pdf|woff2?|ttf|otf|eot|css|js|map|txt|xml|json|mp4|webm)$/i

function isPublicPath(pathname: string) {
  return (
    pathname === '/password' ||
    pathname.startsWith('/api/auth/password') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    STATIC_ASSET_RE.test(pathname) ||
    pathname === '/presale' ||
    pathname.startsWith('/presale/') ||
    pathname.startsWith('/launch')
  )
}

export async function proxy(request: Request) {
  const url = new URL(request.url)
  const { pathname } = url

  // ── Password gate ────────────────────────────────────────────────────────
  if (!isPublicPath(pathname)) {
    const cookieHeader = request.headers.get('cookie') ?? ''
    const hasAccess = cookieHeader
      .split(';')
      .some(c => c.trim() === `${ACCESS_COOKIE}=${ACCESS_VALUE}`)

    if (!hasAccess) {
      const dest = new URL('/password', request.url)
      dest.searchParams.set('from', pathname + url.search)
      return NextResponse.redirect(dest)
    }
  }

  // Auth0 removed — email session + Magic Link are the only auth paths.
  // /auth/* routes redirect to /dashboard so old links don't 404.
  if (pathname.startsWith('/auth/')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
