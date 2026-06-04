'use client'

/**
 * CookieConsent — first-party cookie consent banner + preference center.
 *
 * Mounted once in the root layout (alongside ReferralCapture). On first visit
 * it shows a banner; the preference center lets the visitor toggle non-essential
 * categories. The choice is stored in a first-party cookie (`mlma_cookie_consent`)
 * that is readable client- and server-side so analytics/functional code can gate
 * on it. Strictly necessary cookies are always on and cannot be disabled.
 *
 * Reopen the preference center from anywhere (e.g. the Cookie Policy page or the
 * footer) by calling `openCookiePreferences()` or dispatching the
 * `mlma:open-cookie-preferences` event. This is the mechanism the Cookie Policy
 * (MLMA-LEGAL-004) refers to.
 */

import { useEffect, useState, useCallback } from 'react'

export const CONSENT_COOKIE = 'mlma_cookie_consent'
export const CONSENT_VERSION = 1
const COOKIE_DAYS = 180
export const OPEN_PREFS_EVENT = 'mlma:open-cookie-preferences'

export type CookieConsentValue = {
  v: number
  necessary: true
  functional: boolean
  analytics: boolean
  ts: number
}

// ── Cookie helpers ────────────────────────────────────────────────────────────

export function getConsent(): CookieConsentValue | null {
  if (typeof document === 'undefined') return null
  const m = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=([^;]*)`))
  if (!m) return null
  try {
    const parsed = JSON.parse(decodeURIComponent(m[1])) as CookieConsentValue
    if (!parsed || parsed.v !== CONSENT_VERSION) return null
    return parsed
  } catch {
    return null
  }
}

function writeConsent(functional: boolean, analytics: boolean): void {
  if (typeof document === 'undefined') return
  const value: CookieConsentValue = {
    v: CONSENT_VERSION,
    necessary: true,
    functional,
    analytics,
    ts: Date.now(),
  }
  const expires = new Date(Date.now() + COOKIE_DAYS * 864e5).toUTCString()
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(
    JSON.stringify(value),
  )}; expires=${expires}; path=/; SameSite=Lax`
}

/** Reopen the preference center from anywhere on the site. */
export function openCookiePreferences(): void {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(OPEN_PREFS_EVENT))
}

// ── Category metadata ─────────────────────────────────────────────────────────

const CATEGORIES: {
  key: 'necessary' | 'functional' | 'analytics'
  label: string
  body: string
  locked?: boolean
}[] = [
  {
    key: 'necessary',
    label: 'Strictly necessary',
    body: 'Session authentication, security, fraud prevention, and remembering your cookie choices. Always active; the site cannot function without them.',
    locked: true,
  },
  {
    key: 'functional',
    label: 'Functional',
    body: 'Remembers preferences such as wallet connection state, language, and interface settings.',
  },
  {
    key: 'analytics',
    label: 'Analytics & performance',
    body: 'Aggregate, privacy-respecting measurement of page views and feature use to improve the Services. No advertising profiles.',
  },
]

// ── Component ─────────────────────────────────────────────────────────────────

type Mode = 'hidden' | 'banner' | 'prefs'

