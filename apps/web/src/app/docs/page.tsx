'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, BookOpen, Calculator, CalendarRange, Hexagon } from 'lucide-react'

const cards = [
  {
    href: '/docs/tokenomics',
    title: 'MLMA Tokenomics Whitepaper',
    desc: 'Supply cap, Genesis 200 allocation, vesting mechanics, multipliers, and governance.',
    icon: BookOpen,
    color: 'from-malama-accent/20 to-malama-accent-dim/10',
    border: 'border-malama-accent/30',
  },
  {
    href: '/docs/pricing-roi',
    title: 'Pricing & ROI Summary',
    desc: 'Entry breakdown, interactive scenarios, and payback estimates across demand tiers.',
    icon: Calculator,
    color: 'from-blue-500/20 to-cyan-500/10',
    border: 'border-blue-500/30',
  },
  {
    href: '/docs/phase-1-timeline',
    title: 'Phase 1 Timeline',
    desc: 'From pre-sale through first rewards — milestones, boot, and vesting checkpoints.',
    icon: CalendarRange,
    color: 'from-violet-500/20 to-purple-500/10',
    border: 'border-violet-500/30',
  },
  {
    href: '/docs/operators',
    title: 'Operator Documentation',
    desc: 'Onboarding, mounting, dApp sync, Indigenous Stewardship (ISDA), and support.',
    icon: Hexagon,
    color: 'from-amber-500/20 to-orange-500/10',
    border: 'border-amber-500/30',
  },
]

export default function DocsHubPage() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <p className="text-xs font-black uppercase tracking-widest text-malama-accent mb-3">Genesis 200</p>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
          Documentation Hub
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl leading-relaxed">
          Interactive references for token design, economics, rollout timing, and running your hex node. Pick a topic or use the sidebar on desktop.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-5">
        {cards.map((c, i) => (
          <motion.div
            key={c.href}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Link
              href={c.href}
              className={`group block h-full p-6 rounded-2xl border ${c.border} bg-gradient-to-br ${c.color} hover:scale-[1.01] transition-transform duration-300`}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-black/20 border border-white/10 flex items-center justify-center">
                  <c.icon className="w-6 h-6 text-white/90" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-malama-accent group-hover:translate-x-0.5 transition-all" />
              </div>
              <h2 className="text-xl font-black text-white mb-2">{c.title}</h2>
              <p className="text-sm text-gray-400 leading-relaxed">{c.desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="mt-12 p-6 rounded-2xl border border-gray-800 bg-[#0d1e35] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <p className="font-bold text-white mb-1">Prefer the roadmap view?</p>
          <p className="text-sm text-gray-500">The standalone timeline page uses the same milestones with expandable phases.</p>
        </div>
        <Link
          href="/timeline"
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-malama-accent/40 text-malama-accent font-bold text-sm hover:bg-malama-accent/10 whitespace-nowrap"
        >
          Open timeline →
        </Link>
      </motion.div>
    </div>
  )
}
