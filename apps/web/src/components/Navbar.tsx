'use client'

import Link from 'next/link'
import { useEffect, useState, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'

type SessionData = { auth: 'email' | null; email?: string | null }

const topNavLinks = [
  { href: '/presale',  label: 'Reserve',   active: (p: string) => p.startsWith('/presale') },
  { href: '/docs',     label: 'Docs',      active: (p: string) => p.startsWith('/docs') || p === '/whitepaper' },
  { href: '/timeline', label: 'Timeline',  active: (p: string) => p.startsWith('/timeline') },
  { href: '/explorer', label: 'Explorer',  active: (p: string) => p === '/explorer' || p.startsWith('/explorer/') },
  { href: '/partners', label: 'Partners',  active: (p: string) => p.startsWith('/partners') },
]

const CORPORATE_URL = 'https://malamalabs.com'

const NAV_BTN =
  'shrink-0 whitespace-nowrap rounded-malama-sm px-[18px] py-[11px] text-center font-mono text-[11px] font-semibold uppercase tracking-[0.1em] transition-all hover:-translate-y-px'

export default function Navbar() {
  const pathname = usePathname()
  const router   = useRouter()

  // undefined = not yet resolved (avoids flash)
  const [session, setSession] = useState<SessionData | undefined>(undefined)
  const [signingOut, setSigningOut] = useState(false)

  const fetchSession = useCallback(() => {
    fetch('/api/auth/session', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : { auth: null }))
      .then((d: SessionData) => setSession(d))
      .catch(() => setSession({ auth: null }))
  }, [])

  // Re-fetch on mount and whenever the route changes
  useEffect(() => { fetchSession() }, [fetchSession, pathname])

  // Re-fetch whenever any part of the app signals an auth state change
  useEffect(() => {
    const handler = () => fetchSession()
    window.addEventListener('malama:auth', handler)
    return () => window.removeEventListener('malama:auth', handler)
  }, [fetchSession])

  const isAuthed  = session?.auth != null
  const isLoading = session === undefined

  async function handleSignOut() {
    setSigningOut(true)
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    setSession({ auth: null })
    setSigningOut(false)
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-malama-line bg-malama-bg/80 backdrop-blur-[14px]">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-5 py-[14px] sm:px-10">

        {/* ── Logo ── */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-malama-accent/50"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-mark.png"
            alt="Mālama Labs"
            width={32}
            height={32}
            className="shrink-0 drop-shadow-[0_0_10px_rgba(101,217,165,0.3)] transition-[filter] duration-300 hover:drop-shadow-[0_0_18px_rgba(101,217,165,0.5)]"
            aria-hidden="true"
          />
          <span className="font-black tracking-tight text-white text-[1.05rem] leading-none drop-shadow-[0_0_18px_rgba(101,217,165,0.18)] transition-[filter] duration-300 hover:drop-shadow-[0_0_26px_rgba(101,217,165,0.35)]">
            Mālama Labs
          </span>
        </Link>

        {/* ── Right side ── */}
        <div className="flex min-w-0 items-center justify-end gap-0.5 sm:gap-2">

          {/* Nav links */}
          {topNavLinks.map(({ href, label, active }) => (
            <Link
              key={href}
              href={href}
              className={`shrink-0 whitespace-nowrap rounded-sm px-3 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.1em] transition-colors sm:px-4 ${
                active(pathname) ? 'text-malama-accent' : 'text-malama-ink-dim hover:text-malama-accent'
              }`}
            >
              {label}
            </Link>
          ))}

          {/* Corporate link */}
          <a
            href={CORPORATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-sm px-3 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-malama-ink-faint hover:text-malama-accent transition-colors sm:px-4"
          >
            malamalabs.com
            <svg className="w-2.5 h-2.5 opacity-60" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M1 9L9 1M9 1H3M9 1V7"/>
            </svg>
          </a>

          {/* ── Auth buttons — don't render until session resolves ── */}
          {!isLoading && (
            isAuthed ? (
              <div className="ml-1 sm:ml-2 flex items-center gap-2">
                {/* Dashboard link */}
                <Link
                  href="/dashboard"
                  className={`${NAV_BTN} ${
                    pathname.startsWith('/dashboard')
                      ? 'bg-malama-accent text-malama-bg ring-1 ring-malama-accent/60'
                      : 'bg-malama-accent text-malama-bg hover:shadow-[0_8px_24px_rgba(196,240,97,0.2)]'
                  }`}
                >
                  Dashboard
                </Link>

                {/* Sign out */}
                <button
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className={`${NAV_BTN} border border-malama-line text-malama-ink-dim hover:border-red-500/50 hover:text-red-400 disabled:opacity-40`}
                >
                  {signingOut ? 'Signing out…' : 'Sign Out'}
                </button>
              </div>
            ) : (
              <Link
                href="/dashboard"
                className={`ml-1 sm:ml-2 ${NAV_BTN} bg-malama-accent text-malama-bg hover:shadow-[0_8px_24px_rgba(196,240,97,0.2)]`}
              >
                Log In / Register
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  )
}
