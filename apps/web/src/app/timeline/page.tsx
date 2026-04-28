'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  ChevronDown,
  CheckCircle2,
  Zap,
  Package,
  Cpu,
  TrendingUp,
  Network,
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }),
}

const colorMap = {
  emerald: {
    ring: 'ring-malama-accent/60',
    bg: 'bg-malama-accent/5',
    border: 'border-malama-accent/40',
    dot: 'bg-malama-accent',
    glow: 'shadow-[0_0_30px_rgba(196,240,97,0.15)]',
    badge: 'bg-malama-accent/15 text-malama-accent border-malama-accent/30',
    text: 'text-malama-accent',
    bullet: 'text-malama-accent',
    cta: 'bg-malama-accent text-malama-bg font-black hover:bg-malama-accent/90',
  },
  blue: {
    ring: 'ring-blue-500/50',
    bg: 'bg-blue-500/5',
    border: 'border-blue-500/30',
    dot: 'bg-blue-400',
    glow: 'shadow-[0_0_30px_rgba(59,130,246,0.15)]',
    badge: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    text: 'text-blue-400',
    bullet: 'text-blue-400',
    cta: 'bg-blue-500 text-white font-black hover:bg-blue-400',
  },
  violet: {
    ring: 'ring-violet-500/50',
    bg: 'bg-violet-500/5',
    border: 'border-violet-500/30',
    dot: 'bg-violet-400',
    glow: 'shadow-[0_0_30px_rgba(139,92,246,0.15)]',
    badge: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
    text: 'text-violet-400',
    bullet: 'text-violet-400',
    cta: 'bg-violet-500 text-white font-black hover:bg-violet-400',
  },
  amber: {
    ring: 'ring-amber-500/50',
    bg: 'bg-amber-500/5',
    border: 'border-amber-500/30',
    dot: 'bg-amber-400',
    glow: 'shadow-[0_0_30px_rgba(245,158,11,0.15)]',
    badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    text: 'text-amber-400',
    bullet: 'text-amber-400',
    cta: 'bg-amber-500 text-white font-black hover:bg-amber-400',
  },
  teal: {
    ring: 'ring-teal-500/50',
    bg: 'bg-teal-500/5',
    border: 'border-teal-500/30',
    dot: 'bg-teal-400',
    glow: 'shadow-[0_0_30px_rgba(20,184,166,0.15)]',
    badge: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
    text: 'text-teal-400',
    bullet: 'text-teal-400',
    cta: 'bg-teal-500 text-white font-black hover:bg-teal-400',
  },
}

