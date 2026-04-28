'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowRight,
  Share2,
  DollarSign,
  Zap,
  Users,
  BarChart3,
  CheckCircle2,
  Copy,
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4 } }),
}

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Apply & get approved',
    desc: 'Submit your details. Once approved you\'ll receive your personal referral link within 24 hours.',
    icon: Users,
  },
  {
    step: '02',
    title: 'Share your link',
    desc: 'Post it anywhere — Twitter, Telegram, YouTube, newsletters. Every visit is tracked for 30 days.',
    icon: Share2,
  },
  {
    step: '03',
    title: 'Earn on every node sold',
    desc: 'When someone buys a Genesis Hex Node through your link, your commission is auto-issued in USDC.',
    icon: DollarSign,
  },
]

const TIERS = [
  {
    label: 'Standard Partner',
    bps: '10%',
    usd: '$200',
    desc: 'All approved KOL partners',
    accent: 'border-malama-line',
    badge: 'bg-malama-card text-malama-ink-dim',
  },
  {
    label: 'Genesis Partner',
    bps: '15%',
    usd: '$300',
    desc: 'First 20 approved partners',
    accent: 'border-malama-accent/50',
    badge: 'bg-malama-accent/10 text-malama-accent',
    featured: true,
  },
  {
    label: 'Whale Tier',
    bps: '20%',
    usd: '$400',
    desc: '5+ nodes referred',
    accent: 'border-blue-500/30',
    badge: 'bg-blue-500/10 text-blue-400',
  },
]

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-malama-bg">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16">
        <motion.div initial="hidden" animate="show" variants={fadeUp} custom={0}>
          <p className="text-xs font-black uppercase tracking-widest text-malama-accent mb-4">
            Mālama Partner Program
          </p>
          <h1 className="text-5xl md:text-6xl font-serif font-black text-white tracking-tight leading-none mb-6">
            Earn rewards for<br />
            <span className="text-malama-accent">spreading the word</span>
          </h1>
          <p className="text-lg text-malama-ink-dim max-w-2xl leading-relaxed mb-10">
            Share your referral link. When someone buys a Genesis Hex Node, you earn USDC — automatically,
            on every sale. No caps, no waiting periods.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/partners/apply"
              className="inline-flex items-center gap-2 bg-malama-accent text-malama-bg font-black text-sm uppercase tracking-wider px-6 py-3 rounded-malama hover:bg-malama-accent/90 transition-colors"
            >
              Apply now <ArrowRight size={15} />
            </Link>
            <Link
              href="/partners/dashboard"
              className="inline-flex items-center gap-2 border border-malama-line text-malama-ink text-sm font-medium px-6 py-3 rounded-malama hover:border-malama-line-bright transition-colors"
            >
              Partner dashboard
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────── */}
      <section className="border-y border-malama-line bg-malama-elev">
        <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Node price', value: '$2,000' },
            { label: 'Max commission', value: '$400' },
            { label: 'Cookie window', value: '30 days' },
            { label: 'Payout asset', value: 'USDC · Base' },
          ].map((s, i) => (
            <motion.div key={s.label} initial="hidden" animate="show" variants={fadeUp} custom={i + 1}>
              <p className="text-2xl font-black text-malama-accent font-mono">{s.value}</p>
              <p className="text-xs text-malama-ink-dim uppercase tracking-wider mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <motion.p
          initial="hidden" animate="show" variants={fadeUp} custom={0}
          className="text-xs font-black uppercase tracking-widest text-malama-accent mb-3"
        >
          How it works
        </motion.p>
        <motion.h2
          initial="hidden" animate="show" variants={fadeUp} custom={1}
          className="text-3xl font-serif font-black text-white mb-12"
        >
          Three steps to your first payout
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-6">
          {HOW_IT_WORKS.map((item, i) => (
            <motion.div
              key={item.step}
              initial="hidden" animate="show" variants={fadeUp} custom={i + 2}
              className="bg-malama-card border border-malama-line rounded-malama p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-black font-mono text-malama-ink-faint">{item.step}</span>
                <item.icon size={20} className="text-malama-accent" />
              </div>
              <h3 className="font-black text-white mb-2">{item.title}</h3>
              <p className="text-sm text-malama-ink-dim leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Commission tiers ─────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <motion.p
          initial="hidden" animate="show" variants={fadeUp} custom={0}
          className="text-xs font-black uppercase tracking-widest text-malama-accent mb-3"
        >
          Commission structure
        </motion.p>
        <motion.h2
          initial="hidden" animate="show" variants={fadeUp} custom={1}
          className="text-3xl font-serif font-black text-white mb-10"
        >
          Earn more as you grow
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-5">
          {TIERS.map((tier, i) => (
            <motion.div
              key={tier.label}
              initial="hidden" animate="show" variants={fadeUp} custom={i + 2}
              className={`relative bg-malama-card border rounded-malama p-6 ${tier.accent} ${tier.featured ? 'ring-1 ring-malama-accent/30' : ''}`}
            >
              {tier.featured && (
                <div className="absolute -top-3 left-4">
                  <span className="bg-malama-accent text-malama-bg text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                    Most popular
                  </span>
                </div>
              )}
              <span className={`inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded mb-4 ${tier.badge}`}>
                {tier.label}
              </span>
              <p className="text-4xl font-black font-mono text-white mb-1">{tier.bps}</p>
              <p className="text-malama-ink-dim text-sm mb-3">per sale · <span className="text-malama-accent font-mono">{tier.usd}</span> per node</p>
              <p className="text-xs text-malama-ink-faint">{tier.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FAQ strip ────────────────────────────────────────── */}
      <section className="border-t border-malama-line bg-malama-elev">
        <div className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10">
          {[
            {
              q: 'When do I get paid?',
              a: 'Commissions are issued automatically when the node mint confirms on-chain. Payouts are batched weekly in USDC to your registered Base wallet.',
            },
            {
              q: 'Is there a referral cap?',
              a: 'No. Refer as many buyers as you like. The 400 Genesis nodes are the only natural limit.',
            },
            {
              q: 'How long does the cookie last?',
              a: '30 days from first click. If someone returns and buys within 30 days of clicking your link, you earn the commission.',
            },
            {
              q: 'Can I refer on both chains?',
              a: 'Yes. Commissions are tracked per-sale regardless of whether the buyer mints on Base or Cardano.',
            },
          ].map((faq, i) => (
            <motion.div key={faq.q} initial="hidden" animate="show" variants={fadeUp} custom={i}>
              <div className="flex gap-3">
                <CheckCircle2 size={16} className="text-malama-accent mt-0.5 shrink-0" />
                <div>
                  <p className="font-black text-white mb-1">{faq.q}</p>
                  <p className="text-sm text-malama-ink-dim leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <motion.div initial="hidden" animate="show" variants={fadeUp} custom={0}>
          <Zap size={32} className="text-malama-accent mx-auto mb-4" />
          <h2 className="text-3xl font-serif font-black text-white mb-4">Ready to start earning?</h2>
          <p className="text-malama-ink-dim mb-8 max-w-md mx-auto">
            Applications are reviewed within 24 hours. Join the network of early partners helping launch Mālama.
          </p>
          <Link
            href="/partners/apply"
            className="inline-flex items-center gap-2 bg-malama-accent text-malama-bg font-black text-sm uppercase tracking-wider px-8 py-3 rounded-malama hover:bg-malama-accent/90 transition-colors"
          >
            Apply to become a partner <ArrowRight size={15} />
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
