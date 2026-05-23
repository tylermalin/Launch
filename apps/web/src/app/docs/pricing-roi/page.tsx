import type { Metadata } from 'next'
import Link from 'next/link'
import '../docs-hub.css'
import DocsPageShell from '../_shared/DocsPageShell'

export const metadata: Metadata = {
  title: 'Pricing & Dynamics · Mālama Labs',
  description:
    'Genesis 200 pricing. $2,000 entry, 125,000 MLMA milestone-conditional vesting, validation distribution formula, hex demand tiers, two economic phases. Aligned to Tokenomics Whitepaper v3.6.',
}

export default function PricingRoiPage() {
  return (
    <DocsPageShell
      current="pricing-roi"
      docNumber="DOCS · 02"
      eyebrowText="Genesis 200 · Pricing and dynamics"
      titleLead="Pricing &"
      titleEmphasis="Dynamics."
      lede="Upfront cost, what you receive for it, and the mechanics that govern how validation distributions are calculated. Genesis 200 uses milestone-conditional vesting. 15% at boot, the remaining 85% earned across the first 12 months of operation."
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
            <span className="count">10 sections</span>
          </div>
          <ol>
            {[
              ['s1', '01', 'Capital requirement'],
              ['s2', '02', 'MLMA allocation'],
              ['s3', '03', 'Validation distribution formula'],
              ['s4', '04', 'Hex demand tiers'],
              ['s5', '05', 'Illustrative distributions'],
              ['s6', '06', 'Emission pool trajectory'],
              ['s7', '07', 'Two economic phases'],
              ['s8', '08', 'Hardware payback reference'],
              ['s9', '09', 'Historical comparable'],
              ['s10', '10', 'Disclaimers & no guarantees'],
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
              <p>Hardware ships by <strong>end of December 2026</strong>. Geographic license is minted at reservation. Reservation closes when all 195 external nodes are sold. Five nodes are reserved for Mālama Labs team and production use (Dallas / DFW area).</p>
            </div>
          </section>

          <section className="clause" id="s2">
            <div className="clause-head"><span className="num">§ 02</span><h2>MLMA allocation</h2><a className="anchor" href="#s2">#s2</a></div>
            <div className="clause-body">
              <p>Every Genesis 200 operator receives <strong>125,000 MLMA</strong>, vested across operational milestones. This is a <strong>service-conditional grant</strong>, not a token sale. Failure to meet a milestone forfeits that tranche and subsequent tranches to the post-emission governance reserve.</p>

              <div className="spec-list">
                <div className="row"><div className="k">Total per operator</div><div className="v"><strong>125,000 MLMA</strong></div></div>
                <div className="row"><div className="k">Share of supply</div><div className="v">0.025% per operator · 5% across all 200 nodes</div></div>
                <div className="row"><div className="k">Vesting structure</div><div className="v">Milestone-conditional</div></div>
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
                <p>Operators failing a milestone <strong>forfeit that tranche and subsequent tranches.</strong> Forfeited tokens roll into the post-emission governance reserve. Operators reentering compliance after a missed milestone may petition the DAO for a partial-restoration vote (&gt;50% threshold), at the DAO&rsquo;s discretion.</p>
              </div>

              <p>The milestone-conditional structure aligns operator compensation with <strong>substantial ongoing service</strong>: deployment effort plus 12 months of sustained operation. The boot tranche acknowledges deployment work. The 85% conditional vesting requires continued performance.</p>
            </div>
          </section>

          <section className="clause" id="s3">
            <div className="clause-head"><span className="num">§ 03</span><h2>Validation distribution formula</h2><a className="anchor" href="#s3">#s3</a></div>
            <div className="clause-body">
              <pre>{`Monthly_Validator_Distribution =
  (Monthly_Emission_Pool / Total_Active_Validators)
  × Geographic_Multiplier      [0.5× urban → 3.0× strategic]
  × Uptime_Multiplier          [1.0× baseline → 1.5× at 99.9%+]
  × Genesis_Multiplier         [1.5× Year 1 only for Genesis 200]
  × Stewardship_Multiplier     [1.5× for qualifying community-stewardship hexes]`}</pre>
              <p>Year 1 monthly emission pool (P50 expected realization): <strong>9.0M / 12 = 750K MLMA/month.</strong> Assumed validator count Year 1: <strong>350</strong> (200 Genesis + 150 community).</p>
              <p>Distributions are <strong>competitive and relative</strong>, not fixed. Each operator&rsquo;s monthly distribution is a function of their multiplier stack and the active validator set size. As the network grows, individual distribution weight adjusts proportionally.</p>
            </div>
          </section>

          <section className="clause" id="s4">
            <div className="clause-head"><span className="num">§ 04</span><h2>Hex demand tiers</h2><a className="anchor" href="#s4">#s4</a></div>
            <div className="clause-body">
              <p>The Geographic Multiplier reflects data scarcity value and enterprise demand coverage of your hex. Classification follows climate data value and enterprise sensor deployment density, <strong>not population density</strong>. Parameters are governance-voted (veMLMA).</p>
              <table className="matrix">
                <thead><tr><th>Tier</th><th className="num">Geographic Multiplier</th><th>Profile</th></tr></thead>
                <tbody>
                  <tr><td>Urban</td><td className="num">0.5×</td><td>Dense deployment, lower data scarcity premium</td></tr>
                  <tr><td>Suburban</td><td className="num">1.0×</td><td>Mid-density, baseline validation weight</td></tr>
                  <tr><td>Rural</td><td className="num">1.5×</td><td>Agricultural, scientific interest zones</td></tr>
                  <tr><td>Frontier</td><td className="num">2.0×</td><td>Underserved regions, high scientific value</td></tr>
                  <tr><td>Strategic</td><td className="num"><span className="accent">3.0×</span></td><td>Industrial corridors, AI data centers, coastal wetlands, flood-prone agricultural zones, regulatory-priority areas</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="clause" id="s5">
            <div className="clause-head"><span className="num">§ 05</span><h2>Illustrative monthly validation distributions</h2><a className="anchor" href="#s5">#s5</a></div>
            <div className="clause-body">
              <p>Year 1, P50 realization, 350 validators, 750K MLMA monthly emission pool.</p>
              <table className="matrix">
                <thead><tr><th>Hex type</th><th className="num">Geo mult</th><th className="num">Base monthly</th><th className="num">+ Genesis 1.5×</th><th className="num">+ Uptime 1.5×</th><th className="num">+ Stewardship</th></tr></thead>
                <tbody>
                  <tr><td>Urban</td><td className="num">0.5×</td><td className="num">~1,071</td><td className="num">1,607</td><td className="num">2,411</td><td className="num">3,616</td></tr>
                  <tr><td>Suburban</td><td className="num">1.0×</td><td className="num">~2,143</td><td className="num">3,214</td><td className="num">4,821</td><td className="num">7,232</td></tr>
                  <tr><td>Rural</td><td className="num">1.5×</td><td className="num">~3,214</td><td className="num">4,821</td><td className="num">7,232</td><td className="num">10,848</td></tr>
                  <tr><td>Frontier</td><td className="num">2.0×</td><td className="num">~4,286</td><td className="num">6,429</td><td className="num">9,643</td><td className="num">14,464</td></tr>
                  <tr><td>Strategic</td><td className="num">3.0×</td><td className="num">~6,429</td><td className="num">9,643</td><td className="num">14,464</td><td className="num"><span className="accent">21,697</span></td></tr>
                </tbody>
              </table>
              <p style={{ fontSize: 14, color: 'var(--mlma-ink-faint)' }}>All figures in MLMA per month. <strong>Conservative case</strong> (P25, 60% of ceiling): multiply by 0.80. <strong>Stress case</strong> (P10, 45% of ceiling): multiply by 0.60.</p>
            </div>
          </section>

          <section className="clause" id="s6">
            <div className="clause-head"><span className="num">§ 06</span><h2>Emission pool trajectory</h2><a className="anchor" href="#s6">#s6</a></div>
            <div className="clause-body">
              <table className="matrix">
                <thead><tr><th>Year</th><th className="num">Monthly pool (P50)</th><th>Genesis multiplier</th><th className="num">Approx. validator count</th></tr></thead>
                <tbody>
                  <tr><td>1</td><td className="num">750K MLMA</td><td><span className="accent">1.5× active</span></td><td className="num">350</td></tr>
                  <tr><td>2</td><td className="num">933K MLMA</td><td>Expired</td><td className="num">500 to 800</td></tr>
                  <tr><td>3</td><td className="num">800K MLMA</td><td>Expired</td><td className="num">800 to 1,200</td></tr>
                  <tr><td>4</td><td className="num">600K MLMA</td><td>Expired</td><td className="num">1,000 to 1,500</td></tr>
                  <tr><td>5</td><td className="num">400K MLMA</td><td>Expired</td><td className="num">1,200 to 1,800</td></tr>
                  <tr><td>6-8</td><td className="num">Taper to ~67K</td><td>Expired</td><td className="num">1,500 to 2,500</td></tr>
                  <tr><td>9+</td><td className="num"><span className="warn-c">0 · revenue-funded</span></td><td>Expired</td><td className="num">Steady state</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="clause" id="s7">
            <div className="clause-head"><span className="num">§ 07</span><h2>Two economic phases</h2><a className="anchor" href="#s7">#s7</a></div>
            <div className="clause-body">
              <table className="matrix">
                <thead><tr><th>Phase</th><th>Period</th><th>Distribution source</th><th>Notes</th></tr></thead>
                <tbody>
                  <tr><td>Emission-dependent</td><td>Years 1-3</td><td>Predominantly emission pool</td><td>Year 1: 90% emissions / 10% revenue. Year 3: 55% / 45%.</td></tr>
                  <tr><td>Transitioning</td><td>Years 4-5</td><td>Revenue-majority</td><td>Year 4: 35% emissions / 65% revenue. Year 5: 15% / 85%.</td></tr>
                  <tr><td>Revenue-funded</td><td>Years 6-8</td><td>Predominantly revenue</td><td>Emissions taper to zero.</td></tr>
                  <tr><td>Permanent steady state</td><td>Years 9+</td><td><span className="accent">100% revenue</span></td><td>20% of protocol revenue distributed monthly to operators.</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="clause" id="s8">
            <div className="clause-head"><span className="num">§ 08</span><h2>Hardware payback reference</h2><a className="anchor" href="#s8">#s8</a></div>
            <div className="clause-body">
              <p>Hardware cost: <strong>$380</strong>. Full bundle: <strong>$2,000</strong>. P50 suburban hex with full multipliers (4,821 MLMA/month):</p>
              <table className="matrix">
                <thead><tr><th>Token price</th><th className="num">Monthly USD</th><th className="num">Hardware ($380)</th><th className="num">Full bundle ($2,000)</th></tr></thead>
                <tbody>
                  <tr><td>$0.05</td><td className="num">$241</td><td className="num">1.6 months</td><td className="num">8.3 months</td></tr>
                  <tr><td>$0.10</td><td className="num">$482</td><td className="num">0.8 months</td><td className="num">4.1 months</td></tr>
                  <tr><td>$0.15</td><td className="num">$723</td><td className="num">0.5 months</td><td className="num">2.8 months</td></tr>
                  <tr><td>$0.20</td><td className="num">$964</td><td className="num">0.4 months</td><td className="num">2.1 months</td></tr>
                </tbody>
              </table>
              <p>These figures <strong>exclude the milestone-vested token allocation</strong>. At P10 stress realization (45% of ceiling), full bundle payback at $0.05/MLMA extends to roughly 14 months. <strong>Operators should plan for the downside.</strong></p>
            </div>
          </section>

          <section className="clause" id="s9">
            <div className="clause-head"><span className="num">§ 09</span><h2>Historical comparable</h2><a className="anchor" href="#s9">#s9</a></div>
            <div className="clause-body">
              <p>The closest public DePIN comparable is <strong>WeatherXM</strong>, whose 5,000+ stations report actual monthly token distributions that vary widely by location demand, data quality, and token market price. Published station economics show the range between low-demand and high-demand locations can <strong>differ by 10× or more</strong>. This illustrates why per-node projections without zone-specific demand data are not meaningful.</p>
              <p>Mālama economics will differ based on chain architecture, demand profile, Geographic Multiplier tier, uptime performance, Genesis phase status, and network rollout pace. The WeatherXM reference is a publicly verifiable example of how DePIN node economics work in practice, <strong>not a projection of Mālama outcomes</strong>.</p>
            </div>
          </section>

          <section className="clause" id="s10" style={{ borderBottom: 'none' }}>
            <div className="clause-head"><span className="num">§ 10</span><h2>Disclaimers and no guarantees</h2><a className="anchor" href="#s10">#s10</a></div>
            <div className="clause-body">
              <p>Operating a Genesis 200 Hex Node requires labor: physical installation, network setup, ongoing uptime maintenance, and active stewardship of validation work. Validation distributions depend on data volume in your zone, uptime, Geographic Multiplier, Genesis phase status, MLMA market price, and network conditions.</p>

              <div className="callout warn">
                <span className="tag">▲ Service-conditional allocation</span>
                <p>The MLMA allocation (125,000 MLMA per operator) is service-conditional. <strong>Only 15% (18,750 MLMA) unlocks at boot.</strong> The remaining 85% requires sustained operational performance across the first 12 months. Failure to meet milestones forfeits the affected and subsequent tranches.</p>
              </div>

              <p>There are no guaranteed distributions. There is no published cost recovery timeline. Participation involves risk including loss of capital. Year 1 distribution levels reflect emission-dependent bootstrapping and are not indicative of steady-state network economics.</p>
              <p>MLMA is a utility token designed for network fee payment, staking, and governance. Regulatory classification varies by jurisdiction. Mālama Labs is engaged with qualified securities counsel on regulatory analysis prior to any public offering. <strong>Participation in Genesis 200 does not constitute an investment in a security.</strong> Consult qualified legal, tax, and financial advisors before reserving.</p>

              <div className="sig-strip">
                <div className="label">- END OF PAGE</div>
                <p className="text">Aligned with the MLMA Tokenomics Whitepaper. Actual distributions follow protocol rules and network conditions.</p>
                <p className="footnote">No figures on this page constitute distribution guidance or forward-looking projections. Next: <Link href="/docs/phase-1-timeline" style={{ color: 'var(--mlma-accent)' }}>Phase 1 Timeline →</Link></p>
              </div>
            </div>
          </section>
        </article>
      </main>
    </DocsPageShell>
  )
}
