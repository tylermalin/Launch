import { NextResponse } from 'next/server'

const ACCESS_COOKIE = 'malama_access'
const ACCESS_VALUE  = 'ml-launch-2026-authorized'

// Paths that bypass the password gate entirely
function isPublicPath(pathname: string) {
  return (
    pathname === '/password' ||
    pathname.startsWith('/api/auth/password') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
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
      dest.searchParams.set('from', pathname)
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
