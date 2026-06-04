'use client'

import { openCookiePreferences } from './CookieConsent'

/**
 * Inline button that opens the cookie preference center. Used in the Cookie
 * Policy (and anywhere a "manage cookies" control is wanted).
 */
export default function ManageCookiesButton({
  children = 'Manage cookie preferences',
}: {
  children?: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={openCookiePreferences}
      className="font-mono text-[11px] uppercase tracking-[0.1em] rounded-lg border border-malama-accent/40 bg-malama-accent/10 px-4 py-2 text-malama-accent transition-colors hover:bg-malama-accent/20"
    >
      {children}
    </button>
  )
}
