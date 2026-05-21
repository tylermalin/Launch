import type { Metadata } from 'next'
import Link from 'next/link'
import './legal-doc.css'
import LegalPageScrollSpy from './_shared/LegalPageScrollSpy'

export const metadata: Metadata = {
  title: 'Legal · Mālama Labs',
  description:
    'The binding terms, privacy disclosures, and sale-specific agreements that govern your access to and use of the Mālama Labs network and Hex Node hardware.',
}

/**
 * Legal Hub Index
 *
 * Implementation of the claude.ai/design handoff (legal-index.html).
 * Single-column hub layout listing the 4 in-force legal docs as cards
 * plus 1 in-drafting placeholder (Cookie Policy).
 */
export default function LegalIndexPage() {
  return (
    <div className="mlma-legal-doc">
      {/* hero (no breadcrumb on the index page itself — it IS the index) */}
      <header className="hero" id="top">
        <div className="hero-inner">
          <div>
            <div className="eyebrow">
              <span className="num">LEGAL · INDEX</span> / Policies &amp; agreements
            </div>
            <h1>
              Legal <em>documents.</em>
            </h1>
            <p className="lede">
              The binding terms, privacy disclosures, and sale-specific agreements that govern
              your access to and use of the Mālama Labs network and Hex Node hardware.
            </p>
          </div>
          <aside className="meta-card" aria-label="Document index metadata">
            <div className="row"><span className="k">Entity</span><span className="v">Mālama Labs Inc.</span></div>
            <div className="row"><span className="k">Jurisdiction</span><span className="v">Delaware, USA</span></div>
            <div className="row"><span className="k">Documents</span><span className="v">5 total · 4 live</span></div>
            <div className="row"><span className="k">Last review</span><span className="v">April 28, 2026</span></div>
            <div className="row"><span className="k">Contact</span><span className="v accent">legal@malamalabs.com</span></div>
          </aside>
        </div>
      </header>

      <main className="layout layout--hub" style={{ paddingTop: 56 }}>
        <article className="content">
          <div className="docs-meta-strip">
            <span>Currently in force</span>
            <span className="count">4 documents</span>
          </div>

          <div className="doc-grid">
            <Link className="doc-card" href="/legal/terms">
              <div className="topline">
                <span className="id">MLMA-LEGAL-001 · v2</span>
                <span className="status">In force</span>
              </div>
              <h3>Terms &amp; Conditions</h3>
              <p>The binding agreement governing access to the Mālama website, dashboards, Hex Node sale flows, and broader network — including arbitration, opt-out, and token characterization.</p>
              <div className="footline">
                <span>27 sections · ~18 min read</span>
                <span className="read">Read →</span>
              </div>
            </Link>

            <Link className="doc-card" href="/legal/privacy">
              <div className="topline">
                <span className="id">MLMA-LEGAL-002 · v2</span>
                <span className="status">In force</span>
              </div>
              <h3>Privacy Policy</h3>
              <p>How we collect, use, disclose, and protect Personal Data — and what public, immutable blockchain records mean for your GDPR and CCPA rights.</p>
              <div className="footline">
                <span>17 sections · ~14 min read</span>
                <span className="read">Read →</span>
              </div>
            </Link>

            <Link className="doc-card" href="/legal/hex-node-purchase">
              <div className="topline">
                <span className="id">MLMA-LEGAL-003 · v2</span>
                <span className="status">In force</span>
              </div>
              <h3>Hex Node Purchase &amp; Preorder Agreement</h3>
              <p>Sale-specific terms for the Genesis 200 program — pricing, deployment window, MLMA vesting, the validation reward formula, and the mutable / immutable protocol parameters.</p>
              <div className="footline">
                <span>18 sections · ~22 min read</span>
                <span className="read">Read →</span>
              </div>
            </Link>

            <Link className="doc-card" href="/legal/token-rewards-risk">
              <div className="topline">
                <span className="id">MLMA-LEGAL-005 · v2</span>
                <span className="status">In force</span>
              </div>
              <h3>Token &amp; Rewards Risk Disclosure</h3>
              <p>Plain-language risk factors: token volatility, regulatory uncertainty, Genesis-200 forfeiture, audit gates, slashing, the Year-3 emissions cliff, and the 8-point acknowledgment.</p>
              <div className="footline">
                <span>15 sections · ~20 min read</span>
                <span className="read">Read →</span>
              </div>
            </Link>
          </div>

          <div className="docs-meta-strip coming">
            <span>Coming with launch</span>
            <span className="count">1 document · drafting</span>
          </div>

          <div className="doc-grid">
            <div className="doc-card coming">
              <div className="topline">
                <span className="id">MLMA-LEGAL-004 · draft</span>
                <span className="status coming">In drafting</span>
              </div>
              <h3>Cookie Policy</h3>
              <p>Detailed disclosure of cookies and similar technologies used across malamalabs.com, dashboards, and the launchpad — and the controls available to you per jurisdiction.</p>
              <div className="footline">
                <span>Published with cookie banner</span>
                <span>—</span>
              </div>
            </div>
          </div>

          <div className="sig-strip" style={{ marginTop: 72 }}>
            <div className="label">— LEGAL CONTACT</div>
            <p className="text">Mālama Labs, Inc. · 8 The Green, Suite A, Dover, Delaware 19901</p>
            <p className="footnote">
              General legal inquiries: <a href="mailto:legal@malamalabs.com" style={{ color: 'var(--mlma-accent)' }}>legal@malamalabs.com</a>{' '}
              · Privacy: <a href="mailto:privacy@malamalabs.com" style={{ color: 'var(--mlma-accent)' }}>privacy@malamalabs.com</a>
            </p>
          </div>
        </article>
      </main>

      <LegalPageScrollSpy />
    </div>
  )
}
