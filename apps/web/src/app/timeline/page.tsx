'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ChevronDown, CheckCircle2, Zap, Package, Cpu, TrendingUp } from 'lucide-react'

const colorMap = {
  emerald: {
    ring: 'ring-malama-accent/60',
    bg: 'bg-malama-accent/10',
    border: 'border-malama-accent/40',
    dot: 'bg-malama-accent',
    glow: 'shadow-[0_0_30px_rgba(196,240,97,0.25)]',
    badge: 'bg-malama-accent/20 text-malama-accent border-malama-accent/30',
    line: 'bg-malama-accent',
    text: 'text-malama-accent',
    bullet: 'text-malama-accent',
    cta: 'bg-malama-accent text-malama-bg hover:bg-malama-accent-dim',
  },
  blue: {
    ring: 'ring-blue-500/60',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/40',
    dot: 'bg-blue-400',
    glow: 'shadow-[0_0_30px_rgba(59,130,246,0.2)]',
    badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    line: 'bg-blue-500',
    text: 'text-blue-400',
    bullet: 'text-blue-400',
    cta: 'bg-blue-500 text-white hover:bg-blue-400',
  },
  violet: {
    ring: 'ring-violet-500/60',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/40',
    dot: 'bg-violet-400',
    glow: 'shadow-[0_0_30px_rgba(139,92,246,0.2)]',
    badge: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    line: 'bg-violet-500',
    text: 'text-violet-400',
    bullet: 'text-violet-400',
    cta: 'bg-violet-500 text-white hover:bg-violet-400',
  },
  amber: {
    ring: 'ring-amber-500/60',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/40',
    dot: 'bg-amber-400',
    glow: 'shadow-[0_0_30px_rgba(245,158,11,0.2)]',
    badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    line: 'bg-amber-500',
    text: 'text-amber-400',
    bullet: 'text-amber-400',
    cta: 'bg-amber-500 text-white hover:bg-amber-400',
  },
}

const phases: {
  id: string
  date: string
  label: string
  status: 'upcoming' | 'future'
  icon: React.ElementType
  color: keyof typeof colorMap
  badge: string
  items: string[]
  cta: { label: string; href: string } | null
}[] = [
  {
    id: 'may',
    date: 'May 2026',
    label: 'Pre-Sale Opens',
    status: 'upcoming',
    icon: Zap,
    color: 'emerald',
    badge: 'Open Now',
    items: [
      'Pre-sale officially begins — reserve your Genesis node for $2,000.',
      'Pre-qualification confirms region availability, capital, and shipping constraints via the main portal.',
      'Pay entry cost and receive your NFT-HEX + 125K MLMA allocation on-chain.',
      'Hardware pre-order is queued. Ships in September 2026.',
    ],
    cta: { label: 'Reserve with Crypto or Card', href: '/presale' },
  },
  {
    id: 'sep',
    date: 'September 2026',
    label: 'Hardware Deployment',
    status: 'future',
    icon: Package,
    color: 'blue',
    badge: 'Q3 2026',
    items: [
      'Operator hardware shipments commence to all registered locations.',
      'Delivery includes the Mālama-Provisioned enclosure, sensors, solar UPS, Ethernet cable, and soil probe.',
      'Operators unbox, mount, and charge the solar-powered NEMA 4X enclosure — 30 minutes setup.',
      'Connect to local internet via Waterproof Ethernet or Wi-Fi bridge.',
    ],
    cta: null,
  },
  {
    id: 'oct-boot',
    date: 'Late Sept — Early Oct 2026',
    label: 'Boot & Register',
    status: 'future',
    icon: Cpu,
    color: 'violet',
    badge: 'Q4 2026',
    items: [
      'Secure connection string booting takes ~30 minutes from power-on.',
      'The node connects to the Mālama DePIN network and registers its ATECC608B device key.',
      '25% token allocation (31,250 MLMA) vests instantly on first verified boot.',
      'Node appears on the live network map as “Active” — data validation begins immediately.',
    ],
    cta: null,
  },
  {
    id: 'oct-earn',
    date: 'Early–Mid October 2026',
    label: 'First Rewards Accrue',
    status: 'future',
    icon: TrendingUp,
    color: 'amber',
    badge: 'Revenue',
    items: [
      'Network metrics flow live across the DePIN — validation checks process continuously.',
      'Earn 8–100K MLMA/month depending on hex demand and geographic multiplier.',
      '75% monthly vesting unlocks commence — ~7,813 MLMA/month for 12 months.',
      'Payback on $2,000 entry: 2 weeks (high demand) · 4 weeks (medium) · 12 weeks (low).',
    ],
    cta: { label: 'View Economics', href: '/#economics' },
  },
]

