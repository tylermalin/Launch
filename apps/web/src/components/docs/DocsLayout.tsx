'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BookOpen,
  Calculator,
  CalendarRange,
  FileText,
  Hexagon,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'

const NAV: {
  href: string
  label: string
  icon: typeof BookOpen
  exact?: boolean
}[] = [
  { href: '/docs', label: 'Overview', icon: BookOpen, exact: true },
  { href: '/docs/tokenomics', label: 'MLMA Tokenomics', icon: FileText },
  { href: '/docs/pricing-roi', label: 'Pricing & ROI', icon: Calculator },
  { href: '/docs/phase-1-timeline', label: 'Phase 1 Timeline', icon: CalendarRange },
  { href: '/docs/operators', label: 'Operator Guide', icon: Hexagon },
]

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const NavLinks = ({ onNavigate }: { onNavigate?: () => void }) => (
    <ul className="space-y-1">
      {NAV.map(({ href, label, icon: Icon, exact }) => {
        const active = isActive(href, exact)
        return (
          <li key={href}>
            <Link
              href={href}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                active
                  ? 'bg-malama-accent/15 text-malama-accent border border-malama-accent/30 shadow-[0_0_20px_rgba(196,240,97,0.12)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-malama-accent' : 'text-gray-500'}`} />
              {label}
            </Link>
          </li>
        )
      })}
    </ul>
  )

  return (
    <div className="min-h-screen bg-malama-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* Mobile nav toggle */}
        <div className="lg:hidden flex items-center justify-between mb-6">
          <p className="text-xs font-black uppercase tracking-widest text-malama-accent/80">Documentation</p>
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="p-2 rounded-xl border border-gray-700 text-gray-300 hover:bg-white/5"
            aria-expanded={mobileOpen}
            aria-label="Toggle documentation menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileOpen && (
          <nav className="lg:hidden mb-8 p-4 rounded-2xl border border-malama-line bg-malama-elev">
            <NavLinks onNavigate={() => setMobileOpen(false)} />
          </nav>
        )}

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24">
              <p className="text-xs font-black uppercase tracking-widest text-malama-accent/80 mb-4 px-1">
                Documentation
              </p>
              <nav>
                <NavLinks />
              </nav>
              <div className="mt-8 p-4 rounded-xl border border-malama-line bg-malama-elev/80">
                <p className="text-xs text-malama-ink-faint leading-relaxed">
                  These pages summarize Genesis 200 economics and operations. Figures are illustrative; live terms follow your reservation flow.
                </p>
                <Link
                  href="/presale"
                  className="mt-3 inline-block text-sm font-bold text-malama-accent hover:text-malama-accent-dim"
                >
                  Reserve a node →
                </Link>
              </div>
            </div>
          </aside>

          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </div>
    </div>
  )
}
