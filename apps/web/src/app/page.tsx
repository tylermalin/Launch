'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } }),
}

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full">

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section id="hero" className="relative w-full min-h-[88vh] flex flex-col items-center justify-center overflow-hidden px-4">
        {/* hex bg pattern */}
        <div className="absolute inset-0 z-0 opacity-10 flex items-center justify-center">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hex" width="60" height="103.92" patternUnits="userSpaceOnUse" patternTransform="scale(1.5)">
                <path d="M30 0l30 17.32v34.64L30 69.28 0 51.96V17.32z" fill="none" stroke="#10B981" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hex)" />
          </svg>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A1628] z-0" />

        <div className="z-10 text-center max-w-4xl flex flex-col items-center">
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
            className="inline-flex items-center px-4 py-1.5 mb-8 text-xs font-black uppercase tracking-widest text-emerald-400 border border-emerald-500/30 rounded-full bg-emerald-500/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-2" />
            Genesis 200 Scarcity Edition
          </motion.div>

          <motion.h1 variants={fadeUp} initial="hidden" animate="show" custom={1}
            className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-white leading-tight">
            Own the Infrastructure<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              of Verified Carbon
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} initial="hidden" animate="show" custom={2}
            className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed mb-8">
            A Hex Node validates environmental data on shared protocol. Real-time verified evidence.
            Predictable revenue. Indigenous stewardship built in.
          </motion.p>

          {/* Genesis callout */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
            className="w-full max-w-xl text-left p-5 bg-emerald-500/10 border-l-4 border-emerald-500 rounded-xl mb-10">
            <p className="text-emerald-400 font-bold text-base mb-1">Genesis 200 — $2,000 per node</p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Limited to 200 validators in key geographic zones. Allocation closes when sold or June 2026.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4}
            className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <a href="#reserve"
              className="px-8 py-4 bg-emerald-500 text-white font-black text-lg rounded-full hover:scale-105 transition-transform shadow-[0_0_40px_rgba(16,185,129,0.4)]">
              Reserve Your Genesis Node Now
            </a>
            <a href="#economics"
              className="px-8 py-4 bg-transparent border-2 border-emerald-500/40 text-emerald-400 font-black text-lg rounded-full hover:bg-emerald-500/10 transition-all">
              Explore Economics
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── HARDWARE ───────────────────────────────────────────────── */}
      <section id="hardware" className="w-full py-24 px-4 bg-[#0A1628]">
        <div className="max-w-6xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="text-4xl font-extrabold text-white text-center mb-4">
            The Hex Node Hardware
          </motion.h2>
          <p className="text-gray-400 text-center mb-12 text-lg">
            Everything you need to validate environmental data — shipped to your door.
          </p>
          <div className="flex flex-col gap-8">
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
              className="rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/hardware-exploded.png" alt="Mālama Hex Node — full hardware exploded view" className="w-full h-auto object-cover" />
            </motion.div>
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={1}
              className="rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/hardware-views.png" alt="Mālama Hex Node — enclosure, power system, sensor and network views" className="w-full h-auto object-cover" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── ECONOMICS CARDS ────────────────────────────────────────── */}
      <section id="economics" className="w-full py-24 px-4 bg-[#0d1e35] border-y border-gray-800">
        <div className="max-w-6xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="text-4xl font-extrabold text-white text-center mb-3">
            Genesis Node Economics
          </motion.h2>
          <p className="text-gray-400 text-center mb-12">
            200 nodes allocated globally. $2,000 entry. Three reward streams. Payback in 2-3 months.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Entry Cost', value: '$2,000', desc: 'One-time payment at reserve. Covers hardware + exclusive geographic license for your hex zone.' },
              { title: 'Your MLMA Allocation', value: '125K MLMA', desc: '25% vests at hardware boot. 75% vests monthly over 12 months. Lock as veMLMA for governance weight.' },
              { title: 'Allocation Value', value: '$12.5K–37.5K', desc: 'At $0.10–0.30/MLMA launch price. Actual price depends on investor demand and network revenue maturity.' },
              { title: 'Monthly Rewards', value: '8–100K MLMA', desc: 'Validation earnings depend on hex demand and geographic multiplier. Scenarios shown below.' },
              { title: 'Payback Timeline', value: '2–12 weeks', desc: 'Entry cost recovers in 2 weeks (high demand), 4 weeks (medium), or 12 weeks (low demand).' },
              { title: 'Revenue Onset', value: 'Oct 2026', desc: 'Reserve May 2026, hardware ships September, deploy late September, earn rewards early-mid October.' },
            ].map(({ title, value, desc }, i) => (
              <motion.div key={title} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i * 0.05}
                className="bg-[#0A1628] p-6 rounded-2xl border border-gray-800 hover:border-emerald-500/40 transition-colors">
                <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">{title}</div>
                <div className="text-2xl font-black text-emerald-400 mb-3">{value}</div>
                <div className="text-sm text-gray-400 leading-relaxed">{desc}</div>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="mt-10 flex flex-wrap justify-center gap-3 text-sm">
            <Link href="/docs/tokenomics" className="px-4 py-2 rounded-full border border-emerald-500/40 text-emerald-400 font-bold hover:bg-emerald-500/10 transition-colors">
              MLMA tokenomics →
            </Link>
            <Link href="/docs/pricing-roi" className="px-4 py-2 rounded-full border border-emerald-500/40 text-emerald-400 font-bold hover:bg-emerald-500/10 transition-colors">
              Interactive pricing & ROI →
            </Link>
            <Link href="/docs" className="px-4 py-2 rounded-full border border-gray-700 text-gray-400 font-bold hover:text-white hover:border-gray-500 transition-colors">
              All documentation
            </Link>
          </motion.div>

          {/* Earnings table */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="mt-16 bg-[#0A1628] rounded-2xl border border-gray-800 p-8">
            <h3 className="text-emerald-400 text-xl font-bold mb-2">Year 1 Illustrative Earnings</h3>
            <p className="text-gray-500 text-sm mb-8">
              200 Genesis nodes · 10–50 validations/hex/day · geographic multipliers 0.5×–3.0× · 99.9% uptime bonus active. <em>Earnings depend entirely on data inflow.</em>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Low Demand Hex', range: '~8–15K', payback: '6–12 weeks', yr1: '$39K–52K' },
                { label: 'Medium Demand Hex', range: '~25–40K', payback: '1–4 weeks', yr1: '$73K–103K' },
                { label: 'High Demand Hex', range: '~50–100K', payback: '<1 week', yr1: '$123K–223K' },
              ].map(({ label, range, payback, yr1 }) => (
                <div key={label} className="bg-[#0d1e35] rounded-xl p-5 border border-gray-800">
                  <div className="text-gray-500 text-xs mb-1">{label}</div>
                  <div className="text-3xl font-black text-emerald-400">{range}</div>
                  <div className="text-gray-500 text-xs mb-3">MLMA per month</div>
                  <div className="text-sm text-gray-400">Payback: <span className="text-white font-semibold">{payback}</span></div>
                  <div className="text-xs text-gray-500 mt-1">Year 1: <span className="text-gray-300">{yr1}</span> (at $0.20/MLMA)</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TIMELINE ───────────────────────────────────────────────── */}
      <section id="timeline" className="w-full py-24 px-4 bg-[#0A1628]">
        <div className="max-w-4xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="text-4xl font-extrabold text-white text-center mb-12">
            Your Timeline: Reserve to Revenue
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                date: 'May 2026 — Reserve',
                steps: ['Visit malamalabs.com/genesis', 'Complete pre-qualification (capital, region)', 'Pay $2,000 entry cost', 'Receive NFT-HEX + 125K MLMA allocation', 'Hardware pre-order ships in September'],
              },
              {
                date: 'Sept–Oct 2026 — Deploy & Earn',
                steps: ['Hardware arrives (September)', 'Unbox, charge, mount (30 minutes)', 'Boot and register node (online form)', 'First MLMA rewards (early-mid October)', 'Earn 8–100K MLMA/month ongoing'],
              },
            ].map(({ date, steps }, i) => (
              <motion.div key={date} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i * 0.1}
                className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                <h3 className="text-emerald-400 font-bold text-lg mb-4">{date}</h3>
                <ul className="space-y-2">
                  {steps.map(s => (
                    <li key={s} className="flex items-start gap-2 text-gray-400 text-sm">
                      <span className="text-emerald-400 mt-0.5">✓</span> {s}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="mt-6 p-5 bg-emerald-500/10 border-l-4 border-emerald-500 rounded-xl">
            <p className="text-gray-400 text-sm leading-relaxed">
              <strong className="text-white">Detailed timeline:</strong> See{' '}
              <a href="/docs/GENESIS_200_PHASE1_TIMELINE.md" className="text-emerald-400 underline">GENESIS_200_PHASE1_TIMELINE.md</a>{' '}
              for complete setup instructions, deployment checklist, and contingency scenarios.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────── */}
      <section id="faq" className="w-full py-24 px-4 bg-[#0d1e35] border-t border-gray-800">
        <div className="max-w-3xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="text-4xl font-extrabold text-white text-center mb-12">
            Frequently Asked Questions
          </motion.h2>
          {[
            { q: 'What does the $2,000 entry cost include?', a: 'Hardware covers a Raspberry Pi Zero 2W, atmospheric sensors, weatherproof enclosure, solar UPS, and secure enclave. The license covers exclusive geographic rights to your hex, Genesis 200 MLMA allocation, platform infrastructure, and 12 months of support. You pay once at reserve (May 2026). Hardware ships in September 2026.' },
            { q: 'When do I receive my 125K MLMA tokens?', a: '25% (31,250 MLMA) vests when your hardware boots and you register. The remaining 75% (93,750 MLMA) vests linearly over 12 months at ~7,813 MLMA/month. After 12 months, all tokens are fully unlocked.' },
            { q: 'How quickly will I recover my $2,000 entry cost?', a: 'Low-demand zones: 6–12 weeks. Medium-demand zones: 1–4 weeks. High-demand zones: less than 1 week. All scenarios assume rewards accrue from early-mid October at $0.10–0.20/MLMA.' },
            { q: 'When do I start earning rewards?', a: 'Reserve by May 31, 2026. Hardware ships September. You deploy in late September / early October. First MLMA rewards accrue in early-mid October 2026.' },
            { q: 'Why only 200 nodes?', a: 'Scarcity ensures geographic multiplier premium and prevents oversupply. Helium deployed 500K+ nodes and collapsed operator returns. We are demand-first: 200 nodes in key zones with pre-screened carbon projects. Genesis 200 ends when sold or June 2026. Phase 2 (2027+) expands at lower initial multipliers.' },
            { q: 'How do geographic multipliers work?', a: 'Your hex (H3 Resolution 5, ~252.9 km²) determines your reward multiplier. Urban: 0.5×, suburban: 1.0×, rural: 1.5×, frontier: 2.0×, strategic: up to 3.0×. High-demand zones (Idaho ERW, LA forestry, NYC emissions, London Article 6.4) are allocated first.' },
            { q: 'What is the Indigenous Stewardship program?', a: 'If your hex overlaps Indigenous territory, stewards receive 10–25% of your node rewards (default 15%), settled monthly in MLMA or fiat. Mālama covers all conversion costs. Disputes resolved via prediction market + DAO governance.' },
          ].map(({ q, a }, i) => (
            <motion.details key={q} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i * 0.05}
              className="mb-4 border border-gray-800 rounded-xl overflow-hidden bg-[#0A1628]">
              <summary className="px-6 py-4 cursor-pointer font-semibold text-white hover:text-emerald-400 transition-colors list-none flex justify-between items-center">
                {q}
                <span className="text-emerald-500 text-xl font-black">+</span>
              </summary>
              <p className="px-6 pb-5 pt-0 text-gray-400 text-sm leading-relaxed">{a}</p>
            </motion.details>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS / PURCHASE FUNNEL ─────────────────────── */}
      <section id="reserve" className="w-full py-24 px-4 bg-[#0A1628]">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="inline-flex items-center px-4 py-1.5 mb-6 text-xs font-black uppercase tracking-widest text-emerald-400 border border-emerald-500/30 rounded-full bg-emerald-500/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-2" />
            200 nodes · Allocation closes June 2026
          </motion.div>

          <motion.h2 variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Ready to Own Climate Infrastructure?
          </motion.h2>
          <p className="text-gray-400 mb-12 leading-relaxed max-w-2xl mx-auto">
            The flow is simple: connect your wallet, pick your hex territory on the live map, and complete your $2,000 reservation. Hardware ships September. Revenue starts October.
          </p>

          {/* 3-step funnel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                step: '01',
                title: 'Connect Wallet',
                desc: 'Link your Cardano (Lace/Nami) and EVM (MetaMask/Coinbase) wallets for dual-chain registration.',
                icon: '🔐',
                href: '/presale',
                cta: 'Connect Wallet →',
              },
              {
                step: '02',
                title: 'Pick Your Hex',
                desc: 'Browse the live network map. Choose one of the 200 available hexes across Idaho, LA, NYC, London, Tokyo + more.',
                icon: '🗺️',
                href: '/map',
                cta: 'Open Explorer →',
              },
              {
                step: '03',
                title: 'Reserve for $2,000',
                desc: 'Confirm your hex, approve $2,000 USDC on Base. Receive your NFT-HEX + 125K MLMA allocation instantly.',
                icon: '⚡',
                href: '/presale',
                cta: 'Reserve Now →',
              },
            ].map(({ step, title, desc, icon, href, cta }, i) => (
              <motion.div key={step} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i * 0.1}
                className="bg-[#0d1e35] border border-gray-800 hover:border-emerald-500/40 transition-colors rounded-2xl p-8 text-left">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{icon}</span>
                  <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">{step}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">{desc}</p>
                <Link href={href}
                  className="inline-block px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-sm font-bold hover:bg-emerald-500/20 transition-colors">
                  {cta}
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/presale"
              className="px-10 py-5 bg-emerald-500 text-white font-black text-xl rounded-full hover:scale-105 transition-transform shadow-[0_0_40px_rgba(16,185,129,0.4)]">
              Reserve Your Genesis Node
            </Link>
            <Link href="/map"
              className="px-10 py-5 bg-transparent border-2 border-emerald-500/40 text-emerald-400 font-black text-xl rounded-full hover:bg-emerald-500/10 transition-all">
              Browse Available Hexes
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────── */}
      <footer className="w-full py-16 border-t border-gray-800 bg-[#0A1628] px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
            {/* Brand */}
            <div>
              <p className="text-white font-black text-lg mb-3">Mālama<span className="text-emerald-400">Labs</span></p>
              <p className="text-gray-500 text-sm leading-relaxed">
                Environmental intelligence network. Cryptographic verified carbon on-chain.
              </p>
            </div>
            {/* Navigation */}
            <div>
              <p className="text-white font-bold text-sm uppercase tracking-widest mb-4">Navigate</p>
              <ul className="space-y-2 text-sm">
                {[
                  { href: '#economics', label: 'Economics' },
                  { href: '#hardware', label: 'Hardware' },
                  { href: '#timeline', label: 'Timeline' },
                  { href: '#faq', label: 'FAQ' },
                  { href: '#reserve', label: 'Reserve Node' },
                  { href: '/map', label: 'Network Explorer' },
                  { href: '/dashboard', label: 'Launch App' },
                  { href: '/presale', label: 'Validator Pre-Sale' },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="text-gray-400 hover:text-emerald-400 transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            {/* Resources — interactive docs */}
            <div>
              <p className="text-white font-bold text-sm uppercase tracking-widest mb-4">Genesis 200 Docs</p>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/docs" className="text-gray-400 hover:text-emerald-400 transition-colors font-semibold">
                    Documentation hub →
                  </Link>
                </li>
                {[
                  { href: '/docs/tokenomics', label: 'MLMA Tokenomics Whitepaper' },
                  { href: '/docs/pricing-roi', label: 'Pricing & ROI Summary' },
                  { href: '/docs/phase-1-timeline', label: 'Phase 1 Timeline' },
                  { href: '/docs/operators', label: 'Operator Documentation' },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="text-gray-400 hover:text-emerald-400 transition-colors">{label}</Link>
                  </li>
                ))}
                <li>
                  <a href="mailto:support@malamalabs.com" className="text-gray-400 hover:text-emerald-400 transition-colors">
                    Email Support
                  </a>
                </li>
                <li>
                  <a href="https://discord.gg/PcKRRUcJ" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-400 transition-colors">
                    Discord Community
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-600 text-sm">
            © 2026 Mālama Labs. Environmental Intelligence Core. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  )
}
