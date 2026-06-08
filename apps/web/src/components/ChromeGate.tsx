'use client'

import { usePathname } from 'next/navigation'

/**
 * Hides global site chrome (Navbar / SiteFooter) on routes that carry their own
 * standalone layout — currently the /sensors "Obsidian" product landing.
 */
export default function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname?.startsWith('/sensors')) return null
  return <>{children}</>
}
