'use client'

import { WHITEPAPER_TOC } from './whitepaper-toc'

function TocNav() {
  return (
    <nav className="rounded-2xl border border-gray-800 bg-[#0d1e35]/90 backdrop-blur p-4 xl:sticky xl:top-28">
      <p className="text-xs font-black uppercase tracking-widest text-malama-accent/90 mb-3">On this page</p>
      <ul className="space-y-1.5 text-sm max-h-[70vh] overflow-y-auto pr-1">
        {WHITEPAPER_TOC.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="text-gray-400 hover:text-malama-accent transition-colors block py-0.5 border-l-2 border-transparent hover:border-malama-accent pl-2 -ml-0"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-gray-300 leading-relaxed text-sm md:text-[15px]">{children}</p>
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg font-black text-white mt-8 mb-3">{children}</h3>
}

function Table({
  headers,
  rows,
}: {
  headers: string[]
  rows: (string | number)[][]
}) {
  return (
    <div className="overflow-x-auto my-6 rounded-xl border border-gray-800 shadow-inner">
      <table className="w-full text-sm text-left min-w-[480px]">
        <thead>
          <tr className="bg-[#0A1628] text-gray-400 border-b border-gray-800">
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 font-bold whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-gray-800/80 hover:bg-white/[0.02]">
              {row.map((c, j) => (
                <td key={j} className="px-4 py-2.5 text-gray-300">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="my-4 p-4 rounded-xl bg-black/40 border border-gray-800 text-xs text-malama-accent/90 font-mono overflow-x-auto whitespace-pre-wrap">
      {children}
    </pre>
  )
}

function Callout({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="my-6 rounded-xl border border-malama-accent/25 bg-malama-accent/5 p-4 text-sm">
      {title && <p className="font-bold text-malama-accent mb-2">{title}</p>}
      <div className="text-gray-300 leading-relaxed space-y-2">{children}</div>
    </div>
  )
}

export function WhitepaperProse() {
  return (
    <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_200px] xl:gap-10 xl:items-start">
      <div className="xl:hidden mb-8">
        <TocNav />
      </div>
      <article className="prose-docs min-w-0">
        <section id="executive-summary" className="scroll-mt-28 mb-16">
          <h2 className="text-2xl font-black text-white mb-4 border-b border-gray-800 pb-2">1. Executive Summary</h2>
          <P>
            MLMA is a utility token designed to coordinate a decentralized climate-data network. It serves four primary functions:
            validator rewards; governance via veMLMA; protocol fee payment (MLMA or stablecoin); and incentive alignment through a burn
            mechanism.
          </P>
          <Callout title="Key design principles">
            <ul className="list-disc pl-5 space-y-1 text-gray-300">
              <li>
                <strong className="text-white">500M MLMA</strong> hard cap (no inflation beyond Year 3 emissions schedule)
              </li>
              <li>
                <strong className="text-white">Emissions stop after Year 3</strong> — cold-start only; Years 4–5 are revenue-funded
              </li>
              <li>
                <strong className="text-white">50% burn</strong> of protocol revenue (deflationary pressure)
              </li>
              <li>
                <strong className="text-white">1.5× Genesis multiplier</strong> in Year 1 for early operators (Mālama Genesis)
              </li>
              <li>
                <strong className="text-white">Revenue-first sustainability</strong> — by Year 4, network revenue funds rewards
              </li>
            </ul>
          </Callout>
          <P>
            This design moves away from inflation-dependent DePIN models toward a revenue-funded network where operators earn for real
            validation work.
          </P>
        </section>

        <section id="token-overview" className="scroll-mt-28 mb-16">
          <h2 className="text-2xl font-black text-white mb-4 border-b border-gray-800 pb-2">2. Token Overview</h2>
          <H3>2.1 Name and ticker</H3>
          <ul className="list-disc pl-5 text-gray-300 space-y-1 text-sm md:text-[15px]">
            <li>
              <strong className="text-white">Name:</strong> Mālama — care, protection, sustainability
            </li>
            <li>
              <strong className="text-white">Ticker:</strong> MLMA
            </li>
            <li>
              <strong className="text-white">Precision:</strong> 18 decimals (ERC-20 / Cardano native asset)
            </li>
          </ul>
          <H3>2.2 Primary functions</H3>
          <Table
            headers={['Function', 'Use case', 'Recipient']}
            rows={[
              ['Validator rewards', 'Validating SaveCards & compute packets', 'Operators'],
              ['Governance (veMLMA)', 'Lock MLMA for DAO voting weight', 'MLMA holders'],
              ['Fee payment', 'Protocol fees (optional stablecoin)', 'Treasury'],
              ['Staking rewards', 'Lock MLMA for distribution multipliers', 'veMLMA stakers'],
            ]}
          />
          <H3>2.3 Blockchains</H3>
          <ol className="list-decimal pl-5 text-gray-300 space-y-2 text-sm md:text-[15px]">
            <li>
              <strong className="text-white">Cardano</strong> — archival settlement, SaveCard custody, scientific proof
            </li>
            <li>
              <strong className="text-white">Base</strong> — rewards, claims, governance liquidity
            </li>
            <li>
              <strong className="text-white">Cross-chain</strong> — LayerZero OApp for state sync
            </li>
          </ol>
        </section>

        <section id="supply-framework" className="scroll-mt-28 mb-16">
          <h2 className="text-2xl font-black text-white mb-4 border-b border-gray-800 pb-2">3. Supply Framework</h2>
          <H3>3.1 Total supply cap</H3>
          <P>
            <strong className="text-white">500,000,000 MLMA</strong> — hard cap. No additional issuance beyond 500M via governance;
            emergency mint would require a hard fork and explicit disclosure.
          </P>
          <H3>3.2 Allocation breakdown</H3>
          <Table
            headers={['Recipient', 'Allocation', 'Tokens', 'Notes']}
            rows={[
              ['Mālama Genesis operators (400)', '5%', '25M', '62,500 each; $2k entry; 200 Base + 200 Cardano'],
              ['Network incentives pool', '40%', '200M', 'Y1–Y3 emissions to validators + operators'],
              ['Protocol treasury', '20%', '100M', 'Safe multisig; time-locked'],
              ['Team & advisors', '15%', '75M', '4y vest, 1y cliff'],
              ['Investors', '12%', '60M', 'Pre-genesis SAFTs, 2y vest'],
              ['Ecosystem / grants', '5%', '25M', 'Cardano Catalyst matching, ReFi partnerships'],
              ['Liquidity provision', '3%', '15M', 'DEX liquidity at TGE'],
              ['Total', '100%', '500M', '—'],
            ]}
          />
          <H3>3.3 Mālama Genesis allocation detail</H3>
          <P>
            <strong className="text-white">62,500 MLMA per operator</strong> — entry <strong className="text-white">$2,000</strong>{' '}
            (license + hardware). Vesting: <strong className="text-white">25%</strong> (15,625 MLMA) at verified boot;{' '}
            <strong className="text-white">75%</strong> (46,875 MLMA) linear over 12 months (~3,906 MLMA/month). Operators who do
            not deploy within 90 days forfeit their license and allocation to the treasury.
          </P>
          <Table
            headers={['Milestone', 'Tokens', 'Timing']}
            rows={[
              ['Hardware boot', '15,625 MLMA (25%)', 'Deployment registration (~Oct 2026)'],
              ['Months 1–12', '3,906 MLMA/month', 'Linear vest'],
              ['Month 13+', 'Fully vested', 'Hold, stake as veMLMA, or sell'],
            ]}
          />
          <p className="text-xs text-gray-500 italic mt-4">
            Mālama Labs does not publish MLMA price forecasts. Token value is driven by protocol utility (reward settlement, data-payment discounts, burn-for-MRV, veMLMA lock) and may go up or down. Participants should not acquire MLMA with the expectation of profit.
          </p>
        </section>

        <section id="emission-schedule" className="scroll-mt-28 mb-16">
          <h2 className="text-2xl font-black text-white mb-4 border-b border-gray-800 pb-2">4. Emission Schedule (Years 1–5)</h2>
          <P>Cold-start emissions Years 1–3; zero inflation from Year 4 with revenue-funded rewards.</P>
          <Table
            headers={['Year', 'Network emissions', '% of supply', 'Cumulative', 'Status', 'Revenue forecast']}
            rows={[
              ['1', '9.0M', '1.8%', '9.0M', 'Cold-start', '$2.09M'],
              ['2', '25.2M', '5.0%', '34.2M', 'Scaling', '$6.04M'],
              ['3', '45.0M', '9.0%', '79.2M', 'Breakeven', '$12.60M'],
              ['4', '0', '0%', '79.2M', 'Revenue-funded', '$21.39M'],
              ['5', '0', '0%', '79.2M', 'Revenue-funded', '$34.44M'],
            ]}
          />
          <P>
            <strong className="text-white">Total Y1–Y3 emissions: 79.2M MLMA</strong> (15.8% of supply). Remaining network incentive
            reserve: 137.5M (27.5%) for expansion or governance-directed use.
          </P>
          <H3>4.2 Year 1 distribution logic</H3>
          <CodeBlock>{`Monthly_Validator_Reward = (Emission_Pool / Total_Validators)
  × Geographic_Multiplier × Uptime_Multiplier × Genesis_Multiplier

Emission_Pool: 750,000 MLMA/month (9M / 12)
Validators: illustrative 400–550+ (Mālama Genesis + community)
Geographic_Multiplier: 0.5× (urban) – 3.0× (strategic)
Uptime_Multiplier: 1.0× – 1.5× (99.9%+)
Genesis_Multiplier: 1.5× (Year 1 only, Mālama Genesis operators)`}</CodeBlock>
          <Table
            headers={['Hex type', 'Geo mult.', 'Typical profile']}
            rows={[
              ['Urban', '0.5×', 'Dense deployment, low data scarcity'],
              ['Suburban', '1.0×', 'Mid-density, baseline validation'],
              ['Rural', '1.5×', 'Agricultural, scientific interest'],
              ['Frontier', '2.0×', 'Underserved, high scientific value'],
              ['Strategic', '3.0×', 'Industrial, data center, coastal wetland, flood-prone ag, regulatory-priority'],
            ]}
          />
          <p className="text-xs text-gray-500 italic mt-2">
            The Geographic Multiplier formula and its parameters are governance-voted (veMLMA); see whitepaper v2.1 §6.1 for the published formula. Mālama does not publish per-hex MLMA-per-month forecasts — actual earnings depend on data inflow, validator set size, and demand ramp.
          </p>
        </section>

        <section id="genesis-economics" className="scroll-mt-28 mb-16">
          <h2 className="text-2xl font-black text-white mb-4 border-b border-gray-800 pb-2">5. Genesis Operator Economics</h2>
          <P>
            Beyond the 62,500 MLMA allocation, operators earn MLMA from validating SaveCards and compute packets using the reward formula above.
            Genesis multiplier (1.5×) applies in Year 1; it expires in Year 2 as emissions and revenue share mature.
          </P>
          <H3>5.2 Reward scenarios (mechanics, not projections)</H3>
          <Table
            headers={['Scenario', 'Geographic Multiplier', 'Relative Year 1 MLMA', 'Notes']}
            rows={[
              ['Low-demand hex', '0.5×–1.0×', 'Lowest', 'Rural, low data volume, no institutional offtake'],
              ['Medium-demand hex', '1.0×–2.0×', 'Mid', 'Agricultural or moderately-served regions'],
              ['High-demand hex', '2.0×–3.0×', 'Highest', 'Industrial corridor, AI data center, coastal wetland, flood-prone agricultural hex'],
            ]}
          />
          <p className="text-xs text-gray-500 italic mt-2">
            Mālama does not publish operator payback-period claims or USD earnings forecasts. Actual earnings depend on data inflow, MLMA market price, and network conditions. For a public comparable, see WeatherXM's historical station economics. Operators should model conservative scenarios and consult their own advisors.
          </p>
          <H3>5.3 Years 2–3</H3>
          <P>
            Y2: 25.2M emissions; monthly pool ~2.1M MLMA. Y3: 45M emissions; monthly pool ~3.75M MLMA — final emission year before
            revenue-only funding.
          </P>
          <H3>5.4 Years 4–5 — revenue-funded</H3>
          <P>Emissions = 0. Rewards from protocol revenue: fees from carbon, energy data, insurance, smart-city, LCO₂ settlement.</P>
          <CodeBlock>{`Monthly_Burn = (Protocol_Revenue × 0.50) / MLMA_Price
Distributed = Protocol_Revenue × 0.50
  → 50% to operators (25% of gross revenue)
  → 50% to veMLMA stakers (25% of gross revenue)`}</CodeBlock>
        </section>

        <section id="revenue-sustainability" className="scroll-mt-28 mb-16">
          <h2 className="text-2xl font-black text-white mb-4 border-b border-gray-800 pb-2">6. Revenue Model & Sustainability</h2>
          <P>
            By Year 4, recurring protocol revenue targets ~$21.39M annually (non-linear ramp). By Year 5, ~$34.44M with all six streams
            active. Revenue diversification reduces single-buyer risk.
          </P>
          <Table
            headers={['Stream (Y5 run-rate)', 'Amount', 'Notes']}
            rows={[
              ['Carbon verification', '$10.8M', 'SaveCard validation fees'],
              ['Energy-market data', '$8.06M', 'Subscriptions'],
              ['Parametric insurance', '$1.8M', 'Trigger & verification data'],
              ['Smart-city data', '$12.5M', 'Municipal contracts'],
              ['LCO₂ settlement', '$1.28M', 'Pre-finance conversion'],
              ['AI compute (Phase 2)', 'TBD', 'Ramping'],
            ]}
          />
        </section>

        <section id="burn" className="scroll-mt-28 mb-16">
          <h2 className="text-2xl font-black text-white mb-4 border-b border-gray-800 pb-2">7. Burn Mechanism & Deflation</h2>
          <P>
            Burns create scarcity and align holders with fee growth. Half of protocol revenue (in USD terms) funds buy-and-burn or
            equivalent deflationary routing; half to operator + veMLMA distributions per policy.
          </P>
          <P>
            Burned tokens are permanently removed (sent to the null address). The burn volume scales with protocol revenue and the prevailing MLMA market price — higher revenue and/or lower MLMA price produces more MLMA burned per dollar of revenue. Cumulative deflation depends on network revenue maturity and market conditions, and cannot be forecast precisely.
          </P>
        </section>

        <section id="vemlma" className="scroll-mt-28 mb-16">
          <h2 className="text-2xl font-black text-white mb-4 border-b border-gray-800 pb-2">8. veMLMA Governance</h2>
          <Table
            headers={['Lock', 'Vote weight', 'Distribution mult.']}
            rows={[
              ['3 months', '0.25×', '0.5×'],
              ['6 months', '0.5×', '1.0×'],
              ['12 months', '1.0×', '2.0×'],
              ['24 months', '2.0×', '3.0×'],
            ]}
          />
          <P>
            veMLMA votes cover methodology, validator set, fee schedule, treasury grants, and emergency actions (multisig + governance
            thresholds per proposal type).
          </P>
        </section>

        <section id="risk" className="scroll-mt-28 mb-16">
          <h2 className="text-2xl font-black text-white mb-4 border-b border-gray-800 pb-2">9. Risk Analysis</h2>
          <ul className="list-disc pl-5 text-gray-300 space-y-3 text-sm md:text-[15px]">
            <li>
              <strong className="text-white">Token price:</strong> Mitigated by revenue mix, hard emission cap, burn, and veMLMA alignment.
            </li>
            <li>
              <strong className="text-white">Validator participation:</strong> Genesis multiplier, geographic tiers, low hardware cost.
            </li>
            <li>
              <strong className="text-white">Revenue forecast:</strong> Y1–3 emissions do not require hitting outer-year revenue; Y4+ scales
              with actual fees.
            </li>
          </ul>
        </section>

        <section id="by-year" className="scroll-mt-28 mb-16">
          <h2 className="text-2xl font-black text-white mb-4 border-b border-gray-800 pb-2">10. Tokenomics by Year (detailed)</h2>
          <H3>Year 1</H3>
          <Table
            headers={['Metric', 'Value']}
            rows={[
              ['Network emissions', '9.0M MLMA'],
              ['Validator count', '400–550'],
              ['Entry per node', '$2,000'],
              ['MLMA per operator', '62,500 (25% boot / 75% over 12 mo)'],
              ['Genesis multiplier', '1.5× (Year 1 only)'],
              ['Revenue forecast', 'Modeled internally; not published as forecast'],
              ['Burn (cumulative)', 'Ramps with revenue'],
            ]}
          />
          <H3>Year 2</H3>
          <Table
            headers={['Metric', 'Value']}
            rows={[
              ['Network emissions', '25.2M MLMA'],
              ['Validator count', '500–800'],
              ['Genesis multiplier', 'Expired (Year 1 only)'],
              ['Reward source', 'Emissions + ramping revenue share'],
            ]}
          />
          <H3>Year 3</H3>
          <Table
            headers={['Metric', 'Value']}
            rows={[
              ['Network emissions', '45.0M MLMA (final emission year)'],
              ['Validator count', '800–1,200'],
              ['Emissions after Y3', 'None'],
            ]}
          />
          <H3>Years 4–5</H3>
          <Table
            headers={['Metric', 'Y4', 'Y5']}
            rows={[
              ['Emissions', '0', '0'],
              ['Validators', '1,000–1,500', '1,200–1,800'],
              ['Reward source', 'Protocol revenue only', 'Protocol revenue only'],
            ]}
          />
          <p className="text-xs text-gray-500 italic mt-4">
            Revenue forecasts exist for internal planning but are not published. Any projected dollar figure in marketing or media attributable to Mālama Labs should be treated as incorrect. Consult the whitepaper, audit reports, and your own advisors before making participation decisions.
          </p>
        </section>

        <section id="faq" className="scroll-mt-28 mb-16">
          <h2 className="text-2xl font-black text-white mb-4 border-b border-gray-800 pb-2">11. Genesis Phase 1 FAQ (abridged)</h2>
          <div className="space-y-6 text-sm md:text-[15px] text-gray-300">
            <div>
              <p className="font-bold text-white mb-1">What if MLMA price drops?</p>
              <p>
                Operational economics tie to protocol revenue and multipliers; Y1–Y3 emissions provide a floor. Y4+ rewards are
                revenue-denominated.
              </p>
            </div>
            <div>
              <p className="font-bold text-white mb-1">When can I sell?</p>
              <p>Vested MLMA is free to sell; unvested amounts unlock per schedule. veMLMA locks are voluntary for governance boosts.</p>
            </div>
            <div>
              <p className="font-bold text-white mb-1">Stake before 12 months?</p>
              <p>Any vested MLMA can be locked as veMLMA per chosen duration.</p>
            </div>
            <div>
              <p className="font-bold text-white mb-1">Is MLMA a security?</p>
              <p>
                Designed as utility (fees, staking, governance). Regulatory treatment varies; purchasers should review jurisdictional
                disclosures.
              </p>
            </div>
          </div>
        </section>

        <section id="appendices" className="scroll-mt-28 mb-20">
          <h2 className="text-2xl font-black text-white mb-4 border-b border-gray-800 pb-2">12. Appendices</h2>
          <details className="group rounded-xl border border-gray-800 bg-[#0d1e35] mb-3 open:border-malama-accent/30">
            <summary className="cursor-pointer px-4 py-3 font-bold text-white list-none flex justify-between items-center">
              Appendix A — Emission curve
              <span className="text-gray-500 text-xs group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="px-4 pb-4 text-sm text-gray-400">
              <CodeBlock>{`Y1: 9.0M → 750K/month
Y2: 25.2M → 2.1M/month
Y3: 45.0M → 3.75M/month
Y4–5: 0

Total Y1–Y3: 79.2M MLMA
Reserve (27.5%): 137.5M MLMA`}</CodeBlock>
            </div>
          </details>
          <details className="group rounded-xl border border-gray-800 bg-[#0d1e35] mb-3">
            <summary className="cursor-pointer px-4 py-3 font-bold text-white list-none flex justify-between items-center">
              Appendix B — Revenue assumptions (high level)
              <span className="text-gray-500 text-xs group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="px-4 pb-4 text-sm text-gray-400 space-y-2">
              <p>Carbon, energy, insurance, smart-city, and LCO₂ models use conservative TAM slices — see economics deck for sensitivity.</p>
            </div>
          </details>
          <details className="group rounded-xl border border-gray-800 bg-[#0d1e35]">
            <summary className="cursor-pointer px-4 py-3 font-bold text-white list-none flex justify-between items-center">
              Appendix C–E — Regulatory, burn records, treasury charter
              <span className="text-gray-500 text-xs group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="px-4 pb-4 text-sm text-gray-400 space-y-2">
              <p>
                US / EU frameworks require case-by-case analysis. Burns are logged on-chain. Treasury spend limits and quarterly reporting
                are governed by veMLMA with multisig safeguards.
              </p>
            </div>
          </details>
        </section>

        <section className="scroll-mt-28 mb-12 rounded-2xl border border-malama-accent/20 bg-malama-accent/5 p-6">
          <h2 className="text-xl font-black text-white mb-3">Conclusion</h2>
          <P>
            MLMA is a utility token for a climate-data network — not an inflation-dependent DePIN. The protocol transitions from scheduled
            emissions (Years 1–3) to revenue-funded operation (Years 4–5), with a hard cap, burn alignment, and geographic and uptime
            multipliers. Mālama Genesis operators receive a clear allocation plus market-based validation rewards, with Indigenous stewardship
            (10–25% of applicable flows) where ISDA applies.
          </P>
        </section>

        <footer className="border-t border-gray-800 pt-8 text-xs text-gray-600 space-y-2">
          <p>
            <strong className="text-gray-500">Version 1.0</strong> · April 11, 2026 · Final for Genesis Phase 1 Pre-Sale · Tyler Malin
            (CEO), Finance & Treasury Team
          </p>
          <p>Illustrative only; not legal or investment advice. Indigenous stewardship: 10–25% of applicable operator rewards to steward DAOs per ISDA.</p>
          <p className="text-gray-500">Next review: post-mainnet launch (est. Q2 2026).</p>
        </footer>
      </article>

      <aside className="hidden xl:block">
        <TocNav />
      </aside>
    </div>
  )
}
