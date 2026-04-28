'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { CheckCircle2, Rocket, Package, Cpu, Shield, TrendingUp } from 'lucide-react'

const STEPS = [
  {
    id: 'reserve',
    num: '01',
    date: 'May 2, 2026',
    short: 'Reserve',
    status: 'Open Now',
    title: 'Pre-Sale Opens',
    icon: Rocket,
    color: 'emerald',
    bullets: [
      'Pre-sale officially opens. Reserve your Genesis 200 node for $2,000 — hardware ($380) plus geographic hex license ($1,620).',
      'Pre-qualification via the reservation portal confirms region availability, capital requirement, and shipping address before payment is processed.',
      'On payment, your NFT-HEX geographic rights object is minted on Cardano and Base. This is your H3 hex cell license and it is yours at reservation. The Cardano CIP-25 token record is your on-chain proof of reservation.',
      'Your 125,000 MLMA allocation does not arrive at reservation. It begins vesting at hardware boot in October 2026. At reservation you receive the NFT-HEX only.',
      'Hardware pre-order is queued immediately. Your unit ships in September 2026 based on reservation order.',
    ],
    receive: 'NFT-HEX geographic rights object minted on Cardano and Base',
    ctas: true,
  },
  {
    id: 'close',
    num: '02',
    date: 'May 31, 2026',
    short: 'Closes',
    status: 'Hard cap',
    title: 'Reservation Window Closes',
    icon: Shield,
    color: 'emerald',
    bullets: [
      'Reservation window closes May 31, 2026 or when all 195 external nodes are sold — whichever comes first.',
      '5 nodes are reserved for Mālama Labs team and production use (Dallas / DFW area) and are not available for external reservation.',
      'Zone assignment is locked on-chain at closing. No hex transfers are permitted after the window closes except per the resale rules in your reservation agreement.',
      'If you reserved before close, your order is confirmed and your hardware build enters the production queue.',
    ],
    receive: 'Zone assignment locked on-chain',
    ctas: false,
  },
  {
    id: 'ship',
    num: '03',
    date: 'September 2026',
    short: 'Ships',
    status: 'Q3 2026',
    title: 'Hardware Deployment',
    icon: Package,
    color: 'blue',
    bullets: [
      'Operator hardware shipments commence by reservation order. Earlier reservations ship first.',
      'Each kit includes the Mālama-provisioned NEMA 4X IP67 enclosure, Raspberry Pi Zero 2W, ATECC608B secure element, RS485 7-in-1 soil probe, BME280 atmospheric sensor, Waveshare SIM7600G LTE HAT, solar panel, and UPS battery.',
      'Unbox, mount, and connect to your internet source. Most setups complete in under 30 minutes. Detailed mounting instructions and LED status code reference ship with the kit.',
      'Hardware ships with a pre-configured Mālama Genesis 300 node image and your Device DID pre-provisioned on the ATECC608B secure element.',
    ],
    receive: 'Pre-configured Genesis 300 node with ATECC608B device DID',
    ctas: false,
  },
  {
    id: 'boot',
    num: '04',
    date: 'Late Sept – Early Oct 2026',
    short: 'Boot',
    status: 'Q4 2026',
    title: 'Boot & Register',
    icon: Cpu,
    color: 'violet',
    bullets: [
      'Power on. The ATECC608B secure element provisions its device DID on first boot — approximately 60 seconds. The LED status sequence confirms successful provisioning.',
      'Open the Mālama Labs dApp and connect your Base or Cardano wallet. Enter your node\'s Device DID to bind your hardware identity to your NFT-HEX geographic assignment.',
      'Deployment registration triggers MLMA vesting: 31,250 MLMA (25% of 125K) releases at successful boot registration.',
      'Node appears on the live network map as "Active". First SaveCard validation should appear within 15–30 minutes of successful registration.',
    ],
    receive: '31,250 MLMA at boot (25% of 125K allocation)',
    ctas: false,
  },
  {
    id: 'audit',
    num: '05',
    date: 'October 2026',
    short: 'Audit',
    status: 'Gate',
    title: 'Genesis Hex Sale Audit',
    icon: Shield,
    color: 'amber',
    bullets: [
      'MLMA validation rewards do not begin at a calendar date. They begin after the Genesis Hex Sale audit confirms your node is operational and compliant.',
      'The audit is conducted by an independent reviewer engaged by Mālama Labs. Results are communicated via the dApp and your reservation email.',
      'Nodes that pass receive full Year 1 Genesis multiplier benefits (1.5× GX) from the clearance date.',
      'Nodes that do not yet pass are notified with specific remediation steps. Vesting is not affected by audit status — only validation rewards are withheld until compliance is confirmed.',
    ],
    receive: 'Audit clearance · full Year 1 Genesis 1.5× multiplier confirmed',
    ctas: false,
  },
  {
    id: 'rewards',
    num: '06',
    date: 'Post-audit · Oct 2026',
    short: 'Earn',
    status: 'Revenue',
    title: 'First Validation Rewards Accrue',
    icon: TrendingUp,
    color: 'teal',
    bullets: [
      'Network metrics flow live. Your node validates carbon SaveCards and AI compute attestations continuously.',
      'Earn MLMA based on your Geographic Multiplier (0.5×–3.0×), Data Quality Score, Uptime Factor, and Genesis 1.5× multiplier (Year 1 only). Rewards are relative to total network validation volume — not fixed per-node amounts.',
      '75% monthly vesting continues: approximately 7,813 MLMA per month for 12 months after boot.',
      'Operator economics depend on data demand in your hex, your validation score, and MLMA market conditions. No earnings guarantees are made.',
    ],
    receive: 'Monthly MLMA rewards from emission pool · 7,813 MLMA/month allocation continues',
    ctas: false,
  },
] as const

