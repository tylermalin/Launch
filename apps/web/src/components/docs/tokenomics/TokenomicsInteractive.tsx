'use client'

import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Info, Lock, Sparkles, TrendingUp } from 'lucide-react'

const TOTAL_MLMA = 500_000_000
const GENESIS_POOL = 25_000_000
const PER_NODE = 125_000
const BOOT_PCT = 0.25
const MONTHLY_PCT = 0.75 / 12

const EMISSION_BY_YEAR = [
  { year: 'Y1', mlma: 9, cumulative: 9, label: 'Cold-start' },
  { year: 'Y2', mlma: 25.2, cumulative: 34.2, label: 'Scaling' },
  { year: 'Y3', mlma: 45, cumulative: 79.2, label: 'Breakeven' },
  { year: 'Y4', mlma: 0, cumulative: 79.2, label: 'Revenue' },
  { year: 'Y5', mlma: 0, cumulative: 79.2, label: 'Revenue' },
]

export function TokenomicsInteractive() {
  const [vestMonth, setVestMonth] = useState(0)

  const unlocked = useMemo(() => {
    const boot = PER_NODE * BOOT_PCT
    if (vestMonth <= 0) return boot
    const monthly = PER_NODE * MONTHLY_PCT
    const months = Math.min(vestMonth, 12)
    return boot + monthly * months
  }, [vestMonth])

  const genesisPct = (GENESIS_POOL / TOTAL_MLMA) * 100

  return (
    <div className="space-y-10 mb-16">
      {/* Supply */}
      <section className="rounded-2xl border border-gray-800 bg-[#0d1e35] p-6">
        <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-malama-accent" /> Supply snapshot (Genesis 200)
        </h2>
        <div className="flex flex-wrap gap-6 mb-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Total supply cap</p>
            <p className="text-3xl font-black text-white tabular-nums">500M</p>
            <p className="text-sm text-gray-500">MLMA</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Genesis operators pool</p>
            <p className="text-3xl font-black text-malama-accent tabular-nums">25M</p>
            <p className="text-sm text-gray-500">MLMA ({genesisPct.toFixed(1)}% of cap)</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Per node</p>
            <p className="text-3xl font-black text-white tabular-nums">125K</p>
            <p className="text-sm text-gray-500">MLMA</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-4 rounded-full bg-gray-800 overflow-hidden flex">
            <motion.div
              className="h-full bg-gradient-to-r from-malama-accent to-malama-accent-dim"
              initial={{ width: 0 }}
              animate={{ width: `${genesisPct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Genesis 200 ({GENESIS_POOL.toLocaleString()} MLMA)</span>
            <span>Other allocations per whitepaper §3</span>
          </div>
        </div>
        <p className="mt-4 text-xs text-gray-600 flex items-start gap-2">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
          Full allocation table (investors, team, incentives, treasury) is in the document below.
        </p>
      </section>

      {/* Emissions chart */}
      <section className="rounded-2xl border border-gray-800 bg-[#0d1e35] p-6">
        <h2 className="text-xl font-black text-white mb-2">Network emissions (Y1–Y5)</h2>
        <p className="text-sm text-gray-500 mb-4">Millions of MLMA per year. Emissions end after Year 3.</p>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={EMISSION_BY_YEAR} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="year" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 11 }} label={{ value: 'M MLMA', angle: -90, position: 'insideLeft', fill: '#6b7280' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0d1e35', border: '1px solid #374151', borderRadius: '12px' }}
                labelStyle={{ color: '#e5e7eb' }}
                formatter={(value: number) => [`${value}M MLMA`, 'Emission']}
              />
              <Bar dataKey="mlma" fill="#10b981" radius={[6, 6, 0, 0]} name="Annual emission" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-gray-600 mt-3">Total Y1–Y3: 79.2M MLMA (15.8% of supply). Years 4–5: revenue-funded only.</p>
      </section>

      {/* Vesting */}
      <section className="rounded-2xl border border-gray-800 bg-[#0d1e35] p-6">
        <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-blue-400" /> Genesis allocation vesting (per node)
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          25% at verified hardware boot; 75% linear over 12 months (~7,813 MLMA/month).
        </p>
        <label className="block mb-2">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Months after boot</span>
          <input
            type="range"
            min={0}
            max={12}
            value={vestMonth}
            onChange={(e) => setVestMonth(Number(e.target.value))}
            className="w-full mt-3 accent-malama-accent h-2 rounded-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Boot</span>
            <span className="text-malama-accent font-mono font-bold">{vestMonth} mo</span>
            <span>12 mo</span>
          </div>
        </label>
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-malama-accent/40 bg-malama-accent/10 p-4">
            <p className="text-xs text-malama-accent/80 uppercase tracking-widest mb-1">Unlocked</p>
            <p className="text-3xl font-black text-malama-accent tabular-nums">{(unlocked / 1000).toFixed(1)}K</p>
            <p className="text-sm text-gray-400">MLMA of {PER_NODE.toLocaleString()}</p>
          </div>
          <div className="rounded-xl border border-gray-700 bg-black/20 p-4">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Still vesting</p>
            <p className="text-3xl font-black text-gray-300 tabular-nums">{((PER_NODE - unlocked) / 1000).toFixed(1)}K</p>
            <p className="text-sm text-gray-500">MLMA</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/5 p-6">
        <h2 className="text-xl font-black text-white mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" /> Year 1 Genesis multiplier
        </h2>
        <p className="text-5xl font-black text-white mb-2">
          1.5<span className="text-2xl text-amber-400">×</span>
        </p>
        <p className="text-sm text-gray-400">Applied to validation rewards for Genesis 200 operators in Year 1; expires in Year 2 per model.</p>
      </section>
    </div>
  )
}
