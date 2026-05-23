import type { Metadata } from 'next'
import Link from 'next/link'
import '../docs-hub.css'
import DocsPageShell from '../_shared/DocsPageShell'

export const metadata: Metadata = {
  title: 'Genesis Pricing Methodology · Mālama Labs',
  description:
    'Genesis reserve price ($2,000 flat), listing reference price formula, three-multiplier reward calculation, cohort normalization, 15/15/20/20/30 milestone vesting, buyer protections. v1.0 ratified 2026-05-23 against Mālama Whitepaper v1.0 and Tokenomics v3.6.',
}

export default function PricingPage() {
  return (
    <DocsPageShell
      current="pricing"
      docNumber="DOCS · 06"
      eyebrowText="Genesis 200 · Pricing methodology"
      titleLead="Genesis Pricing"
      titleEmphasis="Methodology."
      lede="Two prices per hex (Genesis reserve: $2,000 flat; listing reference: $2,150 to $2,850). Three-multiplier reward calculation (Genesis Year 1 x Hex Type x Data Demand Score). Cohort-wide normalization to the 25M MLMA operator pool cap. Milestone vesting over 12 months from hardware activation."
      metaRows={[
        { k: 'Status', v: 'v1.0 · ratified 2026-05-23', accent: true },
        { k: 'Reserve price', v: '$2,000 (flat)' },
        { k: 'Listing range', v: '$2,150 to $2,850' },
        { k: 'Base allocation', v: '125,000 MLMA' },
        { k: 'Operator pool cap', v: '25,000,000 MLMA' },
        { k: 'Vesting window', v: '12 months from activation' },
      ]}
    >
      <main className="layout layout--with-toc">
        <aside className="toc" aria-label="Table of contents">
          <div className="toc-label">
            <span>Contents</span>
            <span className="count">10 sections</span>
          </div>
          <ol>
            <li><a href="#s1"><span className="n">01</span><span className="t">Network economics summary</span></a></li>
            <li><a href="#s2"><span className="n">02</span><span className="t">The two prices</span></a></li>
            <li><a href="#s3"><span className="n">03</span><span className="t">Listing reference price</span></a></li>
            <li><a href="#s4"><span className="n">04</span><span className="t">How rewards are calculated</span></a></li>
            <li><a href="#s5"><span className="n">05</span><span className="t">Milestone vesting schedule</span></a></li>
            <li><a href="#s6"><span className="n">06</span><span className="t">The five reserved hexes</span></a></li>
            <li><a href="#s7"><span className="n">07</span><span className="t">8-year emissions context</span></a></li>
            <li><a href="#s8"><span className="n">08</span><span className="t">Post-Genesis pricing</span></a></li>
            <li><a href="#s9"><span className="n">09</span><span className="t">Validator fee accruals</span></a></li>
            <li><a href="#s10"><span className="n">10</span><span className="t">Buyer protections</span></a></li>
          </ol>
          <div className="toc-actions">
            <Link className="btn" href="/docs/data-demand-score-methodology"><span>← Prev · Data Demand Score</span><span></span></Link>
            <Link className="btn" href="/docs/validator-fees"><span>Next · Validator Fees</span><span>→</span></Link>
          </div>
        </aside>

        <article className="content">
          <div className="preamble">
            <p>
              This is the canonical pricing methodology for the Genesis 200 sale. It is ratified against the
              Mālama Whitepaper v1.0 (May 2026) and Tokenomics v3.6. The multiplier framework, cohort
              normalization layer, transfer policy, governance composition, and the framing of Genesis 200
              as bootstrap economics were approved by the Token Team on 2026-05-23.
            </p>
          </div>

          {/* §01 */}
          <section className="clause" id="s1">
            <div className="clause-head">
              <span className="num">§ 01</span>
              <h2>Network economics summary</h2>
              <a className="anchor" href="#s1">#s1</a>
            </div>
            <div className="clause-body">
              <table className="matrix">
                <thead>
                  <tr><th>Metric</th><th>Value</th></tr>
                </thead>
                <tbody>
                  <tr><td>Genesis nodes available externally</td><td>195</td></tr>
                  <tr><td>Genesis nodes reserved by Mālama Labs</td><td>5 (visible in explorer, separate allocation)</td></tr>
                  <tr><td>Genesis nodes total</td><td>200</td></tr>
                  <tr><td>Reserve price per hex</td><td>$2,000</td></tr>
                  <tr><td>Gross Genesis raise (195 external x $2,000)</td><td>$390,000</td></tr>
                  <tr><td>Nominal base MLMA allocation per operator</td><td>125,000</td></tr>
                  <tr><td>Genesis Year 1 Multiplier</td><td>1.5x</td></tr>
                  <tr><td>Hex Type Multiplier range</td><td>0.95x to 1.30x</td></tr>
                  <tr><td>Data Demand Score Multiplier range</td><td>0.70x to 1.30x</td></tr>
                  <tr><td>Maximum theoretical calculated eligibility per operator</td><td>~317,000 MLMA</td></tr>
                  <tr><td>Minimum theoretical calculated eligibility per operator</td><td>~125,000 MLMA</td></tr>
                  <tr><td><strong>Genesis 200 operator pool (hard cap, per Whitepaper v1.0)</strong></td><td><strong>25,000,000 MLMA</strong></td></tr>
                  <tr><td>Effective per-operator share at full cap (25M / 195)</td><td>~128,205 MLMA average</td></tr>
                  <tr><td>Cohort-wide normalization</td><td>Applied if total calculated eligibility exceeds 25M</td></tr>
                  <tr><td>Allocation as share of total supply (500M)</td><td>5.0%</td></tr>
                  <tr><td>Allocation as share of 8-year emissions (60M)</td><td>41.7%</td></tr>
                  <tr><td>Hardware shipping target</td><td>end of December 2026</td></tr>
                  <tr><td>Vesting window</td><td>12 months from individual hardware activation</td></tr>
                  <tr><td>Annual pricing methodology review</td><td>Yes</td></tr>
                </tbody>
              </table>

              <p>
                <strong>On the cap and the headline allocation.</strong> The Mālama Whitepaper v1.0 (May
                2026) specifies the Genesis 200 operator pool at 25,000,000 MLMA, equivalent to 200 hex
                zones x 125,000 MLMA earned via the validation reward formula. The 25M figure is the pool
                cap binding on the 195 external operators. The 5 Mālama Labs reserved hexes are funded
                from a separate treasury allocation (see &ldquo;The Five Reserved Mālama Labs Hexes&rdquo;
                below). The effective average per-operator share at full cap is therefore 25M / 195 = ~128,205
                MLMA. The 125,000 headline figure remains the base for the calculation; the slight uplift
                above 125,000 reflects the reserved hexes being funded outside the pool.
              </p>
              <p>
                <strong>On the normalization layer.</strong> Individual operator eligibility is calculated
                using the multiplier framework below. If the aggregate calculated eligibility across the 195
                external operators exceeds 25M, a cohort-wide normalization factor is applied so the total
                stays at exactly 25M. This preserves the 125,000 base allocation as the headline figure,
                preserves the multiplier framework&rsquo;s differentiation between hex classes and data
                demand scores, and guarantees the protocol-level cap is binding. Operators see their
                relative position within the cohort, not an absolute promise of their final earnings.
              </p>
            </div>
          </section>

          {/* §02 */}
          <section className="clause" id="s2">
            <div className="clause-head">
              <span className="num">§ 02</span>
              <h2>The two prices</h2>
              <a className="anchor" href="#s2">#s2</a>
            </div>
            <div className="clause-body">
              <h3>Genesis Reserve Price: $2,000 across every hex</h3>
              <p>
                Every hex in the Genesis 200 sale carries the same $2,000 reserve price regardless of
                classification, data demand score, or geography. The reserve price is a flat floor.
              </p>
              <p>The reserve price covers two things:</p>
              <ol>
                <li>
                  <strong>Hardware kit.</strong> One Mālama Genesis Hex Node. Component specifications and
                  environmental ratings are documented in the{' '}
                  <Link href="/docs/hex-node-spec" style={{ color: 'var(--mlma-accent)' }}>Hex Node Specification</Link>.
                </li>
                <li>
                  <strong>Geographic operating license.</strong> An NFT-encoded license to operate the
                  assigned H3 hex zone, with on-chain custody on Base (canonical) and Cardano (mirrored for
                  credit card purchases). The license carries operational rights to publish hardware-signed
                  environmental data from within the assigned hex.
                </li>
              </ol>
              <p>
                The Genesis reserve price is intended to subsidize early network formation and may not
                reflect long-term hardware, support, and ecosystem deployment costs. Genesis 200 is the
                founding cohort; pricing for subsequent cohorts reflects mature network economics.
              </p>
              <p>
                <strong>Why a flat reserve when hexes differ in value?</strong> Different hexes carry
                different intrinsic value to the network. A Tokyo Urban hex with high data demand is, in
                expected terms, more valuable than a remote Idaho hex. Charging differential prices by hex
                type during Genesis 200 would concentrate ownership among operators best positioned to
                assess and pay for high-value urban hexes. A flat reserve trades short-term revenue
                optimization for early geographic decentralization. The compensation framework (multipliers
                below) reflects the value differential, not the reserve price.
              </p>

              <h3>Listing Reference Price: estimated $2,150 to $2,850 depending on hex</h3>
              <p>
                Each hex carries an estimated listing reference price computed from its Data Demand Score,
                its classification, and approximate comparable cost of equivalent third-party environmental
                monitoring services for the area.
              </p>
              <p>
                The listing reference price is illustrative. It is what Mālama would charge for the same
                hex if it were sold outside the Genesis discount window, based on first-pass estimates that
                are subject to validation against actual market comparables. Operators in the Genesis 200
                sale pay the $2,000 reserve regardless.
              </p>
              <p>
                <strong>Reference price is not a market valuation.</strong> It&rsquo;s an internal benchmark
                for post-Genesis pricing once the network operates at maturity. Secondary market values for
                transferred Genesis licenses will be set by the market, not by Mālama.
              </p>
            </div>
          </section>

          {/* §03 */}
          <section className="clause" id="s3">
            <div className="clause-head">
              <span className="num">§ 03</span>
              <h2>How listing reference price is computed</h2>
              <a className="anchor" href="#s3">#s3</a>
            </div>
            <div className="clause-body">
              <pre>{`Listing Reference Price = Base Listing ($1,800)
                       + Data Demand Premium ($1,000 × DDS / 100)
                       + Classification Adjustment`}</pre>

              <h3>Base Listing: $1,800 (illustrative, pending market validation)</h3>
              <p>
                Floor estimate covering hardware kit cost, license issuance, network onboarding, and
                customer support. Subject to validation against actual comparable third-party telemetry
                costs and regional deployment economics.
              </p>

              <h3>Data Demand Premium: $0 to $1,000</h3>
              <p>
                Linear premium tied to the Data Demand Score. A hex with a Data Demand Score of 50 carries
                a $500 premium. A hex with a score of 100 carries a $1,000 premium. See the{' '}
                <Link href="/docs/data-demand-score-methodology" style={{ color: 'var(--mlma-accent)' }}>Data Demand Score Methodology</Link>{' '}
                page for how the score is computed.
              </p>

              <h3>Classification Adjustment</h3>
              <table className="matrix">
                <thead>
                  <tr><th>Classification</th><th>Adjustment</th></tr>
                </thead>
                <tbody>
                  <tr><td>Urban Core</td><td>+$200</td></tr>
                  <tr><td>Urban</td><td>+$100</td></tr>
                  <tr><td>Suburban</td><td>$0</td></tr>
                  <tr><td>Rural</td><td>-$50</td></tr>
                  <tr><td>Remote</td><td>-$150</td></tr>
                </tbody>
              </table>

              <p>Worked examples (rounded to nearest $10):</p>
              <table className="matrix">
                <thead>
                  <tr><th>Hex</th><th>Class</th><th>DDS</th><th>Calculation</th><th>Listing</th></tr>
                </thead>
                <tbody>
                  <tr><td>Idaho · 8428861ffffffff</td><td>Remote</td><td>57</td><td>$1,800 + $570 + (-$150)</td><td>$2,220</td></tr>
                  <tr><td>Tokyo · 872f5a343ffffff</td><td>Urban</td><td>93</td><td>$1,800 + $930 + $100</td><td>$2,830</td></tr>
                  <tr><td>NYC · 872a100a4ffffff</td><td>Urban</td><td>91</td><td>$1,800 + $910 + $100</td><td>$2,810</td></tr>
                  <tr><td>London · suburban example</td><td>Suburban</td><td>71</td><td>$1,800 + $710 + $0</td><td>$2,510</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* §04 */}
          <section className="clause" id="s4">
            <div className="clause-head">
              <span className="num">§ 04</span>
              <h2>How rewards are calculated</h2>
              <a className="anchor" href="#s4">#s4</a>
            </div>
            <div className="clause-body">
              <p>
                Operator compensation is denominated in MLMA tokens, vested against operational milestones.
                Two layers compute final earned MLMA:
              </p>

              <p><strong>Layer 1 — Calculated Eligibility:</strong></p>
              <pre>{`Calculated Eligibility = Base Allocation
                       × Genesis Year 1 Multiplier
                       × Hex Type Multiplier
                       × Data Demand Score Multiplier`}</pre>

              <p><strong>Layer 2 — Cohort Normalization:</strong></p>
              <pre>{`Final Earned MLMA = Calculated Eligibility
                  × (25,000,000 / Total Cohort Calculated Eligibility)`}</pre>

              <p>
                The cohort normalization factor scales every operator&rsquo;s calculated eligibility so the
                aggregate across the 195 external Genesis 200 operators equals exactly 25M MLMA. If the
                cohort&rsquo;s total calculated eligibility comes in below 25M (operators forfeit
                milestones, the cohort doesn&rsquo;t fully fill, etc.), the normalization factor is 1.0
                and operators earn their full calculated amount up to the cap.
              </p>

              <h3>Base Allocation: 125,000 MLMA</h3>
              <p>
                Every Genesis 200 operator&rsquo;s calculation begins at 125,000 MLMA as the base. Actual
                earned MLMA after multipliers and normalization can be higher or lower depending on the
                operator&rsquo;s hex characteristics and the cohort-wide total.
              </p>

              <h3>Genesis Year 1 Multiplier: 1.5x</h3>
              <p>
                Active during the first 12 months from individual hardware activation (not calendar Year
                1). Operators who activate their hardware in February 2027 see their Genesis Year 1
                Multiplier apply through February 2028. The multiplier applies uniformly across all five
                milestone payouts during that window. Does not apply to post-Genesis operators or to
                Genesis license holders past their first 12 months of activation.
              </p>

              <h3>Hex Type Multiplier: 0.95x to 1.30x</h3>
              <table className="matrix">
                <thead>
                  <tr><th>Classification</th><th>Multiplier</th></tr>
                </thead>
                <tbody>
                  <tr><td>Urban Core</td><td>0.95x</td></tr>
                  <tr><td>Urban</td><td>1.00x</td></tr>
                  <tr><td>Suburban</td><td>1.10x</td></tr>
                  <tr><td>Rural</td><td>1.20x</td></tr>
                  <tr><td>Remote</td><td>1.30x</td></tr>
                </tbody>
              </table>
              <p>
                Higher multipliers for sparser settlement densities reflect the premium value of coverage
                in undermonitored regions and the relative scarcity of operators willing to deploy hardware
                in remote areas. The compressed range (0.95x to 1.30x) reflects the ratified balance
                between meaningful differentiation and total emissions discipline.
              </p>

              <h3>Data Demand Score Multiplier: 0.70x to 1.30x</h3>
              <pre>{`DDS Multiplier = 0.70 + (DDS × 0.006)`}</pre>
              <table className="matrix">
                <thead>
                  <tr><th>Data Demand Score</th><th>DDS Multiplier</th></tr>
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
                The bounded form ensures low-DDS hexes are not economically punished beyond a reasonable
                floor (0.70x rather than approaching zero), preserving the geographic expansion incentive.
                The cap at 1.30x prevents high-DDS hexes from producing outsized emissions when
                compounded with the Hex Type and Genesis Year 1 multipliers.
              </p>

              <h3>Worked examples</h3>
              <p>Idaho Remote hex, Data Demand Score 57:</p>
              <pre>{`Calculated Eligibility = 125,000 × 1.5 × 1.30 × 1.042 = 254,000 MLMA`}</pre>
              <p>Tokyo Urban hex, Data Demand Score 93:</p>
              <pre>{`Calculated Eligibility = 125,000 × 1.5 × 1.00 × 1.258 = 235,875 MLMA`}</pre>
              <p>NYC Urban hex, Data Demand Score 91:</p>
              <pre>{`Calculated Eligibility = 125,000 × 1.5 × 1.00 × 1.246 = 233,625 MLMA`}</pre>
              <p>London Suburban hex, Data Demand Score 71:</p>
              <pre>{`Calculated Eligibility = 125,000 × 1.5 × 1.10 × 1.126 = 232,196 MLMA`}</pre>

              <p>
                Each figure above is calculated eligibility before normalization. Final earned MLMA is
                calculated eligibility multiplied by the cohort normalization factor. If the total
                calculated eligibility across 195 external operators is approximately 47M (rough estimate
                at expected average multipliers), the normalization factor is 25/47 = ~0.53, and the
                figures above scale to roughly:
              </p>

              <table className="matrix">
                <thead>
                  <tr><th>Hex</th><th>Calculated</th><th>After normalization (illustrative)</th></tr>
                </thead>
                <tbody>
                  <tr><td>Idaho Remote DDS 57</td><td>254,000</td><td>~135,000</td></tr>
                  <tr><td>Tokyo Urban DDS 93</td><td>235,875</td><td>~125,000</td></tr>
                  <tr><td>NYC Urban DDS 91</td><td>233,625</td><td>~124,000</td></tr>
                  <tr><td>London Suburban 71</td><td>232,196</td><td>~123,000</td></tr>
                </tbody>
              </table>

              <p>
                Post-normalization figures are illustrative and depend on actual cohort composition once
                Genesis 200 fills. The pattern holds: Remote hexes earn modestly more than Urban hexes,
                but the spread is significantly tighter than the calculated-only view suggests because the
                normalization applies uniformly.
              </p>

              <div className="callout warn">
                <span className="tag">Note</span>
                <p>
                  Calculated eligibility is not guaranteed earned. Each calculation above is subject to
                  milestone vesting (operators must qualify at each of five milestones), network performance
                  (uptime, tamper events, PONO qualification), and cohort normalization (the 25M aggregate
                  cap is binding per Whitepaper v1.0).
                </p>
              </div>
            </div>
          </section>

          {/* §05 */}
          <section className="clause" id="s5">
            <div className="clause-head">
              <span className="num">§ 05</span>
              <h2>Milestone vesting schedule</h2>
              <a className="anchor" href="#s5">#s5</a>
            </div>
            <div className="clause-body">
              <p>
                Calculated eligibility vests against five operational milestones over the 12 months from
                individual hardware activation:
              </p>
              <table className="matrix">
                <thead>
                  <tr><th>Milestone</th><th>% of total</th><th>Trigger</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Boot</td>
                    <td>15%</td>
                    <td>Deployment registration, KYB, first signed reading</td>
                  </tr>
                  <tr>
                    <td>PONO 90-day</td>
                    <td>15%</td>
                    <td>90-day PONO qualification</td>
                  </tr>
                  <tr>
                    <td>6-month</td>
                    <td>20%</td>
                    <td>Continuous PONO + uptime threshold + no tamper events</td>
                  </tr>
                  <tr>
                    <td>9-month</td>
                    <td>20%</td>
                    <td>Same conditions</td>
                  </tr>
                  <tr>
                    <td>12-month</td>
                    <td>30%</td>
                    <td>Same conditions</td>
                  </tr>
                </tbody>
              </table>

              <p>
                <strong>Detailed definitions</strong> for PONO qualification, uptime measurement
                methodology, tamper event classification, and dispute procedures are codified in the{' '}
                <Link href="/legal/token-rewards-risk" style={{ color: 'var(--mlma-accent)' }}>Token &amp; Rewards Risk Disclosure</Link>{' '}
                and the{' '}
                <Link href="/legal/hex-node-purchase" style={{ color: 'var(--mlma-accent)' }}>Hex Node Purchase &amp; Preorder Agreement</Link>.
                The legal documents are the binding source of truth.
              </p>

              <p>
                <strong>Forfeited MLMA.</strong> If an operator fails to qualify for a milestone, the
                MLMA allocated to that milestone does not vest. Subsequent milestones can still be
                qualified if conditions are met. Forfeited MLMA returns to the Genesis Performing Operator
                Bonus Pool and is redistributed to active Genesis 200 operators who complete all milestone
                qualifications. This preserves the 25M cap within the founding cohort while creating an
                additional reliability incentive.
              </p>
            </div>
          </section>

          {/* §06 */}
          <section className="clause" id="s6">
            <div className="clause-head">
              <span className="num">§ 06</span>
              <h2>The five reserved Mālama Labs hexes</h2>
              <a className="anchor" href="#s6">#s6</a>
            </div>
            <div className="clause-body">
              <p>
                Five of the 200 Genesis hex zones are reserved by Mālama Labs for internal deployment.
                Treatment:
              </p>
              <ol>
                <li>
                  <strong>Counted within the 200.</strong> 195 hexes available for external purchase,
                  5 reserved by Mālama Labs, 200 total.
                </li>
                <li>
                  <strong>Visible in the explorer.</strong> Displayed on the map with a &ldquo;Reserved
                  · Mālama Labs&rdquo; badge. Never hidden from public view.
                </li>
                <li>
                  <strong>Operate normally.</strong> Subject to the same hardware deployment, signal
                  generation, and milestone qualification requirements as external operators.
                </li>
                <li>
                  <strong>Separate MLMA allocation.</strong> Rewards for the 5 reserved hexes are funded
                  from the Mālama Labs treasury allocation, not from the 25M Genesis 200 operator pool.
                  This avoids any insider dilution of external operator economics. The 25M pool is fully
                  reserved for the 195 external operators.
                </li>
              </ol>
            </div>
          </section>

          {/* §07 */}
          <section className="clause" id="s7">
            <div className="clause-head">
              <span className="num">§ 07</span>
              <h2>Genesis 200 in the 8-year emissions context</h2>
              <a className="anchor" href="#s7">#s7</a>
            </div>
            <div className="clause-body">
              <p>
                The Genesis 200 operator allocation (25M MLMA) represents 41.7% of the 8-year cumulative
                emissions schedule (60M MLMA total) per Whitepaper v1.0. The rationale:
              </p>
              <p>
                Founding cohort operators assume disproportionate deployment, hardware, execution, and
                reputational risk before the protocol reaches operational maturity. The allocation reflects
                a founding cohort bootstrap premium designed to accelerate geographically distributed
                infrastructure before revenue-funded incentives dominate.
              </p>
              <p>This is a transitional phase, not the steady-state operator economics:</p>
              <ul>
                <li>
                  <strong>Genesis 200 (Years 1-2):</strong> front-loaded operator allocation. 25M MLMA
                  paid via milestone vesting to compensate the network bootstrap.
                </li>
                <li>
                  <strong>Post-Genesis cohorts (Years 2-5):</strong> operator rewards continue from the
                  emissions schedule but at compressed rates reflecting reduced execution risk.
                </li>
                <li>
                  <strong>Revenue-funded steady state (Years 4+):</strong> validator fee accruals (paid
                  in USDC from commercial buyer relationships) become the dominant operator compensation,
                  with MLMA emissions tapering toward burn-floor equilibrium.
                </li>
              </ul>
              <p>
                The Genesis 200 economics are not recurring operator economics. They are infrastructure
                bootstrap economics. The protocol&rsquo;s long-term direction is revenue-funded incentives
                rather than perpetual inflation.
              </p>
            </div>
          </section>

          {/* §08 */}
          <section className="clause" id="s8">
            <div className="clause-head">
              <span className="num">§ 08</span>
              <h2>Post-Genesis pricing</h2>
              <a className="anchor" href="#s8">#s8</a>
            </div>
            <div className="clause-body">
              <p>After the Genesis 200 sale closes:</p>
              <ol>
                <li>
                  <strong>Reserve price closes.</strong> No further hexes are available at the $2,000
                  reserve.
                </li>
                <li>
                  <strong>Listing prices become the floor.</strong> Newly issued hexes are sold at the
                  listing reference price computed by the formula above (with the listing-formula
                  calibration validated against market comparables prior to that point).
                </li>
                <li>
                  <strong>Resale market opens.</strong> Existing operators can transfer or sell their
                  hexes on the secondary market at any price they choose. Mālama Labs does not control
                  secondary market pricing.
                </li>
                <li>
                  <strong>Hex Type Multiplier remains.</strong> New operators continue to earn under the
                  same Hex Type Multiplier framework. The Genesis Year 1 Multiplier (1.5x) applies only
                  to original Genesis 200 operators during their first 12 months of hardware activation;
                  it does not transfer with secondary license sales.
                </li>
                <li>
                  <strong>Periodic pricing review.</strong> Methodology updates go through the governance
                  process described below.
                </li>
              </ol>

              <h3>Governance of methodology changes</h3>
              <p>The pricing methodology is reviewed annually by the Mālama Pricing Committee. Composition:</p>
              <ul>
                <li>
                  <strong>Current (through Genesis 200 launch and initial operations):</strong> internal
                  Mālama Labs members across product, token economics, operations, and legal.
                </li>
                <li>
                  <strong>Transition trigger:</strong> operator-elected representation joins the Pricing
                  Committee when both (a) more than 75% of the Genesis 200 cohort is active (hardware
                  deployed, boot milestone reached), AND (b) at least 12 months have elapsed post-launch,
                  whichever occurs later.
                </li>
                <li>
                  <strong>At steady state:</strong> the Pricing Committee includes a defined number of
                  operator-elected seats and material methodology changes require a binding operator vote.
                </li>
              </ul>

              <p>Process for methodology changes:</p>
              <ol>
                <li>Proposed changes posted to the Operator Forum for a 14-day comment period.</li>
                <li>Operator feedback reviewed by the Pricing Committee.</li>
                <li>Revised methodology published with at least 30 days notice before taking effect.</li>
                <li>Genesis 200 operators notified by email.</li>
                <li>
                  Operators have a defined appeal mechanism for individual hex re-evaluation requests,
                  documented in the{' '}
                  <Link href="/docs/data-demand-score-methodology" style={{ color: 'var(--mlma-accent)' }}>Data Demand Score Methodology</Link>{' '}
                  page.
                </li>
              </ol>
            </div>
          </section>

          {/* §09 */}
          <section className="clause" id="s9">
            <div className="clause-head">
              <span className="num">§ 09</span>
              <h2>Validator fee accruals (outside the MLMA cap)</h2>
              <a className="anchor" href="#s9">#s9</a>
            </div>
            <div className="clause-body">
              <p>
                In addition to MLMA milestone rewards, Genesis 200 operators participate in validator fee
                accruals: protocol revenue distributed in stablecoin (USDC) from specific commercial buyer
                relationships.
              </p>
              <p>Key properties:</p>
              <ul>
                <li>
                  <strong>Paid in USDC, not MLMA.</strong> Validator fees are real revenue from enterprise
                  data buyers, registry partnerships, prediction market platform integrations, and similar
                  commercial relationships.
                </li>
                <li>
                  <strong>Outside the MLMA emissions schedule entirely.</strong> Validator fee distributions
                  do not count against the 25M Genesis 200 operator allocation cap or the 60M 8-year
                  emissions total.
                </li>
                <li>
                  <strong>Distributed pro-rata</strong> based on validator fee accruals within each hex,
                  weighted by operator uptime and PONO qualification during the accrual period.
                </li>
                <li>
                  <strong>Continuous, not milestone-vested.</strong> Validator fees accrue and distribute
                  on a defined cadence (target: monthly), independent of the milestone vesting schedule
                  that applies to MLMA rewards.
                </li>
              </ul>
              <p>
                Detailed validator fee mechanics, accrual computation, and distribution schedule are
                documented in{' '}
                <Link href="/docs/validator-fees" style={{ color: 'var(--mlma-accent)' }}>/docs/validator-fees</Link>.
              </p>
            </div>
          </section>

          {/* §10 */}
          <section className="clause" id="s10" style={{ borderBottom: 'none' }}>
            <div className="clause-head">
              <span className="num">§ 10</span>
              <h2>Buyer protections</h2>
              <a className="anchor" href="#s10">#s10</a>
            </div>
            <div className="clause-body">
              <p>Three guarantees apply to all Genesis 200 reservations:</p>
              <ol>
                <li>
                  <strong>Hardware quality.</strong> If the Hex Node hardware fails on arrival or within
                  the 90-day install window for reasons other than buyer negligence, Mālama replaces it at
                  no charge.
                </li>
                <li>
                  <strong>Replacement on warranty failure.</strong> If hardware fails within the first 12
                  months of verified operation due to manufacturing defect, Mālama replaces it at no
                  charge. Warranty does not cover physical damage, tampering, or deployment outside the
                  rated operating range. Detailed environmental specifications are in the{' '}
                  <Link href="/docs/hex-node-spec" style={{ color: 'var(--mlma-accent)' }}>Hex Node Specification</Link>.
                  Operators are responsible for confirming deployment conditions fall within rated specs
                  before installation.
                </li>
                <li>
                  <strong>License portability.</strong> A Genesis 200 operator can transfer their license
                  to another party. The NFT transfers directly on-chain. Mālama Labs does not restrict
                  transfers.
                </li>
              </ol>

              <p>
                <strong>On the Genesis Year 1 Multiplier and transfers.</strong> The Genesis Year 1
                Multiplier compensates the original commitment to bootstrap the network: the risk taken by
                reserving hardware months before delivery, in a pre-launch protocol, with operational
                milestones that begin a year after purchase. The commitment is taken by the original
                purchaser, not by any subsequent buyer. License transfers reset the Genesis Year 1
                Multiplier. The new operator earns under the standard multiplier framework without the
                1.5x bonus.
              </p>
              <p>
                This policy will be reviewed by the Pricing Committee after the Genesis 200 cohort reaches
                maturity (per the governance transition criteria above). Operators wishing to flag
                perceived friction with secondary market liquidity can do so through the Operator Forum.
              </p>

              <div className="sig-strip">
                <div className="label">-- DOCS · 06 · GENESIS PRICING METHODOLOGY · v1.0</div>
                <p className="text">
                  Mālama Labs, Inc. · Genesis 200 · Ratified 2026-05-23 · Whitepaper v1.0 · Tokenomics
                  v3.6 · Next review Q2 2027
                </p>
                <p className="footnote">
                  Questions: Operator Discord <code>#pricing-and-rewards</code> · economics@malamalabs.com
                </p>
              </div>
            </div>
          </section>
        </article>
      </main>
    </DocsPageShell>
  )
}