const phases: {
  id: string
  date: string
  label: string
  icon: React.ElementType
  color: keyof typeof colorMap
  badge: string
  items: string[]
  note?: string
  cta: { label: string; href: string } | null
}[] = [
  {
    id: 'may',
    date: 'May 2026',
    label: 'Pre-Sale Opens',
    icon: Zap,
    color: 'emerald',
    badge: 'Live Soon',
    items: [
      'Phase 1 pre-sale officially begins — reserve your Genesis Hex Node for $2,000.',
      'Select your H3 hex cell on the Hex Map Explorer. Each cell is a unique geographic license.',
      'Pay via crypto or card and receive your NFT-HEX rights object + 125,000 MLMA allocation on-chain.',
      'Hardware pre-order enters the production queue. Ships September 2026.',
    ],
    note: '195 nodes available for public allocation. 5 reserved for Mālama Labs.',
    cta: { label: 'Reserve a Hex Node', href: '/presale' },
  },
  {
    id: 'sep',
    date: 'September 2026',
    label: 'Hardware Deployment',
    icon: Package,
    color: 'blue',
    badge: 'Q3 2026',
    items: [
      'Operator hardware shipments commence to all registered locations globally.',
      'Each kit includes the Mālama-provisioned enclosure, sensors, solar UPS, Ethernet cable, and soil probe.',
      'Operators unbox, mount, and charge the solar-powered NEMA 4X enclosure — approximately 30 minutes setup.',
      'Connect to local internet via weatherproof Ethernet or Wi-Fi bridge.',
    ],
    cta: null,
  },
  {
    id: 'oct-boot',
    date: 'Late Sept — Early Oct 2026',
    label: 'Boot & Register',
    icon: Cpu,
    color: 'violet',
    badge: 'Q4 2026',
    items: [
      'Secure connection string booting takes approximately 30 minutes from first power-on.',
      'The node connects to the Mālama DePIN network and registers its ATECC608B device key on-chain.',
      '25% of your MLMA allocation (31,250 MLMA) vests instantly on first verified boot.',
      'Node appears on the live network map as "Active" — carbon SaveCard and AI compute validation begins immediately.',
    ],
    cta: null,
  },
  {
    id: 'oct-earn',
    date: 'October 2026',
    label: 'First Rewards Accrue',
    icon: TrendingUp,
    color: 'amber',
    badge: 'Rewards',
    items: [
      'Network metrics flow live — validation checks process carbon SaveCards and AI compute attestations continuously.',
      'Earn MLMA based on your Geographic Multiplier (0.5×–3.0×), Data Quality Score, and uptime. Rewards are relative to total network validation volume.',
      '75% monthly vesting unlocks commence — approximately 7,812 MLMA per month for 12 months.',
      'Operator economics depend on data demand in your hex cell and MLMA market conditions. See whitepaper for mechanics.',
    ],
    note: 'Mālama does not publish projected earnings, token price forecasts, or payback timelines. Model conservative scenarios.',
    cta: { label: 'View Validation Rewards', href: '/#economics' },
  },
  {
    id: 'genesis-phase',
    date: 'Years 1–3',
    label: 'Genesis Phase',
    icon: Network,
    color: 'teal',
    badge: 'Long-term',
    items: [
      'Genesis 200 operators hold lifetime protocol rights — including rights to all future product streams added to the validator network.',
      'Higher reward density during network bootstrap phase. 200 nodes at maximum per-node emission rate.',
      'Protocol scales enterprise carbon MRV and AI compute attestation client deployments.',
      'DAO governance activates: Genesis operators vote on methodology updates, validator set changes, and treasury distribution.',
      'Steady state transition begins in Year 4 as the validator set expands and fee-based revenue supplements emissions.',
    ],
    cta: { label: 'Learn About Two Economic Phases', href: '/#phases' },
  },
]

