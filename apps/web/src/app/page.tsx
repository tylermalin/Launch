'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } }),
}

// Source citation URLs — fill in final links before mainnet launch.
// TODO(sources): replace placeholders with the final links Mālama controls.
const SOURCE_SAVECARDS = '/docs/architecture#savecard-archive' // 2,786+ SaveCards: Cardanoscan preprod link goes here
const SOURCE_FAS_META = 'https://fas.org/publication/unmeasured-emissions/' // FAS Meta emissions: confirm/replace with exact citation
const SOURCE_AIPOWER = 'https://ai-energy-impact-opal.vercel.app/'

export default function Home() {
  return (
    <div className="flex w-full flex-col items-center">
      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section
        id="hero"
        className="relative flex min-h-[92vh] w-full flex-col items-center justify-center overflow-hidden px-5 pt-10 sm:px-10"
      >
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.12]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hex" width="60" height="103.92" patternUnits="userSpaceOnUse" patternTransform="scale(1.5)">
                <path d="M30 0l30 17.32v34.64L30 69.28 0 51.96V17.32z" fill="none" stroke="#c4f061" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hex)" />
          </svg>
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-malama-bg" />

        <div className="z-10 flex max-w-5xl flex-col items-center text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
            className="eyebrow mb-8 inline-flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-malama-accent"
          >
            <span className="h-2 w-2 animate-malama-live rounded-full bg-malama-accent" />
            Phase 1 Pre-Sale · Opens May 2026 · 195 Nodes Available
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="mb-6 max-w-[1100px] font-serif text-[clamp(2.75rem,7vw,5.5rem)] font-normal leading-[0.95] tracking-[-0.035em] text-malama-ink"
          >
            Own the validation layer
            <br />
            <em className="font-light italic text-malama-accent">of a real-world data network.</em>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="mb-5 max-w-3xl text-[19px] leading-relaxed text-malama-ink-dim"
          >
            The Mālama Hex Node validates hardware-signed carbon data and AI compute attestations for enterprise clients. Not a token product. Infrastructure.
          </motion.p>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mb-10 max-w-2xl text-base leading-relaxed text-malama-ink-dim"
          >
            The Genesis 200 program is the first and only opportunity to acquire a Hex Node validator license at founder pricing. 200 total nodes. $2,000 entry. 125,000 MLMA allocation. October 2026 delivery.
          </motion.p>

          {/* Key fact pills */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={4}
            className="mb-10 grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4"
          >
            {[
              { label: 'Total Nodes', value: '200' },
              { label: 'Entry Price', value: '$2,000' },
              { label: 'On-Chain SaveCards', value: '2,786+' },
              { label: 'Max Multiplier', value: '3.0×' },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-malama border border-malama-line bg-malama-elev/60 p-4 text-left backdrop-blur">
                <div className="font-mono text-[10px] uppercase tracking-widest text-malama-ink-faint">{label}</div>
                <div className="mt-1 font-serif text-xl text-malama-accent">{value}</div>
              </div>
            ))}
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={5}
            className="mb-6 flex w-full flex-col justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/presale"
              className="btn-primary inline-flex items-center justify-center gap-2 px-7 py-4 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-malama-bg shadow-[0_8px_24px_rgba(196,240,97,0.2)] transition hover:-translate-y-0.5"
            >
              Reserve a Hex Node →
            </Link>
            <Link
              href="/map"
              className="btn-ghost inline-flex items-center justify-center gap-2 border border-malama-line-bright px-7 py-4 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-malama-ink transition hover:border-malama-accent hover:text-malama-accent"
            >
              Hex Map Explorer
            </Link>
          </motion.div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={6}
            className="font-mono text-[11px] uppercase tracking-[0.15em] text-malama-ink-faint"
          >
            NFT-HEX Generator · Multi-Chain · First Phase 1 access closes Q2 2026
          </motion.p>
        </div>
      </section>

      {/* ── 01 · TWO STREAMS, ONE VALIDATOR ────────────────────────── */}
      <section id="why" className="w-full border-y border-malama-line bg-malama-elev px-5 py-[120px] sm:px-10">
        <div className="mx-auto max-w-[1400px]">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-3 text-center font-mono text-xs uppercase tracking-[0.2em] text-malama-accent"
          >
            01 · Two Streams, One Validator
          </motion.p>
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-4 text-center font-serif text-[clamp(2rem,4vw,3rem)] font-normal tracking-tight text-malama-ink"
          >
            Two data streams. One validator network.
          </motion.h2>
          <p className="mx-auto mb-12 max-w-3xl text-center text-malama-ink-dim">
            A Hex Node is not a token speculation. It is decentralized infrastructure that validates the most critical environmental data streams in the world. Carbon dMRV is the proven pipeline operational on Cardano since June 2024. AI compute attestation is the scaling product targeting Q2 2026 pilot deployments. The same Hex Node validates both.
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Carbon SaveCards */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="rounded-malama border border-malama-line bg-malama-bg p-8"
            >
              <div className="mb-4 inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-malama-accent">
                <span className="h-1.5 w-1.5 rounded-full bg-malama-accent" />
                Proven · Live since June 2024
              </div>
              <h3 className="mb-3 font-serif text-2xl text-malama-ink">Carbon SaveCards</h3>
              <p className="mb-4 text-sm leading-relaxed text-malama-ink-dim">
                Hardware-signed environmental telemetry direct from the field. Biochar, ERW, forestry, soil carbon. Every reading is ECDSA-signed by an ATECC608B secure enclave — private key burned at manufacture, never exported from the silicon.{' '}
                <a href={SOURCE_SAVECARDS} className="text-malama-accent underline-offset-2 hover:underline">
                  2,786+ on-chain SaveCards
                </a>
                {' '}on Cardano preprod with zero gaps.
              </p>
              <p className="text-sm leading-relaxed text-malama-ink-dim">
                LCO₂ pre-finance issued at a protocol-set discount to expected verified value. VCO₂ verified credits at registry approval. Compatible with Puro.earth, Isometric, and Verra methodologies.
              </p>
            </motion.div>

            {/* AI Compute Attestation */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={1}
              className="rounded-malama border border-malama-line bg-malama-bg p-8"
            >
              <div className="mb-4 inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-blue-400">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                Scaling · Q2 2026 Pilots
              </div>
              <h3 className="mb-3 font-serif text-2xl text-malama-ink">AI Compute Attestation</h3>
              <p className="mb-4 text-sm leading-relaxed text-malama-ink-dim">
                Rack-level power sensors deployed inside AI data centers. Direct measurement of electrical load per inference run, per training cycle. Cooling water attribution. Real-time grid carbon intensity cross-referenced at the moment of measurement.
              </p>
              <p className="text-sm leading-relaxed text-malama-ink-dim">
                The{' '}
                <a
                  href={SOURCE_FAS_META}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline-offset-2 hover:underline"
                >
                  Federation of American Scientists found
                </a>
                {' '}Meta's actual emissions may be up to 19,000× higher than market-based reports suggest. Hex Nodes validate the truth.
              </p>
            </motion.div>
          </div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-8 rounded-malama border border-malama-line bg-malama-bg/50 p-6"
          >
            <p className="text-sm leading-relaxed text-malama-ink-dim">
              The validator network is structurally separate from both upstream data streams. A Hex Node operator does not own carbon credits. They own the right to validate the infrastructure that issues them.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── 02 · METHODOLOGY ──────────────────────────────────────── */}
      <section id="methodology" className="w-full bg-malama-bg px-5 py-[120px] sm:px-10">
        <div className="mx-auto max-w-[1400px]">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-3 text-center font-mono text-xs uppercase tracking-[0.2em] text-malama-accent"
          >
            02 · The Methodology
          </motion.p>
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-4 text-center font-serif text-[clamp(2rem,4vw,3rem)] font-normal tracking-tight text-malama-ink"
          >
            From sensor to proof.
          </motion.h2>
          <p className="mx-auto mb-12 max-w-3xl text-center text-malama-ink-dim">
            The Mālama dMRV cycle. Four steps from physical reality to on-chain certificate. The same pipeline serves both upstream data streams. Hex Nodes participate in step three: decentralized consensus.
          </p>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {[
              {
                n: '01',
                title: 'Direct Sensor Capture',
                body: 'IoT sensors capture high-frequency data at the source. Mālama Genesis nodes for environmental sites. Rack-mount AI Power Sensors for data centers. Every reading is ECDSA-signed by an ATECC608B secure enclave with the private key burned at manufacture — never exported from the silicon. The signature exists before the data leaves the hardware.',
              },
              {
                n: '02',
                title: 'Edge Verification',
                body: 'Raw signed data is processed at the edge. Cryptographic, protocol, physical, spatial, temporal, and methodology checks run in sequence. AI z-score anomaly detection flags spoofed or implausible readings. For AI compute, edge verification cross-references power draw against grid carbon intensity at the moment of measurement.',
              },
              {
                n: '03',
                title: 'Hex Node Consensus',
                body: 'Verified data is broadcast to the Hex Node network. Each node operates within an H3 hex cell governed by its NFT-HEX rights object. Nodes perform decentralized audits and reach Proof-of-Truth consensus. Validators stake MLMA. Fraudulent attestations face 10% slashing. Byzantine Fault Tolerant by construction. This is what your Hex Node does.',
                highlight: true,
              },
              {
                n: '04',
                title: 'Proof of Truth',
                body: 'Once validated, the data becomes a Proof of Truth certificate anchored on Cardano via CIP-25/CIP-68. For carbon: a SaveCard feeding LCO₂ pre-finance and VCO₂ verified credit conversion. For AI compute: a hardware-verified disclosure record satisfying SEC climate disclosure, EU CSRD, and SBTi reporting requirements.',
              },
            ].map(({ n, title, body, highlight }, i) => (
              <motion.div
                key={n}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i * 0.5}
                className={`rounded-malama border p-7 transition-colors ${
                  highlight
                    ? 'border-malama-accent bg-malama-accent/5 shadow-[0_0_30px_rgba(196,240,97,0.12)]'
                    : 'border-malama-line bg-malama-elev hover:border-malama-line-bright'
                }`}
              >
                <div className="mb-3 font-mono text-xs font-bold uppercase tracking-widest text-malama-accent">{n}</div>
                <h3 className="mb-3 font-serif text-xl text-malama-ink">{title}</h3>
                <p className="text-sm leading-relaxed text-malama-ink-dim">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 03 · VALIDATION REWARDS ───────────────────────────────── */}
      <section
        id="economics"
        className="w-full border-y border-malama-line bg-malama-elev px-5 py-[120px] sm:px-10"
      >
        <div className="mx-auto max-w-[1400px]">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-3 text-center font-mono text-xs uppercase tracking-[0.2em] text-malama-accent"
          >
            03 · Validation Rewards
          </motion.p>
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-4 text-center font-serif text-[clamp(2rem,4vw,3rem)] font-normal tracking-tight text-malama-ink"
          >
            Three reward mechanisms. One node.
          </motion.h2>
          <p className="mx-auto mb-12 max-w-3xl text-center text-malama-ink-dim">
            Hex Nodes earn through three coordinated reward mechanisms. Each is designed to align long-term network health with operator incentives.
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                label: '01 · Verification Yield',
                title: 'MLMA per Validation',
                body: 'Earn MLMA for every successful validation of an AI compute attestation or carbon SaveCard. Rewards scale with validation volume and packet complexity. Multi-stream validation compounds yield.',
              },
              {
                label: '02 · Uptime Multiplier',
                title: '99.9%+ Bonus',
                body: 'Bonus rewards for nodes maintaining greater than 99.9% uptime. Ensures the live data stream at aipower.fyi never drops and the carbon SaveCard pipeline maintains continuity.',
              },
              {
                label: '03 · Governance Weight',
                title: '1 Hex Node = 1 Vote',
                body: 'Each Hex Node carries one vote in the Mālama DAO. Methodology updates, sensor deployment priorities, validator set changes, and treasury distribution are governed by node operators.',
              },
            ].map(({ label, title, body }, i) => (
              <motion.div
                key={label}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i * 0.5}
                className="rounded-malama border border-malama-line bg-malama-bg p-7"
              >
                <div className="mb-2 font-mono text-[10px] font-bold uppercase tracking-widest text-malama-accent">{label}</div>
                <h3 className="mb-3 font-serif text-xl text-malama-ink">{title}</h3>
                <p className="text-sm leading-relaxed text-malama-ink-dim">{body}</p>
              </motion.div>
            ))}
          </div>

          {/* Geographic multiplier table */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-10 rounded-malama border border-malama-accent/30 bg-malama-accent/5 p-6"
          >
            <p className="mb-4 font-mono text-[11px] font-bold uppercase tracking-widest text-malama-accent">
              Geographic multiplier
            </p>
            <div className="overflow-x-auto rounded-malama border border-malama-accent/20">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-malama-accent/20 bg-malama-accent/5 text-left">
                    {['Zone', 'Multiplier', 'Allocation', 'Notes'].map((h) => (
                      <th key={h} className="px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-wider text-malama-accent">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-malama-accent/10">
                  {[
                    ['Urban', '0.5×', '~40%', 'Most nodes'],
                    ['Dense suburban', '1.0×', '~30%', 'Mid-tier'],
                    ['Rural', '1.5×', '~20%', 'Limited'],
                    ['Frontier', '2.0×', '~8%', 'Very limited'],
                    ['Strategic gap', '3.0×', '~2%', 'Scarce'],
                  ].map(([zone, mult, alloc, notes]) => (
                    <tr key={zone}>
                      <td className="px-4 py-3 font-semibold text-malama-ink">{zone}</td>
                      <td className="px-4 py-3 font-mono font-bold text-malama-accent">{mult}</td>
                      <td className="px-4 py-3 text-malama-ink-dim">{alloc}</td>
                      <td className="px-4 py-3 text-malama-ink-dim">{notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs italic text-malama-ink-faint">
              MLMA rewards are relative, not fixed. As the validator set grows, rewards per node are recalculated against total validated packet volume. Early operators benefit from network bootstrap density. Projected figures are illustrative only. Mālama does not publish projected operator earnings, token price forecasts, or payback timelines. See the{' '}
              <Link href="/legal/token-rewards-risk" className="underline underline-offset-2 hover:text-malama-ink-dim">
                Token &amp; Rewards Risk Disclosure
              </Link>
              {' '}for full risks.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── 04 · TWO ECONOMIC PHASES ──────────────────────────────── */}
      <section id="phases" className="w-full bg-malama-bg px-5 py-[120px] sm:px-10">
        <div className="mx-auto max-w-[1400px]">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-3 text-center font-mono text-xs uppercase tracking-[0.2em] text-malama-accent"
          >
            04 · Two Economic Phases
          </motion.p>
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-4 text-center font-serif text-[clamp(2rem,4vw,3rem)] font-normal tracking-tight text-malama-ink"
          >
            Genesis phase. Steady state.
          </motion.h2>
          <p className="mx-auto mb-12 max-w-3xl text-center text-malama-ink-dim">
            The protocol is designed in two distinct economic phases. Genesis operators capture a structural advantage that cannot be replicated after the network scales.
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="rounded-malama border border-malama-accent/40 bg-malama-accent/5 p-8"
            >
              <div className="mb-4 inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-malama-accent">
                <span className="h-1.5 w-1.5 rounded-full bg-malama-accent" />
                Genesis Phase · Years 1–3
              </div>
              <h3 className="mb-4 font-serif text-2xl text-malama-ink">Founding cohort premium</h3>
              <ul className="space-y-3 text-sm leading-relaxed text-malama-ink-dim">
                <li>Higher reward density — protocol is bootstrapping the validator network at 200 nodes.</li>
                <li>Genesis 200 operators receive lifetime protocol rights, including rights to future product streams added to the network.</li>
                <li>Founding cohort receives preferential allocation in geographic cells with highest long-term multipliers.</li>
                <li>Protocol emissions allocated at maximum bootstrap rate during network formation.</li>
              </ul>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={1}
              className="rounded-malama border border-malama-line bg-malama-elev p-8"
            >
              <div className="mb-4 inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-malama-ink-dim">
                <span className="h-1.5 w-1.5 rounded-full bg-malama-ink-dim" />
                Steady State · Years 4–5
              </div>
              <h3 className="mb-4 font-serif text-2xl text-malama-ink">Fee-based revenue model</h3>
              <ul className="space-y-3 text-sm leading-relaxed text-malama-ink-dim">
                <li>Expanded validator set as protocol scales beyond the Genesis 200 cohort.</li>
                <li>Fee-based revenue model from enterprise carbon credit issuance and AI compute disclosure services.</li>
                <li>Validator rewards shift from pure emission to hybrid emission + fee share.</li>
                <li>DAO treasury distributions activated from accumulated protocol fees.</li>
              </ul>
            </motion.div>
          </div>

          {/* Revenue flywheel */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-8 rounded-malama border border-malama-line bg-malama-elev p-6"
          >
            <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-widest text-malama-accent">
              Revenue flywheel
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
              {[
                'Enterprise clients',
                'Carbon MRV fees',
                'Protocol treasury',
                'Validator rewards',
                'More validators',
                'Better coverage',
                'More enterprise clients',
              ].map((step, i, arr) => (
                <span key={step} className="flex items-center gap-2">
                  <span className="rounded border border-malama-line bg-malama-bg px-3 py-1.5 text-malama-ink-dim">
                    {step}
                  </span>
                  {i < arr.length - 1 && (
                    <span className="text-malama-accent">→</span>
                  )}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 05 · DEMAND ANCHORS ───────────────────────────────────── */}
      <section id="demand" className="w-full border-y border-malama-line bg-malama-elev px-5 py-[120px] sm:px-10">
        <div className="mx-auto max-w-[1400px]">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-3 text-center font-mono text-xs uppercase tracking-[0.2em] text-malama-accent"
          >
            05 · Demand Anchors
          </motion.p>
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-4 text-center font-serif text-[clamp(2rem,4vw,3rem)] font-normal tracking-tight text-malama-ink"
          >
            Four enterprise deployment categories.
          </motion.h2>
          <p className="mx-auto mb-12 max-w-3xl text-center text-malama-ink-dim">
            The demand for hardware-verified environmental data is structural. These are the markets that require the data the validator network produces.
          </p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {[
              {
                n: '01',
                title: 'Carbon MRV',
                body: 'Compliance buyers at Puro.earth, Isometric, and Verra require hardware-verified dMRV for premium credit issuance. Mālama SaveCards are the verified measurement layer feeding these registries.',
                color: 'text-malama-accent',
                dot: 'bg-malama-accent',
              },
              {
                n: '02',
                title: 'AI Data Center',
                body: 'SEC climate disclosure, EU CSRD, and SBTi reporting requirements are forcing AI operators to produce verifiable emissions data at the rack level. Hardware attestation is the only credible path.',
                color: 'text-blue-400',
                dot: 'bg-blue-400',
              },
              {
                n: '03',
                title: 'Parametric Insurance',
                body: 'Weather and emissions triggers for crop and infrastructure insurance policies require verified environmental outcomes. On-chain, hardware-signed data enables trustless parametric payouts.',
                color: 'text-violet-400',
                dot: 'bg-violet-400',
              },
              {
                n: '04',
                title: 'Prediction Markets',
                body: 'Verified environmental outcomes for on-chain settlement. Carbon sequestration, temperature anomalies, and emissions events settling on hardware-verified data rather than oracle feeds.',
                color: 'text-amber-400',
                dot: 'bg-amber-400',
              },
            ].map(({ n, title, body, color, dot }, i) => (
              <motion.div
                key={n}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i * 0.3}
                className="rounded-malama border border-malama-line bg-malama-bg p-7"
              >
                <div className={`mb-4 inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest ${color}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
                  {n}
                </div>
                <h3 className="mb-3 font-serif text-xl text-malama-ink">{title}</h3>
                <p className="text-sm leading-relaxed text-malama-ink-dim">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HARDWARE IMAGES ───────────────────────────────────────── */}
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
            Everything you need to validate carbon and compute data — shipped to your door.
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

      {/* ── 06 · HARDWARE SPECIFICATIONS ─────────────────────────── */}
      <section id="specs" className="w-full border-y border-malama-line bg-malama-elev px-5 py-[120px] sm:px-10">
        <div className="mx-auto max-w-4xl">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-3 text-center font-mono text-xs uppercase tracking-[0.2em] text-malama-accent"
          >
            06 · Hardware Specifications
          </motion.p>
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-4 text-center font-serif text-[clamp(2rem,4vw,3rem)] font-normal tracking-tight text-malama-ink"
          >
            Technical requirements.
          </motion.h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-malama-ink-dim">
            Protocol Version 1.0 (Verity Architecture). Network role: validation, consensus, dMRV data integrity. Click each section to expand.
          </p>

          <div className="space-y-3">
            <SpecSection title="Hardware Requirements" defaultOpen>
              <p className="mb-4 text-sm leading-relaxed text-malama-ink-dim">
                To maintain network uptime and ensure low-latency validation of global AI inference and carbon sensor streams, Hex Nodes must meet the following minimum specifications.
              </p>
              <div className="overflow-x-auto rounded-malama border border-malama-line">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-malama-line bg-malama-bg/50 text-left text-malama-ink-faint">
                      <th className="px-4 py-3 font-semibold">Component</th>
                      <th className="px-4 py-3 font-semibold">Minimum</th>
                      <th className="px-4 py-3 font-semibold">Recommended</th>
                    </tr>
                  </thead>
                  <tbody className="text-malama-ink-dim">
                    {[
                      ['CPU', '4 cores @ 2.0 GHz+', '8 cores @ 3.0 GHz+'],
                      ['RAM', '8 GB DDR4', '16 GB DDR4'],
                      ['Storage', '256 GB NVMe SSD', '512 GB NVMe SSD'],
                      ['Network', '100 Mbps up/down', '1 Gbps up/down'],
                      ['Secure element', 'ATECC608B', 'ATECC608B'],
                      ['OS', 'Ubuntu 22.04 LTS', 'Ubuntu 24.04 LTS'],
                      ['Uptime', '99.0%', '99.9%+ for bonus'],
                      ['Anchoring', 'Cardano + Base', 'Cardano + Hedera + Base'],
                    ].map(([c, min, rec]) => (
                      <tr key={c} className="border-b border-malama-line last:border-0">
                        <td className="px-4 py-3 font-semibold text-malama-ink">{c}</td>
                        <td className="px-4 py-3">{min}</td>
                        <td className="px-4 py-3 text-malama-accent">{rec}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-malama-ink-faint">
                NFT-HEX: Each node license is represented by an NFT-HEX rights object encoding geographic rights, capacity constraints, reward weighting, and regional governance for that H3 cell.
              </p>
            </SpecSection>

            <SpecSection title="Core Functions">
              <ul className="space-y-3 text-sm leading-relaxed text-malama-ink-dim">
                <li>
                  <strong className="text-malama-ink">Packet Validation.</strong> Authenticates encrypted data streams from rack-level AI power sensors and Mālama Genesis environmental nodes. Verifies device signatures against the on-chain device registry.
                </li>
                <li>
                  <strong className="text-malama-ink">Consensus Participation.</strong> Participates in the Proof-of-Truth consensus mechanism to reach agreement on energy consumption, carbon intensity, and environmental measurements.
                </li>
                <li>
                  <strong className="text-malama-ink">dMRV Proof Generation.</strong> Generates the cryptographic proofs required to issue hardware-verified carbon credits and AI compute disclosure records.
                </li>
                <li>
                  <strong className="text-malama-ink">Metadata Storage.</strong> Maintains a local high-availability ledger of regional grid carbon intensity data for the H3 cell the node operates within.
                </li>
              </ul>
            </SpecSection>

            <SpecSection title="Deployment Options">
              <ul className="space-y-3 text-sm leading-relaxed text-malama-ink-dim">
                <li>
                  <strong className="text-malama-ink">Cloud Hosted.</strong> One-click deployment via partner cloud providers for immediate participation. Recommended for operators who want to skip infrastructure management.
                </li>
                <li>
                  <strong className="text-malama-ink">Bare Metal.</strong> Manual installation on owned or co-located hardware. Maximum control, lowest long-term cost, highest uptime multiplier potential.
                </li>
                <li>
                  <strong className="text-malama-ink">Managed Services.</strong> Third-party hosting partners run the node on your behalf for a fee. Recommended for passive participation without operational burden.
                </li>
              </ul>
            </SpecSection>

            <SpecSection title="Security & Compliance">
              <ul className="space-y-3 text-sm leading-relaxed text-malama-ink-dim">
                <li>
                  <strong className="text-malama-ink">End-to-End Encryption.</strong> All data streams from sensors are AES-256 encrypted before reaching the node. Sensor private keys never leave the ATECC608B secure enclave.
                </li>
                <li>
                  <strong className="text-malama-ink">Hardware Security Modules.</strong> Hex Node operator keys are HSM-compatible to prevent private key compromise.
                </li>
                <li>
                  <strong className="text-malama-ink">Audited Codebase.</strong> Core Hex Node software is undergoing third-party security audits to ensure protocol resilience against 51% attacks on the dMRV stream. Audit completion target Q2 2026.
                </li>
                <li>
                  <strong className="text-malama-ink">Slashing.</strong> Validators face 10% asset slashing for fraudulent attestations. Byzantine Fault Tolerant by construction.
                </li>
              </ul>
            </SpecSection>

            <SpecSection title="NFT-HEX Geographic Rights">
              <div className="space-y-3 text-sm leading-relaxed text-malama-ink-dim">
                <p>
                  Each Hex Node operates inside a specific H3 hex cell governed by an NFT-HEX rights object. The NFT-HEX encodes geographic rights, capacity constraints, reward weighting, acquisition policy, and regional governance for that cell.
                </p>
                <p>
                  H3 Resolution 5 cells are approximately 252.9 km² each, with 2,016,842 unique cells globally. Buying an NFT-HEX gives you the right and obligation to operate one Hex Node validator within that specific cell.
                </p>
                <p>
                  Reward multipliers by zone: urban 0.5×, dense suburban 1.0×, rural 1.5×, frontier 2.0×, strategic gap up to 3.0×.
                </p>
              </div>
            </SpecSection>
          </div>
        </div>
      </section>

      {/* ── RESERVE CTA ──────────────────────────────────────────── */}
      <section id="reserve" className="w-full bg-malama-bg px-5 py-[120px] sm:px-10">
        <div className="mx-auto max-w-[1400px]">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-malama-accent">
              Phase 1 Pre-Sale · Opens May 2026
            </p>
            <h2 className="mb-8 font-serif text-[clamp(2rem,4vw,3rem)] font-normal tracking-tight text-malama-ink">
              Reserve your Hex Node.
            </h2>

            {/* Reserve stats */}
            <div className="mx-auto mb-10 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: 'Available', value: '195' },
                { label: 'Entry price', value: '$2,000' },
                { label: 'MLMA allocation', value: '125,000' },
                { label: 'Delivery', value: 'Oct 2026' },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-malama border border-malama-line bg-malama-elev p-4 text-center">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-malama-ink-faint">{label}</div>
                  <div className="mt-1 font-serif text-xl text-malama-accent">{value}</div>
                </div>
              ))}
            </div>

            <p className="mb-10 text-malama-ink-dim">
              Explore the global hex map, generate your NFT-HEX, and complete your reservation across Cardano and Base. First Phase 1 access closes Q2 2026.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/presale"
                className="btn-primary inline-flex items-center justify-center gap-2 px-7 py-4 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-malama-bg shadow-[0_8px_24px_rgba(196,240,97,0.2)] transition hover:-translate-y-0.5"
              >
                Reserve a Hex Node →
              </Link>
              <Link
                href="mailto:hello@malamalabs.com?subject=Hex%20Node%20call"
                className="btn-ghost inline-flex items-center justify-center gap-2 border border-malama-line-bright px-7 py-4 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-malama-ink transition hover:border-malama-accent hover:text-malama-accent"
              >
                Schedule a Call
              </Link>
            </div>
          </motion.div>

          {/* Mālama Foundation / aipower.fyi */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mx-auto mt-20 max-w-3xl rounded-malama border border-malama-line bg-malama-elev p-6 text-center"
          >
            <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-widest text-malama-accent">
              Powered by Mālama dMRV · A project of the Mālama Foundation
            </p>
            <p className="mb-4 text-sm leading-relaxed text-malama-ink-dim">
              Hardware-verified energy data for a nature-positive AI. Live stream of AI data center power and carbon-intensity measurements.
            </p>
            <a
              href={SOURCE_AIPOWER}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-malama-accent hover:text-malama-accent-dim"
            >
              Live data stream → aipower.fyi
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

// ── SpecSection (accordion) ────────────────────────────────────────────
function SpecSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="overflow-hidden rounded-malama border border-malama-line bg-malama-bg">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-malama-elev"
        aria-expanded={open}
      >
        <span className="font-serif text-lg text-malama-ink">{title}</span>
        <ChevronDown
          className={`h-5 w-5 text-malama-ink-faint transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      {open && <div className="border-t border-malama-line px-6 py-6">{children}</div>}
    </div>
  )
}
