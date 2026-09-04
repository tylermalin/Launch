import Link from 'next/link'

const DISCORD_URL = 'https://discord.gg/PcKRRUcJ'
const AIPOWER_URL = 'https://ai-energy-impact-opal.vercel.app/'
const CORPORATE_URL = 'https://malamalabs.com'

const footerSections: { title: string; links: { href: string; label: string; external?: boolean }[] }[] = [
  {
    title: 'Product',
    links: [
      { href: '/presale',  label: 'Register interest' },
      { href: '/sensors',  label: 'Sensor Systems' },
      { href: '/data-solutions', label: 'Data Solutions' },
      { href: '/explorer', label: 'Hex Map Explorer' },
      { href: '/timeline', label: 'Timeline' },
      { href: '/partners', label: 'Become a partner' },
    ],
  },
  {
    title: 'Documentation',
    links: [
      { href: '/docs',                label: 'Protocol Policy & Documentation' },
      { href: '/whitepaper',          label: 'Whitepaper' },
      { href: '/docs/tokenomics',     label: 'Tokenomics' },
      { href: '/docs/operators',      label: 'Operator Guide' },
      { href: 'https://docs.malamalabs.com', label: 'User Documentation', external: true },
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
              <span className="text-malama-ink">Mālama Labs</span> is the trust anchor for physical-world data.
              Two product lines today: carbon dMRV (proven) and AI compute monitoring (scaling). One signing
              architecture across both.
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
            <div className="mt-5 flex items-center gap-4">
              <a
                href="https://www.linkedin.com/company/malama-labs"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-malama-ink-faint transition-colors hover:text-malama-accent"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
              </a>
              <a
                href="https://www.youtube.com/@malamalabs"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-malama-ink-faint transition-colors hover:text-malama-accent"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" /><path d="m10 15 5-3-5-3z" /></svg>
              </a>
              <a
                href="https://medium.com/@malamalabs"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Medium"
                className="text-malama-ink-faint transition-colors hover:text-malama-accent"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="7" cy="12" r="5" /><ellipse cx="16.5" cy="12" rx="2" ry="5" /><ellipse cx="21" cy="12" rx="0.5" ry="5" /></svg>
              </a>
              <a
                href="https://twitter.com/malamalabs"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className="text-malama-ink-faint transition-colors hover:text-malama-accent"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
              </a>
            </div>
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
        <div className="border-t border-malama-line pt-8">
          <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <Link href="/legal/terms" className="text-malama-ink-dim transition-colors hover:text-malama-accent">Terms &amp; Conditions</Link>
            <a href="mailto:hello@malamalabs.com?subject=Hello" className="text-malama-ink-dim transition-colors hover:text-malama-accent">Contact Us</a>
            <Link href="/legal/privacy" className="text-malama-ink-dim transition-colors hover:text-malama-accent">Privacy Policy</Link>
            <Link href="/docs" className="text-malama-ink-dim transition-colors hover:text-malama-accent">Docs</Link>
            <span className="mx-1 hidden h-3 w-px bg-malama-line sm:inline-block" />
            <a href="https://x.com/malamalabs" target="_blank" rel="noopener noreferrer" className="text-malama-ink-dim transition-colors hover:text-malama-accent">Follow on X</a>
            <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="text-malama-ink-dim transition-colors hover:text-malama-accent">Join Discord</a>
            <a href="https://www.reddit.com/r/malamalabs" target="_blank" rel="noopener noreferrer" className="text-malama-ink-dim transition-colors hover:text-malama-accent">r/malamalabs</a>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-malama-ink-faint">
              © 2026 Mālama Labs. All rights reserved.
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-malama-ink-faint">
              Environmental intelligence core
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