export default function TimelinePage() {
  const [expanded, setExpanded] = useState<string>('may')

  return (
    <div className="w-full min-h-screen bg-malama-bg">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-5 pt-24 pb-16 text-center sm:px-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
          className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-malama-accent border border-malama-accent/30 rounded-full bg-malama-accent/8"
        >
          <span className="w-2 h-2 rounded-full bg-malama-accent animate-pulse" />
          Mālama Genesis · Phase 1 Roadmap
        </motion.div>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="font-serif text-[clamp(2.75rem,7vw,5rem)] font-normal leading-[0.95] tracking-[-0.035em] text-malama-ink mb-6"
        >
          Reserve to{' '}
          <em className="font-light italic text-malama-accent">revenue.</em>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
          className="text-lg text-malama-ink-dim leading-relaxed max-w-2xl mx-auto"
        >
          From your first reservation in May 2026 to earning MLMA rewards in October —
          every milestone, vesting moment, and Genesis Phase right mapped out.
        </motion.p>
      </div>

      {/* ── Timeline ─────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 pb-32 sm:px-6 relative">

        {/* Vertical connector line */}
        <div className="absolute left-[2.25rem] top-0 bottom-0 w-px bg-gradient-to-b from-malama-accent/50 via-blue-500/30 via-violet-500/30 via-amber-500/30 to-teal-500/30 hidden md:block" />

        <div className="space-y-4">
          {phases.map((phase, i) => {
            const c = colorMap[phase.color]
            const Icon = phase.icon
            const isOpen = expanded === phase.id

            return (
              <motion.div
                key={phase.id}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={i}
                className="relative"
              >
                {/* Timeline node dot */}
                <div
                  className={`absolute left-[1.625rem] top-6 w-4 h-4 rounded-full ${c.dot} ring-4 ${c.ring} hidden md:block z-10`}
                />

                <div className="md:ml-20">
                  {/* Header */}
                  <button
                    onClick={() => setExpanded(isOpen ? '' : phase.id)}
                    className={`w-full text-left p-6 rounded-malama border transition-all duration-300 ${c.bg} ${c.border} ${isOpen ? c.glow : 'hover:border-malama-line-bright'}`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className={`w-11 h-11 rounded-malama-sm ${c.bg} border ${c.border} flex items-center justify-center shrink-0`}>
                          <Icon className={`w-5 h-5 ${c.text}`} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-3 mb-1 flex-wrap">
                            <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded border ${c.badge}`}>
                              {phase.badge}
                            </span>
                            <span className="text-malama-ink-faint text-xs font-mono">{phase.date}</span>
                          </div>
                          <h2 className="font-serif text-xl text-malama-ink">{phase.label}</h2>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.25 }}
                        className="shrink-0"
                      >
                        <ChevronDown className={`w-5 h-5 ${c.text}`} />
                      </motion.div>
                    </div>
                  </button>

                  {/* Expandable content */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className={`mt-2 p-6 rounded-malama border ${c.border} bg-malama-card`}>
                          <ul className="space-y-3 mb-5">
                            {phase.items.map((item, j) => (
                              <motion.li
                                key={j}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: j * 0.05 }}
                                className="flex items-start gap-3 text-malama-ink-dim text-sm leading-relaxed"
                              >
                                <CheckCircle2 className={`w-4 h-4 ${c.bullet} shrink-0 mt-0.5`} />
                                <span>{item}</span>
                              </motion.li>
                            ))}
                          </ul>

                          {phase.note && (
                            <p className="text-xs italic text-malama-ink-faint mb-5 pl-7">{phase.note}</p>
                          )}

                          {phase.cta && (
                            <Link
                              href={phase.cta.href}
                              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-malama-sm text-sm transition-all hover:-translate-y-px ${c.cta}`}
                            >
                              {phase.cta.label} →
                            </Link>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Summary stats strip */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 md:ml-20"
        >
          {[
            { label: 'Entry price', value: '$2,000', sub: 'One-time at reserve' },
            { label: 'MLMA allocation', value: '125,000', sub: '25% at boot · 75% vested' },
            { label: 'First rewards', value: 'Oct 2026', sub: 'Validation live on boot' },
            { label: 'Genesis rights', value: 'Lifetime', sub: 'All future product streams' },
          ].map(({ label, value, sub }) => (
            <div key={label} className="bg-malama-card border border-malama-line rounded-malama p-4 text-center">
              <div className="font-mono text-[10px] uppercase tracking-widest text-malama-ink-faint mb-1">{label}</div>
              <div className="font-serif text-lg text-malama-accent">{value}</div>
              <div className="text-malama-ink-faint text-xs mt-1">{sub}</div>
            </div>
          ))}
        </motion.div>

        {/* Final CTA */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-8 md:ml-20 p-8 rounded-malama border border-malama-accent/30 bg-malama-accent/5 text-center"
        >
          <p className="font-mono text-[11px] uppercase tracking-widest text-malama-accent mb-2">
            Phase 1 Pre-Sale · Opens May 2026
          </p>
          <h3 className="font-serif text-2xl text-malama-ink mb-2">195 nodes available.</h3>
          <p className="text-malama-ink-dim text-sm mb-8 max-w-md mx-auto">
            5 nodes reserved for Mālama Labs. Allocation closes June 2026 or when sold out. First-come, first-served by hex cell selection.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/presale"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-malama-accent text-malama-bg font-black text-sm uppercase tracking-wider rounded-malama hover:bg-malama-accent/90 transition-all hover:-translate-y-px shadow-[0_8px_24px_rgba(196,240,97,0.2)]"
            >
              Reserve a Hex Node →
            </Link>
            <Link
              href="/map"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-malama-accent/40 text-malama-accent font-black text-sm uppercase tracking-wider rounded-malama hover:bg-malama-accent/8 transition-all"
            >
              Browse Available Hexes
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
