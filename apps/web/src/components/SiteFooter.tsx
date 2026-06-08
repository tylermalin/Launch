import Link from 'next/link'

const DISCORD_URL = 'https://discord.gg/PcKRRUcJ'
const AIPOWER_URL = 'https://ai-energy-impact-opal.vercel.app/'
const CORPORATE_URL = 'https://malamalabs.com'

const footerSections: { title: string; links: { href: string; label: string; external?: boolean }[] }[] = [
  {
    title: 'Product',
    links: [
      { href: '/presale',  label: 'Reserve a node' },
      { href: '/explorer', label: 'Hex Map Explorer' },
      { href: '/timeline', label: 'Timeline' },
      { href: '/partners', label: 'Become a partner' },
    ],
  },
  {
    title: 'Documentation',
    links: [
      { href: '/whitepaper',          label: 'Whitepaper v1.0' },
      { href: '/docs',                label: 'Docs hub' },
      { href: '/docs/tokenomics',     label: 'MLMA Tokenomics' },
      { href: '/docs/pricing-roi',    label: 'Pricing & Dynamics' },
      { href: '/docs/operators',      label: 'Operator Guide' },
      { href: 'https://docs.malamalabs.com', label: 'User Docs', external: true },
    ],
  },
  {
    title: 'Community',
    links: [
      { href: DISCORD_URL,  label: 'Discord',          external: true },
      { href: 'mailto:hello@malamalabs.com?subject=Hex%20Node%20call', label: 'Schedule a call', external: true },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/legal',                      label: 'Legal center' },
      { href: '/legal/token-rewards-risk',   label: 'Token & Rewards Risk Disclosure' },
    ],
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
              Cryptographic environmental intelligence. Hardware-signed data anchored to Cardano and Base.
            </p>
            <a
              href={AIPOWER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-malama-accent hover:text-malama-accent/80 transition-colors"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-malama-accent animate-pulse" />
              Live data stream → aipower.fyi
            </a>
            <a
              href={CORPORATE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-malama-ink-faint hover:text-malama-accent transition-colors"
            >
              ← malamalabs.com
            </a>
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
