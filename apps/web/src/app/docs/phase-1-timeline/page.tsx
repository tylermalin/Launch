'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Calendar, Cpu, Package, Rocket, TrendingUp } from 'lucide-react'

const MILESTONES = [
  {
    id: 'may',
    month: 'May 2026',
    title: 'Pre-sale opens',
    short: 'Reserve',
    icon: Rocket,
    color: 'emerald',
    bullets: [
      'Pre-sale begins — reserve your Genesis node at the $2,000 entry.',
      'Pre-qualification: region availability, capital, and shipping constraints via the portal.',
    ],
  },
  {
    id: 'sep',
    month: 'September 2026',
    title: 'Hardware deployment',
    short: 'Ship',
    icon: Package,
    color: 'blue',
    bullets: [
      'Shipments go out to registered operator locations.',
      'Unbox, mount, and charge the solar-powered enclosure where you have internet access.',
    ],
  },
  {
    id: 'boot',
    month: 'Late Sept – Early Oct 2026',
    title: 'Booting',
    short: 'Boot',
    icon: Cpu,
    color: 'violet',
    bullets: [
      'Secure connection and boot typically ~30 minutes.',
      'Node joins the network; 25% MLMA allocation vests on first verified boot.',
    ],
  },
  {
    id: 'rewards',
    month: 'Early–Mid October 2026',
    title: 'First rewards',
    short: 'Earn',
    icon: TrendingUp,
    color: 'amber',
    bullets: [
      'Network metrics flow across the DePIN; validation runs continuously.',
      '75% monthly vesting unlocks begin; validators accrue validation incentives.',
    ],
  },
] as const

const colorStyles: Record<string, { ring: string; bg: string; text: string; border: string; line: string }> = {
  emerald: {
    ring: 'ring-malama-accent/50',
    bg: 'bg-malama-accent/15',
    text: 'text-malama-accent',
    border: 'border-malama-accent/40',
    line: 'from-malama-accent to-malama-accent/0',
  },
  blue: {
    ring: 'ring-blue-500/50',
    bg: 'bg-blue-500/15',
    text: 'text-blue-400',
    border: 'border-blue-500/40',
    line: 'from-blue-500 to-blue-500/0',
  },
  violet: {
    ring: 'ring-violet-500/50',
    bg: 'bg-violet-500/15',
    text: 'text-violet-400',
    border: 'border-violet-500/40',
    line: 'from-violet-500 to-violet-500/0',
  },
  amber: {
    ring: 'ring-amber-500/50',
    bg: 'bg-amber-500/15',
    text: 'text-amber-400',
    border: 'border-amber-500/40',
    line: 'from-amber-500 to-amber-500/0',
  },
}

export default function Phase1TimelinePage() {
  const [active, setActive] = useState(0)

  return (
    <div className="max-w-3xl">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <p className="text-xs font-black uppercase tracking-widest text-violet-400 mb-2">Genesis 200</p>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
          Phase 1 Timeline
        </h1>
        <p className="text-lg text-gray-400 leading-relaxed">
          From reservation to first rewards — tap a phase or use the strip to explore milestones, dates, and what happens at each step.
        </p>
      </motion.header>

      {/* Step strip */}
      <div className="mb-10 overflow-x-auto pb-2 -mx-1 px-1">
        <div className="flex gap-2 min-w-max md:min-w-0 md:grid md:grid-cols-4">
          {MILESTONES.map((m, i) => {
            const c = colorStyles[m.color]
            const isOn = i === active
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setActive(i)}
                className={`relative flex flex-col items-center text-center px-4 py-3 rounded-xl border transition-all duration-300 ${
                  isOn ? `${c.bg} ${c.border} ring-2 ${c.ring}` : 'border-gray-800 bg-[#0d1e35] hover:border-gray-700'
                }`}
              >
                <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isOn ? c.text : 'text-gray-500'}`}>
                  {m.short}
                </span>
                <span className="text-sm font-bold text-white">{m.month}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Active card */}
      <motion.div
        key={MILESTONES[active].id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="rounded-2xl border border-gray-800 bg-[#0d1e35] overflow-hidden mb-10"
      >
        <div
          className={`h-1.5 bg-gradient-to-r ${colorStyles[MILESTONES[active].color].line}`}
        />
        <div className="p-6 sm:p-8">
          <div className="flex items-start gap-4 mb-6">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colorStyles[MILESTONES[active].color].bg} border ${colorStyles[MILESTONES[active].color].border}`}
            >
              {(() => {
                const Icon = MILESTONES[active].icon
                return <Icon className={`w-7 h-7 ${colorStyles[MILESTONES[active].color].text}`} />
              })()}
            </div>
            <div>
              <p className="text-xs font-mono text-gray-500 mb-1">{MILESTONES[active].month}</p>
              <h2 className="text-2xl font-black text-white">{MILESTONES[active].title}</h2>
            </div>
          </div>
          <ul className="space-y-3">
            {MILESTONES[active].bullets.map((b) => (
              <li key={b} className="flex gap-3 text-gray-300 text-sm leading-relaxed">
                <Calendar className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Gantt-style visual */}
      <section className="mb-10">
        <h2 className="text-lg font-black text-white mb-4">At a glance</h2>
        <div className="rounded-2xl border border-gray-800 bg-[#0d1e35] p-4 sm:p-6">
          <div className="relative h-14 rounded-lg bg-gray-800/80 overflow-hidden">
            {[
              { w: '28%', offset: '0%', c: 'bg-malama-accent/80' },
              { w: '28%', offset: '28%', c: 'bg-blue-500/80' },
              { w: '18%', offset: '56%', c: 'bg-violet-500/80' },
              { w: '28%', offset: '72%', c: 'bg-amber-500/80' },
            ].map((seg, i) => (
              <motion.div
                key={i}
                className={`absolute top-0 bottom-0 ${seg.c} rounded-md`}
                style={{ left: seg.offset, width: seg.w }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-3 mt-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-malama-accent" /> Pre-sale</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> Deploy</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-violet-500" /> Boot</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Rewards</span>
          </div>
        </div>
      </section>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/timeline"
          className="flex-1 text-center px-5 py-3 rounded-xl border border-gray-700 text-gray-300 font-bold hover:bg-white/5 transition-colors"
        >
          Full roadmap view →
        </Link>
        <Link
          href="/presale"
          className="flex-1 text-center px-5 py-3 rounded-xl bg-malama-accent text-black font-black hover:scale-[1.02] transition-transform"
        >
          Reserve a node
        </Link>
      </div>
    </div>
  )
}
