import Link from 'next/link'
import type { ReactNode } from 'react'
import DocsPageScrollSpy from './DocsPageScrollSpy'

/**
 * Shared chrome for every page in the Documentation Hub.
 *
 * Renders the breadcrumb/switcher, document control bar, hero with
 * metadata card, and a single-content slot. Sub-pages add a sticky
 * TOC inside `children` themselves (using `<aside class="toc">` and
 * `<main class="layout layout--with-toc">`).
 *
 * Ported from the claude.ai/design handoff bundle — see
 * /tmp/malama-docs-design/legal-docs/project/docs/*.html
 */

export type DocsSlug =
  | 'overview'
  | 'tokenomics'
  | 'pricing-roi'
  | 'phase-1-timeline'
  | 'operators'
  | 'data-demand-score-methodology'
  | 'pricing'
  | 'validator-fees'

const SWITCHER_ITEMS: { slug: DocsSlug; label: string; href: string }[] = [
  { slug: 'overview', label: 'Overview', href: '/docs' },
  { slug: 'tokenomics', label: 'Tokenomics', href: '/docs/tokenomics' },
  { slug: 'pricing-roi', label: 'Pricing & Dynamics', href: '/docs/pricing-roi' },
  { slug: 'phase-1-timeline', label: 'Phase 1 Timeline', href: '/docs/phase-1-timeline' },
  { slug: 'operators', label: 'Operator Guide', href: '/docs/operators' },
  { slug: 'data-demand-score-methodology', label: 'Data Demand Score', href: '/docs/data-demand-score-methodology' },
  { slug: 'pricing', label: 'Genesis Pricing', href: '/docs/pricing' },
  { slug: 'validator-fees', label: 'Validator Fees', href: '/docs/validator-fees' },
]

export interface DocsPageShellProps {
  /** Slug of the current page (drives the active pill in the switcher). */
  current: DocsSlug
  /** e.g. "DOCS · 01" — left of the eyebrow text. */
  docNumber: string
  /** Right side of the eyebrow text, e.g. "Tokenomics · Whitepaper v3.6" */
  eyebrowText: string
  /** Main hero title text (before the italic emphasis). */
  titleLead: string
  /** Italic emphasis tail of the title, e.g. "Tokenomics." */
  titleEmphasis: string
  /** Lede paragraph beneath the title. */
  lede: ReactNode
  /** Metadata card rows on the right of the hero. */
  metaRows: { k: string; v: ReactNode; accent?: boolean }[]
  /** Main content (TOC + article). */
  children: ReactNode
}

export default function DocsPageShell({
  current,
  docNumber,
  eyebrowText,
  titleLead,
  titleEmphasis,
  lede,
  metaRows,
  children,
}: DocsPageShellProps) {
  return (
    <div className="mlma-docs-hub">
      {/* breadcrumb / switcher */}
      <div className="crumb">
        <div className="crumb-inner">
          <Link className="back" href="/">
            ← Mālama Labs
          </Link>
          <div className="switcher">
            {SWITCHER_ITEMS.map((item) => (
              <Link
                key={item.slug}
                href={item.href}
                className={item.slug === current ? 'current' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* docbar */}
      <div className="docbar" id="top">
        <div className="docbar-inner">
          <div className="left">
            <span className="live">v4 · Canonical</span>
            <span className="sep">/</span>
            <span>Aligned to Tokenomics Whitepaper v3.6</span>
            <span className="sep">/</span>
            <span>May 2026</span>
          </div>
          <div className="right">
            <a href="#" id="mlma-docs-copy-link">
              ↗ Copy link
            </a>
            <span className="dot">·</span>
            <a href="mailto:hello@malamalabs.com">✉ Contact</a>
          </div>
        </div>
      </div>

      {/* hero */}
      <header className="hero">
        <div className="hero-inner">
          <div>
            <div className="eyebrow">
              <span className="num">{docNumber}</span> / {eyebrowText}
            </div>
            <h1>
              {titleLead} <em>{titleEmphasis}</em>
            </h1>
            <p className="lede">{lede}</p>
          </div>

          <aside className="meta-card" aria-label="Document metadata">
            {metaRows.map((row) => (
              <div key={row.k} className="row">
                <span className="k">{row.k}</span>
                <span className={row.accent ? 'v accent' : 'v'}>{row.v}</span>
              </div>
            ))}
          </aside>
        </div>
      </header>

      {children}

      <DocsPageScrollSpy />
    </div>
  )
}
