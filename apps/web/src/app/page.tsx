'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { ChevronDown, ExternalLink } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } }),
}

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
            className="eyebrow mb-8 inline-flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-malama-ink-faint"
          >
            Hardware-Verified · Cardano · Hedera · Base
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="mb-6 max-w-[1100px] font-serif text-[clamp(3.5rem,8vw,6.5rem)] font-normal leading-[0.9] tracking-[-0.035em] text-malama-ink"
          >
            Reality is
            <br />
            measured.
            <br />
            <em className="font-light italic text-malama-accent">Not estimated.</em>
          </motion.h1>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-malama-accent/30 bg-malama-accent/10 px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-widest text-malama-accent backdrop-blur"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-malama-accent" />
            Hardware-signed truth.
          </motion.div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mb-10 max-w-3xl text-[19px] leading-relaxed text-malama-ink-dim"
          >
            Mālama Labs is the hardware-signed trust anchor for physical-world data. Every environmental market, every emissions disclosure, every ESG claim, every parametric insurance payout, and every supply-chain attestation depends on one thing: knowing what is actually happening in the physical world. For thirty years, that knowledge came from estimates, models, self-reports, and annual audits. We replaced estimation with cryptographically signed sensors. Each reading is signed at the device by a key burned into hardware at manufacture, anchored on-chain, and verifiable by anyone. Carbon proved the pipeline works. AI compute scales it. Water, supply chain, biodiversity, and grid follow.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={4}
            className="mb-12 flex w-full flex-col justify-center gap-4 sm:flex-row"
          >
            <Link
              href="https://www.malamalabs.com/stake/"
              className="btn-primary inline-flex items-center justify-center gap-2 px-7 py-4 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-malama-bg shadow-[0_8px_24px_rgba(196,240,97,0.2)] transition hover:-translate-y-0.5"
            >
              Join our waitlist →
            </Link>
            <Link
              href="/contact"
              className="btn-ghost inline-flex items-center justify-center gap-2 border border-malama-line-bright px-7 py-4 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-malama-ink transition hover:border-malama-accent hover:text-malama-accent"
            >
              Schedule a Call
            </Link>
          </motion.div>

        </div>
      </section>

      {/* ── 01 · EXPLAINER ─────────────────────────────────────────── */}
      <section id="what-is-malama" className="w-full border-y border-malama-line bg-malama-elev px-5 py-[120px] sm:px-10">
        <div className="mx-auto max-w-[1400px]">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-3 text-center font-mono text-xs uppercase tracking-[0.2em] text-malama-accent"
          >
            What is Mālama Labs?
          </motion.p>
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-4 text-center font-serif text-[clamp(2rem,4vw,3rem)] font-normal tracking-tight text-malama-ink"
          >
            The missing input
            <br />
            for every physical market.
          </motion.h2>
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-6 text-lg leading-relaxed text-malama-ink-dim">
              Carbon markets lost buyer trust because credits are verified once a year by humans walking transects. AI data-center emissions are reported via spreadsheets and renewable energy certificates. Parametric insurance triggers on weather stations hundreds of miles away. Supply-chain provenance still lives on PDFs.
            </p>
            <p className="mb-10 text-lg leading-relaxed text-malama-ink-dim">
              Every one of these markets has the same missing input: a trusted, continuously monitored, cryptographically signed physical data source. That is what Mālama builds. Not a methodology. Not a registry. The hardware-signed measurement layer downstream markets have been trying to work around.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/docs/architecture"
                className="btn-ghost inline-flex items-center justify-center gap-2 border border-malama-line-bright px-7 py-4 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-malama-ink transition hover:border-malama-accent hover:text-malama-accent"
              >
                See how the pipeline works →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 02 · PIPELINE ──────────────────────────────────────────── */}
      <section id="platform" className="w-full bg-malama-bg px-5 py-[120px] sm:px-10">
        <div className="mx-auto max-w-[1400px]">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-3 text-center font-mono text-xs uppercase tracking-[0.2em] text-malama-accent"
          >
            Mālama Labs · Platform Overview
          </motion.p>
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-12 text-center font-serif text-[clamp(2rem,4vw,3rem)] font-normal tracking-tight text-malama-ink"
          >
            One Pipeline. Any Physical Measurement.
          </motion.h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: 'Carbon',
                desc: 'Annual human audits → continuous hardware-signed telemetry',
                color: 'text-malama-accent',
                border: 'border-malama-accent/30',
                bg: 'bg-malama-accent/5',
              },
              {
                title: 'AI Compute',
                desc: 'Spreadsheet RECs → per-rack direct measurement',
                color: 'text-blue-400',
                border: 'border-blue-400/30',
                bg: 'bg-blue-400/5',
              },
              {
                title: 'Insurance',
                desc: 'Distant weather stations → on-site signed sensor triggers',
                color: 'text-violet-400',
                border: 'border-violet-400/30',
                bg: 'bg-violet-400/5',
              },
              {
                title: 'Supply Chain',
                desc: 'PDFs and self-reports → cryptographic provenance on-chain',
                color: 'text-amber-400',
                border: 'border-amber-400/30',
                bg: 'bg-amber-400/5',
              },
            ].map(({ title, desc, color, border, bg }, i) => (
              <motion.div
                key={title}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i * 0.2}
                className={`card-hover rounded-malama border ${border} ${bg} p-6`}
              >
                <h3 className={`mb-3 font-serif text-xl ${color}`}>{title}</h3>
                <p className="text-sm leading-relaxed text-malama-ink-dim">{desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-20 grid grid-cols-1 gap-10 md:grid-cols-2">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="rounded-malama border border-malama-line bg-malama-elev p-8"
            >
              <div className="mb-4 inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-malama-accent">
                <span className="h-1.5 w-1.5 rounded-full bg-malama-accent" />
                Proven · Live since June 2024
              </div>
              <h3 className="mb-4 font-serif text-2xl text-malama-ink">Carbon dMRV</h3>
              <p className="mb-6 text-sm leading-relaxed text-malama-ink-dim">
                The Dallas Genesis 300 pilot node (op5pro-field-a) has operated continuously since June 2024 on Cardano preprod. Full credit lineage from sensor to oracle to event to credit is operational with 2,786+ records and zero gaps. Mainnet migration targets Q2 2026 post-audit.
              </p>
              <ul className="mb-6 space-y-2 text-sm text-malama-ink-dim">
                <li>• Soil, atmospheric, and enhanced rock weathering telemetry</li>
                <li>• LCO₂ pre-finance and VCO₂ verified credits</li>
                <li>• Registry engagement underway with Puro.earth and Isometric</li>
                <li>• Same signing architecture used across all product verticals</li>
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
              <div className="mb-4 inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-blue-400">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                Scaling · Q2 2026 Pilots
              </div>
              <h3 className="mb-4 font-serif text-2xl text-malama-ink">AI Compute Monitoring</h3>
              <p className="mb-6 text-sm leading-relaxed text-malama-ink-dim">
                Rack-level power sensors measure exact electrical load per inference and training cycle. Same hardware-signed pipeline. Same Cardano anchor. Same Hex Node validators. Verified Scope 1 data the data center cannot omit or estimate.
              </p>
              <ul className="mb-6 space-y-2 text-sm text-malama-ink-dim">
                <li>• Direct power sensing per inference and training cycle</li>
                <li>• Water cooling attribution and evaporation tracking</li>
                <li>• Real-time grid carbon intensity cross-reference at time of measurement</li>
                <li>• Built for SEC climate disclosure, EU CSRD, and SBTi-aligned reporting</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 03 · THE STACK ─────────────────────────────────────────── */}
      <section id="stack" className="w-full border-t border-malama-line bg-malama-elev px-5 py-[120px] sm:px-10">
        <div className="mx-auto max-w-[1400px]">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-3 text-center font-mono text-xs uppercase tracking-[0.2em] text-malama-accent"
          >
            02 · The Stack
          </motion.p>
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-4 text-center font-serif text-[clamp(2rem,4vw,3rem)] font-normal tracking-tight text-malama-ink"
          >
            Four layers visible.
            <br />
            Six layers in the protocol.
          </motion.h2>
          <p className="mx-auto mb-16 max-w-3xl text-center text-lg leading-relaxed text-malama-ink-dim">
            The four-layer summary below collapses Mālama's full six-layer architecture into what teams need day-to-day. Carbon SaveCards, AI compute packets, and future sensor types all flow through the same trust pipeline.
          </p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                n: '01',
                title: 'Hardware',
                sub: 'The device',
                body: 'Two hardware classes, one signing architecture. Genesis 300 outdoor nodes for environmental sites. MRAA-01 rack-mount appliances for data center deployment. Both carry ATECC608B secure enclaves with private keys provisioned at manufacture and never exported.',
              },
              {
                n: '02',
                title: 'Trust',
                sub: 'The signature',
                body: 'ECDSA/SHA-256 device signing. Every reading — soil temperature or rack-level wattage — is signed by the device private key before it leaves hardware. Tamper-evidence is cryptographic, not procedural. The signature exists before the data reaches any network.',
              },
              {
                n: '03',
                title: 'Blockchain',
                sub: 'The anchor',
                body: 'Three-layer by design. Cardano anchors SaveCards via CIP-25/CIP-68 for archival custody and registry-grade auditability. Hedera handles institutional settlement with ABFT consensus and deterministic finality. Base handles rewards, claims, and EVM market activity.',
              },
              {
                n: '04',
                title: 'Hex Nodes',
                sub: 'The validators',
                body: 'Decentralized validator network running Proof-of-Truth consensus. Each Hex Node operates within an H3 geographic cell governed by an NFT-HEX rights object. Nodes validate both carbon SaveCards and AI compute packets. Genesis 200 Phase 1 opens May 2, 2026.',
              },
            ].map(({ n, title, sub, body }, i) => (
              <motion.div
                key={n}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i * 0.2}
                className="card-hover rounded-malama border border-malama-line bg-malama-bg p-8"
              >
                <div className="mb-4 font-mono text-[10px] font-bold uppercase tracking-widest text-malama-accent">{n}</div>
                <h3 className="mb-1 font-serif text-2xl text-malama-ink">{title}</h3>
                <div className="mb-4 font-mono text-[11px] uppercase tracking-widest text-malama-ink-dim">{sub}</div>
                <p className="text-sm leading-relaxed text-malama-ink-dim">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 04 · WHO ITS FOR ───────────────────────────────────────── */}
      <section id="audiences" className="w-full bg-malama-bg px-5 py-[120px] sm:px-10">
        <div className="mx-auto max-w-[1400px]">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-3 text-center font-mono text-xs uppercase tracking-[0.2em] text-malama-accent"
          >
            03 · Who It's For
          </motion.p>
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-4 text-center font-serif text-[clamp(2rem,4vw,3rem)] font-normal tracking-tight text-malama-ink"
          >
            Three audiences today.
            <br />
            The list grows as the sensor catalog grows.
          </motion.h2>

          <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-3">
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="flex flex-col">
              <div className="mb-4 font-mono text-[10px] font-bold uppercase tracking-widest text-malama-accent">01 / Carbon Project Developers</div>
              <h3 className="mb-4 font-serif text-2xl text-malama-ink">Deploy Genesis 300 Nodes</h3>
              <p className="mb-4 text-sm leading-relaxed text-malama-ink-dim">
                Move from intermittent audit assumptions to continuous hardware-signed verification. Sub-acre deployments become viable when field telemetry is continuously signed and queryable at the registry level.
              </p>
              <p className="mb-8 text-sm leading-relaxed text-malama-ink-dim">
                Traditional verification often carries $20,000–$50,000+ per-project audit overhead. Mālama targets single-digit dollar MRV cost per tCO₂e at scale, depending on project size and sensor density.
              </p>
              <div className="mt-auto pt-4">
                <Link href="/docs/carbon" className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-malama-accent hover:text-malama-accent-dim">
                  Carbon dMRV detail →
                </Link>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={1} className="flex flex-col">
              <div className="mb-4 font-mono text-[10px] font-bold uppercase tracking-widest text-blue-400">02 / AI Operators</div>
              <h3 className="mb-4 font-serif text-2xl text-malama-ink">AI Compute & Data Center Teams</h3>
              <p className="mb-4 text-sm leading-relaxed text-malama-ink-dim">
                Hardware-verified Scope 1 data ready for SEC climate disclosure, EU CSRD, and SBTi reporting. Scope 3 support for organizations consuming AI compute services. Stop estimating at the meter; start measuring at the rack.
              </p>
              <ul className="mb-8 space-y-4 text-sm text-malama-ink-dim">
                <li>
                  <strong className="block text-malama-ink">Scope 1:</strong>
                  Direct measurement of electrical load per inference and training cycle
                </li>
                <li>
                  <strong className="block text-malama-ink">Scope 3 support:</strong>
                  Hardware data supports upstream emissions calculations for AI buyers
                </li>
              </ul>
              <div className="mt-auto pt-4">
                <Link href="/docs/ai-compute" className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-blue-400 hover:text-blue-500">
                  AI Compute detail →
                </Link>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={2} className="flex flex-col">
              <div className="mb-4 font-mono text-[10px] font-bold uppercase tracking-widest text-malama-ink-dim">03 / Node Operators</div>
              <h3 className="mb-4 font-serif text-2xl text-malama-ink">Hex Node Validators</h3>
              <p className="mb-4 text-sm leading-relaxed text-malama-ink-dim">
                Run a Hex Node in an H3 geographic cell and validate carbon SaveCards, AI compute packets, and future physical-world data types. Earn MLMA verification yield, uptime multipliers, and governance weight in the Mālama DAO.
              </p>
              <div className="mt-auto pt-4">
                <Link href="https://www.malamalabs.com/stake/" className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-malama-ink hover:text-malama-ink-dim">
                  Join our waitlist →
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 05 · LIVE PROOF ────────────────────────────────────────── */}
      <section id="proof" className="w-full border-y border-malama-line bg-malama-elev px-5 py-[120px] sm:px-10">
        <div className="mx-auto max-w-[1400px]">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-3 text-center font-mono text-xs uppercase tracking-[0.2em] text-malama-accent"
          >
            04 · Live Proof
          </motion.p>
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-4 text-center font-serif text-[clamp(2rem,4vw,3rem)] font-normal tracking-tight text-malama-ink"
          >
            Carbon dMRV is the production reference.
            <br />
            AI compute is next.
          </motion.h2>
          <p className="mx-auto mb-16 max-w-3xl text-center text-lg leading-relaxed text-malama-ink-dim">
            Sensor stream live today on Cardano preprod via op5pro-field-a (Dallas). Mainnet SaveCard minting is paused pending audit completion and migration, targeting Q2 2026. Dashboard SaveCard count reflects live indexer data and may differ slightly from the 2,786+ narrative figure as new records are anchored.
          </p>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Stats Sidebar */}
            <div className="flex flex-col gap-6 lg:col-span-4">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="card-hover rounded-malama border border-malama-line bg-malama-bg p-6"
              >
                <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-malama-ink-faint">SaveCards Minted</div>
                <div className="mb-2 font-serif text-4xl text-malama-accent">2,786+</div>
                <div className="font-mono text-xs text-malama-ink-dim">Hardware-signed · ECDSA</div>
              </motion.div>
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={1}
                className="card-hover rounded-malama border border-malama-line bg-malama-bg p-6"
              >
                <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-malama-ink-faint">Genesis Date</div>
                <div className="mb-2 font-serif text-4xl text-malama-ink">Jun '24</div>
                <div className="font-mono text-xs text-malama-ink-dim">Continuous since June 22, 2024</div>
              </motion.div>
              <div className="grid grid-cols-2 gap-6">
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  custom={2}
                  className="card-hover rounded-malama border border-malama-line bg-malama-bg p-6"
                >
                  <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-malama-ink-faint">Field Events</div>
                  <div className="mb-2 font-serif text-2xl text-malama-ink">3</div>
                  <div className="font-mono text-xs text-malama-ink-dim">Biochar · Soil Test</div>
                </motion.div>
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  custom={3}
                  className="card-hover rounded-malama border border-malama-line bg-malama-bg p-6"
                >
                  <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-malama-ink-faint">Network</div>
                  <div className="mb-2 font-serif text-2xl text-malama-ink">Preprod</div>
                  <div className="font-mono text-xs text-malama-ink-dim">Mainnet target Q2 2026</div>
                </motion.div>
              </div>
            </div>

            {/* Ledger Feed */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={4}
              className="flex flex-col overflow-hidden rounded-malama border border-malama-line bg-malama-bg lg:col-span-8"
            >
              <div className="flex items-center justify-between border-b border-malama-line bg-malama-elev/50 px-6 py-4">
                <div className="font-mono text-xs font-bold uppercase tracking-widest text-malama-ink">Recent Transactions · Preprod</div>
                <div className="flex gap-2">
                  <span className="rounded bg-malama-accent/10 px-2 py-1 font-mono text-[10px] text-malama-accent">Preprod</span>
                  <span className="rounded bg-malama-line px-2 py-1 font-mono text-[10px] text-malama-ink-dim">Mainnet</span>
                </div>
              </div>
              <div className="flex-1 overflow-x-auto p-6">
                <div className="mb-4 flex items-center gap-2 font-mono text-xs text-malama-accent">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-malama-accent" />
                  Live · Koios indexer
                </div>
                <div className="space-y-3 font-mono text-sm">
                  {[
                    ['e81e40ce…8962b05a', '#4,653,405 · 22s'],
                    ['cc15a6d3…7374884f', '#4,642,883 · 3d'],
                    ['0a60a620…36de9c15', '#4,642,845 · 3d'],
                    ['f9f11e84…facb4fdc', '#4,642,831 · 3d'],
                    ['ceb08e6e…05328988', '#4,642,830 · 3d'],
                    ['de7764c2…bcbbf7a1', '#4,642,828 · 3d'],
                    ['23345d11…2982e029', '#4,642,815 · 3d'],
                  ].map(([hash, detail], i) => (
                    <div key={hash} className="flex items-center justify-between border-b border-malama-line/50 pb-3 last:border-0 last:pb-0">
                      <a href={`https://preprod.cardanoscan.io/transaction/${hash.replace('…', '')}`} target="_blank" rel="noopener noreferrer" className="text-malama-ink hover:text-malama-accent hover:underline underline-offset-4">
                        {hash}
                      </a>
                      <span className="text-malama-ink-dim">{detail}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-xs italic text-malama-ink-faint">
                  Each row opens in Cardanoscan. If the indexer feed is empty, the last loaded list shows as fallback.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 06 · MEASUREMENT CRISIS (AI) ───────────────────────────── */}
      <section id="crisis" className="w-full bg-malama-bg px-5 py-[120px] sm:px-10">
        <div className="mx-auto max-w-[1400px]">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-3 text-center font-mono text-xs uppercase tracking-[0.2em] text-malama-accent"
          >
            05 · The Measurement Crisis (AI Compute)
          </motion.p>
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-4 text-center font-serif text-[clamp(2rem,4vw,3rem)] font-normal tracking-tight text-malama-ink"
          >
            Why the next vertical
            <br />
            after carbon is AI.
          </motion.h2>
          <p className="mx-auto mb-16 max-w-3xl text-center text-lg leading-relaxed text-malama-ink-dim">
            The AI industry accelerates while its environmental footprint remains obscured by voluntary disclosure and market-based accounting. A Federation of American Scientists analysis found that market-based emissions reporting can materially understate actual AI data center emissions. Software reporting cannot close the gap between what is disclosed and what is real. Hardware-signed direct measurement can.
          </p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                title: 'Direct Power Sensing',
                sub: 'Per-Inference Wattage',
                body: 'Rack-level sensors measure exact electrical load per inference and training cycle. Not market-based estimates. Not vendor self-reports. Direct measurement at the source, signed at the device before the reading enters any network.',
                metric: '944 Wh',
                metricSub: 'Video generation energy cost per prompt · illustrative estimate',
              },
              {
                title: 'Water Attribution',
                sub: 'Cooling and Evaporation',
                body: 'Hardware-linked tracking of cooling energy and evaporation rates. Cooling water consumption is a material environmental impact of large-scale AI inference that market-based reporting does not capture at the prompt level.',
                metric: '~1 L',
                metricSub: 'Cooling water per video generation prompt · illustrative estimate',
              },
              {
                title: 'Grid Intensity Sync',
                sub: 'Real Carbon, Not Average',
                body: 'Cross-references real-time grid carbon intensity with sensor-verified energy use. The same kilowatt-hour at different times and locations carries materially different emissions weight. Hourly CFE matching requires this resolution.',
                metric: '39.2 Wh',
                metricSub: 'GPT-o3 per prompt energy estimate · illustrative',
              },
            ].map(({ title, sub, body, metric, metricSub }, i) => (
              <motion.div
                key={title}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i * 0.2}
                className="card-hover-blue flex flex-col rounded-malama border border-malama-line bg-malama-bg p-8"
              >
                <div className="mb-2 font-mono text-[10px] font-bold uppercase tracking-widest text-blue-400">{title}</div>
                <h3 className="mb-4 font-serif text-2xl text-malama-ink">{sub}</h3>
                <p className="mb-8 text-sm leading-relaxed text-malama-ink-dim">{body}</p>
                <div className="mt-auto border-t border-malama-line pt-6">
                  <div className="mb-1 font-serif text-3xl text-blue-400">{metric}</div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-malama-ink-dim">{metricSub}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 flex justify-center gap-4">
            <Link href="/docs/ai-compute" className="btn-ghost inline-flex items-center justify-center gap-2 border border-malama-line-bright px-7 py-4 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-malama-ink transition hover:border-blue-400 hover:text-blue-400">
              AI Compute Product →
            </Link>
            <a href={SOURCE_AIPOWER} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center justify-center gap-2 bg-blue-500 px-7 py-4 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-malama-bg shadow-[0_8px_24px_rgba(59,130,246,0.2)] transition hover:-translate-y-0.5">
              Live Dashboard ↗
            </a>
          </div>
        </div>
      </section>

      {/* ── 07 · NETWORK CTA ───────────────────────────────────────── */}
      <section id="reserve" className="w-full border-t border-malama-line bg-malama-elev px-5 py-[120px] sm:px-10">
        <div className="mx-auto max-w-[1400px]">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mx-auto max-w-4xl text-center"
          >
            <h2 className="mb-6 font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-normal leading-tight tracking-tight text-malama-ink">
              Own the infrastructure
              <br />
              <em className="font-light italic text-malama-accent">of truth.</em>
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-malama-ink-dim">
              Each Hex Node validates carbon SaveCards and AI compute packets across the Mālama network. Get updates—learn first when we open in the coming days.
            </p>

            <div className="mb-16 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="https://www.malamalabs.com/stake/"
                className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-5 font-mono text-sm font-semibold uppercase tracking-[0.1em] text-malama-bg shadow-[0_8px_30px_rgba(196,240,97,0.25)] transition hover:-translate-y-0.5"
              >
                Join our waitlist ↗
              </Link>
              <Link
                href="/contact"
                className="btn-ghost inline-flex items-center justify-center gap-2 border border-malama-line-bright px-8 py-5 font-mono text-sm font-semibold uppercase tracking-[0.1em] text-malama-ink transition hover:border-malama-accent hover:text-malama-accent"
              >
                Schedule a Call
              </Link>
            </div>
          </motion.div>

          {/* Footer-ish closing block */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mx-auto mt-24 max-w-4xl border-t border-malama-line pt-12 text-center"
          >
            <h3 className="mb-4 font-serif text-2xl text-malama-ink">Mālama Labs</h3>
            <p className="mb-8 text-sm text-malama-ink-dim">
              The hardware-signed trust anchor for environmental truth. Two product lines: carbon dMRV (proven) and AI compute monitoring (scaling).
            </p>
            <div className="flex justify-center gap-6">
              <a
                href={SOURCE_AIPOWER}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-blue-400 hover:text-blue-300"
              >
                Live stream → aipower.fyi <ExternalLink className="h-3 w-3" />
              </a>
              <a
                href="https://malamafoundation.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-malama-accent hover:text-malama-accent-dim"
              >
                MalamaFoundation.org <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
