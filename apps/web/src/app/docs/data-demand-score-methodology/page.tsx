import type { Metadata } from 'next'
import Link from 'next/link'
import '../docs-hub.css'
import DocsPageShell from '../_shared/DocsPageShell'

export const metadata: Metadata = {
  title: 'Data Demand Score Methodology · Mālama Labs',
  description:
    'Five-component scoring framework measuring the commercial and regulatory value of hardware-signed environmental data from each Genesis 200 hex. Inputs, weights, update cadence, multiplier formula, and worked examples. v1.0 ratified 2026-05-23.',
}

export default function DataDemandScoreMethodologyPage() {
  return (
    <DocsPageShell
      current="data-demand-score-methodology"
      docNumber="DOCS · 05"
      eyebrowText="Genesis 200 · Data Demand Score methodology"
      titleLead="Data Demand Score"
      titleEmphasis="Methodology."
      lede="Each Genesis 200 hex carries a Data Demand Score between 0 and 100. The score measures how much commercial, regulatory, and research buyers would pay for hardware-signed environmental data originating from that geographic cell. Five weighted components, quarterly recompute, bounded multiplier formula."
      metaRows={[
        { k: 'Status', v: 'v1.0 · ratified 2026-05-23', accent: true },
        { k: 'Score range', v: '0 to 100' },
        { k: 'Components', v: '5 weighted inputs' },
        { k: 'Update cadence', v: 'Quarterly' },
        { k: 'Multiplier range', v: '0.70x to 1.30x' },
        { k: 'Next review', v: 'Q2 2027' },
      ]}
    >
      <main className="layout layout--with-toc">
        <aside className="toc" aria-label="Table of contents">
          <div className="toc-label">
            <span>Contents</span>
            <span className="count">8 sections</span>
          </div>
          <ol>
            <li><a href="#s1"><span className="n">01</span><span className="t">What the score measures</span></a></li>
            <li><a href="#s2"><span className="n">02</span><span className="t">What feeds the score</span></a></li>
            <li><a href="#s3"><span className="n">03</span><span className="t">How the score updates</span></a></li>
            <li><a href="#s4"><span className="n">04</span><span className="t">Effect on compensation</span></a></li>
            <li><a href="#s5"><span className="n">05</span><span className="t">Worked examples</span></a></li>
            <li><a href="#s6"><span className="n">06</span><span className="t">What the score does not capture</span></a></li>
            <li><a href="#s7"><span className="n">07</span><span className="t">Reviewing or disputing a score</span></a></li>
            <li><a href="#s8"><span className="n">08</span><span className="t">Methodology change control</span></a></li>
          </ol>
          <div className="toc-actions">
            <Link className="btn" href="/docs/operators"><span>← Prev · Operator Guide</span><span></span></Link>
            <Link className="btn" href="/docs/pricing"><span>Next · Genesis Pricing</span><span>→</span></Link>
          </div>
        </aside>

        <article className="content">
          <div className="preamble">
            <p>
              This document is the canonical specification for the Data Demand Score. It is ratified against
              the Mālama Whitepaper v1.0 (May 2026), Tokenomics v3.6, and the Pricing Methodology v1.0.
              The score feeds directly into the operator compensation formula documented in{' '}
              <Link href="/docs/pricing" style={{ color: 'var(--mlma-accent)' }}>Genesis Pricing</Link>.
            </p>
          </div>

          {/* §01 */}
          <section className="clause" id="s1">
            <div className="clause-head">
              <span className="num">§ 01</span>
              <h2>What the score measures</h2>
              <a className="anchor" href="#s1">#s1</a>
            </div>
            <div className="clause-body">
              <p>
                Each Genesis 200 hex carries a Data Demand Score between 0 and 100. The score reflects the
                relative value of cryptographically-signed environmental data originating from that specific
                geographic cell, as measured by quantifiable demand signals from commercial, regulatory, and
                research consumers of environmental data.
              </p>
              <p>
                The score is not a measure of how much data exists in a hex today. It is a measure of how
                much that data is worth to verified buyers when it does exist. A remote area with no current
                sensors can have a high score if the data from there would resolve high-value contracts,
                satisfy regulatory disclosure requirements, or close significant gaps in scientific coverage.
              </p>
              <p>
                The score is one input to the operator compensation calculation, combined with the Hex Type
                Multiplier and the Genesis Year 1 Multiplier under the bounded reward framework documented
                in the <Link href="/docs/pricing" style={{ color: 'var(--mlma-accent)' }}>Genesis Pricing</Link> page.
                The score does not directly determine final earnings. The cohort normalization layer in the
                reward formula ensures total Genesis 200 emissions stay within the 25M MLMA operator pool cap
                regardless of how individual scores distribute.
              </p>
              <p>
                The score is computed at hex creation and recomputed quarterly based on changes in underlying
                demand, not on what the operator does. Operators do not earn more by manipulating data to
                inflate signal volume.
              </p>
            </div>
          </section>

          {/* §02 */}
          <section className="clause" id="s2">
            <div className="clause-head">
              <span className="num">§ 02</span>
              <h2>What feeds the score</h2>
              <a className="anchor" href="#s2">#s2</a>
            </div>
            <div className="clause-body">
              <p>
                Five weighted components, each scored 0-100, blended into the final score:
              </p>

              <h3>Parametric insurance trigger density (weight: 25%)</h3>
              <p>
                The density of parametric insurance contracts whose triggers are resolvable by
                hardware-verified environmental data originating from the hex. This includes crop insurance
                with rainfall or temperature triggers, wildfire insurance with humidity and wind triggers,
                flood insurance with precipitation triggers, and supply chain insurance with regional event
                triggers.
              </p>
              <p>
                Hexes in regions with active parametric insurance markets and resolvable triggers score
                higher. Hexes in regions with no parametric insurance activity score lower.
              </p>

              <h3>Regulatory monitoring demand (weight: 25%)</h3>
              <p>
                The volume of regulatory disclosure obligations that require environmental data verifiable
                from the hex. This includes the EU Deforestation Regulation (EUDR) supply chain monitoring
                requirements for agricultural commodities, the EU Corporate Sustainability Reporting
                Directive (CSRD) ESRS E1 climate disclosures, US SEC climate disclosure rules where
                applicable, and emissions monitoring requirements for AI compute facilities.
              </p>
              <p>
                Hexes covering regulated commodity production zones, large emissions sources, or
                compliance-relevant geographies score higher. Hexes in regions without regulatory mandates
                consuming hex-level data score lower.
              </p>

              <h3>Prediction market resolution density (weight: 15%)</h3>
              <p>
                The density of prediction market contracts whose resolution depends on environmental
                conditions or events verifiable from data originating in the hex. This includes weather
                event prediction markets, climate milestone markets, and other contracts that require
                verifiable on-ground signal for settlement.
              </p>
              <p>
                Hexes in regions where prediction markets actively resolve to ground-truth environmental
                data score higher. Hexes in regions where no such markets operate score lower.
              </p>

              <h3>Scientific coverage gap (weight: 20%)</h3>
              <p>
                The degree to which the hex represents a gap in existing scientific environmental monitoring
                coverage. Computed against the density of public scientific instrumentation (NOAA networks,
                EPA monitoring sites, academic research networks, World Meteorological Organization
                stations) in and around the hex.
              </p>
              <p>
                Hexes in densely monitored urban regions with extensive existing coverage score lower on
                this component. Hexes in undermonitored rural and remote regions where Mālama hardware
                would provide novel scientific signal score higher.
              </p>

              <h3>AI compute disclosure obligations (weight: 15%)</h3>
              <p>
                The density of AI compute facilities subject to emissions and water disclosure requirements
                within or proximate to the hex. As AI compute regulatory frameworks mature (water
                permitting, emissions reporting, energy consumption disclosure), data centers require
                hardware-verifiable measurement of their local environmental impact.
              </p>
              <p>
                Hexes containing or adjacent to data center clusters score higher. Hexes without
                significant AI compute infrastructure score lower on this component.
              </p>

              <table className="matrix">
                <thead>
                  <tr>
                    <th>Component</th>
                    <th>Weight</th>
                    <th>Scores higher when</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Parametric insurance trigger density</td>
                    <td>25%</td>
                    <td>Active parametric markets with resolvable triggers</td>
                  </tr>
                  <tr>
                    <td>Regulatory monitoring demand</td>
                    <td>25%</td>
                    <td>EUDR, CSRD, SEC, or AI compute mandates apply to hex geography</td>
                  </tr>
                  <tr>
                    <td>Prediction market resolution density</td>
                    <td>15%</td>
                    <td>Active prediction markets resolve to hex-verifiable signals</td>
                  </tr>
                  <tr>
                    <td>Scientific coverage gap</td>
                    <td>20%</td>
                    <td>Undermonitored area with no existing NOAA, EPA, or WMO coverage</td>
                  </tr>
                  <tr>
                    <td>AI compute disclosure obligations</td>
                    <td>15%</td>
                    <td>Data center clusters within or adjacent to hex</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* §03 */}
          <section className="clause" id="s3">
            <div className="clause-head">
              <span className="num">§ 03</span>
              <h2>How the score updates</h2>
              <a className="anchor" href="#s3">#s3</a>
            </div>
            <div className="clause-body">
              <p>
                The Data Demand Score is computed at hex creation and recomputed on a quarterly cadence
                (March 31, June 30, September 30, December 31). The score reflects demand signals as they
                exist on the computation date, including:
              </p>
              <ul>
                <li>Quarterly updates to parametric insurance markets and active contract counts</li>
                <li>New regulatory frameworks coming into force or sunsetting</li>
                <li>Changes in scientific monitoring infrastructure</li>
                <li>AI compute facility additions, expansions, or closures</li>
                <li>Prediction market activity over the prior 90 days</li>
              </ul>
              <p>
                Score changes are visible to operators in the Node Command Center dashboard at each quarterly
                recompute. Operators receive notification when their hex score changes by more than 10 points
                in either direction.
              </p>
              <p>
                A hex score does not change based on the operator&rsquo;s individual performance, uptime,
                or data quality. Those metrics affect compensation through other mechanisms (PONO
                qualification, uptime requirements, milestone vesting, cohort normalization), not through
                the Data Demand Score.
              </p>
            </div>
          </section>

          {/* §04 */}
          <section className="clause" id="s4">
            <div className="clause-head">
              <span className="num">§ 04</span>
              <h2>How the score affects operator compensation</h2>
              <a className="anchor" href="#s4">#s4</a>
            </div>
            <div className="clause-body">
              <p>
                The Data Demand Score feeds into the bounded reward framework documented in the{' '}
                <Link href="/docs/pricing" style={{ color: 'var(--mlma-accent)' }}>Genesis Pricing</Link> page.
                The relevant calculation:
              </p>
              <pre>{`Calculated Eligibility = Base Allocation
                       × Genesis Year 1 Multiplier
                       × Hex Type Multiplier
                       × Data Demand Score Multiplier`}</pre>

              <p>Where:</p>
              <ul>
                <li><strong>Base allocation:</strong> 125,000 MLMA per Genesis 200 operator (nominal)</li>
                <li><strong>Genesis Year 1 Multiplier:</strong> 1.5x during the first 12 months from individual hardware activation</li>
                <li><strong>Hex Type Multiplier:</strong> 0.95x to 1.30x depending on hex classification (Urban Core, Urban, Suburban, Rural, Remote)</li>
                <li><strong>Data Demand Score Multiplier:</strong> 0.70x to 1.30x per the bounded formula below</li>
              </ul>

              <h3>Data Demand Score Multiplier formula</h3>
              <pre>{`DDS Multiplier = 0.70 + (DDS × 0.006)`}</pre>

              <table className="matrix">
                <thead>
                  <tr>
                    <th>Data Demand Score</th>
                    <th>DDS Multiplier</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>0</td><td>0.70x</td></tr>
                  <tr><td>25</td><td>0.85x</td></tr>
                  <tr><td>50</td><td>1.00x</td></tr>
                  <tr><td>75</td><td>1.15x</td></tr>
                  <tr><td>100</td><td>1.30x</td></tr>
                </tbody>
              </table>

              <p>
                The bounded form (rather than an unconstrained ratio) ensures low-DDS hexes are not
                economically punished beyond a reasonable floor (0.70x rather than approaching zero), which
                preserves the geographic expansion incentive. The cap at 1.30x prevents high-DDS hexes from
                producing outsized emissions when compounded with the Hex Type and Genesis Year 1 multipliers.
              </p>

              <h3>The cohort normalization layer</h3>
              <p>
                Calculated Eligibility is not the final earned amount. The Mālama Whitepaper v1.0 caps the
                Genesis 200 operator pool at 25M MLMA. After all 195 external operators&rsquo; Calculated
                Eligibility figures are summed, a cohort-wide normalization factor is applied so the total
                earned across the cohort equals exactly 25M:
              </p>
              <pre>{`Final Earned MLMA = Calculated Eligibility
                  × (25,000,000 / Total Cohort Calculated Eligibility)`}</pre>

              <p>
                The Data Demand Score determines an operator&rsquo;s relative position within the cohort,
                not an absolute promise of earnings. Higher-DDS operators earn proportionally more than
                lower-DDS operators within the same cohort, but the total pool stays fixed.
              </p>
              <p>
                See the <Link href="/docs/pricing" style={{ color: 'var(--mlma-accent)' }}>Genesis Pricing</Link> page
                for the full reward calculation, including milestone vesting and the forfeited-MLMA
                recycling mechanism.
              </p>
            </div>
          </section>

          {/* §05 */}
          <section className="clause" id="s5">
            <div className="clause-head">
              <span className="num">§ 05</span>
              <h2>Worked examples</h2>
              <a className="anchor" href="#s5">#s5</a>
            </div>
            <div className="clause-body">
              <p>
                Calculated Eligibility for representative hexes (before cohort normalization):
              </p>

              <h3>Idaho Remote hex, Data Demand Score 57</h3>
              <pre>{`DDS Multiplier = 0.70 + (57 × 0.006) = 1.042

Calculated Eligibility = 125,000 × 1.5 × 1.30 × 1.042 = 254,000 MLMA`}</pre>
              <p>
                The Idaho hex earns higher than nominal because the Remote Hex Type Multiplier (1.30x)
                reflects the premium value of coverage in undermonitored regions, even though its Data
                Demand Score is moderate.
              </p>

              <h3>Tokyo Urban hex, Data Demand Score 93</h3>
              <pre>{`DDS Multiplier = 0.70 + (93 × 0.006) = 1.258

Calculated Eligibility = 125,000 × 1.5 × 1.00 × 1.258 = 235,875 MLMA`}</pre>
              <p>
                The Tokyo hex earns through a different path: high Data Demand Score (dense regulatory and
                commercial buyer demand) combined with the baseline Urban Hex Type Multiplier.
              </p>

              <h3>London Suburban hex, Data Demand Score 71</h3>
              <pre>{`DDS Multiplier = 0.70 + (71 × 0.006) = 1.126

Calculated Eligibility = 125,000 × 1.5 × 1.10 × 1.126 = 232,196 MLMA`}</pre>

              <h3>NYC Urban hex, Data Demand Score 91</h3>
              <pre>{`DDS Multiplier = 0.70 + (91 × 0.006) = 1.246

Calculated Eligibility = 125,000 × 1.5 × 1.00 × 1.246 = 233,625 MLMA`}</pre>

              <p>
                The framework produces a tighter spread across hex classes than the multipliers alone would
                suggest, because the cohort normalization pulls all operators toward the 25M aggregate cap.
              </p>
            </div>
          </section>

          {/* §06 */}
          <section className="clause" id="s6">
            <div className="clause-head">
              <span className="num">§ 06</span>
              <h2>What the score does not capture</h2>
              <a className="anchor" href="#s6">#s6</a>
            </div>
            <div className="clause-body">
              <p>Three things the Data Demand Score does not measure:</p>
              <ol>
                <li>
                  <strong>Operator performance.</strong> Uptime, data quality, PONO qualification, and
                  tamper-event history are tracked separately and gate compensation through milestone
                  vesting and the forfeited-MLMA recycling mechanism, not through the score.
                </li>
                <li>
                  <strong>Buyer-specific deal economics.</strong> When Mālama Labs strikes a specific
                  commercial deal (an enterprise data buyer, a registry partnership, a prediction market
                  platform integration), the revenue from that deal is distributed through the validator
                  fee accrual system in USDC, not through Data Demand Score adjustments. See{' '}
                  <Link href="/docs/validator-fees" style={{ color: 'var(--mlma-accent)' }}>/docs/validator-fees</Link>{' '}
                  for details.
                </li>
                <li>
                  <strong>Future demand events.</strong> The score is a snapshot of demand at computation
                  time. New regulatory frameworks, climate events, or buyer relationships can shift demand
                  significantly between quarterly recomputes. Operators should expect quarter-over-quarter
                  movement in their scores.
                </li>
              </ol>
            </div>
          </section>

          {/* §07 */}
          <section className="clause" id="s7">
            <div className="clause-head">
              <span className="num">§ 07</span>
              <h2>Reviewing or disputing a score</h2>
              <a className="anchor" href="#s7">#s7</a>
            </div>
            <div className="clause-body">
              <p>
                An operator who believes their hex is materially mis-scored can request a re-evaluation.
                The process:
              </p>
              <ol>
                <li>
                  Submit a re-evaluation request through the Operator Discord or the Node Command Center
                  support form, identifying the specific component(s) believed to be mis-scored.
                </li>
                <li>
                  The Mālama data team reviews the inputs against current methodology and either confirms
                  the original score or issues a correction.
                </li>
                <li>
                  Corrections apply prospectively from the date of correction, not retroactively.
                </li>
              </ol>
              <p>
                Re-evaluation requests are reviewed within 30 days. The team publishes an aggregate report
                each quarter on the number of requests received, the categories disputed, and the
                corrections issued.
              </p>
            </div>
          </section>

          {/* §08 */}
          <section className="clause" id="s8" style={{ borderBottom: 'none' }}>
            <div className="clause-head">
              <span className="num">§ 08</span>
              <h2>Methodology change control</h2>
              <a className="anchor" href="#s8">#s8</a>
            </div>
            <div className="clause-body">
              <p>
                The components, weights, and computation logic in this methodology can change as the network
                matures, new demand signals emerge, or existing signals lose relevance. Material changes go
                through this process:
              </p>
              <ol>
                <li>Proposed changes are posted to the Operator Forum for a 14-day comment period.</li>
                <li>Operator feedback is incorporated.</li>
                <li>The revised methodology is published with at least 30 days notice before taking effect.</li>
                <li>
                  The first quarterly recompute under the new methodology is communicated to operators by
                  email at least 14 days before recompute date.
                </li>
              </ol>
              <p>
                Governance of methodology changes follows the same process documented in the{' '}
                <Link href="/docs/pricing" style={{ color: 'var(--mlma-accent)' }}>Genesis Pricing</Link> page.
                The Pricing Committee reviews this methodology in coordination with reward framework reviews
                on an annual cadence.
              </p>

              <h3>Methodology provenance</h3>
              <p>This methodology is published as v1.0 ratified against:</p>
              <ul>
                <li>
                  <strong>Mālama Whitepaper v1.0 (May 2026)</strong>: the 25M Genesis 200 operator pool
                  cap that the score feeds into.
                </li>
                <li>
                  <strong>Tokenomics v3.6</strong>: the milestone vesting structure (15/15/20/20/30) that
                  gates the application of calculated eligibility.
                </li>
                <li>
                  <strong>Pricing Methodology v1.0 (2026-05-23)</strong>: the multiplier framework and
                  cohort normalization layer that the score multiplier feeds into.
                </li>
                <li>
                  <strong>Token Team Ratification 2026-05-23</strong>: the bounded formula structure (0.70
                  floor, 0.006 slope, 1.30 cap) and the integration with the Hex Type Multiplier.
                </li>
              </ul>
              <p>
                The five-component weighting (parametric insurance 25%, regulatory monitoring 25%,
                prediction markets 15%, scientific coverage gap 20%, AI compute 15%) is first-pass and
                subject to review by the Mālama data team as actual demand signals are measured against
                initial assumptions. The first methodology review is scheduled for Q2 2027 after a full
                year of quarterly recomputes.
              </p>

              <div className="sig-strip">
                <div className="label">-- DOCS · 05 · DATA DEMAND SCORE METHODOLOGY · v1.0</div>
                <p className="text">
                  Mālama Labs, Inc. · Genesis 200 · Ratified 2026-05-23 · Next review Q2 2027
                </p>
                <p className="footnote">
                  Questions: Operator Discord <code>#data-demand-score</code> · data@malamalabs.com
                </p>
              </div>
            </div>
          </section>
        </article>
      </main>
    </DocsPageShell>
  )
}