const colorMap: Record<string, { ring: string; bg: string; text: string; border: string; line: string; dot: string; badge: string }> = {
  emerald: {
    ring: 'ring-malama-accent/50',
    bg: 'bg-malama-accent/10',
    text: 'text-malama-accent',
    border: 'border-malama-accent/40',
    line: 'from-malama-accent',
    dot: 'bg-malama-accent',
    badge: 'bg-malama-accent/15 text-malama-accent border-malama-accent/30',
  },
  blue: {
    ring: 'ring-blue-500/50',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/40',
    line: 'from-blue-500',
    dot: 'bg-blue-400',
    badge: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  },
  violet: {
    ring: 'ring-violet-500/50',
    bg: 'bg-violet-500/10',
    text: 'text-violet-400',
    border: 'border-violet-500/40',
    line: 'from-violet-500',
    dot: 'bg-violet-400',
    badge: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
  },
  amber: {
    ring: 'ring-amber-500/50',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/40',
    line: 'from-amber-500',
    dot: 'bg-amber-400',
    badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  },
  teal: {
    ring: 'ring-teal-500/50',
    bg: 'bg-teal-500/10',
    text: 'text-teal-400',
    border: 'border-teal-500/40',
    line: 'from-teal-500',
    dot: 'bg-teal-400',
    badge: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
  },
}

