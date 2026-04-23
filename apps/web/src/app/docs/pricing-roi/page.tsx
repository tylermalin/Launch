'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { AlertTriangle, DollarSign, Layers, Info } from 'lucide-react'

const ENTRY_USD = 2000
const HARDWARE_USD = 380
const LICENSE_USD = 1620

type Tier = 'high' | 'medium' | 'low'

const TIERS: Record<
  Tier,
  { label: string; gmRange: string; profile: string; examples: string }
> = {
  high: {
    label: 'High demand hex',
    gmRange: '2.0× – 3.0×',
    profile: 'Strategic zones with high institutional demand and scientific priority.',
    examples: 'Industrial corridors, AI data center perimeters, coastal wetlands, flood-prone agricultural hexes, regulatory-priority zones.',
  },
  medium: {
    label: 'Medium demand hex',
    gmRange: '1.0× – 2.0×',
    profile: 'Agricultural or moderately-served regions. Balanced reward and validation frequency.',
    examples: 'Rural cropland, suburban edge, moderate-priority monitoring zones.',
  },
  low: {
    label: 'Low demand hex',
    gmRange: '0.5× – 1.0×',
    profile: 'Dense urban deployments or low data-scarcity regions.',
    examples: 'Urban centers with existing dense coverage, low-priority zones.',
  },
}

