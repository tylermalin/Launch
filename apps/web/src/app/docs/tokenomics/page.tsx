import type { Metadata } from 'next'
import Link from 'next/link'
import '../docs-hub.css'
import DocsPageShell from '../_shared/DocsPageShell'

export const metadata: Metadata = {
  title: 'MLMA Tokenomics · Mālama Labs',
  description:
    'MLMA token design — 500M hard cap, 8-year smooth taper emission window, KPI scaling, supply allocation, revenue distribution, veMLMA governance, Stewardship Pool. Aligned to Tokenomics Whitepaper v3.6.',
}

export default function TokenomicsPage() {
  return (
    <DocsPageShell
      current="tokenomics"
      docNumber="DOCS · 01"
      eyebrowText="Token design and economics"
      titleLead="MLMA"
      titleEmphasis="Tokenomics."
      lede="MLMA is a utility token coordinating a decentralized environmental data network. Hard-capped at 500M, with an 8-year emission window that tapers smoothly into permanent revenue-funded operation."
      metaRows={[
        { k: 'Hard cap', v: '500M MLMA', accent: true },
        { k: 'Emissions', v: '60M · 12%' },
        { k: 'Window', v: 'Years 1 – 8' },
        { k: 'Burn floor', v: '250M circulating' },
        { k: 'Chain', v: 'Base (ERC-20)' },
        { k: 'Precision', v: '18 decimals' },
      ]}
    >
      <main className="layout layout--with-toc">
        <aside className="toc" aria-label="Table of contents">
          <div className="toc-label">
            <span>Contents</span>
            <span className="count">12 sections</span>
          </div>
          <ol>
            {[
              ['s1', '01', 'Supply at a glance'],
              ['s2', '02', 'Token identity'],
              ['s3', '03', 'Primary functions'],
              ['s4', '04', 'Chain architecture'],
              ['s5', '05', 'Supply allocation'],
              ['s6', '06', 'Emission schedule'],
              ['s7', '07', 'Revenue distribution'],
              ['s8', '08', 'veMLMA governance'],
              ['s9', '09', 'Stewardship Pool'],
              ['s10', '10', 'Revenue sustainability'],
              ['s11', '11', 'Risk factors'],
              ['s12', '12', 'Disclaimers'],
            ].map(([id, n, t]) => (
              <li key={id}>
                <a href={`#${id}`}>
                  <span className="n">{n}</span>
                  <span className="t">{t}</span>
                </a>
              </li>
            ))}
          </ol>
          <div className="toc-actions">
            <Link className="btn" href="/docs/pricing-roi">
              <span>Next · Pricing</span>
              <span>→</span>
            </Link>
          </div>
        </aside>

        <article className="content">
          <div className="preamble">
            <p>
              This page summarizes the token design specified in the{' '}
              <strong>MLMA Tokenomics Whitepaper</strong>. MLMA is the utility token
              coordinating the Mālama validation network — used for fee payment, staking,
              governance (with PONO credential), and validator distributions.
            </p>
          </div>

          {/* §1 */}
          <section className="clause" id="s1">
            <div className="clause-head">
              <span className="num">§ 01</span>
              <h2>Supply at a glance</h2>
              <a className="anchor" href="#s1">#s1</a>
            </div>
            <div className="clause-body">
              <table className="matrix">
                <thead><tr><th>Metric</th><th>Value</th></tr></thead>
                <tbody>
                  <tr><td>Total supply cap</td><td><strong>500,000,000 MLMA</strong> · hard ceiling <span className="inline-pill warn">▲ Immutable</span></td></tr>
                  <tr><td>Emission window</td><td>Years 1 to 8 · smooth taper</td></tr>
                  <tr><td>Total network emissions</td><td><strong>60,000,000 MLMA</strong> · 12% of supply · KPI-scaled</td></tr>
                  <tr><td>Genesis 200 operator pool</td><td><strong>25,000,000 MLMA</strong> · 5% of supply</td></tr>
                  <tr><td>Per Genesis operator</td><td><strong>125,000 MLMA</strong> · milestone-conditional vesting</td></tr>
                  <tr><td>Stewardship Pool</td><td><strong>8,750,000 MLMA</strong> · 1.75% of supply · FPIC-gated</td></tr>
                  <tr><td>Post-emission governance reserve</td><td><strong>81,250,000 MLMA</strong> · 16.25% of supply</td></tr>
                  <tr><td>Burn floor</td><td><strong>250,000,000 MLMA</strong> circulating supply</td></tr>
                  <tr><td>Years 9+ emissions</td><td><strong>0</strong> · permanent revenue-funded operation</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* §2 */}
          <section className="clause" id="s2">
            <div className="clause-head">
              <span className="num">§ 02</span>
              <h2>Token identity</h2>
              <a className="anchor" href="#s2">#s2</a>
            </div>
            <div className="clause-body">
              <div className="spec-list">
                <div className="row"><div className="k">Name</div><div className="v"><strong>Mālama</strong></div></div>
                <div className="row"><div className="k">Language of origin</div><div className="v">ʻŌlelo Hawaiʻi (Hawaiian)</div></div>
                <div className="row"><div className="k">Meaning</div><div className="v">To care for, to tend, to protect, to preserve</div></div>
                <div className="row"><div className="k">Ticker</div><div className="v"><strong>MLMA</strong></div></div>
                <div className="row"><div className="k">Precision</div><div className="v">18 decimals</div></div>
                <div className="row"><div className="k">Standard</div><div className="v"><strong>ERC-20 on Base</strong> (Coinbase L2, EVM-equivalent)</div></div>
              </div>
            </div>
          </section>

          {/* §3 */}
          <section className="clause" id="s3">
            <div className="clause-head">
              <span className="num">§ 03</span>
              <h2>Primary functions</h2>
              <a className="anchor" href="#s3">#s3</a>
            </div>
            <div className="clause-body">
              <table className="matrix">
                <thead><tr><th>Function</th><th>Use</th><th>Recipient</th></tr></thead>
                <tbody>
                  <tr><td>Validator distribution</td><td>Receive MLMA for validating SaveCards and compute packets</td><td>Network operators</td></tr>
                  <tr><td>Governance</td><td>veMLMA lock plus PONO credential for DAO voting</td><td>Operators with PONO</td></tr>
                  <tr><td>Fee payment</td><td>Protocol fees payable in MLMA or stablecoin</td><td>Protocol treasury</td></tr>
                  <tr><td>Staking</td><td>Lock as veMLMA for enhanced distribution multipliers</td><td>veMLMA stakers</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* §4 */}
          <section className="clause" id="s4">
            <div className="clause-head">
              <span className="num">§ 04</span>
              <h2>Chain architecture</h2>
              <a className="anchor" href="#s4">#s4</a>
            </div>
            <div className="clause-body">
              <p>Two chains with separation of concerns. <strong>Cardano</strong> handles environmental data. <strong>Base</strong> handles the MLMA token. The chains are not bridged at TGE.</p>
              <table className="matrix">
                <thead><tr><th>Layer</th><th>Chain</th><th>Function</th></tr></thead>
                <tbody>
                  <tr><td>Environmental data archival</td><td>Cardano</td><td>SaveCard custody (CIP-68), 60-second Merkle anchoring, geographic consensus attestation. Deterministic finality at predictable cost. Live since June 2024.</td></tr>
                  <tr><td>MLMA token issuance</td><td>Base</td><td>ERC-20 MLMA, KPI-gated minting policy, burn mechanism, vesting validators.</td></tr>
                  <tr><td>Token liquidity</td><td>Base</td><td>Uniswap V3, Aerodrome, eventual CEX listings.</td></tr>
                  <tr><td>veMLMA staking</td><td>Base</td><td>Time-locked staking, vote weight, revenue distribution.</td></tr>
                  <tr><td>PONO credential</td><td>Base</td><td>Soulbound (non-transferable) ERC-721.</td></tr>
                  <tr><td>Cross-chain bridging</td><td>None at TGE</td><td>Optional Phase 2 if a credible bridge architecture matures.</td></tr>
                </tbody>
              </table>
              <p>Cardano is selected for archival data because of deterministic finality, predictable fees, and the existing Genesis 300 Node #1 track record (continuous operation since June 2024 with 2,786+ SaveCards anchored to Cardano preprod). Base is selected for the token because of EVM-native liquidity depth, mature audit ecosystem for Solidity contracts, and broader institutional access. <strong>Both chains are selected for the function they perform best.</strong></p>
            </div>
          </section>

          {/* §5 */}
          <section className="clause" id="s5">
            <div className="clause-head">
              <span className="num">§ 05</span>
              <h2>Supply allocation</h2>
              <a className="anchor" href="#s5">#s5</a>
            </div>
            <div className="clause-body">
              <table className="matrix">
                <thead><tr><th>Pool</th><th className="num">Allocation</th><th className="num">Tokens</th><th>Notes</th></tr></thead>
                <tbody>
                  <tr><td>Investors</td><td className="num">30.0%</td><td className="num">150,000,000</td><td>Seed SAFE plus token side letter. 12-month cliff, 48-month S-curve vesting.</td></tr>
                  <tr><td>Insiders (Team &amp; Advisors)</td><td className="num">20.0%</td><td className="num">100,000,000</td><td>12-month cliff, 48-month S-curve vesting.</td></tr>
                  <tr><td>Foundation / Treasury</td><td className="num">15.0%</td><td className="num">75,000,000</td><td>LP deployment (45M) plus operating reserve (30M). Replenished by 20% of protocol revenue, rising to 65% post-burn-floor.</td></tr>
                  <tr><td>Community</td><td className="num">35.0%</td><td className="num">175,000,000</td><td>Sub-itemized below.</td></tr>
                  <tr><td>Public Sale</td><td className="num">0%</td><td className="num">0</td><td>None planned at TGE. Regulatory-conservative posture.</td></tr>
                  <tr className="total"><td><strong>Total</strong></td><td className="num"><strong>100%</strong></td><td className="num"><strong>500,000,000</strong></td><td>Hard cap, immutable.</td></tr>
                </tbody>
              </table>

              <h3>Community sub-allocation</h3>
              <table className="matrix">
                <thead><tr><th>Component</th><th className="num">% of supply</th><th className="num">Tokens</th><th>Function</th></tr></thead>
                <tbody>
                  <tr><td>Genesis 200 operator allocation</td><td className="num">5.0%</td><td className="num">25,000,000</td><td>200 hex zones × 125,000 MLMA each, milestone-vested</td></tr>
                  <tr><td>Stewardship Pool</td><td className="num">1.75%</td><td className="num">8,750,000</td><td>Indigenous and Native community-led deployments, FPIC-gated</td></tr>
                  <tr><td>Network emissions (Years 1 to 8)</td><td className="num">12.0%</td><td className="num">60,000,000</td><td>KPI-scaled validator distributions across the 8-year window</td></tr>
                  <tr><td>Post-emission governance reserve</td><td className="num">16.25%</td><td className="num">81,250,000</td><td>Unreleased after Year 8. Governance-directed (PONO supermajority).</td></tr>
                  <tr className="total"><td><strong>Community total</strong></td><td className="num"><strong>35.0%</strong></td><td className="num"><strong>175,000,000</strong></td><td></td></tr>
                </tbody>
              </table>
              <p>The <strong>post-emission governance reserve</strong> is not committed to emissions and cannot be released as automatic validator distributions. It is governance-controlled and subject to PONO supermajority voting.</p>
            </div>
          </section>

          {/* §6 */}
          <section className="clause" id="s6">
            <div className="clause-head">
              <span className="num">§ 06</span>
              <h2>Emission schedule · 8-year smooth taper</h2>
              <a className="anchor" href="#s6">#s6</a>
            </div>
            <div className="clause-body">
              <p>Cold-start emissions for eight years with smooth taper. <strong>Zero emissions from Year 9</strong>, with all distributions funded by protocol revenue.</p>

              <h3>Annual ceilings</h3>
              <table className="matrix">
                <thead><tr><th>Year</th><th className="num">Ceiling</th><th className="num">Monthly ceiling</th><th className="num">% of supply</th></tr></thead>
                <tbody>
                  <tr><td>1</td><td className="num">12.0M MLMA</td><td className="num">1.000M / mo</td><td className="num">2.4%</td></tr>
                  <tr><td>2</td><td className="num">14.0M MLMA</td><td className="num">1.167M / mo</td><td className="num">2.8%</td></tr>
                  <tr><td>3</td><td className="num">12.0M MLMA</td><td className="num">1.000M / mo</td><td className="num">2.4%</td></tr>
                  <tr><td>4</td><td className="num">9.0M MLMA</td><td className="num">0.750M / mo</td><td className="num">1.8%</td></tr>
                  <tr><td>5</td><td className="num">6.0M MLMA</td><td className="num">0.500M / mo</td><td className="num">1.2%</td></tr>
                  <tr><td>6</td><td className="num">4.0M MLMA</td><td className="num">0.333M / mo</td><td className="num">0.8%</td></tr>
                  <tr><td>7</td><td className="num">2.0M MLMA</td><td className="num">0.167M / mo</td><td className="num">0.4%</td></tr>
                  <tr><td>8</td><td className="num">1.0M MLMA</td><td className="num">0.083M / mo</td><td className="num">0.2%</td></tr>
                  <tr><td>9+</td><td className="num">0</td><td className="num">0</td><td className="num">0%</td></tr>
                  <tr className="total"><td><strong>Total</strong></td><td className="num"><strong>60.0M MLMA</strong></td><td className="num"></td><td className="num"><strong>12.0%</strong></td></tr>
                </tbody>
              </table>

              <h3>KPI scaling function · smooth</h3>
              <p>Monthly emission release is governed by a continuous scaling function rather than a step gate:</p>
              <pre>{`emission_release_pct = max(0.25, min(1.0, weighted_growth_index / target_growth_index))`}</pre>
              <p>Where <code>weighted_growth_index</code> is the equal-weighted geometric mean of three growth metrics: active validator count (month-over-month), SaveCard count (month-over-month), and veMLMA TVL (month-over-month).</p>

              <p><strong>Target month-over-month growth (composite):</strong></p>
              <table className="matrix">
                <thead><tr><th>Period</th><th>Target growth</th></tr></thead>
                <tbody>
                  <tr><td>Year 1</td><td>5%</td></tr>
                  <tr><td>Year 2</td><td>4%</td></tr>
                  <tr><td>Year 3</td><td>3%</td></tr>
                  <tr><td>Year 4</td><td>2.5%</td></tr>
                  <tr><td>Year 5</td><td>2%</td></tr>
                  <tr><td>Years 6 to 8</td><td>1.5%</td></tr>
                </tbody>
              </table>
              <p>This produces a <strong>25% release minimum</strong> (floor, even in zero-growth conditions), a <strong>100% release maximum</strong> (ceiling, when growth meets target), and linear interpolation between. The floor and ceiling eliminate the threshold-edge gaming incentive present in step-function gates.</p>

              <h3>Anti-gaming provisions</h3>
              <ul>
                <li><strong>Sybil validator inflation</strong> — validator count metric weighted by hardware-attested signing activity in the preceding 30 days. Newly registered validators that have not produced signed readings do not increment the metric. KYB requirement prevents trivial sybil multiplication.</li>
                <li><strong>SaveCard frequency inflation</strong> — SaveCard count metric normalized by hardware unit count and capped at the per-sensor reading rate specified in the Genesis hardware specification.</li>
                <li><strong>veMLMA TVL inflation through wash-locking</strong> — veMLMA TVL metric weighted by lock duration. Short-tier locks (3-month) contribute 0.25× to the metric; 24-month locks contribute 2.0×.</li>
              </ul>
              <p>Unused ceiling tokens roll into the post-emission governance reserve, subject to PONO supermajority for any future deployment and bound by the 500M hard cap.</p>

              <h3>Expected realization · plan to P50, not ceiling</h3>
              <div className="callout warn">
                <span className="tag">▲ Operator economics</span>
                <p>Operator economics should be planned against probable realization, not against ceiling. The table below shows P50 expected, P25 conservative, and P10 stress scenarios.</p>
              </div>
              <table className="matrix">
                <thead><tr><th>Period</th><th className="num">Ceiling</th><th className="num">P50 expected</th><th className="num">P25 conservative</th><th className="num">P10 stress</th></tr></thead>
                <tbody>
                  <tr><td>Year 1</td><td className="num">12.0M</td><td className="num"><span className="accent">9.0M (75%)</span></td><td className="num">7.2M (60%)</td><td className="num">5.4M (45%)</td></tr>
                  <tr><td>Year 2</td><td className="num">14.0M</td><td className="num"><span className="accent">11.2M (80%)</span></td><td className="num">9.1M (65%)</td><td className="num">7.0M (50%)</td></tr>
                  <tr><td>Year 3</td><td className="num">12.0M</td><td className="num"><span className="accent">9.6M (80%)</span></td><td className="num">7.8M (65%)</td><td className="num">6.0M (50%)</td></tr>
                  <tr><td>Year 4</td><td className="num">9.0M</td><td className="num"><span className="accent">7.2M (80%)</span></td><td className="num">5.85M (65%)</td><td className="num">4.5M (50%)</td></tr>
                  <tr><td>Years 5 – 8 cum.</td><td className="num">13.0M</td><td className="num"><span className="accent">10.4M (80%)</span></td><td className="num">8.45M (65%)</td><td className="num">6.5M (50%)</td></tr>
                  <tr className="total"><td><strong>Total expected</strong></td><td className="num"><strong>60.0M</strong></td><td className="num"><strong>47.4M (P50)</strong></td><td className="num"><strong>38.4M (P25)</strong></td><td className="num"><strong>29.4M (P10)</strong></td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* §7 */}
          <section className="clause" id="s7">
            <div className="clause-head">
              <span className="num">§ 07</span>
              <h2>Revenue distribution</h2>
              <a className="anchor" href="#s7">#s7</a>
            </div>
            <div className="clause-body">
              <p>Protocol revenue is distributed across four sinks. After the <strong>250M circulating-supply burn floor</strong> is reached, the burn allocation redirects to the Foundation operating reserve.</p>

              <h3>Pre-floor distribution · until 250M circulating</h3>
              <table className="matrix">
                <thead><tr><th>Sink</th><th className="num">Share</th><th>Mechanism</th></tr></thead>
                <tbody>
                  <tr><td>Burn</td><td className="num"><span className="warn-c">45%</span></td><td>Permanent removal via transfer to null address</td></tr>
                  <tr><td>Operator distribution</td><td className="num">20%</td><td>Distributed monthly, weighted by data volume, uptime, geographic multiplier</td></tr>
                  <tr><td>veMLMA staker distribution</td><td className="num">15%</td><td>Distributed monthly, weighted by lock duration and PONO eligibility</td></tr>
                  <tr><td>Foundation operating reserve</td><td className="num">20%</td><td>Treasury inflow, governance-bound spending</td></tr>
                </tbody>
              </table>

              <h3>Post-floor distribution · after 250M reached</h3>
              <table className="matrix">
                <thead><tr><th>Sink</th><th className="num">Share</th><th>Mechanism</th></tr></thead>
                <tbody>
                  <tr><td>Burn</td><td className="num">0%</td><td>Burns cease; floor permanent</td></tr>
                  <tr><td>Operator distribution</td><td className="num">20%</td><td>Unchanged</td></tr>
                  <tr><td>veMLMA staker distribution</td><td className="num">15%</td><td>Unchanged</td></tr>
                  <tr><td>Foundation operating reserve</td><td className="num"><span className="accent">65%</span></td><td>Receives the 45% redirected from burn</td></tr>
                </tbody>
              </table>

              <pre>{`Monthly_Burn (pre-floor)    = (Protocol_Revenue × 0.45) / MLMA_Spot_Price
Monthly_Distributed         = Protocol_Revenue × 0.35
  → 20% of total revenue → Operators (prorated by validation score)
  → 15% of total revenue → veMLMA Stakers (prorated by lock duration)
Foundation_Inflow (pre-floor)  = Protocol_Revenue × 0.20
Foundation_Inflow (post-floor) = Protocol_Revenue × 0.65`}</pre>

              <p>Burned tokens are sent to a null address on Base and cannot be recovered. Each burn transaction records date, block height, amount, MLMA spot price at execution, source revenue feed, and transaction hash.</p>
            </div>
          </section>

          {/* §8 */}
          <section className="clause" id="s8">
            <div className="clause-head">
              <span className="num">§ 08</span>
              <h2>veMLMA governance</h2>
              <a className="anchor" href="#s8">#s8</a>
            </div>
            <div className="clause-body">
              <h3>Lock tiers</h3>
              <table className="matrix">
                <thead><tr><th>Lock duration</th><th className="num">Vote weight</th><th className="num">Distribution multiplier</th></tr></thead>
                <tbody>
                  <tr><td>3 months</td><td className="num">0.25×</td><td className="num">0.5×</td></tr>
                  <tr><td>6 months</td><td className="num">0.5×</td><td className="num">1.0×</td></tr>
                  <tr><td>12 months</td><td className="num">1.0×</td><td className="num">2.0×</td></tr>
                  <tr><td>24 months</td><td className="num"><span className="accent">2.0×</span></td><td className="num"><span className="accent">3.0×</span></td></tr>
                </tbody>
              </table>
              <p>Maximum lock duration is 24 months. Lock is non-transferable. Tokens are returned at expiry.</p>

              <h3>PONO credential</h3>
              <p>PONO is a <strong>non-transferable on-chain credential</strong> (soulbound ERC-721 on Base) issued automatically to operators meeting specific KYB, uptime, and operational criteria. Holding veMLMA alone is not sufficient to participate in governance.</p>
              <p>Full PONO eligibility criteria are documented in the <Link href="/docs/operators#pono" style={{ color: 'var(--mlma-accent)' }}>Operator Guide</Link>. Summary:</p>
              <ul>
                <li>KYB verification with UBO disclosure (above 25% threshold) and sanctions screening.</li>
                <li>Active hardware with 99.0%+ uptime, 1,000+ signed readings per 30-day window, 95%+ Merkle anchor participation, 100% geographic coherence.</li>
                <li>90-day qualifying period of continuous operation post-deployment.</li>
                <li>Annual KYB renewal with material-change reporting.</li>
              </ul>

              <h3>10% UBO governance cap</h3>
              <div className="callout accent">
                <span className="tag">● Anti-capture · UBO ceiling</span>
                <p>No single beneficial owner controls more than <strong>10% of PONO-weighted vote</strong> on any individual proposal. Coordinated entities (common control, proxy arrangements) are aggregated for the purpose of the cap. Vote weight above the 10% cap is forfeited for that proposal.</p>
                <p>The cap prevents M&amp;A capture of governance: an acquirer cannot consolidate operators to translate economic concentration into governance dominance. The cap depends on accurate UBO and proxy disclosure; non-disclosure is grounds for PONO revocation.</p>
              </div>

              <h3>Governance thresholds</h3>
              <table className="matrix">
                <thead><tr><th>Decision type</th><th className="num">Threshold</th><th className="num">Timelock</th></tr></thead>
                <tbody>
                  <tr><td>Methodology / validator parameter changes</td><td className="num">&gt; 50%</td><td className="num">7 days</td></tr>
                  <tr><td>Fee schedule adjustments</td><td className="num">&gt; 66%</td><td className="num">14 days</td></tr>
                  <tr><td>Critical economics / treasury actions</td><td className="num">&gt; 66%</td><td className="num">14 days</td></tr>
                  <tr><td>Emergency protocol pause</td><td className="num">Foundation multisig 3-of-5</td><td className="num">0 days</td></tr>
                  <tr><td>Hard cap modifications</td><td className="num"><span className="warn-c">NOT MODIFIABLE</span></td><td className="num">N/A</td></tr>
                  <tr><td>Burn rate / burn floor</td><td className="num">&gt; 75%</td><td className="num">30 days</td></tr>
                  <tr><td>Revenue distribution percentages</td><td className="num">&gt; 75%</td><td className="num">30 days</td></tr>
                  <tr><td>UBO cap modifications</td><td className="num">&gt; 66%</td><td className="num">14 days</td></tr>
                  <tr><td>PONO revocation</td><td className="num">&gt; 66%</td><td className="num">14 days</td></tr>
                  <tr><td>Stewardship Pool regional activation</td><td className="num">&gt; 66% + cultural advisor sign-off</td><td className="num">14 days</td></tr>
                  <tr><td>Post-emission reserve deployment</td><td className="num">&gt; 66%</td><td className="num">14 days</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* §9 */}
          <section className="clause" id="s9">
            <div className="clause-head">
              <span className="num">§ 09</span>
              <h2>Stewardship Pool</h2>
              <a className="anchor" href="#s9">#s9</a>
            </div>
            <div className="clause-body">
              <p>8.75M MLMA (1.75% of supply) allocated from the Community pool for operator deployments on Indigenous lands or in partnership with Native communities.</p>
              <table className="matrix">
                <thead><tr><th>Parameter</th><th>Specification</th></tr></thead>
                <tbody>
                  <tr><td>Pool size</td><td><strong>8.75M MLMA</strong></td></tr>
                  <tr><td>Disbursement</td><td>Over 5 years pari passu with general emissions, KPI-scaled identically</td></tr>
                  <tr><td>Eligibility</td><td>Operators on Indigenous lands or in partnership with Native communities</td></tr>
                  <tr><td>Multiplier</td><td><strong>1.5× stewardship multiplier</strong> on validation distributions for qualifying operators</td></tr>
                  <tr><td>Governance</td><td>Cannot be redirected to non-stewardship use by any governance mechanism</td></tr>
                  <tr><td>Regional activation</td><td>Requires Free, Prior, and Informed Consent (FPIC) consultation, cultural advisor sign-off, governance supermajority</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* §10 */}
          <section className="clause" id="s10">
            <div className="clause-head">
              <span className="num">§ 10</span>
              <h2>Revenue sustainability</h2>
              <a className="anchor" href="#s10">#s10</a>
            </div>
            <div className="clause-body">
              <p>From Year 9 onward, all operator distributions come from protocol revenue. Six commercial verticals contribute, all running on the same shared hardware trust stack:</p>
              <ul>
                <li>Carbon verification fees (per-SaveCard validation on credit issuance).</li>
                <li>Energy market data subscriptions (MRAA-01 telemetry licensing).</li>
                <li>Parametric insurance data fees (per-policy and per-settlement).</li>
                <li>LCO₂ settlement fees (0.5 to 2% on LCO₂ → VCO₂ conversions).</li>
                <li>Prediction market data licensing (resolution fees).</li>
                <li>MRAA-01 SaaS subscriptions ($200 / rack / yr).</li>
              </ul>
              <div className="callout accent">
                <span className="tag">● Modeled revenue</span>
                <p>Year 5 modeled revenue: <strong>$34.44M</strong>. Year 8 modeled revenue: <strong>$72M</strong>. Operators pay SaaS fees to the network independent of MLMA price. <strong>This is the structural departure from inflation-dependent DePIN models.</strong></p>
              </div>
            </div>
          </section>

          {/* §11 */}
          <section className="clause" id="s11">
            <div className="clause-head">
              <span className="num">§ 11</span>
              <h2>Risk factors</h2>
              <a className="anchor" href="#s11">#s11</a>
            </div>
            <div className="clause-body">
              <h3>Token price risk</h3>
              <p>MLMA price may decline due to weak demand, slower-than-forecast network deployment, broader crypto market conditions, or competition. The emission schedule and hard cap are immutable. The protocol cannot issue additional tokens to defend price.</p>

              <h3>Validator participation risk</h3>
              <p>Operators may not deploy hardware if anticipated distributions appear insufficient. Mitigation: Genesis 1.5× multiplier for early movers, geographic tiers for high-value zones, low hardware cost, 8-year emission tail.</p>

              <h3>Year 1 to Year 3 revenue ramp risk</h3>
              <p>Years 1 to 3 are emission-dependent (90%, 75%, 55% emissions-share of operator earnings respectively). If protocol revenue underperforms, the 8-year smooth taper provides longer runway than a cliff schedule, but operator economics depend on the revenue transition completing by Year 4 to 5.</p>

              <h3>KPI scaling underperformance</h3>
              <p>If the composite growth index sits at the 25% floor for sustained periods, monthly emission release is reduced and per-validator distributions compress.</p>

              <h3>Smart contract risk</h3>
              <p>Solidity contracts on Base and Aiken contracts on Cardano are pending audit. Foundation multisig provides emergency pause; audit completion is required before mainnet migration.</p>

              <h3>Supply chain risk</h3>
              <p>ATECC608B is the primary secure element. Multi-vendor alternatives (NXP SE050, Infineon OPTIGA Trust M, STMicroelectronics STSAFE-A110, Analog Devices DS28E38) are qualified at the protocol level. The whitelist is governance-managed.</p>
            </div>
          </section>

          {/* §12 */}
          <section className="clause" id="s12" style={{ borderBottom: 'none' }}>
            <div className="clause-head">
              <span className="num">§ 12</span>
              <h2>Disclaimers</h2>
              <a className="anchor" href="#s12">#s12</a>
            </div>
            <div className="clause-body">
              <div className="callout warn">
                <span className="tag">▲ Not legal, investment, or tax advice</span>
                <p>This page summarizes the MLMA Tokenomics Whitepaper. MLMA is designed as a utility token. Regulatory classification depends on facts and circumstances and varies by jurisdiction.</p>
                <p>Mālama Labs is engaged with qualified securities counsel on regulatory analysis. <strong>No public token offering will proceed in the US until that analysis is complete.</strong> This page does not constitute legal, investment, or tax advice. Consult qualified counsel before participating.</p>
              </div>
              <p>Mālama does not publish MLMA price forecasts or projected operator distributions. Token value is driven by protocol utility and market conditions and may go up or down. Participants should not acquire MLMA with the expectation of profit.</p>

              <div className="sig-strip">
                <div className="label">— END OF PAGE</div>
                <p className="text">Mālama Labs, Inc. · MLMA Tokenomics · Aligned to Whitepaper v3.6 · May 2026</p>
                <p className="footnote">
                  Next: <Link href="/docs/pricing-roi" style={{ color: 'var(--mlma-accent)' }}>Pricing &amp; Dynamics →</Link>
                </p>
              </div>
            </div>
          </section>
        </article>
      </main>
    </DocsPageShell>
  )
}