export default function Phase1TimelinePage() {
  const [active, setActive] = useState(0)
  const step = STEPS[active]
  const c = colorMap[step.color]

  return (
    <div className="max-w-3xl">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <p className="text-xs font-black uppercase tracking-widest text-malama-accent mb-2">Genesis 200 · Documentation</p>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
          Phase 1 Timeline
        </h1>
        <p className="text-base text-gray-400 leading-relaxed">
          From reservation to first validation rewards — tap a phase to explore milestones, dates, and what happens at each step.
        </p>
      </motion.header>

      <div className="rounded-xl border border-malama-accent/20 bg-malama-accent/5 p-4 mb-10 text-sm text-gray-300 leading-relaxed">
        The Genesis 200 program is designed to bootstrap a globally distributed validation layer for real-world data. Early operator
        incentives are front-loaded to ensure rapid deployment and network reliability prior to revenue maturity. Long-term operator
        economics are derived exclusively from protocol revenue generated by enterprise data usage.
      </div>

      {/* Step strip */}
      <div className="mb-6 overflow-x-auto pb-2 -mx-1 px-1">
        <div className="flex gap-2 min-w-max">
          {STEPS.map((s, i) => {
            const sc = colorMap[s.color]
            const isOn = i === active
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActive(i)}
                className={`relative flex flex-col items-center text-center px-4 py-3 rounded-xl border transition-all duration-200 min-w-[90px] ${
                  isOn ? `${sc.bg} ${sc.border} ring-2 ${sc.ring}` : 'border-gray-800 bg-[#0d1e35] hover:border-gray-700'
                }`}
              >
                <span className={`text-[9px] font-black uppercase tracking-widest mb-0.5 ${isOn ? sc.text : 'text-gray-600'}`}>
                  Step {s.num}
                </span>
                <span className={`text-xs font-bold ${isOn ? 'text-white' : 'text-gray-400'}`}>{s.short}</span>
                <span className={`text-[10px] mt-0.5 ${isOn ? sc.text : 'text-gray-600'}`}>{s.status}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Active card */}
      <motion.div
        key={step.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className={`rounded-2xl border ${c.border} bg-[#0d1e35] overflow-hidden mb-10`}
      >
        <div className={`h-1 bg-gradient-to-r ${c.line} to-transparent`} />
        <div className="p-6 sm:p-8">
          <div className="flex items-start gap-4 mb-5">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${c.bg} border ${c.border}`}>
              {(() => { const Icon = step.icon; return <Icon className={`w-6 h-6 ${c.text}`} /> })()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${c.badge}`}>
                  {step.status}
                </span>
                <span className="text-xs font-mono text-gray-500">{step.date}</span>
              </div>
              <h2 className="text-xl font-black text-white">Step {step.num} · {step.title}</h2>
            </div>
          </div>

          <ul className="space-y-3 mb-6">
            {step.bullets.map((b, i) => (
              <li key={i} className="flex gap-3 text-gray-300 text-sm leading-relaxed">
                <CheckCircle2 className={`w-4 h-4 ${c.text} shrink-0 mt-0.5`} />
                {b}
              </li>
            ))}
          </ul>

          {step.ctas && (
            <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-gray-800">
              <Link
                href="/presale"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-malama-accent text-malama-bg font-black text-sm rounded-xl hover:bg-malama-accent/90 transition-all"
              >
                Reserve with Crypto or Card →
              </Link>
              <Link
                href="/map"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 border border-malama-accent/40 text-malama-accent font-black text-sm rounded-xl hover:bg-malama-accent/8 transition-all"
              >
                Browse Available Hexes
              </Link>
            </div>
          )}
        </div>
      </motion.div>

      {/* At a Glance */}
      <section className="mb-10">
        <h2 className="text-lg font-black text-white mb-4">At a Glance</h2>
        <div className="rounded-2xl border border-gray-800 bg-[#0d1e35] overflow-hidden">
          {[
            { date: 'May 2, 2026', event: 'Pre-sale opens', detail: 'Reserve · pay $2,000 · receive NFT-HEX', dot: 'bg-malama-accent' },
            { date: 'May 31, 2026', event: 'Closes', detail: '195 external nodes · hard cap', dot: 'bg-malama-accent' },
            { date: 'September 2026', event: 'Hardware ships', detail: 'Priority batches by reservation order', dot: 'bg-blue-400' },
            { date: 'Late Sept – Oct 2026', event: 'Boot & register', detail: '125,000 MLMA vesting begins at boot', dot: 'bg-violet-400' },
            { date: 'October 2026', event: 'Audit clears', detail: 'Pre-emission gate · rewards begin after', dot: 'bg-amber-400' },
          ].map((row, i, arr) => (
            <div key={i} className={`flex items-start gap-4 px-5 py-4 ${i < arr.length - 1 ? 'border-b border-gray-800' : ''}`}>
              <div className="flex flex-col items-center shrink-0 mt-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${row.dot}`} />
                {i < arr.length - 1 && <span className="w-px flex-1 bg-gray-800 mt-1 h-6" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="font-mono text-xs text-gray-500">{row.date}</span>
                  <span className="font-bold text-white text-sm">{row.event}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{row.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Full milestone table */}
      <section className="mb-10">
        <h2 className="text-lg font-black text-white mb-4">Full milestone table</h2>
        <div className="overflow-x-auto rounded-2xl border border-gray-800 bg-[#0d1e35]">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="border-b border-gray-800 text-left">
                {['Step', 'Milestone', 'Date', 'What you receive'].map((h) => (
                  <th key={h} className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {STEPS.map((s, i) => {
                const sc = colorMap[s.color]
                return (
                  <tr
                    key={s.id}
                    className={`border-t border-gray-800/80 cursor-pointer transition-colors hover:bg-white/[0.02] ${active === i ? sc.bg : ''}`}
                    onClick={() => setActive(i)}
                  >
                    <td className={`px-4 py-3 font-black font-mono ${sc.text}`}>{s.num}</td>
                    <td className="px-4 py-3 font-semibold text-white">{s.title}</td>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs whitespace-nowrap">{s.date}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs leading-relaxed">{s.receive}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-600 mt-2">Click any row to jump to that step above.</p>
      </section>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/timeline"
          className="flex-1 text-center px-5 py-3 rounded-xl border border-gray-700 text-gray-300 font-bold hover:bg-white/5 transition-colors text-sm"
        >
          Full roadmap view →
        </Link>
        <Link
          href="/presale"
          className="flex-1 text-center px-5 py-3 rounded-xl bg-malama-accent text-malama-bg font-black text-sm hover:bg-malama-accent/90 transition-colors"
        >
          Reserve a node
        </Link>
      </div>
    </div>
  )
}
