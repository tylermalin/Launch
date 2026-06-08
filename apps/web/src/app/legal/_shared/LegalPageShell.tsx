import Link from 'next/link'
import type { ReactNode } from 'react'
import LegalPageScrollSpy from './LegalPageScrollSpy'

/**
 * Shared chrome for every page in the Legal Hub.
 *
 * Renders the breadcrumb/switcher, document control bar, hero with
 * metadata card, and a single-content slot. Sub-pages add a sticky
 * TOC inside `children` themselves (using `<aside class="toc">` and
 * `<main class="layout">`).
 *
 * Ported from the claude.ai/design handoff bundle —
 *   /tmp/mlma-batch/docs/legal-docs/project/*.html
 */

export type LegalSlug = 'index' | 'terms' | 'privacy' | 'hex-node-purchase' | 'token-rewards-risk' | 'cookies'

const SWITCHER_ITEMS: { slug: LegalSlug; label: string; href: string }[] = [
  { slug: 'terms', label: 'Terms & Conditions', href: '/legal/terms' },
  { slug: 'privacy', label: 'Privacy Policy', href: '/legal/privacy' },
  { slug: 'hex-node-purchase', label: 'Hex Node Agreement', href: '/legal/hex-node-purchase' },
  { slug: 'token-rewards-risk', label: 'Risk Disclosure', href: '/legal/token-rewards-risk' },
  { slug: 'cookies', label: 'Cookie Policy', href: '/legal/cookies' },
]

export interface DocBarFacts {
  /** e.g. "Version 2 · In force" */
  version: string
  /** e.g. "Doc · MLMA-LEGAL-001" */
  docId: string
  /** e.g. "Category · Master agreement" */
  category: string
}

export interface LegalPageShellProps {
  current: LegalSlug
  docNumber: string // e.g. "DOC · 001"
  eyebrowText: string // e.g. "Master agreement · Read carefully"
  titleLead: string
  titleEmphasis: string
  lede: ReactNode
  metaRows: { k: string; v: ReactNode; accent?: boolean }[]
  docBar: DocBarFacts
  children: ReactNode
}

export default function LegalPageShell({
  current,
  docNumber,
  eyebrowText,
  titleLead,
  titleEmphasis,
  lede,
  metaRows,
  docBar,
  children,
}: LegalPageShellProps) {
  return (
    <div className="mlma-legal-doc">
      {/* breadcrumb / switcher */}
      <div className="crumb">
        <div className="crumb-inner">
          <Link className="back" href="/legal">
            ← All legal documents
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
            <span className="live">{docBar.version}</span>
            <span className="sep">/</span>
            <span>{docBar.docId}</span>
            <span className="sep">/</span>
            <span>{docBar.category}</span>
          </div>
          <div className="right">
            <a href="#" id="mlma-copy-link">
              ↗ Copy link
            </a>
            <span className="dot">·</span>
            <a href="mailto:legal@malamalabs.com">✉ legal@malamalabs.com</a>
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

      <LegalPageScrollSpy />
    </div>
  )
}