export default function PricingRoiPage() {
  const [tier, setTier] = useState<Tier>('medium')
  const t = TIERS[tier]

  return (
    <div className="max-w-3xl">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <p className="text-xs font-black uppercase tracking-widest text-blue-400 mb-2">Mālama Genesis</p>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
          Pricing & Reward Mechanics
        </h1>
        <p className="text-lg text-gray-400 leading-relaxed">
          Upfront capital breakdown and the formula that governs operator rewards. Mālama does not publish
          MLMA price forecasts or projected operator earnings.
        </p>
      </motion.header>

      {/* Capital */}
      <section className="mb-10">
        <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-malama-accent" /> Capital requirement
        </h2>
        <div className="rounded-2xl border border-gray-800 bg-[#0d1e35] p-6">
          <p className="text-4xl font-black text-white mb-2 tabular-nums">
            ${ENTRY_USD.toLocaleString()}{' '}
            <span className="text-lg text-gray-500 font-semibold">USD</span>
          </p>
          <p className="text-sm text-gray-500 mb-6">One-time Mālama Genesis entry (per Hex Node License)</p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-malama-accent/30 bg-malama-accent/5 p-4">
              <p className="text-xs uppercase tracking-widest text-malama-accent/80 mb-1">Hardware</p>
              <p className="text-2xl font-black text-white">${HARDWARE_USD}</p>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Raspberry Pi Zero 2W, sensors, NEMA enclosure, solar UPS, ATECC608 secure element.
              </p>
            </div>
            <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-4">
              <p className="text-xs uppercase tracking-widest text-blue-400/80 mb-1">Geographic license</p>
              <p className="text-2xl font-black text-white">${LICENSE_USD}</p>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Exclusive rights to operate a sensor node within a specific H3 hex cell on the Mālama network.
              </p>
            </div>
          </div>

          <div className="mt-4 h-3 rounded-full overflow-hidden flex bg-gray-800">
            <div
              className="h-full bg-malama-accent"
              style={{ width: `${(HARDWARE_USD / ENTRY_USD) * 100}%` }}
            />
            <div className="h-full bg-blue-500" style={{ width: `${(LICENSE_USD / ENTRY_USD) * 100}%` }} />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span className="text-malama-accent">Hardware {((HARDWARE_USD / ENTRY_USD) * 100).toFixed(0)}%</span>
            <span className="text-blue-400">License {((LICENSE_USD / ENTRY_USD) * 100).toFixed(0)}%</span>
          </div>
        </div>
      </section>

      {/* Reward formula */}
      <section className="mb-10">
        <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-violet-400" /> Reward formula
        </h2>

        <div className="rounded-2xl border border-gray-800 bg-[#0d1e35] p-6 mb-4">
          <p className="font-mono text-lg text-white mb-4">
            R<sub>operator</sub> = B × DQS × GM × UF × PoolFactor
          </p>
          <ul className="text-sm text-gray-400 space-y-2 leading-relaxed">
            <li><span className="text-white font-semibold">B</span> — Base rate: MLMA per epoch from the network incentives pool, divided across active operators.</li>
            <li><span className="text-white font-semibold">DQS</span> — Data Quality Score: 0.0–1.0 from validator confidence and cross-validation with neighboring hexes.</li>
            <li><span className="text-white font-semibold">GM</span> — Geographic Multiplier: 0.5× to 3.0×, governance-voted formula (whitepaper v2.1 §6.1).</li>
            <li><span className="text-white font-semibold">UF</span> — Uptime Factor: linear from 0 at 90% uptime to 1.0 at 99%, 1.1× bonus at ≥99.9%.</li>
            <li><span className="text-white font-semibold">PoolFactor</span> — Scaling factor that keeps total issuance within the per-epoch cap.</li>
          </ul>
        </div>
      </section>

      {/* Hex tiers */}
      <section className="mb-10">
        <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-violet-400" /> Hex demand tiers
        </h2>

        <div className="flex flex-wrap gap-2 mb-6">
          {(Object.keys(TIERS) as Tier[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setTier(k)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                tier === k
                  ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/25'
                  : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'
              }`}
            >
              {TIERS[k].label.replace(' hex', '')}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-gray-800 bg-[#0d1e35] p-6">
          <p className="text-sm text-gray-400 mb-2">{t.label}</p>
          <p className="text-3xl font-black text-malama-accent tabular-nums mb-4">{t.gmRange}</p>
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Geographic Multiplier</p>
          <p className="text-sm text-gray-300 leading-relaxed mb-3">{t.profile}</p>
          <p className="text-sm text-gray-400 leading-relaxed">
            <span className="text-gray-500 uppercase text-xs tracking-widest font-bold">Examples: </span>
            {t.examples}
          </p>
        </div>
      </section>

      {/* Historical comparable */}
      <section className="mb-10">
        <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-sky-400" /> Historical comparable
        </h2>
        <div className="rounded-2xl border border-sky-500/30 bg-sky-500/5 p-6">
          <p className="text-sm text-gray-300 leading-relaxed mb-3">
            Mālama does not publish operator earnings forecasts, token price targets, or payback-period claims.
          </p>
          <p className="text-sm text-gray-400 leading-relaxed">
            For reference, the closest public DePIN comparable is{' '}
            <a
              href="https://weatherxm.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-300 underline underline-offset-2 font-semibold"
            >
              WeatherXM
            </a>
            , whose 5,000+ stations report actual monthly token earnings that vary widely by location demand, data quality, and
            token market price. Mālama's economics will differ based on chain, demand profile, Geographic Multiplier, and rollout
            pace. Operators should model their own scenarios conservatively and consult their own advisors.
          </p>
        </div>
      </section>

      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 flex gap-3 mb-6">
        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-200/90 leading-relaxed">
          <p className="font-bold mb-1">No guarantees</p>
          <p>
            Operating a Mālama Hex Node requires labor (physical installation, maintenance, uptime). Earnings depend on
            validated data contributions, Geographic Multiplier, Data Quality Score, MLMA market price, and network conditions.
            There is no guaranteed return. Participation involves risk including loss of capital. Consult qualified legal,
            tax, and financial advisors before reserving. See{' '}
            <a href="/legal" className="underline underline-offset-2 font-semibold">Legal center</a> for full disclosures.
          </p>
        </div>
      </div>

      <p className="text-xs text-gray-600 border-t border-gray-800 pt-6">
        Mālama Genesis Pricing & Mechanics — aligned with Whitepaper v2.1. Actual rewards follow protocol rules and network conditions.
      </p>
    </div>
  )
}
