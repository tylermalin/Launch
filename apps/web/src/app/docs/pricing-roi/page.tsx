import type { Metadata } from 'next'
import Link from 'next/link'
import '../docs-hub.css'
import DocsPageShell from '../_shared/DocsPageShell'

export const metadata: Metadata = {
  title: 'Pricing & Dynamics · Mālama Labs',
  description:
    'Genesis 200 pricing and dynamics. $2,000 entry, 125,000 MLMA milestone-conditional vesting (15/15/20/20/30), the Genesis Pricing v1.0 reward calculation, and the two economic phases. Aligned to the V1 document set.',
}

export default function PricingRoiPage() {
  return (
    <DocsPageShell
      current="pricing-roi"
      docNumber="DOCS · 02"
      eyebrowText="Genesis 200 · Pricing and dynamics"
      titleLead="Pricing &"
      titleEmphasis="Dynamics."
      lede="Upfront cost, what you receive for it, and the mechanics that govern how rewards are calculated. Genesis 200 uses milestone-conditional vesting. 15% at boot, the remaining 85% earned across the first 12 months of operation. The authoritative reward math is the ratified Genesis Pricing v1.0 methodology."
      metaRows={[
        { k: 'Entry', v: 'US$2,000', accent: true },
        { k: 'Hardware', v: '$380' },
        { k: 'Hex license', v: '$1,620' },
        { k: 'MLMA / operator', v: '125,000' },
        { k: 'Boot tranche', v: '15% · 18,750' },
        { k: 'Vested over', v: '12 months' },
      ]}
    >
      <main className="layout layout--with-toc">
        <aside className="toc" aria-label="Table of contents">
          <div className="toc-label">
            <span>Contents</span>
            <span className="count">6 sections</span>
          </div>
          <ol>
            {[
              ['s1', '01', 'Capital requirement'],
              ['s2', '02', 'MLMA allocation and vesting'],
              ['s3', '03', 'Reward calculation'],
              ['s4', '04', 'Two economic phases'],
              ['s5', '05', 'Historical comparable'],
              ['s6', '06', 'Disclaimers & no guarantees'],
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
            <Link className="btn" href="/docs/tokenomics">
              <span>← Prev · Tokenomics</span>
              <span></span>
            </Link>
            <Link className="btn" href="/docs/phase-1-timeline">
              <span>Next · Timeline</span>
              <span>→</span>
            </Link>
          </div>
        </aside>

        <article className="content">
          <div className="preamble">
            <p>
              The Genesis 200 program bootstraps a globally distributed validation layer for
              real-world data. Early operator incentives are front-loaded with the Year 1
              Genesis multiplier. Long-term operator economics derive from protocol revenue.
            </p>
          </div>

          <section className="clause" id="s1">
            <div className="clause-head"><span className="num">§ 01</span><h2>Capital requirement</h2><a className="anchor" href="#s1">#s1</a></div>
            <div className="clause-body">
              <p><strong>Total entry: $2,000 per Hex Node license.</strong> One-time. Not recurring.</p>
              <table className="matrix">
                <thead><tr><th>Component</th><th className="num">Amount</th><th>What it covers</th></tr></thead>
                <tbody>
                  <tr><td>Hardware</td><td className="num"><strong>$380</strong></td><td>Raspberry Pi Zero 2W, ATECC608B-class secure element, RS485 7-in-1 soil probe, BME280 atmospheric sensor, NEMA 4X IP67 enclosure, Waveshare SIM7600G LTE HAT, solar panel, UPS battery.</td></tr>
                  <tr><td>Geographic license</td><td className="num"><strong>$1,620</strong></td><td>Non-exclusive operating rights for a specific H3 hex cell on the Mālama network. NFT-HEX minted on Cardano and Base at reservation.</td></tr>
                </tbody>
              </table>
              <p>Hardware ships by <strong>end of December 2026</strong>. Geographic license is minted at reservation. Genesis 200 is <strong>195 external nodes plus 5 reserved</strong> for Mālama Labs team and production use (Dallas / DFW area); reservation closes when the 195 external nodes are sold, a <strong>$390,000 external raise</strong>.</p>
            </div>
          </section>

          <section className="clause" id="s2">
            <div className="clause-head"><span className="num">§ 02</span><h2>MLMA allocation and vesting</h2><a className="anchor" href="#s2">#s2</a></div>
            <div className="clause-body">
              <p>Every Genesis 200 operator receives <strong>125,000 MLMA</strong>, vested across operational milestones. This is a <strong>service-conditional grant</strong>, not a token sale. Failure to meet a milestone forfeits that tranche and subsequent tranches to the <strong>Genesis Performing Operator Bonus Pool</strong>.</p>

              <div className="spec-list">
                <div className="row"><div className="k">Total per operator</div><div className="v"><strong>125,000 MLMA</strong></div></div>
                <div className="row"><div className="k">Share of supply</div><div className="v">0.025% per operator · 5% across all 200 nodes</div></div>
                <div className="row"><div className="k">Vesting structure</div><div className="v">Milestone-conditional · 15 / 15 / 20 / 20 / 30 over 12 months</div></div>
                <div className="row"><div className="k">Boot tranche</div><div className="v"><strong>15%</strong> (18,750 MLMA)</div></div>
                <div className="row"><div className="k">Milestone tranches</div><div className="v"><strong>85%</strong> (106,250 MLMA) across PONO, 6, 9, 12 months</div></div>
              </div>

              <h3>Milestone-conditional vesting</h3>
              <table className="matrix">
                <thead><tr><th>Milestone</th><th className="num">MLMA</th><th className="num">Cumulative</th><th>Conditions</th></tr></thead>
                <tbody>
                  <tr><td>Boot tranche (registration)</td><td className="num">18,750 (15%)</td><td className="num">15%</td><td>Hardware registered, KYB complete, first signed reading recorded on Cardano</td></tr>
                  <tr><td>90-day PONO qualification</td><td className="num">18,750 (15%)</td><td className="num">30%</td><td>PONO credential issued per <Link href="/docs/operators#pono" style={{ color: 'var(--mlma-accent)' }}>Operator Guide</Link> requirements</td></tr>
                  <tr><td>6-month operational</td><td className="num">25,000 (20%)</td><td className="num">50%</td><td>Continuous PONO eligibility, ≥99% uptime months 4-6, no tamper events, no falsification detected</td></tr>
                  <tr><td>9-month operational</td><td className="num">25,000 (20%)</td><td className="num">70%</td><td>Continuous PONO eligibility, ≥99% uptime months 7-9, no tamper events, no falsification detected</td></tr>
                  <tr><td>12-month operational</td><td className="num"><span className="accent">37,500 (30%)</span></td><td className="num"><span className="accent">100%</span></td><td>Continuous PONO eligibility, ≥99% uptime months 10-12, no tamper events, no falsification detected</td></tr>
                </tbody>
              </table>

              <div className="callout warn">
                <span className="tag">▲ Forfeiture · Missed milestones</span>
                <p>Operators failing a milestone <strong>forfeit that tranche and subsequent tranches.</strong> Forfeited tokens roll into the <strong>Genesis Performing Operator Bonus Pool</strong>. Operators reentering compliance after a missed milestone may petition the DAO for a partial-restoration vote (&gt;50% threshold), at the DAO&rsquo;s discretion.</p>
              </div>

              <p>The milestone-conditional structure aligns operator compensation with <strong>substantial ongoing service</strong>: deployment effort plus 12 months of sustained operation. The boot tranche acknowledges deployment work. The 85% conditional vesting requires continued performance.</p>
            </div>
          </section>

          <section className="clause" id="s3">
            <div className="clause-head"><span className="num">§ 03</span><h2>Reward calculation</h2><a className="anchor" href="#s3">#s3</a></div>
            <div className="clause-body">
              <p>The reward is the ratified <strong>Genesis Pricing v1.0</strong> calculation. A fixed base scaled by three bounded multipliers, then cohort-normalized so the cohort total lands on the 25M Genesis pool. There is no per-node emission-pool draw and no geographic 0.5× to 3.0× multiplier.</p>
              <pre>{`Calculated_Eligibility =
  125,000 base
  × Genesis_Year_1            [1.5×, Year 1 only]
  × Hex_Type                  [0.95× to 1.30×]
  × Data_Demand_Score         [0.70× to 1.30×]

then cohort-normalized to the 25M Genesis operator pool.`}</pre>
              <p>Hex Type and Data Demand Score are bounded, governance-readable inputs. The Data Demand Score is the five-component 0-100 measure recomputed quarterly, defined in <Link href="/docs/data-demand-score-methodology" style={{ color: 'var(--mlma-accent)' }}>Data Demand Score v1.0</Link>. The full worked methodology, cohort normalization, and buyer protections are in <Link href="/docs/pricing" style={{ color: 'var(--mlma-accent)' }}>Genesis Pricing v1.0</Link>; the supply and revenue context is in <Link href="/docs/tokenomics" style={{ color: 'var(--mlma-accent)' }}>Tokenomics v1</Link>.</p>
            </div>
          </section>

          <section className="clause" id="s4">
            <div className="clause-head"><span className="num">§ 04</span><h2>Two economic phases</h2><a className="anchor" href="#s4">#s4</a></div>
            <div className="clause-body">
              <p>Operator distributions begin emission-funded and transition to revenue-funded. Emissions are a <strong>60M, 8-year smooth taper</strong> (12 / 14 / 12 / 9 / 6 / 4 / 2 / 1M), after which operation is revenue-funded. Protocol revenue is split <strong>45 burn / 20 operators / 15 stakers / 20 Foundation</strong> to a 250M circulating burn floor, after which the burn share redirects to the Foundation.</p>
              <table className="matrix">
                <thead><tr><th>Phase</th><th>Period</th><th>Distribution source</th><th>Notes</th></tr></thead>
                <tbody>
                  <tr><td>Emission-dependent</td><td>Years 1-3</td><td>Predominantly emissions</td><td>Front-loaded taper; Year 1 carries the 1.5× Genesis multiplier.</td></tr>
                  <tr><td>Transitioning</td><td>Years 4-5</td><td>Revenue-majority</td><td>Emission taper continues as protocol revenue scales.</td></tr>
                  <tr><td>Revenue-funded</td><td>Years 6-8</td><td>Predominantly revenue</td><td>Emissions taper to the final 1M tranche, then zero.</td></tr>
                  <tr><td>Permanent steady state</td><td>Years 9+</td><td><span className="accent">100% revenue</span></td><td>20% of protocol revenue distributed to operators.</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="clause" id="s5">
            <div className="clause-head"><span className="num">§ 05</span><h2>Historical comparable</h2><a className="anchor" href="#s5">#s5</a></div>
            <div className="clause-body">
              <p>The closest public DePIN comparable is <strong>WeatherXM</strong>, whose 5,000+ stations report actual monthly token distributions that vary widely by location demand, data quality, and token market price. Published station economics show the range between low-demand and high-demand locations can <strong>differ by 10× or more</strong>. This illustrates why per-node projections without zone-specific demand data are not meaningful.</p>
              <p>Mālama economics will differ based on chain architecture, demand profile, Hex Type and Data Demand Score, uptime performance, Genesis phase status, and network rollout pace. The WeatherXM reference is a publicly verifiable example of how DePIN node economics work in practice, <strong>not a projection of Mālama outcomes</strong>.</p>
            </div>
          </section>

          <section className="clause" id="s6" style={{ borderBottom: 'none' }}>
            <div className="clause-head"><span className="num">§ 06</span><h2>Disclaimers and no guarantees</h2><a className="anchor" href="#s6">#s6</a></div>
            <div className="clause-body">
              <p>Operating a Genesis 200 Hex Node requires labor: physical installation, network setup, ongoing uptime maintenance, and active stewardship of validation work. Rewards depend on data volume in your zone, uptime, Hex Type, Data Demand Score, Genesis phase status, and network conditions.</p>

              <div className="callout warn">
                <span className="tag">▲ Service-conditional allocation</span>
                <p>The MLMA allocation (125,000 MLMA per operator) is service-conditional. <strong>Only 15% (18,750 MLMA) unlocks at boot.</strong> The remaining 85% requires sustained operational performance across the first 12 months. Failure to meet milestones forfeits the affected and subsequent tranches to the Genesis Performing Operator Bonus Pool.</p>
              </div>

              <p>There are no guaranteed distributions. There is no published cost-recovery timeline, token-price forecast, or payback projection. Year 1 distribution levels reflect emission-dependent bootstrapping and are not indicative of steady-state network economics.</p>
              <p>MLMA is a digital tool under the SEC-CFTC Joint Interpretation (S7-2026-09), not a security. Regulatory classification varies by jurisdiction and this copy is preliminary, pending qualified securities counsel. <strong>Participation in Genesis 200 does not constitute an investment in a security.</strong> Consult qualified legal, tax, and financial advisors before reserving.</p>

              <div className="sig-strip">
                <div className="label">- END OF PAGE</div>
                <p className="text">Aligned to the V1 document set. Actual distributions follow protocol rules and network conditions.</p>
                <p className="footnote">No figures on this page constitute distribution guidance or forward-looking projections. Next: <Link href="/docs/phase-1-timeline" style={{ color: 'var(--mlma-accent)' }}>Phase 1 Timeline →</Link></p>
              </div>
            </div>
          </section>
        </article>
      </main>
    </DocsPageShell>
  )
}
