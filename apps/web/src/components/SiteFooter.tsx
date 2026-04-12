import Link from 'next/link'

const DISCORD_URL = 'https://discord.gg/PcKRRUcJ'

const footerSections: { title: string; links: { href: string; label: string; external?: boolean }[] }[] = [
  {
    title: 'Product',
    links: [
      { href: '/presale', label: 'Reserve a node' },
      { href: '/map', label: 'Explorer' },
      { href: '/timeline', label: 'Timeline' },
    ],
  },
  {
    title: 'Documentation',
    links: [
      { href: '/docs', label: 'Documentation hub' },
      { href: '/docs/tokenomics', label: 'White paper' },
      { href: '/docs/pricing-roi', label: 'Pricing and ROI' },
      { href: '/docs/phase-1-timeline', label: 'Phase 1 timeline' },
      { href: '/docs/operators', label: 'Operator docs' },
    ],
  },
  {
    title: 'Community',
    links: [{ href: DISCORD_URL, label: 'Discord', external: true }],
  },
  {
    title: 'Legal',
    links: [{ href: '/legal', label: 'Legal center' }],
  },
]

export default function SiteFooter() {
  return (
    <footer className="relative z-[2] mt-24 w-full border-t border-malama-line bg-malama-bg">
      <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-10">
        <div className="mb-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <p className="font-serif text-[1.65rem] font-medium tracking-tight text-malama-ink">Mālama Labs</p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-malama-ink-dim">
              Cryptographic environmental intelligence — hardware-signed data anchored to Base and Cardano.
            </p>
          </div>
          {footerSections.map((section) => (
            <div key={section.title}>
              <h2 className="mb-4 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-malama-ink-faint">
                {section.title}
              </h2>
              <ul className="space-y-2.5">
                {section.links.map((item) => (
                  <li key={item.href}>
                    {item.external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-malama-ink-dim transition-colors hover:text-malama-accent"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className="text-sm text-malama-ink-dim transition-colors hover:text-malama-accent"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3 border-t border-malama-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-malama-ink-faint">
            © 2026 Mālama Labs. All rights reserved.
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-malama-ink-faint">
            Environmental intelligence core
          </p>
        </div>
      </div>
    </footer>
  )
}
