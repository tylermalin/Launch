'use client'

import Link from 'next/link'
import { useEffect, useState, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAccount, useDisconnect } from 'wagmi'
import { useWallet } from '@meshsdk/react'

type SessionData = { auth: 'email' | null; email?: string | null }

// Top nav: 5 primary items. Secondary items live in the mobile menu + footer.
const primaryNavLinks = [
  { href: '/sensors',        label: 'Sensors',     active: (p: string) => p.startsWith('/sensors'), authOnly: false },
  { href: '/presale',        label: 'Register interest', active: (p: string) => p.startsWith('/presale'), authOnly: false },
  { href: '/explorer',       label: 'Explore',     active: (p: string) => p === '/explorer' || p.startsWith('/explorer/'), authOnly: false },
  { href: '/docs',           label: 'Docs',        active: (p: string) => p.startsWith('/docs') || p === '/whitepaper', authOnly: false },
  { href: '/data-solutions', label: 'Data Buyers', active: (p: string) => p.startsWith('/data-solutions'), authOnly: false },
]
const secondaryNavLinks = [
  { href: '/timeline',  label: 'Timeline',  active: (p: string) => p.startsWith('/timeline'), authOnly: false },
  { href: '/partners',  label: 'Partners',  active: (p: string) => p.startsWith('/partners'), authOnly: false },
  { href: '/dashboard', label: 'Dashboard', active: (p: string) => p.startsWith('/dashboard'), authOnly: true },
]

const CORPORATE_URL = 'https://malamalabs.com'

const NAV_BTN =
  'shrink-0 whitespace-nowrap rounded-malama-sm px-[18px] py-[11px] text-center font-mono text-[11px] font-semibold uppercase tracking-[0.1em] transition-all hover:-translate-y-px'

// Small dot colored by auth method
function AuthDot({ method }: { method: 'evm' | 'cardano' | 'email' }) {
  const color =
    method === 'evm'     ? 'bg-blue-400'          :
    method === 'cardano' ? 'bg-malama-accent'      :
                           'bg-emerald-400'
  return <span className={`inline-block h-1.5 w-1.5 rounded-full ${color} shrink-0`} />
}

export default function Navbar() {
  const pathname = usePathname()
  const router   = useRouter()

  // ── Wallet state (client-side) ────────────────────────────────────────────
  const { address: evmAddress, isConnected: evmConnected } = useAccount()
  const { disconnect: disconnectEvm } = useDisconnect()
  const { connected: cardanoConnected, name: cardanoWalletName, disconnect: cardanoDisconnect } = useWallet()

  // ── Server session state ──────────────────────────────────────────────────
  // undefined = not yet resolved (avoids flash)
  const [session, setSession] = useState<SessionData | undefined>(undefined)
  const [signingOut, setSigningOut] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const fetchSession = useCallback(() => {
    fetch('/api/auth/session', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : { auth: null }))
      .then((d: SessionData) => setSession(d))
      .catch(() => setSession({ auth: null }))
  }, [])

  // Re-fetch on mount and whenever the route changes; close the mobile menu on nav.
  useEffect(() => { fetchSession(); setMenuOpen(false) }, [fetchSession, pathname])

  // Re-fetch whenever any part of the app signals an auth state change
  useEffect(() => {
    const handler = () => fetchSession()
    window.addEventListener('malama:auth', handler)
    return () => window.removeEventListener('malama:auth', handler)
  }, [fetchSession])

  // ── Combine all auth sources ──────────────────────────────────────────────
  const isAuthed  = session?.auth != null || evmConnected || cardanoConnected
  const isLoading = session === undefined

  // Auth method for display
  const authMethod: 'evm' | 'cardano' | 'email' | null =
    evmConnected    ? 'evm'     :
    cardanoConnected ? 'cardano' :
    session?.auth === 'email' ? 'email' :
    null

  // Short identity string shown in the chip
  let authIdentity: string | null = null
  if (evmConnected && evmAddress) {
    authIdentity = `${evmAddress.slice(0, 6)}…${evmAddress.slice(-4)}`
  } else if (cardanoConnected && cardanoWalletName) {
    authIdentity = cardanoWalletName.charAt(0).toUpperCase() + cardanoWalletName.slice(1)
  } else if (session?.email) {
    authIdentity = session.email.length > 22
      ? `${session.email.slice(0, 20)}…`
      : session.email
  }

  // ── Sign out ──────────────────────────────────────────────────────────────
  async function handleSignOut() {
    setSigningOut(true)
    try {
      if (evmConnected) disconnectEvm()
      if (cardanoConnected) cardanoDisconnect()
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
      setSession({ auth: null })
      window.dispatchEvent(new Event('malama:auth'))
      router.push('/')
      router.refresh()
    } finally {
      setSigningOut(false)
    }
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

          {/* Desktop nav links (5 primary) — hidden on mobile, replaced by the hamburger */}
          <div className="hidden lg:flex items-center gap-0.5">
            {primaryNavLinks.map(({ href, label, active }) => (
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
          </div>

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

          {/* ── Auth section — don't render until session resolves ── */}
          {!isLoading && (
            isAuthed ? (
              <div className="ml-1 sm:ml-2 flex items-center gap-1.5">

                {/* Identity chip — shows wallet address / wallet name / email */}
                {authIdentity && authMethod && (
                  <span className="hidden md:inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-malama-sm border border-malama-line bg-malama-card px-3 py-[11px] font-mono text-[10px] text-malama-ink-dim tracking-wide">
                    <AuthDot method={authMethod} />
                    {authIdentity}
                  </span>
                )}

                {/* Log Out */}
                <button
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className={`${NAV_BTN} border border-malama-line text-malama-ink-dim hover:border-red-500/50 hover:text-red-400 disabled:opacity-40`}
                >
                  {signingOut ? 'Signing out…' : 'Log Out'}
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className={`ml-1 sm:ml-2 ${NAV_BTN} bg-malama-accent text-malama-bg hover:shadow-[0_8px_24px_rgba(196,240,97,0.2)]`}
              >
                Log In / Register
              </Link>
            )
          )}

          {/* Hamburger — mobile only */}
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            className="lg:hidden ml-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-malama-sm border border-malama-line text-malama-ink-dim transition-colors hover:border-malama-accent/50 hover:text-malama-accent"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {menuOpen ? <path d="M6 6l12 12M6 18L18 6" /> : <><path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" /></>}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div className="lg:hidden border-t border-malama-line bg-malama-bg/95 px-5 py-3 backdrop-blur-[14px] sm:px-10">
          <div className="flex flex-col">
            {[...primaryNavLinks, ...secondaryNavLinks]
              .filter(({ authOnly }) => !authOnly || isAuthed)
              .map(({ href, label, active }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-sm px-2 py-3 font-mono text-[12px] font-medium uppercase tracking-[0.1em] transition-colors ${
                    active(pathname) ? 'text-malama-accent' : 'text-malama-ink-dim hover:text-malama-accent'
                  }`}
                >
                  {label}
                </Link>
              ))}
            <a
              href={CORPORATE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="rounded-sm px-2 py-3 font-mono text-[12px] font-medium uppercase tracking-[0.1em] text-malama-ink-faint transition-colors hover:text-malama-accent"
            >
              malamalabs.com ↗
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
