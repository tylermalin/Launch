'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  CheckCircle2,
  HeartHandshake,
  HelpCircle,
  Radio,
  Shield,
  Wrench,
} from 'lucide-react'

const TABS = [
  { id: 'onboard', label: 'Onboarding' },
  { id: 'hardware', label: 'Hardware & mount' },
  { id: 'isda', label: 'ISDA' },
  { id: 'support', label: 'Support' },
] as const

const STEPS = [
  {
    title: 'Preparation',
    body: 'Choose a deployment location with reliable solar exposure (or another power source), physical security, and stable internet.',
    icon: Radio,
  },
  {
    title: 'Mounting',
    body: 'Install using included mounts — most setups finish in under 30 minutes. Keep the sensor array exposed to open air for accurate readings.',
    icon: Wrench,
  },
  {
    title: 'dApp sync',
    body: 'After unboxing, use the Mālama Labs dApp to link your hardware’s unique ATECC slot ID to your Ethereum or Cardano address.',
    icon: Shield,
  },
]

export default function OperatorsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('onboard')
  const [done, setDone] = useState<Record<number, boolean>>({})

  const toggleStep = (i: number) => {
    setDone((d) => ({ ...d, [i]: !d[i] }))
  }

  return (
    <div className="max-w-3xl">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <p className="text-xs font-black uppercase tracking-widest text-amber-400 mb-2">Genesis Phase 1</p>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
          Operator documentation
        </h1>
        <p className="text-lg text-gray-400 leading-relaxed">
          How to deploy, connect, and steward your hex node — including Indigenous revenue sharing when applicable.
        </p>
      </motion.header>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-800 pb-4">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              tab === t.id
                ? 'bg-amber-500 text-black'
                : 'text-gray-500 hover:text-white hover:bg-white/5'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'onboard' && (
          <motion.div
            key="onboard"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-6"
          >
            <p className="text-gray-400 text-sm leading-relaxed">
              Welcome to the Genesis Node stack. By operating this hardware you anchor a geographic hex zone on the Mālama DePIN. Work through the checklist — it stays in your browser.
            </p>
            {STEPS.map((s, i) => {
              const Icon = s.icon
              const checked = !!done[i]
              return (
                <button
                  key={s.title}
                  type="button"
                  onClick={() => toggleStep(i)}
                  className={`w-full text-left rounded-2xl border p-5 flex gap-4 transition-all ${
                    checked
                      ? 'border-malama-accent/50 bg-malama-accent/10'
                      : 'border-gray-800 bg-[#0d1e35] hover:border-gray-700'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      checked ? 'bg-malama-accent/30 text-malama-accent' : 'bg-gray-800 text-gray-500'
                    }`}
                  >
                    {checked ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-black text-white mb-1">{s.title}</p>
                    <p className="text-sm text-gray-400 leading-relaxed">{s.body}</p>
                    <p className="text-xs text-gray-600 mt-2">Tap to mark {checked ? 'incomplete' : 'done'}</p>
                  </div>
                </button>
              )
            })}
          </motion.div>
        )}

        {tab === 'hardware' && (
          <motion.div
            key="hardware"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-2xl border border-gray-800 bg-[#0d1e35] p-6 space-y-4"
          >
            <div className="flex items-center gap-3 text-malama-accent font-bold">
              <BookOpen className="w-5 h-5" /> Field notes
            </div>
            <ul className="space-y-3 text-sm text-gray-300 leading-relaxed">
              <li>• Aim for clear sky view for solar; use extension cables if the enclosure must sit in partial shade.</li>
              <li>• Verify gasket seals before first storm — NEMA-rated enclosure protects electronics, not calibration if flooded.</li>
              <li>• Ethernet preferred; Wi-Fi bridge acceptable if packet loss stays low for validation windows.</li>
            </ul>
            <p className="text-xs text-gray-600 pt-2">
              Detailed BOM and troubleshooting ship with your kit; Discord operators channel for live help.
            </p>
          </motion.div>
        )}

        {tab === 'isda' && (
          <motion.div
            key="isda"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-500/10 to-orange-500/5 p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 text-rose-300 font-bold mb-4">
              <HeartHandshake className="w-6 h-6" /> Indigenous Stewardship Agreement (ISDA)
            </div>
            <p className="text-sm text-gray-300 leading-relaxed mb-4">
              Where your hex overlaps self-identified Indigenous communities, a portion of node revenue routes automatically to registered steward DAOs —{' '}
              <span className="text-white font-semibold">15% default</span>, up to{' '}
              <span className="text-white font-semibold">25%</span> under protocol parameters.
            </p>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Settlement executes in MLMA via smart contracts; no manual invoicing. Eligibility and beneficiary registries are governed by community and protocol policy.
            </p>
            <div className="rounded-xl bg-black/20 border border-white/10 p-4 text-xs text-gray-500">
              If you believe your territory may intersect Indigenous lands, coordinate early with Mālama stewardship reviewers before final mount.
            </div>
          </motion.div>
        )}

        {tab === 'support' && (
          <motion.div
            key="support"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
          >
            {[
              {
                q: 'Where do I get firmware or pairing help?',
                a: 'Use the Launch Discord and hardware ticket queue — include your ATECC slot ID and hex ID.',
              },
              {
                q: 'Can I move my node to a new hex?',
                a: 'Territory is tied to your license NFT; transfers follow governance and resale rules. Contact support before relocating.',
              },
              {
                q: 'What if validation volume is low at launch?',
                a: 'Network demand ramps with data partners. See Pricing & ROI for tiered scenarios and payback ranges.',
              },
            ].map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-gray-800 bg-[#0d1e35] p-5">
                <div className="flex gap-2 text-white font-bold text-sm mb-2">
                  <HelpCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  {faq.q}
                </div>
                <p className="text-sm text-gray-400 leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
            <div className="flex flex-wrap gap-3 pt-4">
              <Link
                href="/docs/pricing-roi"
                className="text-sm font-bold text-malama-accent hover:text-malama-accent-dim"
              >
                Pricing & ROI →
              </Link>
              <Link href="/" className="text-sm font-bold text-gray-500 hover:text-gray-300">
                Launch page →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-12 text-xs text-gray-600 border-t border-gray-800 pt-6">
        Genesis Phase 1 Operator Bundle — companion to shipped runbooks. For binding terms, refer to your reservation agreement and on-chain policies.
      </p>
    </div>
  )
}