export default function CookieConsent() {
  const [mode, setMode] = useState<Mode>('hidden')
  const [functional, setFunctional] = useState(false)
  const [analytics, setAnalytics] = useState(false)

  // Decide initial state once mounted (avoids SSR/hydration mismatch).
  useEffect(() => {
    const existing = getConsent()
    if (existing) {
      setFunctional(existing.functional)
      setAnalytics(existing.analytics)
    } else {
      setMode('banner')
    }
    const onOpen = () => {
      const c = getConsent()
      setFunctional(c?.functional ?? false)
      setAnalytics(c?.analytics ?? false)
      setMode('prefs')
    }
    window.addEventListener(OPEN_PREFS_EVENT, onOpen)
    return () => window.removeEventListener(OPEN_PREFS_EVENT, onOpen)
  }, [])

  const acceptAll = useCallback(() => {
    writeConsent(true, true)
    setMode('hidden')
  }, [])

  const rejectNonEssential = useCallback(() => {
    writeConsent(false, false)
    setMode('hidden')
  }, [])

  const savePrefs = useCallback(() => {
    writeConsent(functional, analytics)
    setMode('hidden')
  }, [functional, analytics])

  if (mode === 'hidden') return null

  const btnBase =
    'font-mono text-[11px] uppercase tracking-[0.1em] px-4 py-2 rounded-lg border transition-colors'
  const btnAccent = `${btnBase} border-malama-accent/40 bg-malama-accent/10 text-malama-accent hover:bg-malama-accent/20`
  const btnGhost = `${btnBase} border-malama-line bg-transparent text-malama-ink-dim hover:text-malama-ink hover:border-malama-ink-faint`

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[9999] flex justify-center px-4 pb-4 sm:px-6 sm:pb-6"
      style={{ pointerEvents: 'none' }}
    >
      {mode === 'banner' && (
        <div
          role="dialog"
          aria-label="Cookie consent"
          aria-live="polite"
          className="w-full max-w-3xl rounded-2xl border border-malama-line bg-malama-elev/95 p-5 backdrop-blur sm:p-6"
          style={{ pointerEvents: 'auto' }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-malama-accent/80">
            Cookies
          </p>
          <p className="mt-2 text-sm leading-relaxed text-malama-ink-dim">
            We use strictly necessary cookies to run the site, and, with your consent, functional
            and analytics cookies to improve it. We do not use advertising cookies. See the{' '}
            <a href="/legal/cookies" className="text-malama-accent hover:underline">
              Cookie Policy
            </a>
            .
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={acceptAll} className={btnAccent}>
              Accept all
            </button>
            <button type="button" onClick={rejectNonEssential} className={btnGhost}>
              Reject non-essential
            </button>
            <button type="button" onClick={() => setMode('prefs')} className={btnGhost}>
              Preferences
            </button>
          </div>
        </div>
      )}

      {mode === 'prefs' && (
        <>
          <div
            className="fixed inset-0 bg-black/60"
            style={{ pointerEvents: 'auto' }}
            onClick={() => setMode(getConsent() ? 'hidden' : 'banner')}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Cookie preferences"
            className="relative mb-2 max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-malama-line bg-malama-bg p-6 shadow-2xl"
            style={{ pointerEvents: 'auto' }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-malama-accent/80">
              Cookie preferences
            </p>
            <h2 className="mt-2 font-serif text-xl font-medium text-malama-ink">
              Manage your cookie choices
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-malama-ink-dim">
              Choose which non-essential categories to allow. You can change this any time from the
              Cookie Policy.
            </p>

            <div className="mt-5 space-y-3">
              {CATEGORIES.map((cat) => {
                const checked =
                  cat.key === 'necessary'
                    ? true
                    : cat.key === 'functional'
                      ? functional
                      : analytics
                const setter =
                  cat.key === 'functional'
                    ? setFunctional
                    : cat.key === 'analytics'
                      ? setAnalytics
                      : undefined
                return (
                  <div
                    key={cat.key}
                    className="rounded-xl border border-malama-line bg-malama-elev/50 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-malama-ink">
                          {cat.label}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-malama-ink-dim">
                          {cat.body}
                        </p>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={checked}
                        aria-label={`${cat.label}${cat.locked ? ' (always on)' : ''}`}
                        disabled={cat.locked}
                        onClick={() => setter && setter(!checked)}
                        className="mt-0.5 inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors"
                        style={{
                          borderColor: checked ? 'var(--mlma-accent, #c4f061)' : '#2d3d2e',
                          background: checked
                            ? 'color-mix(in srgb, var(--mlma-accent, #c4f061) 30%, transparent)'
                            : 'transparent',
                          cursor: cat.locked ? 'not-allowed' : 'pointer',
                          opacity: cat.locked ? 0.7 : 1,
                        }}
                      >
                        <span
                          className="inline-block h-3.5 w-3.5 rounded-full transition-transform"
                          style={{
                            background: checked ? 'var(--mlma-accent, #c4f061)' : '#5f6c5f',
                            transform: checked ? 'translateX(18px)' : 'translateX(3px)',
                          }}
                        />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button type="button" onClick={savePrefs} className={btnAccent}>
                Save preferences
              </button>
              <button type="button" onClick={acceptAll} className={btnGhost}>
                Accept all
              </button>
              <button type="button" onClick={rejectNonEssential} className={btnGhost}>
                Reject non-essential
              </button>
            </div>
            <p className="mt-3 text-center font-mono text-[10px] text-malama-ink-faint">
              Full detail in the{' '}
              <a href="/legal/cookies" className="text-malama-accent hover:underline">
                Cookie Policy
              </a>
              .
            </p>
          </div>
        </>
      )}
    </div>
  )
}
