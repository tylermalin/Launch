'use client'

/**
 * ReferralCapture — reads ?ref=<kolId> from the URL on any page load
 * and stores it in a 30-day cookie (`malama_ref`).
 *
 * Also fires a lightweight background hit to /api/ref/[kolId]/track
 * so we can count clicks server-side.
 *
 * Add <ReferralCapture /> once in the root layout (inside Suspense is handled internally).
 */

import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

export const REF_COOKIE = 'malama_ref'
const COOKIE_DAYS = 30
const KOL_ID_RE = /^[a-zA-Z0-9_-]{1,48}$/

// ── Cookie helpers ────────────────────────────────────────────────────────────

export function setRefCookie(kolId: string): void {
  if (typeof document === 'undefined') return
  const expires = new Date(Date.now() + COOKIE_DAYS * 24 * 60 * 60 * 1000).toUTCString()
  document.cookie = `${REF_COOKIE}=${encodeURIComponent(kolId)}; expires=${expires}; path=/; SameSite=Lax`
}

export function getRefCookie(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${REF_COOKIE}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

export function clearRefCookie(): void {
  if (typeof document === 'undefined') return
  document.cookie = `${REF_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
}

// ── Internal tracker component ────────────────────────────────────────────────

function Tracker() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const ref = searchParams.get('ref')
    if (!ref || !KOL_ID_RE.test(ref)) return

    // Extend / set the cookie
    setRefCookie(ref)

    // Background server-side click count (fire-and-forget, best-effort)
    fetch(`/api/ref/${encodeURIComponent(ref)}/track`, {
      method: 'POST',
      credentials: 'same-origin',
    }).catch(() => {
      /* ignore — click tracking is non-critical */
    })
  }, [searchParams])

  return null
}

// ── Public component ──────────────────────────────────────────────────────────

export default function ReferralCapture() {
  return (
    <Suspense fallback={null}>
      <Tracker />
    </Suspense>
  )
}
