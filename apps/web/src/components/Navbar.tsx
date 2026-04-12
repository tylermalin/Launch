'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const topNavLinks = [
  { href: '/presale', label: 'Reserve', active: (p: string) => p.startsWith('/presale') },
  { href: '/docs', label: 'Docs', active: (p: string) => p.startsWith('/docs') },
  { href: '/timeline', label: 'Timeline', active: (p: string) => p.startsWith('/timeline') },
  { href: '/map', label: 'Explorer', active: (p: string) => p === '/map' || p.startsWith('/map/') },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-malama-line bg-malama-bg/80 backdrop-blur-[14px]">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-5 py-[14px] sm:px-10">
        <Link
          href="/"
          className="flex shrink-0 items-center rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-malama-accent/50"
        >
          <Image
            src="/brand-logo.png"
            alt="Mālama Labs Logo"
            width={700}
            height={300}
            priority
            className="h-9 w-auto max-w-[min(100%,15rem)] object-contain object-left drop-shadow-[0_0_18px_rgba(196,240,97,0.18)] transition-[filter] duration-300 hover:drop-shadow-[0_0_26px_rgba(196,240,97,0.35)] sm:h-11 sm:max-w-[20rem] md:h-12 md:max-w-[24rem]"
          />
        </Link>

        <div className="flex min-w-0 items-center justify-end gap-0.5 sm:gap-2">
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
          <Link
            href="/dashboard"
            className={`ml-1 shrink-0 whitespace-nowrap rounded-malama-sm px-[18px] py-[11px] font-mono text-[11px] font-semibold uppercase tracking-[0.1em] transition-transform hover:-translate-y-px sm:ml-2 ${
              pathname.startsWith('/dashboard')
                ? 'bg-malama-accent text-malama-bg ring-1 ring-malama-accent/60'
                : 'bg-malama-accent text-malama-bg hover:shadow-[0_8px_24px_rgba(196,240,97,0.2)]'
            }`}
          >
            Launch App
          </Link>
        </div>
      </div>
    </nav>
  )
}
