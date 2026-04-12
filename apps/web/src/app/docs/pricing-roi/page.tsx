'use client'

import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { AlertTriangle, DollarSign, Layers } from 'lucide-react'

const ENTRY_USD = 2000
const HARDWARE_USD = 380
const LICENSE_USD = 1620

type Tier = 'high' | 'medium' | 'low'

const TIERS: Record<
  Tier,
  { label: string; validations: string; monthlyMin: number; monthlyMax: number; docPayback: string }
> = {
  high: {
    label: 'High demand hex',
    validations: '~50–100K validations / month',
    monthlyMin: 50_000,
    monthlyMax: 100_000,
    docPayback: '< 1 week',
  },
  medium: {
    label: 'Medium demand hex',
    validations: '~25–40K validations / month',
    monthlyMin: 25_000,
    monthlyMax: 40_000,
    docPayback: '1–4 weeks',
  },
  low: {
    label: 'Low demand hex',
    validations: '~8–15K validations / month',
    monthlyMin: 8_000,
    monthlyMax: 15_000,
    docPayback: '6–12 weeks',
  },
}

export default function PricingRoiPage() {
  const [tier, setTier] = useState<Tier>('medium')
  const [mlmaPrice, setMlmaPrice] = useState(0.2)

  const t = TIERS[tier]

  const { monthlyMid, monthlyUsd, yearMlma, yearUsd, paybackWeeks } = useMemo(() => {
    const monthlyMid = (t.monthlyMin + t.monthlyMax) / 2
    const monthlyUsd = monthlyMid * mlmaPrice
    const yearMlma = monthlyMid * 12
    const yearUsd = yearMlma * mlmaPrice
    const weeklyUsd = monthlyUsd * (12 / 52)
    const paybackWeeks = weeklyUsd > 0 ? ENTRY_USD / weeklyUsd : 999
    return { monthlyMid, monthlyUsd, yearMlma, yearUsd, paybackWeeks }
  }, [t, mlmaPrice])

  return (
    <div className="max-w-3xl">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <p className="text-xs font-black uppercase tracking-widest text-blue-400 mb-2">Genesis 200</p>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
          Pricing & ROI
        </h1>
        <p className="text-lg text-gray-400 leading-relaxed">
          Upfront capital, allocation breakdown, and illustrative earnings. Adjust MLMA price and demand tier to explore scenarios.
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
          <p className="text-sm text-gray-500 mb-6">One-time Genesis 200 entry</p>

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
                Exclusive rights to deploy inside your mapped contiguous hex on the Mālama network.
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

      {/* Interactive scenarios */}
      <section className="mb-10">
        <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-violet-400" /> Illustrative Year 1 scenarios
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

        <div className="rounded-2xl border border-gray-800 bg-[#0d1e35] p-6 mb-6">
          <p className="text-sm text-gray-400 mb-1">{t.label}</p>
          <p className="text-xs text-gray-600 mb-6">{t.validations}</p>

          <label className="block mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">MLMA price (USD)</span>
            <div className="flex items-center gap-4 mt-2">
              <input
                type="range"
                min={0.1}
                max={0.3}
                step={0.01}
                value={mlmaPrice}
                onChange={(e) => setMlmaPrice(Number(e.target.value))}
                className="flex-1 accent-violet-500 h-2 rounded-full"
              />
              <span className="text-white font-mono font-black w-16 text-right">${mlmaPrice.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">Reference range from published economics ($0.10–$0.30)</p>
          </label>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-malama-accent/40 bg-malama-accent/10 p-4">
              <p className="text-xs text-malama-accent/80 uppercase tracking-widest mb-1">Monthly yield (mid-range)</p>
              <p className="text-2xl font-black text-malama-accent tabular-nums">
                {(monthlyMid / 1000).toFixed(0)}K MLMA
              </p>
              <p className="text-sm text-gray-400 mt-1">≈ ${monthlyUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })} / mo at ${mlmaPrice.toFixed(2)}</p>
            </div>
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4">
              <p className="text-xs text-amber-400/80 uppercase tracking-widest mb-1">Payback</p>
              <p className="text-2xl font-black text-amber-200">{t.docPayback}</p>
              <p className="text-xs text-gray-500 mt-1">
                At slider price & mid yield: ~{paybackWeeks < 200 ? paybackWeeks.toFixed(1) : '—'} weeks to recover ${ENTRY_USD} entry
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-gray-700 bg-black/20 p-4">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Year 1 validation rewards (illustrative)</p>
            <p className="text-2xl text-white font-black tabular-nums">
              ${yearUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              <span className="text-gray-500 text-base font-semibold ml-1">USD</span>
            </p>
            <p className="text-xs text-gray-600 mt-2">
              Mid-range MLMA/month × 12 × MLMA price. ~{(yearMlma / 1000).toFixed(0)}K MLMA/year at the selected tier midpoint.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-200/90 leading-relaxed">
            Earnings depend on real data inflow in your hex. Lower demand means slower payback and lower Year 1 totals. Figures are not financial advice or guarantees.
          </p>
        </div>
      </section>

      <p className="text-xs text-gray-600 border-t border-gray-800 pt-6">
        Genesis 200 Pricing & ROI Summary — aligned with public documentation. Actual rewards follow protocol rules and network conditions.
      </p>
    </div>
  )
}