export default function TimelinePage() {
  const [expanded, setExpanded] = useState<string>('may')

  return (
    <div className="w-full min-h-screen bg-[#0A1628] px-4 pb-32">
      {/* Hero */}
      <div className="max-w-4xl mx-auto pt-24 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="inline-flex items-center px-4 py-1.5 mb-8 text-xs font-black uppercase tracking-widest text-malama-accent border border-malama-accent/30 rounded-full bg-malama-accent/10">
          <span className="w-2 h-2 rounded-full bg-malama-accent animate-pulse mr-2" />
          Genesis 200 — Phase 1 Roadmap
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">
          Reserve to{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-malama-accent to-malama-accent-dim">
            Revenue
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
          From your first reservation in May 2026 to earning MLMA rewards in October —
          every step, milestone, and vesting moment mapped out.
        </motion.p>
      </div>

      {/* Timeline */}
      <div className="max-w-3xl mx-auto relative">
        {/* Vertical connector line */}
        <div className="absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-malama-accent/60 via-blue-500/40 via-violet-500/40 to-amber-500/60 hidden md:block" />

        <div className="space-y-4">
          {phases.map((phase, i) => {
            const c = colorMap[phase.color]
            const Icon = phase.icon
            const isOpen = expanded === phase.id

            return (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative"
              >
                {/* Node dot on timeline */}
                <div className={`absolute left-6 top-6 w-5 h-5 rounded-full ${c.dot} ring-4 ${c.ring} hidden md:block z-10`} />

                <div className="md:ml-20">
                  {/* Header (always visible, clickable) */}
                  <button
                    onClick={() => setExpanded(isOpen ? '' : phase.id)}
                    className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 ${c.bg} ${c.border} ${isOpen ? c.glow : 'hover:border-gray-700'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-6 h-6 ${c.text}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1 flex-wrap">
                            <span className={`text-xs font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${c.badge}`}>
                              {phase.badge}
                            </span>
                            <span className="text-gray-500 text-xs font-mono">{phase.date}</span>
                          </div>
                          <h2 className={`text-xl md:text-2xl font-black text-white`}>{phase.label}</h2>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex-shrink-0"
                      >
                        <ChevronDown className={`w-6 h-6 ${c.text}`} />
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
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className={`mt-2 p-6 rounded-2xl border ${c.border} bg-[#0d1e35]`}>
                          <ul className="space-y-3 mb-6">
                            {phase.items.map((item, j) => (
                              <motion.li
                                key={j}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: j * 0.06 }}
                                className="flex items-start gap-3 text-gray-300 text-sm leading-relaxed"
                              >
                                <CheckCircle2 className={`w-5 h-5 ${c.bullet} flex-shrink-0 mt-0.5`} />
                                <span>{item}</span>
                              </motion.li>
                            ))}
                          </ul>

                          {phase.cta && (
                            <Link
                              href={phase.cta.href}
                              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all hover:scale-105 ${c.cta}`}
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

        {/* Summary strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:ml-20">
          {[
            { label: 'Entry Price', value: '$2,000', sub: 'One-time at reserve' },
            { label: 'MLMA Allocation', value: '125K', sub: '25% at boot · 75% vested' },
            { label: 'First Rewards', value: 'Oct 2026', sub: 'Early-mid month' },
            { label: 'Payback', value: '2-12 wks', sub: 'Demand dependent' },
          ].map(({ label, value, sub }) => (
            <div key={label} className="bg-[#0d1e35] border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-gray-500 text-xs uppercase tracking-widest mb-1">{label}</div>
              <div className="text-xl font-black text-malama-accent">{value}</div>
              <div className="text-gray-600 text-xs mt-1">{sub}</div>
            </div>
          ))}
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-12 md:ml-20 p-8 rounded-2xl border border-malama-accent/30 bg-malama-accent/5 text-center">
          <p className="text-malama-accent font-bold text-lg mb-2">⏳ 190 of 200 nodes remaining for public allocation</p>
          <p className="text-gray-400 text-sm mb-6">10 nodes reserved for Mālama Labs team · Allocation closes June 2026 or when sold</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/presale"
              className="px-8 py-4 bg-malama-accent text-white font-black rounded-full hover:scale-105 transition-transform shadow-[0_0_30px_rgba(196,240,97,0.3)]">
              Reserve with Crypto or Card
            </Link>
            <Link href="/map"
              className="px-8 py-4 border border-malama-accent/40 text-malama-accent font-black rounded-full hover:bg-malama-accent/10 transition-all">
              Browse Available Hexes
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
