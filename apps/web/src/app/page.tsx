'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } }),
}

export default function Home() {
  return (
    <div className="flex w-full flex-col items-center">
      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section
        id="hero"
        className="relative flex min-h-[88vh] w-full flex-col items-center justify-center overflow-hidden px-5 pt-10 sm:px-10"
      >
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.12]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="hex"
                width="60"
                height="103.92"
                patternUnits="userSpaceOnUse"
                patternTransform="scale(1.5)"
              >
                <path
                  d="M30 0l30 17.32v34.64L30 69.28 0 51.96V17.32z"
                  fill="none"
                  stroke="#c4f061"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hex)" />
          </svg>
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-malama-bg" />

        <div className="z-10 flex max-w-4xl flex-col items-center text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
            className="eyebrow mb-8 inline-flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-malama-accent"
          >
            <span className="h-2 w-2 animate-malama-live rounded-full bg-malama-accent" />
            Mālama Genesis · 200 Base + 200 Cardano
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="mb-6 max-w-[1100px] font-serif text-[clamp(2.75rem,7vw,5.5rem)] font-normal leading-[0.95] tracking-[-0.035em] text-malama-ink"
          >
            Own the Infrastructure
            <br />
            <em className="text-malama-accent font-light italic">of Verified Carbon</em>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="mb-8 max-w-2xl text-[19px] leading-relaxed text-malama-ink-dim"
          >
            A Hex Node validates environmental data on shared protocol. Hardware-signed evidence.
            Demand-scaled rewards. Indigenous stewardship built in.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mb-10 w-full max-w-xl border-l-4 border-malama-accent bg-malama-accent/10 p-5 text-left rounded-malama"
          >
            <p className="mb-1 text-base font-semibold text-malama-accent">Mālama Genesis — $2,000 per node</p>
            <p className="text-sm leading-relaxed text-malama-ink-dim">
              400 Hex Node Licenses total: 200 on Base (ERC-721) and 200 on Cardano (CIP-68). Allocation closes when sold or June 2026.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={4}
            className="flex w-full flex-col justify-center gap-4 sm:flex-row"
          >
            <a
              href="#reserve"
              className="btn-primary inline-flex items-center justify-center gap-2 px-7 py-4 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-malama-bg shadow-[0_8px_24px_rgba(196,240,97,0.2)] transition hover:-translate-y-0.5"
            >
              Reserve with Crypto or Card
            </a>
            <a
              href="#economics"
              className="btn-ghost inline-flex items-center justify-center gap-2 border border-malama-line-bright px-7 py-4 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-malama-ink transition hover:border-malama-accent hover:text-malama-accent"
            >
              Explore Economics
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── HARDWARE ───────────────────────────────────────────────── */}
      <section id="hardware" className="w-full bg-malama-bg px-5 py-[120px] sm:px-10">
        <div className="mx-auto max-w-[1400px]">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-4 text-center font-serif text-[clamp(2rem,4vw,3rem)] font-normal tracking-tight text-malama-ink"
          >
            The Hex Node Hardware
          </motion.h2>
          <p className="mb-12 text-center text-lg text-malama-ink-dim">
            Everything you need to validate environmental data — shipped to your door.
          </p>
          <div className="flex flex-col gap-8">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="overflow-hidden rounded-malama border border-malama-line shadow-2xl"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/hardware-exploded.png"
                alt="Mālama Hex Node — full hardware exploded view"
                className="h-auto w-full object-cover"
              />
            </motion.div>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={1}
              className="overflow-hidden rounded-malama border border-malama-line shadow-2xl"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/hardware-views.png"
                alt="Mālama Hex Node — enclosure, power system, sensor and network views"
                className="h-auto w-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── ECONOMICS CARDS ────────────────────────────────────────── */}
      <section id="economics" className="w-full border-y border-malama-line bg-malama-elev px-5 py-[120px] sm:px-10">
        <div className="mx-auto max-w-[1400px]">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-3 text-center font-serif text-[clamp(2rem,4vw,3rem)] font-normal tracking-tight text-malama-ink"
          >
            Genesis Node Economics
          </motion.h2>
          <p className="mb-12 text-center text-malama-ink-dim">
            200 Base + 200 Cardano Genesis nodes. $2,000 entry. Three reward streams. Operators earn MLMA for validated data contributions.
          </p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Entry Cost',
                value: '$2,000',
                desc: 'One-time payment at reserve. Covers hardware + exclusive geographic license for your hex zone.',
              },
              {
                title: 'Your MLMA Allocation',
                value: '62.5K MLMA',
                desc: '25% vests at hardware boot. 75% vests monthly over 12 months. Lock as veMLMA for governance weight.',
              },
              {
                title: 'Genesis Share of Supply',
                value: '5%',
                desc: '400 Genesis operators (200 Base + 200 Cardano) × 62,500 MLMA = 25M total, of a 500M hard-capped supply.',
              },
              {
                title: 'Monthly Rewards',
                value: 'Demand-scaled',
                desc: 'Validation earnings scale with Geographic Multiplier (0.5×–3.0×), Data Quality Score, and uptime. No guaranteed earnings.',
              },
              {
                title: 'Reward Formula',
                value: 'B × DQS × GM × UF',
                desc: 'Base rate × Data Quality Score × Geographic Multiplier × Uptime Factor. Full formula in the whitepaper.',
              },
              {
                title: 'Revenue Onset',
                value: 'Oct 2026',
                desc: 'Reserve May 2026, hardware ships September, deploy late September, earn rewards early-mid October.',
              },
            ].map(({ title, value, desc }, i) => (
              <motion.div
                key={title}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i * 0.05}
                className="feature-card rounded-malama border border-malama-line bg-malama-bg p-8 transition-colors hover:border-malama-accent"
              >
                <div className="mb-2 font-mono text-[11px] uppercase tracking-widest text-malama-ink-faint">{title}</div>
                <div className="mb-3 font-serif text-2xl font-normal text-malama-accent">{value}</div>
                <div className="text-sm leading-relaxed text-malama-ink-dim">{desc}</div>
              </motion.div>
            ))}
          </div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-10 flex flex-wrap justify-center gap-3 text-sm"
          >
            <Link
              href="/docs/tokenomics"
              className="rounded-malama-sm border border-malama-line-bright px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-malama-accent transition hover:bg-malama-accent/10"
            >
              MLMA tokenomics →
            </Link>
            <Link
              href="/docs/pricing-roi"
              className="rounded-malama-sm border border-malama-line-bright px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-malama-accent transition hover:bg-malama-accent/10"
            >
              Interactive pricing & ROI →
            </Link>
            <Link
              href="/docs"
              className="rounded-malama-sm border border-malama-line px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-malama-ink-dim transition hover:border-malama-line-bright hover:text-malama-ink"
            >
              All documentation
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-16 rounded-malama border border-malama-line bg-malama-bg p-8"
          >
            <h3 className="mb-2 font-serif text-xl text-malama-accent">Reward Mechanics</h3>
            <p className="mb-8 text-sm text-malama-ink-faint">
              400 Genesis nodes · 10–50 validations/hex/day · Geographic Multipliers 0.5×–3.0× · 99.9% uptime bonus
              active. <em>Operators should model expectations conservatively. No projected returns are guaranteed.</em>
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                { label: 'Low Demand Hex', range: '0.5×–1.0×', desc: 'Rural, low-priority zones with lower baseline validation volume.' },
                { label: 'Medium Demand Hex', range: '1.0×–2.0×', desc: 'Agricultural or moderately-served regions. Balanced reward and validation frequency.' },
                { label: 'High Demand Hex', range: '2.0×–3.0×', desc: 'Strategic zones: industrial corridors, data centers, coastal wetlands, flood-prone agricultural hexes.' },
              ].map(({ label, range, desc }) => (
                <div key={label} className="rounded-malama border border-malama-line bg-malama-elev p-5">
                  <div className="mb-1 font-mono text-[10px] uppercase tracking-wider text-malama-ink-faint">{label}</div>
                  <div className="font-serif text-3xl text-malama-accent">{range}</div>
                  <div className="mb-3 font-mono text-[10px] uppercase tracking-wider text-malama-ink-faint">
                    Geographic Multiplier
                  </div>
                  <div className="text-sm text-malama-ink-dim">{desc}</div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-xs text-malama-ink-faint italic">
              Mālama does not publish token price forecasts or operator payback timelines. For reference, the closest public comparable (WeatherXM) reports actual monthly station earnings ranging widely by location and token price. Operators should consult the whitepaper and model their own scenarios.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── TIMELINE ───────────────────────────────────────────────── */}
      <section id="timeline" className="w-full bg-malama-bg px-5 py-[120px] sm:px-10">
        <div className="mx-auto max-w-4xl">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-12 text-center font-serif text-[clamp(2rem,4vw,3rem)] font-normal tracking-tight text-malama-ink"
          >
            Your Timeline: Reserve to Revenue
          </motion.h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[
              {
                date: 'May 2026 — Reserve',
                steps: [
                  'Visit malamalabs.com/genesis',
                  'Complete pre-qualification (capital, region)',
                  'Pay $2,000 entry cost',
                  'Receive NFT-HEX + 62,500 MLMA allocation',
                  'Hardware pre-order ships in September',
                ],
              },
              {
                date: 'Sept–Oct 2026 — Deploy & Earn',
                steps: [
                  'Hardware arrives (September)',
                  'Unbox, charge, mount (30 minutes)',
                  'Boot and register node (online form)',
                  'First MLMA rewards (early-mid October)',
                  'Earn 8–100K MLMA/month ongoing',
                ],
              },
            ].map(({ date, steps }, i) => (
              <motion.div
                key={date}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i * 0.1}
                className="rounded-malama border border-malama-line-bright bg-malama-accent/5 p-6"
              >
                <h3 className="mb-4 font-mono text-sm font-semibold uppercase tracking-wide text-malama-accent">
                  {date}
                </h3>
                <ul className="space-y-2">
                  {steps.map((s) => (
                    <li key={s} className="flex items-start gap-2 text-sm text-malama-ink-dim">
                      <span className="mt-0.5 text-malama-accent">✓</span> {s}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-6 rounded-malama border-l-4 border-malama-accent bg-malama-accent/10 p-5"
          >
            <p className="text-sm leading-relaxed text-malama-ink-dim">
              <strong className="text-malama-ink">Detailed timeline:</strong> See{' '}
              <a href="/docs/GENESIS_200_PHASE1_TIMELINE.md" className="text-malama-accent underline underline-offset-2">
                GENESIS_200_PHASE1_TIMELINE.md
              </a>{' '}
              for complete setup instructions, deployment checklist, and contingency scenarios.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────── */}
      <section id="faq" className="w-full border-t border-malama-line bg-malama-elev px-5 py-[120px] sm:px-10">
        <div className="mx-auto max-w-3xl">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-12 text-center font-serif text-[clamp(2rem,4vw,3rem)] font-normal tracking-tight text-malama-ink"
          >
            Frequently Asked Questions
          </motion.h2>
          {[
            {
              q: 'What does the $2,000 entry cost include?',
              a: 'Hardware covers a Raspberry Pi Zero 2W, atmospheric sensors, weatherproof enclosure, solar UPS, and secure enclave. The license covers exclusive geographic rights to your hex, Mālama Genesis MLMA allocation, platform infrastructure, and 12 months of support. You pay once at reserve (May 2026). Hardware ships in September 2026.',
            },
            {
              q: 'When do I receive my 62,500 MLMA tokens?',
              a: '25% (15,625 MLMA) vests when your hardware boots and you register. The remaining 75% (46,875 MLMA) vests linearly over 12 months at ~3,906 MLMA/month. After 12 months, all tokens are fully unlocked. Operators who do not deploy within 90 days forfeit their license and allocation.',
            },
            {
              q: 'Will I recover my $2,000 entry cost?',
              a: 'Mālama Labs does not publish token price forecasts or payback-period claims. Operator economics depend on your Geographic Multiplier, your Data Quality Score, uptime, MLMA market price (which may go up or down), and actual data demand in your hex. Operators should model conservative scenarios. For a public comparable, WeatherXM publishes historical station earnings that vary widely by location and token price.',
            },
            {
              q: 'When do I start earning rewards?',
              a: 'Reserve by May 31, 2026. Hardware ships September. You deploy in late September / early October. First MLMA rewards accrue in early-mid October 2026.',
            },
            {
              q: 'Why 200 per chain?',
              a: 'Mālama Genesis is a symmetric launch: 200 Hex Node Licenses on Base and 200 on Cardano, 400 total. Scarcity ensures geographic multiplier premium and prevents oversupply. Helium deployed 500K+ nodes and collapsed operator returns. We are demand-first: 400 nodes in key zones supporting carbon projects, AI data-center monitoring, climate prediction-market settlement, and industrial emissions monitoring. Allocation closes when sold or June 2026. Phase 2 (2027+) expands at lower initial multipliers.',
            },
            {
              q: 'How do geographic multipliers work?',
              a: 'Your hex (H3 Resolution 5, ~252.9 km²) determines your reward multiplier. Urban: 0.5×, suburban: 1.0×, rural: 1.5×, frontier: 2.0×, strategic: up to 3.0×. High-demand zones (Idaho ERW, LA forestry, NYC emissions, London Article 6.4) are allocated first.',
            },
            {
              q: 'What is the Indigenous Stewardship program?',
              a: 'If your hex overlaps Indigenous territory, stewards receive 10–25% of your node rewards (default 15%), settled monthly in MLMA or fiat. Mālama covers all conversion costs. Disputes resolved via prediction market + DAO governance.',
            },
          ].map(({ q, a }, i) => (
            <motion.details
              key={q}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={i * 0.05}
              className="mb-4 overflow-hidden rounded-malama border border-malama-line bg-malama-bg"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-4 font-semibold text-malama-ink transition-colors hover:text-malama-accent">
                {q}
                <span className="text-xl font-black text-malama-accent">+</span>
              </summary>
              <p className="px-6 pb-5 pt-0 text-sm leading-relaxed text-malama-ink-dim">{a}</p>
            </motion.details>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS / PURCHASE FUNNEL ─────────────────────── */}
      <section id="reserve" className="w-full bg-malama-bg px-5 py-[120px] sm:px-10">
        <div className="mx-auto max-w-[1400px] text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="eyebrow mb-6 inline-flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-malama-accent"
          >
            <span className="h-2 w-2 animate-malama-live rounded-full bg-malama-accent" />
            400 nodes (200 Base + 200 Cardano) · Allocation closes June 2026
          </motion.div>

          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-4 font-serif text-[clamp(2rem,5vw,3.5rem)] font-normal tracking-tight text-malama-ink"
          >
            Ready to Own Climate Infrastructure?
          </motion.h2>
          <p className="mx-auto mb-4 max-w-2xl font-medium leading-relaxed text-malama-ink">
            Three steps: pick your territory, connect how you want to pay, then lock in your Genesis license.
          </p>
          <p className="mx-auto mb-12 max-w-2xl leading-relaxed text-malama-ink-dim">
            Choose a hex from the 400 Mālama Genesis Hex Node licenses available for early supporters (200 Base + 200 Cardano). Connect an EVM or
            Cardano wallet — or use a custodial wallet with email. Reserve with crypto or fiat (credit/debit card).
            Hardware ships September. Revenue starts October.
          </p>

          <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Choose a Hex',
                desc: 'Pick one of the 400 Mālama Genesis Hex Node licenses available for early supporters (200 Base + 200 Cardano). Browse the live map and claim your territory before it’s gone.',
                icon: '🗺️',
                href: '/map',
                cta: 'Browse the map →',
              },
              {
                step: '02',
                title: 'Connect your wallet',
                desc: 'Use an EVM wallet (e.g. MetaMask) or a Cardano wallet (e.g. Lace). Or choose a custodial wallet: enter your email and we’ll mint to a secure wallet you control via transfer link.',
                icon: '🔐',
                href: '/presale',
                cta: 'Go to checkout →',
              },
              {
                step: '03',
                title: 'Reserve your hex',
                desc: 'Pay the $2,000 entry with crypto (e.g. USDC on Base) or fiat via credit/debit card. Your NFT-HEX and 62,500 MLMA allocation follow on-chain.',
                icon: '💳',
                href: '/presale',
                cta: 'Reserve with crypto or card →',
              },
            ].map(({ step, title, desc, icon, href, cta }, i) => (
              <motion.div
                key={step}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i * 0.1}
                className="feature-card rounded-malama border border-malama-line bg-malama-elev p-8 text-left transition-colors hover:border-malama-accent"
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-2xl">{icon}</span>
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-malama-accent">
                    {step}
                  </span>
                </div>
                <h3 className="mb-3 font-serif text-xl font-normal text-malama-ink">{title}</h3>
                <p className="mb-6 text-sm leading-relaxed text-malama-ink-dim">{desc}</p>
                <Link
                  href={href}
                  className="inline-block rounded-malama-sm border border-malama-line-bright bg-malama-accent/10 px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-malama-accent transition hover:bg-malama-accent/20"
                >
                  {cta}
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex flex-col justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/presale"
              className="btn-primary inline-flex items-center justify-center px-10 py-5 font-mono text-sm font-semibold uppercase tracking-[0.1em] text-malama-bg shadow-[0_8px_24px_rgba(196,240,97,0.2)] transition hover:-translate-y-0.5"
            >
              Reserve with Crypto or Card
            </Link>
            <Link
              href="/map"
              className="btn-ghost inline-flex items-center justify-center border-2 border-malama-line-bright px-10 py-5 font-mono text-sm font-semibold uppercase tracking-[0.1em] text-malama-ink transition hover:border-malama-accent hover:text-malama-accent"
            >
              Browse Available Hexes
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
