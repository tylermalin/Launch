import type { Metadata } from 'next'
import Link from 'next/link'
import '../docs-hub.css'
import DocsPageShell from '../_shared/DocsPageShell'

export const metadata: Metadata = {
  title: 'Validator Fees · Mālama Labs',
  description:
    'USDC-denominated protocol revenue distributed to Genesis 200 operators from commercial buyer relationships. Separate from MLMA emissions. Accrual logic, operator weighting, distribution mechanics, and interaction with MLMA milestone vesting. v0.1 Draft published 2026-05-23.',
}

export default function ValidatorFeesPage() {
  return (
    <DocsPageShell
      current="validator-fees"
      docNumber="DOCS · 07"
      eyebrowText="Genesis 200 · Validator fees"
      titleLead="Validator"
      titleEmphasis="Fees."
      lede="Protocol revenue from commercial buyers of hardware-signed environmental data, distributed in USDC to Genesis 200 operators. Distinct from MLMA emissions in every meaningful way: source, currency, schedule, and cap. Six open items pending finalization before this page locks to v1.0."
      metaRows={[
        { k: 'Status', v: 'v0.1 · Draft 2026-05-23', accent: true },
        { k: 'Currency', v: 'USDC on Base' },
        { k: 'Cadence', v: 'Monthly (target)' },
        { k: 'Cap', v: 'None (scales with revenue)' },
        { k: 'MLMA interaction', v: 'Parallel, not substituted' },
        { k: 'Open items', v: '6 pending v1.0' },
      ]}
    >
      <main className="layout layout--with-toc">
        <aside className="toc" aria-label="Table of contents">
          <div className="toc-label">
            <span>Contents</span>
            <span className="count">9 sections</span>
          </div>
          <ol>
            <li><a href="#s1"><span className="n">01</span><span className="t">What validator fees are</span></a></li>
            <li><a href="#s2"><span className="n">02</span><span className="t">Where revenue comes from</span></a></li>
            <li><a href="#s3"><span className="n">03</span><span className="t">How accruals work</span></a></li>
            <li><a href="#s4"><span className="n">04</span><span className="t">Distribution mechanics</span></a></li>
            <li><a href="#s5"><span className="n">05</span><span className="t">Interaction with MLMA rewards</span></a></li>
            <li><a href="#s6"><span className="n">06</span><span className="t">Worked example</span></a></li>
            <li><a href="#s7"><span className="n">07</span><span className="t">Open items for v1.0</span></a></li>
            <li><a href="#s8"><span className="n">08</span><span className="t">What this page does not cover</span></a></li>
            <li><a href="#s9"><span className="n">09</span><span className="t">Methodology provenance</span></a></li>
          </ol>
          <div className="toc-actions">
            <Link className="btn" href="/docs/pricing"><span>← Prev · Genesis Pricing</span><span></span></Link>
            <Link className="btn" href="/docs"><span>Back to hub</span><span>→</span></Link>
          </div>
        </aside>

        <article className="content">
          <div className="preamble">
            <p>
              This page is published as Draft v0.1. Six open items listed in{' '}
              <a href="#s7" style={{ color: 'var(--mlma-accent)' }}>§ 07</a> require finalization before
              the methodology locks to v1.0. The structural model documented here has been approved by the
              token team. The open items are implementation details, not structural questions.
            </p>
          </div>

          {/* §01 */}
          <section className="clause" id="s1">
            <div className="clause-head">
              <span className="num">§ 01</span>
              <h2>What validator fees are</h2>
              <a className="anchor" href="#s1">#s1</a>
            </div>
            <div className="clause-body">
              <p>
                Validator fees are Mālama protocol revenue, paid by commercial buyers of hardware-signed
                environmental data, and distributed in stablecoin (USDC) to the Genesis 200 operators
                whose hexes produce the underlying signal.
              </p>
              <p>They are distinct from MLMA emissions in every meaningful way:</p>
              <table className="matrix">
                <thead>
                  <tr>
                    <th>Dimension</th>
                    <th>MLMA Rewards</th>
                    <th>Validator Fees</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Source</td>
                    <td>Inflationary token emissions</td>
                    <td>Commercial buyer revenue</td>
                  </tr>
                  <tr>
                    <td>Currency</td>
                    <td>MLMA (Mālama Labs token)</td>
                    <td>USDC (stablecoin)</td>
                  </tr>
                  <tr>
                    <td>Schedule</td>
                    <td>Fixed milestone vesting (15/15/20/20/30 over 24 months)</td>
                    <td>Continuous, target monthly distribution</td>
                  </tr>
                  <tr>
                    <td>Cap</td>
                    <td>25M MLMA Genesis 200 operator pool (per Whitepaper v1.0)</td>
                    <td>No cap; scales with commercial adoption</td>
                  </tr>
                  <tr>
                    <td>Triggers</td>
                    <td>Hardware activation + milestone qualification</td>
                    <td>Per-hex revenue accruals + uptime / PONO weighting</td>
                  </tr>
                  <tr>
                    <td>Counts against emissions cap?</td>
                    <td>Yes</td>
                    <td>No</td>
                  </tr>
                </tbody>
              </table>
              <p>
                The structural separation is deliberate. MLMA rewards bootstrap the network and compensate
                operators during the period before commercial demand has matured. Validator fees compensate
                operators on an ongoing basis as commercial demand actually materializes. Operators receive
                both. They are not mutually exclusive, and they are not substitutes for each other.
              </p>
            </div>
          </section>

          {/* §02 */}
          <section className="clause" id="s2">
            <div className="clause-head">
              <span className="num">§ 02</span>
              <h2>Where validator fee revenue comes from</h2>
              <a className="anchor" href="#s2">#s2</a>
            </div>
            <div className="clause-body">
              <p>
                Mālama Labs structures commercial relationships with buyers of hardware-verified
                environmental data. Each commercial agreement identifies which Genesis 200 hex or set of
                hexes produces the data being purchased. Revenue from those agreements accrues to those
                specific hexes.
              </p>
              <p>Categories of commercial buyer:</p>
              <ul>
                <li>
                  <strong>Carbon registries.</strong> Verra, Puro.earth, Gold Standard, Isometric, and
                  Article 6.4 framework participants paying for hardware-verified MRV (measurement,
                  reporting, verification) data to underwrite credit issuance.
                </li>
                <li>
                  <strong>Parametric insurance providers.</strong> Carriers paying for hex-level data that
                  resolves rainfall, temperature, wildfire, flood, and supply chain insurance triggers.
                </li>
                <li>
                  <strong>AI compute emissions verification buyers.</strong> Data center operators,
                  ESG-compliant customers, and regulators paying for hardware-verified emissions and water
                  measurement around AI compute infrastructure.
                </li>
                <li>
                  <strong>Supply chain compliance buyers.</strong> Importers and exporters required to
                  demonstrate EUDR compliance, paying for hex-level deforestation and land use data
                  covering production regions.
                </li>
                <li>
                  <strong>Prediction market platforms.</strong> Markets paying for oracle resolution data
                  on environmental events and milestones.
                </li>
                <li>
                  <strong>Enterprise data buyers.</strong> Corporates purchasing environmental data for
                  internal ESG, climate disclosure (CSRD ESRS E1, SEC climate rules), supply chain
                  transparency, or operations.
                </li>
                <li>
                  <strong>Scientific research buyers.</strong> Universities, government agencies, and
                  research consortia purchasing data from undermonitored regions where Mālama provides
                  novel coverage.
                </li>
              </ul>
              <p>
                The Mālama Whitepaper v1.0 identifies the $4.7T total addressable market across these
                seven verticals. Validator fees are the mechanism by which operator economics participate
                in that TAM as it converts into actual revenue.
              </p>
            </div>
          </section>

          {/* §03 */}
          <section className="clause" id="s3">
            <div className="clause-head">
              <span className="num">§ 03</span>
              <h2>How accruals work</h2>
              <a className="anchor" href="#s3">#s3</a>
            </div>
            <div className="clause-body">
              <h3>Per-deal attribution</h3>
              <p>
                When Mālama Labs signs a commercial agreement with a buyer, the agreement identifies which
                hexes produce the data being delivered. This can be:
              </p>
              <ul>
                <li>
                  <strong>A single hex</strong> for narrowly scoped commercial deals (a parametric
                  insurance carrier covering one production region).
                </li>
                <li>
                  <strong>A defined set of hexes</strong> for multi-region deals (a registry partnership
                  requiring verified data across multiple agricultural regions).
                </li>
                <li>
                  <strong>The full network</strong> for portfolio-level deals (an enterprise buyer
                  subscribing to network-wide data coverage).
                </li>
              </ul>
              <p>
                Revenue from each deal is allocated to the hexes that produce its underlying data. The
                allocation method depends on the deal structure: per-hex flat fees, per-reading volumetric
                pricing, or revenue-share against the buyer&rsquo;s downstream economics.
              </p>

              <h3>Per-hex accrual</h3>
              <p>
                Each Genesis 200 hex maintains a running validator fee accrual balance, denominated in
                USDC, updated continuously as commercial deals deliver revenue. The accrual balance is
                visible to operators in the Node Command Center dashboard.
              </p>

              <h3>Operator weighting within the accrual period</h3>
              <p>
                The operator of a hex earns the accrued validator fees, but only to the extent that they
                are operating the hex in good standing. The weighting applied within each distribution
                period:
              </p>
              <table className="matrix">
                <thead>
                  <tr><th>Operator Status</th><th>Weight</th></tr>
                </thead>
                <tbody>
                  <tr><td>Active hex, full uptime, PONO qualified</td><td>1.0x</td></tr>
                  <tr><td>Active hex, partial uptime</td><td>Proportional to uptime percentage</td></tr>
                  <tr><td>Active hex, not yet PONO qualified</td><td>0x</td></tr>
                  <tr><td>Hex with tamper event during period</td><td>0x for the period</td></tr>
                  <tr><td>Hex with hardware offline above threshold</td><td>0x</td></tr>
                </tbody>
              </table>
              <p>
                Forfeited validator fees (revenue accrued to a hex during a period when the operator&rsquo;s
                weight is below 1.0) are redirected to the Genesis Performing Operator Bonus Pool,
                consistent with the forfeited-MLMA recycling mechanism documented in the{' '}
                <Link href="/docs/pricing" style={{ color: 'var(--mlma-accent)' }}>Genesis Pricing</Link>{' '}
                page.
              </p>
              <p>
                This is the same incentive structure that governs MLMA milestone vesting: operators are
                paid for operating, not for holding a license. The validator fee mechanism reinforces
                operational reliability through the same economic logic that gates MLMA earnings.
              </p>
            </div>
          </section>

          {/* §04 */}
          <section className="clause" id="s4">
            <div className="clause-head">
              <span className="num">§ 04</span>
              <h2>Distribution mechanics</h2>
              <a className="anchor" href="#s4">#s4</a>
            </div>
            <div className="clause-body">
              <h3>Cadence</h3>
              <p>
                Target distribution cadence is monthly, paid in USDC to the operator wallet of record on
                the first business day of the following month. Distribution covers the prior calendar
                month&rsquo;s accruals net of any forfeitures.
              </p>
              <p>
                The cadence is target rather than guaranteed during early network operation. If commercial
                revenue in a given month is below a minimum distribution threshold (set to keep transaction
                costs reasonable), accruals roll forward to the next month.
              </p>

              <h3>Payment rail</h3>
              <p>
                Validator fees are paid in USDC on Base, sent directly to the operator&rsquo;s wallet of
                record. Operators specify their payout wallet during Genesis 200 onboarding or via the
                Node Command Center.
              </p>
              <p>
                Operators who initially purchased via credit card and Magic Wallet receive validator fees
                to their Magic-managed wallet by default, with the option to designate a self-custody
                wallet at any time.
              </p>

              <h3>Reporting</h3>
              <p>
                US-based operators with annual validator fee earnings above the reporting threshold receive
                1099-MISC forms each January for the prior tax year. Mālama Labs does not provide tax
                advice; operators are responsible for their own tax treatment of validator fee income.
              </p>
              <p>
                Non-US operators are responsible for compliance with their local tax and reporting regimes.
              </p>
            </div>
          </section>

          {/* §05 */}
          <section className="clause" id="s5">
            <div className="clause-head">
              <span className="num">§ 05</span>
              <h2>How validator fees interact with MLMA rewards</h2>
              <a className="anchor" href="#s5">#s5</a>
            </div>
            <div className="clause-body">
              <p>
                Genesis 200 operators are eligible to earn both MLMA and validator fees concurrently.
                The interaction model:
              </p>
              <p>
                <strong>MLMA rewards</strong> follow the bounded reward framework in the{' '}
                <Link href="/docs/pricing" style={{ color: 'var(--mlma-accent)' }}>Genesis Pricing</Link>{' '}
                page. They vest on the 15/15/20/20/30 milestone schedule over 24 months from hardware
                activation, are capped at 25M MLMA across the cohort per Whitepaper v1.0, and reflect
                the bootstrap economics of the protocol.
              </p>
              <p>
                <strong>Validator fees</strong> flow continuously as commercial revenue materializes. They
                do not count against the 25M cap, are not subject to milestone vesting (they pay out
                monthly on accrued basis), and reflect the operational economics of the protocol.
              </p>
              <p>
                Both flows are gated by the same operational requirements: hardware uptime, PONO
                qualification, and absence of tamper events. An operator who fails to maintain qualifying
                operation loses access to both the next MLMA milestone and that period&rsquo;s validator
                fee accruals.
              </p>
              <p>
                The economic logic: operators commit capital to acquire a license and deploy hardware.
                MLMA rewards compensate that capital commitment and bootstrap operations during the period
                before commercial demand has scaled. Validator fees compensate ongoing operational labor
                and capital cost as commercial demand materializes. Over the network&rsquo;s lifecycle,
                validator fees become the larger share of operator economics; MLMA rewards become the
                smaller share.
              </p>
            </div>
          </section>

          {/* §06 */}
          <section className="clause" id="s6">
            <div className="clause-head">
              <span className="num">§ 06</span>
              <h2>Worked example</h2>
              <a className="anchor" href="#s6">#s6</a>
            </div>
            <div className="clause-body">
              <div className="callout warn">
                <span className="tag">Illustrative only</span>
                <p>
                  The numbers below are not commitments and not based on actual revenue, which is nascent
                  during the Genesis 200 launch period.
                </p>
              </div>

              <p>
                Suppose total Mālama commercial revenue in a given month is $50,000 USDC, attributed
                across hexes as follows:
              </p>
              <ul>
                <li>80 hexes earn $300 each (large-deal hexes: active parametric insurance regions, registry partnership zones, AI compute facility proximity) = $24,000</li>
                <li>100 hexes earn $200 each (mid-tier deal hexes) = $20,000</li>
                <li>20 hexes earn $300 each (concentrated commercial activity hexes) = $6,000</li>
              </ul>
              <p>Total: $50,000 accrued across 200 hexes.</p>

              <p>Apply operator weighting:</p>
              <ul>
                <li>180 hexes operating at full weight (1.0x): full per-hex accrual paid</li>
                <li>15 hexes at partial weight (0.6x average): 60% of per-hex accrual paid, 40% redirected to bonus pool</li>
                <li>5 hexes at zero weight (tamper events, offline beyond threshold): 0% paid, 100% redirected to bonus pool</li>
              </ul>

              <p>Approximate distribution to operators in that month:</p>
              <ul>
                <li>A full-weight operator with a $300-accrual hex earns $300 USDC</li>
                <li>A full-weight operator with a $200-accrual hex earns $200 USDC</li>
                <li>A 0.6x weighted operator with a $200-accrual hex earns $120 USDC</li>
                <li>A zero-weighted operator earns $0 USDC for that period; their accrued $300 goes to the bonus pool</li>
              </ul>
              <p>
                The bonus pool from forfeited validator fees is distributed quarterly to operators who
                maintained full weight across the prior quarter, in addition to their normal accruals.
              </p>
            </div>
          </section>

          {/* §07 */}
          <section className="clause" id="s7">
            <div className="clause-head">
              <span className="num">§ 07</span>
              <h2>Open items for v1.0</h2>
              <a className="anchor" href="#s7">#s7</a>
            </div>
            <div className="clause-body">
              <p>
                This page is published as Draft v0.1 because the following items require finalization
                before the methodology can lock to v1.0:
              </p>
              <ol>
                <li>
                  <strong>Distribution cadence formalization.</strong> Target is monthly. Final answer
                  depends on smart contract vs off-chain payment rail and on observed transaction cost
                  economics. Decision needed before first commercial revenue distribution.
                </li>
                <li>
                  <strong>Uptime / PONO weighting formula precision.</strong> The structure above
                  (proportional to uptime, zero for non-PONO) is approved by the token team. The exact
                  uptime threshold definition and the PONO qualification verification cadence need
                  spec-level documentation.
                </li>
                <li>
                  <strong>Payment rail.</strong> USDC on Base is the working assumption. Final decision
                  between (a) direct smart contract distribution from a treasury contract and (b) off-chain
                  payment processing with on-chain settlement needs operator agreement language and
                  accounting review.
                </li>
                <li>
                  <strong>Per-hex accrual computation for portfolio deals.</strong> Single-hex and
                  defined-set deals attribute cleanly. Portfolio deals (network-wide subscriptions)
                  require an allocation rule: equal weighting, DDS-weighted, usage-weighted, or hybrid.
                  Working assumption is equal weighting plus DDS adjustment, but this needs token team
                  confirmation.
                </li>
                <li>
                  <strong>Bonus pool distribution mechanics.</strong> Quarterly distribution to
                  full-weight operators is the working model. Specific qualification threshold and
                  pro-rata calculation method need finalization.
                </li>
                <li>
                  <strong>Tax and reporting infrastructure.</strong> 1099-MISC issuance, international
                  reporting, and Form 1042-S for non-US operators need legal and accounting setup before
                  first material distribution.
                </li>
              </ol>
              <p>
                The team will publish v1.0 once these items resolve. Operators will be notified through
                the Operator Discord and the Node Command Center when the methodology locks.
              </p>
            </div>
          </section>

          {/* §08 */}
          <section className="clause" id="s8">
            <div className="clause-head">
              <span className="num">§ 08</span>
              <h2>What this page does not cover</h2>
              <a className="anchor" href="#s8">#s8</a>
            </div>
            <div className="clause-body">
              <p>Two adjacent topics intentionally excluded from this page:</p>
              <ol>
                <li>
                  <strong>Post-Genesis-200 operator economics.</strong> Future expansion cohorts beyond
                  the Genesis 200 will have their own MLMA allocation framework and may have different
                  validator fee weighting. The Whitepaper v1.0 documents the 60M total emissions schedule
                  across Years 1-8; the per-cohort allocation methodology beyond Genesis 200 is not yet
                  finalized and will be published separately.
                </li>
                <li>
                  <strong>Specific buyer relationships and deal economics.</strong> Mālama Labs does not
                  publish commercial deal terms by counterparty. Aggregate revenue figures will be
                  reported to operators at quarterly intervals through the Node Command Center.
                </li>
              </ol>
            </div>
          </section>

          {/* §09 */}
          <section className="clause" id="s9" style={{ borderBottom: 'none' }}>
            <div className="clause-head">
              <span className="num">§ 09</span>
              <h2>Methodology provenance</h2>
              <a className="anchor" href="#s9">#s9</a>
            </div>
            <div className="clause-body">
              <p>This methodology is published as Draft v0.1 ratified against:</p>
              <ul>
                <li>
                  <strong>Mālama Whitepaper v1.0 (May 2026):</strong> the 60M emissions schedule and the
                  structural separation of MLMA from protocol revenue.
                </li>
                <li>
                  <strong>Token Team Ratification 2026-05-23 (Item 7):</strong> the explicit approval of
                  the structure documented above: MLMA rewards as inflationary schedule, validator fees as
                  protocol revenue distributed in USDC outside the cap.
                </li>
                <li>
                  <strong>Pricing Methodology v1.0 (2026-05-23):</strong> the bounded reward framework and
                  the forfeited-MLMA recycling mechanism that the validator fee weighting parallels. See{' '}
                  <Link href="/docs/pricing" style={{ color: 'var(--mlma-accent)' }}>Genesis Pricing</Link>.
                </li>
                <li>
                  <strong>Data Demand Score Methodology v1.0 (2026-05-23):</strong> the demand signal
                  framework that informs commercial deal attribution and per-hex accrual logic. See{' '}
                  <Link href="/docs/data-demand-score-methodology" style={{ color: 'var(--mlma-accent)' }}>Data Demand Score Methodology</Link>.
                </li>
              </ul>

              <div className="sig-strip">
                <div className="label">-- DOCS · 07 · VALIDATOR FEES · v0.1 DRAFT</div>
                <p className="text">
                  Mālama Labs, Inc. · Genesis 200 · Draft published 2026-05-23 · Six open items pending
                  finalization · v1.0 to be published on completion of token team responses
                </p>
                <p className="footnote">
                  Questions: Operator Discord <code>#validator-fees</code> · operators@malamalabs.com
                  {' '}· Commercial inquiries: commercial@malamalabs.com
                </p>
              </div>
            </div>
          </section>
        </article>
      </main>
    </DocsPageShell>
  )
}
