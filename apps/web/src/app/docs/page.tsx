import type { Metadata } from 'next'
import Link from 'next/link'
import './docs-hub.css'
import DocsHubScrollSpy from './DocsHubScrollSpy'

export const metadata: Metadata = {
  title: 'Documentation · Mālama Labs',
  description:
    'Genesis 200 documentation hub. MLMA tokenomics, pricing dynamics, Phase 1 timeline, operator guide. Aligned to Tokenomics Whitepaper v3.6.',
}

/**
 * Documentation Hub · Overview
 *
 * Implementation of the claude.ai/design handoff:
 *   TmSb7V3WcO1VghxQNZrQSA → docs/index.html
 *
 * The sub-pages (/docs/tokenomics, /docs/pricing-roi,
 * /docs/phase-1-timeline, /docs/operators) still use the legacy
 * left-sidebar `DocsLayout` until they're individually migrated to
 * this design — each wraps itself in DocsLayout now that the docs
 * root layout is a passthrough.
 */
export default function DocsOverviewPage() {
  return (
    <div className="mlma-docs-hub">
      {/* document switcher */}
      <div className="crumb">
        <div className="crumb-inner">
          <a className="back" href="https://malamalabs.com" target="_blank" rel="noopener noreferrer">
            ← malamalabs.com
          </a>
          <div className="switcher">
            <Link href="/docs" className="current">
              Overview
            </Link>
            <Link href="/whitepaper">Whitepaper v1.0</Link>
            <Link href="/docs/tokenomics">Tokenomics</Link>
            <Link href="/docs/pricing-roi">Pricing &amp; Dynamics</Link>
            <Link href="/docs/phase-1-timeline">Phase 1 Timeline</Link>
            <Link href="/docs/operators">Operator Guide</Link>
            <Link href="/docs/data-demand-score-methodology">Data Demand Score</Link>
            <Link href="/docs/pricing">Genesis Pricing</Link>
            <Link href="/docs/validator-fees">Validator Fees</Link>
          </div>
        </div>
      </div>

      {/* document control bar */}
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
              <span className="num">DOCS · 00</span> / Genesis 200 · Documentation
            </div>
            <h1>
              Genesis 200 · <em>Documentation.</em>
            </h1>
            <p className="lede">
              Hardware-signed truth for the physical economy. Genesis 200 bootstraps a
              globally distributed validation layer for real-world data. Hex-zoned nodes
              that validate enterprise sensor data across carbon, AI compute emissions,
              parametric insurance, supply chain, and more.
            </p>
          </div>

          <aside className="meta-card" aria-label="Hub metadata">
            <div className="row">
              <span className="k">Hub version</span>
              <span className="v accent">v4</span>
            </div>
            <div className="row">
              <span className="k">Aligned to</span>
              <span className="v">Whitepaper v3.6</span>
            </div>
            <div className="row">
              <span className="k">Updated</span>
              <span className="v">May 2026</span>
            </div>
            <div className="row">
              <span className="k">Pages</span>
              <span className="v">9</span>
            </div>
            <div className="row">
              <span className="k">Owner</span>
              <span className="v">Tyler Malin</span>
            </div>
          </aside>
        </div>
      </header>

      {/* main */}
      <main className="layout">
        <article className="content">
          {/* preamble */}
          <div className="preamble">
            <p>
              This documentation hub is the canonical reference for operators, partners, and
              researchers. It is the companion to the runbooks shipped with Genesis 200
              hardware and the legal agreements signed at reservation.
            </p>
            <p
              style={{
                fontSize: 14,
                color: 'var(--mlma-ink-faint)',
                marginTop: 14,
              }}
            >
              <strong style={{ color: 'var(--mlma-ink-dim)' }}>Material changes from v3:</strong>{' '}
              Emissions extended from 3-year to 8-year smooth taper (60M total · 12% of
              supply) · Genesis 200 vesting now milestone-conditional (15% boot + 15% PONO +
              20/20/30 at operational milestones) · Standardized pools (30 / 20 / 15 / 35) ·
              Revenue split 45 / 20 / 15 / 20 with 250M burn floor · MLMA on Base, SaveCards
              on Cardano · Stewardship Pool (8.75M, FPIC-gated) · 10% UBO governance cap.
            </p>
          </div>

          <div className="docs-meta-strip">
            <span>Documents in this hub</span>
            <span className="count">9 pages</span>
          </div>

          {/* doc cards — whitepaper spans full width as first item */}
          <div className="doc-grid">

            {/* ── Featured: Institutional Whitepaper ── */}
            <Link
              href="/whitepaper"
              className="doc-card"
              style={{
                gridColumn: '1 / -1',
                background: 'linear-gradient(135deg, rgba(196,240,97,0.06) 0%, rgba(196,240,97,0.02) 100%)',
                borderColor: 'rgba(196,240,97,0.22)',
              }}
            >
              <div className="topline">
                <span className="id">WP · v1.0</span>
                <span className="status" style={{ color: 'var(--mlma-accent)', borderColor: 'rgba(196,240,97,0.3)', background: 'rgba(196,240,97,0.08)' }}>
                  Institutional · May 2026
                </span>
              </div>
              <h3>Whitepaper v1.0 — Six-Layer DePIN</h3>
              <p>
                The canonical institutional document. Hardware-verified truth for climate markets and AI
                compute. Covers the full six-layer DePIN architecture, seven verticals (carbon dMRV,
                energy telemetry, parametric insurance, AI compute accountability, supply chain, LCO₂
                clearing, prediction markets), tokenomics, regulatory posture, and operational threat
                model. 33 pages · Document MLM-WP-v1.0.
              </p>
              <div className="footline">
                <span>Architecture · tokenomics · regulatory posture · appendices</span>
                <span className="read" style={{ color: 'var(--mlma-accent)' }}>Read + Download →</span>
              </div>
            </Link>

            <Link className="doc-card" href="/docs/tokenomics">
              <div className="topline">
                <span className="id">DOCS · 01</span>
                <span className="status">Canonical</span>
              </div>
              <h3>MLMA Tokenomics</h3>
              <p>
                Token design, the 8-year emission schedule with KPI scaling, allocation pools,
                governance, revenue distribution, and the 250M circulating-supply burn floor.
              </p>
              <div className="footline">
                <span>Supply · emissions · governance</span>
                <span className="read">Read →</span>
              </div>
            </Link>

            <Link className="doc-card" href="/docs/pricing-roi">
              <div className="topline">
                <span className="id">DOCS · 02</span>
                <span className="status">Canonical</span>
              </div>
              <h3>Pricing &amp; Dynamics</h3>
              <p>
                Capital requirement, milestone-conditional vesting (15 / 15 / 20 / 20 / 30),
                validation distribution formula, hex demand tiers, and the two economic
                phases.
              </p>
              <div className="footline">
                <span>Capital · vesting · multipliers</span>
                <span className="read">Read →</span>
              </div>
            </Link>

            <Link className="doc-card" href="/docs/phase-1-timeline">
              <div className="topline">
                <span className="id">DOCS · 03</span>
                <span className="status">Canonical</span>
              </div>
              <h3>Phase 1 Timeline</h3>
              <p>
                From reservation through Year 1 milestone vesting. Six phases. Reservation,
                hardware ship, boot &amp; audit, PONO qualify, and three operational
                milestones.
              </p>
              <div className="footline">
                <span>May 2026 → October 2027</span>
                <span className="read">Read →</span>
              </div>
            </Link>

            <Link className="doc-card" href="/docs/operators">
              <div className="topline">
                <span className="id">DOCS · 04</span>
                <span className="status">Canonical</span>
              </div>
              <h3>Operator Guide</h3>
              <p>
                Deployment, hardware, node operation, PONO qualification, and support. The
                companion to runbooks shipped with your kit.
              </p>
              <div className="footline">
                <span>Deploy · operate · qualify</span>
                <span className="read">Read →</span>
              </div>
            </Link>

            <Link className="doc-card" href="/docs/data-demand-score-methodology">
              <div className="topline">
                <span className="id">DOCS · 05</span>
                <span className="status">v1.0 · Ratified</span>
              </div>
              <h3>Data Demand Score</h3>
              <p>
                Five-component scoring framework (0-100) measuring the commercial and
                regulatory value of hardware-signed data from each hex. Inputs, update cadence,
                multiplier formula, and worked examples.
              </p>
              <div className="footline">
                <span>Score · multipliers · examples</span>
                <span className="read">Read →</span>
              </div>
            </Link>

            <Link className="doc-card" href="/docs/pricing">
              <div className="topline">
                <span className="id">DOCS · 06</span>
                <span className="status">v1.0 · Ratified</span>
              </div>
              <h3>Genesis Pricing</h3>
              <p>
                Genesis reserve price ($2,000 flat), listing reference price formula,
                three-multiplier reward calculation, cohort normalization, milestone vesting,
                and buyer protections.
              </p>
              <div className="footline">
                <span>Reserve · rewards · vesting</span>
                <span className="read">Read →</span>
              </div>
            </Link>

            <Link className="doc-card" href="/docs/validator-fees">
              <div className="topline">
                <span className="id">DOCS · 07</span>
                <span className="status">v0.1 · Draft</span>
              </div>
              <h3>Validator Fees</h3>
              <p>
                USDC-denominated protocol revenue distributed to Genesis 200 operators from
                commercial buyer relationships. Separate from MLMA emissions. Accrual logic,
                distribution mechanics, and interaction with MLMA milestone vesting.
              </p>
              <div className="footline">
                <span>Revenue · accruals · USDC</span>
                <span className="read">Read →</span>
              </div>
            </Link>
          </div>

          {/* §01 How the system fits together */}
          <section
            className="clause"
            id="fit"
            style={{ borderTop: '1px solid var(--mlma-line)', paddingTop: 56, marginTop: 56 }}
          >
            <div className="clause-head">
              <span className="num">§ 01</span>
              <h2>How the system fits together</h2>
              <a className="anchor" href="#fit">
                #fit
              </a>
            </div>
            <div className="clause-body">
              <p>
                Mālama Labs builds the measurement layer for markets that depend on
                physical-world data. The same hardware-signed primitive. A sensor reading,
                signed at the silicon level by an{' '}
                <strong>ATECC608B-class secure element</strong> and anchored to Cardano. Produces verifiable evidence across seven markets:
              </p>
              <ul>
                <li>Carbon dMRV</li>
                <li>AI compute emissions</li>
                <li>Parametric insurance</li>
                <li>Supply chain provenance</li>
                <li>Prediction market resolution</li>
                <li>Smart agriculture</li>
                <li>Grid intelligence</li>
              </ul>
              <p>
                <strong>Genesis 200</strong> is the first 200 hex-zoned validation nodes on
                the network. These nodes form the geographic spine of the protocol&rsquo;s
                data integrity layer. They validate data produced by enterprise sensor
                deployments. Operators receive validation distributions and a{' '}
                <strong>125,000 MLMA</strong> allocation vested across operational
                milestones.
              </p>
            </div>
          </section>

          {/* §02 Key concepts */}
          <section className="clause" id="concepts">
            <div className="clause-head">
              <span className="num">§ 02</span>
              <h2>Key concepts</h2>
              <a className="anchor" href="#concepts">
                #concepts
              </a>
            </div>
            <div className="clause-body">
              <div className="concept-grid">
                <div className="concept">
                  <div className="term">SaveCard</div>
                  <div className="def">
                    A CIP-68 NFT anchored to Cardano containing hardware-signed evidence of a
                    physical-world reading. Public, registry-readable, immutable.
                  </div>
                </div>
                <div className="concept">
                  <div className="term">Hex Node</div>
                  <div className="def">
                    A validation node tied to a specific H3 hex cell. Receives MLMA
                    distributions for validating SaveCards and compute packets from its hex
                    zone and across the network.
                  </div>
                </div>
                <div className="concept">
                  <div className="term">MLMA</div>
                  <div className="def">
                    The network token. ERC-20 on Base. Used for fee payment, staking
                    (veMLMA), governance (with PONO credential), and validator distributions.
                  </div>
                </div>
                <div className="concept">
                  <div className="term">PONO</div>
                  <div className="def">
                    A non-transferable on-chain credential (soulbound ERC-721 on Base) issued
                    automatically to operators after KYB, active hardware, and a 90-day
                    qualifying period. Required for veMLMA governance.
                  </div>
                </div>
                <div className="concept">
                  <div className="term">LCO₂ / VCO₂</div>
                  <div className="def">
                    The carbon-vertical credit lifecycle. LCO₂ is forward-finance
                    pre-issuance. VCO₂ is the verified credit after hardware-signed evidence
                    and third-party verification clear.
                  </div>
                </div>
                <div className="concept">
                  <div className="term">KPI-scaled emission</div>
                  <div className="def">
                    Monthly emission release is a smooth scaling function (25% floor, 100%
                    ceiling) tied to validator count, SaveCard count, and veMLMA TVL growth.
                    Replaces step-function gates.
                  </div>
                </div>
                <div className="concept">
                  <div className="term">Burn floor</div>
                  <div className="def">
                    Once circulating supply reaches 250M MLMA, automatic revenue-funded burns
                    cease and the 45% burn allocation redirects to the Foundation operating
                    reserve.
                  </div>
                </div>
                <div className="concept">
                  <div className="term">Stewardship Pool</div>
                  <div className="def">
                    8.75M MLMA (1.75% of supply) allocated for operators on Indigenous lands
                    or in partnership with Native communities. FPIC-gated. 1.5× distribution
                    multiplier.
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* §03 Disclaimers */}
          <section className="clause" id="disclaimers" style={{ borderBottom: 'none' }}>
            <div className="clause-head">
              <span className="num">§ 03</span>
              <h2>Disclaimers</h2>
              <a className="anchor" href="#disclaimers">
                #disclaimers
              </a>
            </div>
            <div className="clause-body">
              <div className="callout warn">
                <span className="tag">▲ Informational only</span>
                <p>
                  Documentation is informational. Specific reservation, participation, and
                  token terms are governed by the agreements signed at reservation. The{' '}
                  <Link href="/legal/terms" style={{ color: 'var(--mlma-accent)' }}>
                    Terms &amp; Conditions
                  </Link>
                  ,{' '}
                  <Link
                    href="/legal/hex-node-purchase"
                    style={{ color: 'var(--mlma-accent)' }}
                  >
                    Hex Node Purchase Agreement
                  </Link>
                  , and{' '}
                  <Link
                    href="/legal/token-rewards-risk"
                    style={{ color: 'var(--mlma-accent)' }}
                  >
                    Token &amp; Rewards Risk Disclosure
                  </Link>
                  . Consult qualified legal, tax, and financial advisors before participating.
                </p>
              </div>

              <div className="sig-strip">
                <div className="label">- DOCUMENTATION HUB · v4</div>
                <p className="text">
                  Mālama Labs, Inc. · Genesis 200 Documentation · Aligned to MLMA Tokenomics
                  Whitepaper v3.6
                </p>
                <p className="footnote">
                  Companion to shipped hardware runbooks. Actual distributions follow
                  protocol rules and network conditions. No figures in this hub constitute
                  distribution guidance or forward-looking projections.
                </p>
              </div>
            </div>
          </section>
        </article>
      </main>

      <DocsHubScrollSpy />
    </div>
  )
}
