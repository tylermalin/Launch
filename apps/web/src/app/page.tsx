'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'

const SCHEDULE = 'mailto:hello@malamalabs.com?subject=Schedule%20a%20call'

export default function Home() {
  return (
    <div className="flex w-full flex-col items-center bg-malama-bg text-malama-ink">
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[88vh] w-full flex-col items-center justify-center overflow-hidden px-5 pt-16 sm:px-10">
        <div className="absolute inset-0 z-0 opacity-[0.10]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hexbg" width="60" height="103.92" patternUnits="userSpaceOnUse" patternTransform="scale(1.4)">
                <path d="M30 0l30 17.32v34.64L30 69.28 0 51.96V17.32z" fill="none" stroke="#c4f061" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hexbg)" />
          </svg>
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-malama-bg" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="z-10 flex max-w-4xl flex-col items-center text-center"
        >
          <div className="mb-8 inline-flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-malama-accent">
            <span className="h-2 w-2 animate-pulse rounded-full bg-malama-accent" />
            Live · signed every 5 seconds · Dallas, TX
          </div>
          <h1 className="mb-6 max-w-[1000px] font-serif text-[clamp(2.5rem,6.5vw,5rem)] font-normal leading-[0.98] tracking-[-0.03em]">
            Hardware-verified environmental sensing for the real world.
          </h1>
          <p className="mb-9 max-w-2xl text-[18px] leading-relaxed text-malama-ink-dim">
            Mālama Labs builds sensors that cryptographically sign every reading inside the device, the
            moment it is measured. The record is anchored on a public blockchain. Nobody can edit it
            after the fact, and anyone can check it.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <a href={SCHEDULE} className="btn-primary inline-flex items-center justify-center px-7 py-4 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-malama-bg transition hover:-translate-y-0.5">
              Schedule a Call
            </a>
            <Link href="/explorer" className="btn-ghost inline-flex items-center justify-center border border-malama-line-bright px-7 py-4 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-malama-ink transition hover:-translate-y-0.5 hover:border-malama-accent hover:text-malama-accent">
              See the live network
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── 01 · THE NETWORK ─────────────────────────────────────────── */}
      <Section eyebrow="01 · The network, right now" title="Every hex is a place. Every gold tick is a reading a machine signed.">
        <p className="mx-auto mb-10 max-w-3xl text-center text-malama-ink-dim">
          Hex Nodes validate signed readings inside their geographic cell. Click a cell to see what its
          sensor reported and the on-chain record that proves it.
        </p>
        <HexNetwork />
      </Section>

      {/* ── 02 · WHY THIS MATTERS ────────────────────────────────────── */}
      <Section eyebrow="02 · Why this matters" title="Climate markets run on estimates. Estimates cannot be audited." dark>
        <div className="mx-auto max-w-3xl space-y-5 text-malama-ink-dim">
          <p>
            Carbon credits are verified by site visits and spreadsheets, 12 to 18 months after the fact.
            AI data centers report emissions using market-based accounting. The Federation of American
            Scientists found Meta&apos;s actual emissions may be up to 19,000× higher than its reports
            suggest. When the number is wrong, there is no way to prove it either way.
          </p>
          <p>
            A measured number is different in kind. It has a timestamp, a location, and a signature from
            the device that took it. You do not have to trust the reporter. You check the record.
          </p>
        </div>
        <BandViz />
      </Section>

      {/* ── 03 · WHAT WE BUILD ───────────────────────────────────────── */}
      <Section eyebrow="03 · What we build" title="A sensor that proves its own reading. Three steps.">
        <p className="mx-auto mb-12 max-w-3xl text-center text-malama-ink-dim">
          Put the signature where the data is born, not where the report is written. Everything
          downstream inherits that proof.
        </p>
        <BuildSteps />
      </Section>

      {/* ── 04 · WHERE IT RUNS ───────────────────────────────────────── */}
      <Section eyebrow="04 · Where it runs today" title="Carbon proved it. AI compute scales it." dark>
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          <RunCard
            image={{ src: '/sensors/field-hero.png', alt: 'Genesis 300 sensor node at a biochar site' }}
            status="Carbon dMRV · live since June 2024 · 51,466+ signed records"
            title="Proof that a project removed the carbon it claims."
            body="Genesis 300 sensors sit at biochar, rock-weathering, forestry, and soil projects and sign what they measure. Developers get pre-finance against verified evidence (LCO₂). Buyers get credits with a signed trail from field to registry (VCO₂). Compatible with Puro.earth, Isometric, and Verra."
            href="/sensors"
            cta="Sensor systems →"
          />
          <RunCard
            image={{ rack: true, alt: 'AI Power Sensor, data-center rack install' }}
            status="AI compute · pilots Q2 2026 · Estimation stream live at aipower.fyi"
            title="Measured emissions for every inference and training run."
            body="Rack-level power sensors inside AI data centers record electrical load directly, attribute cooling water, and cross-reference grid carbon intensity at the moment of measurement. Built for SEC climate disclosure, EU CSRD, and SBTi reporting."
            href="/data-solutions"
            cta="AI compute →"
          />
        </div>
      </Section>

      {/* ── CLOSER ───────────────────────────────────────────────────── */}
      <section className="w-full px-5 py-24 text-center sm:px-10">
        <h2 className="mx-auto mb-8 max-w-2xl font-serif text-[clamp(1.8rem,4vw,2.6rem)] font-normal tracking-tight">
          See the record for yourself.
        </h2>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <a href={SCHEDULE} className="btn-primary inline-flex items-center justify-center px-7 py-4 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-malama-bg transition hover:-translate-y-0.5">
            Schedule a Call
          </a>
          <Link href="/explorer" className="btn-ghost inline-flex items-center justify-center border border-malama-line-bright px-7 py-4 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-malama-ink transition hover:-translate-y-0.5 hover:border-malama-accent hover:text-malama-accent">
            See the live network
          </Link>
        </div>
      </section>
    </div>
  )
}

/* ── Reusable section wrapper with scroll reveal ───────────────────────── */
function Section({ eyebrow, title, children, dark }: { eyebrow: string; title: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <section className={`w-full px-5 py-[110px] sm:px-10 ${dark ? 'border-y border-malama-line bg-malama-elev' : ''}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mx-auto max-w-[1200px]"
      >
        <p className="mb-3 text-center font-mono text-xs uppercase tracking-[0.2em] text-malama-accent">{eyebrow}</p>
        <h2 className="mx-auto mb-8 max-w-4xl text-center font-serif text-[clamp(1.9rem,3.6vw,3rem)] font-normal tracking-tight">{title}</h2>
        {children}
      </motion.div>
    </section>
  )
}

/* ── 01 · Interactive hexagonal network ────────────────────────────────── */
type CellState = 'verified' | 'pending' | 'offline' | 'none'
const STATE_COLOR: Record<CellState, string> = { verified: '#c4f061', pending: '#f0a860', offline: '#6b7280', none: '#3a4632' }
const STATE_LABEL: Record<CellState, string> = { verified: 'Verified', pending: 'Pending', offline: 'Offline', none: 'No sensor yet' }

interface Cell { id: number; row: number; col: number; state: CellState; region: string; lat: string; lng: string }

// Fixed layout so it renders identically every load (no randomness).
const LAYOUT: CellState[][] = [
  ['verified', 'verified', 'pending', 'none', 'verified', 'none', 'pending'],
  ['none', 'verified', 'offline', 'verified', 'pending', 'none', 'verified'],
  ['pending', 'none', 'verified', 'none', 'verified', 'offline', 'none'],
  ['verified', 'pending', 'none', 'verified', 'none', 'verified', 'pending'],
]
const REGIONS = ['Dallas, TX', 'Austin, TX', 'Boulder, CO', 'Fresno, CA', 'Ames, IA', 'Athens, GA', 'Bend, OR']

function hexPoints(cx: number, cy: number, r: number): string {
  const pts: string[] = []
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 180) * (60 * i - 30)
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`)
  }
  return pts.join(' ')
}

function HexNetwork() {
  const r = 30
  const dx = Math.sqrt(3) * r
  const dy = 1.5 * r
  const pad = r + 4

  const cells: Cell[] = useMemo(() => {
    const out: Cell[] = []
    let id = 0
    LAYOUT.forEach((rowArr, row) =>
      rowArr.forEach((state, col) => {
        out.push({
          id: id++,
          row,
          col,
          state,
          region: REGIONS[(row * 3 + col) % REGIONS.length],
          lat: (30 + row * 1.7 + col * 0.3).toFixed(3),
          lng: (-(96 + col * 1.4 + row * 0.5)).toFixed(3),
        })
      }),
    )
    return out
  }, [])

  const [selected, setSelected] = useState<Cell | null>(() => cells.find((c) => c.state === 'verified') ?? null)

  const cols = LAYOUT[0].length
  const width = pad * 2 + dx * cols + dx / 2
  const height = pad * 2 + dy * (LAYOUT.length - 1) + r * 2

  const cx = (c: Cell) => pad + c.col * dx + (c.row % 2 ? dx / 2 : 0) + r
  const cy = (c: Cell) => pad + c.row * dy + r

  return (
    <div className="mx-auto grid max-w-5xl items-start gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="rounded-malama border border-malama-line bg-malama-elev/50 p-4">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label="Illustrative hex network">
          {cells.map((c) => {
            const active = selected?.id === c.id
            return (
              <g key={c.id} className="cursor-pointer" onClick={() => setSelected(c)}>
                <polygon
                  points={hexPoints(cx(c), cy(c), r - 2)}
                  fill={`${STATE_COLOR[c.state]}${active ? '33' : '1f'}`}
                  stroke={active ? '#c4f061' : STATE_COLOR[c.state]}
                  strokeWidth={active ? 2.4 : 1.2}
                  style={{ transition: 'all .2s' }}
                />
                {c.state === 'verified' && <circle cx={cx(c)} cy={cy(c)} r={3} fill="#c4f061" />}
              </g>
            )
          })}
        </svg>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-widest text-malama-ink-faint">
          {(Object.keys(STATE_LABEL) as CellState[]).map((s) => (
            <span key={s} className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: STATE_COLOR[s] }} />
              {STATE_LABEL[s]}
            </span>
          ))}
        </div>
        <p className="mt-3 text-xs text-malama-ink-faint">
          Illustrative cell layout.{' '}
          <Link href="/explorer" className="text-malama-accent hover:underline">Live map with pan and zoom in the Hex Map Explorer →</Link>
        </p>
      </div>

      <CellDetail cell={selected} />
    </div>
  )
}

function CellDetail({ cell }: { cell: Cell | null }) {
  if (!cell) return null
  return (
    <motion.div
      key={cell.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-malama border border-malama-line bg-malama-bg/60 p-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="font-serif text-lg text-malama-ink">{cell.region}</span>
        <span
          className="rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide"
          style={{ background: `${STATE_COLOR[cell.state]}22`, color: STATE_COLOR[cell.state] }}
        >
          {STATE_LABEL[cell.state]}
        </span>
      </div>

      {cell.state === 'verified' && (
        <dl className="space-y-2 text-sm">
          <Row k="Reading" v="Soil organic carbon 2.14%" accent />
          <Row k="Signed" v="3s ago · ATECC608B secure element" />
          <Row k="Cadence" v="every 5s · 17,280 today" />
          <Row k="Anchored" v="Cardano · CIP-68 SaveCard" />
          <p className="pt-2 text-xs text-malama-ink-faint">Gold tick = a signed point on the record.</p>
        </dl>
      )}
      {cell.state === 'pending' && (
        <dl className="space-y-2 text-sm">
          <Row k="Status" v="Demand registered · sensor not yet deployed" />
          <Row k="Data Demand Score" v="74 / 100" accent />
          <Row k="Live readings" v="None. Unsigned streams are not accepted." />
          <p className="pt-2 text-xs text-malama-ink-faint">Only hardware-signed readings appear here.</p>
        </dl>
      )}
      {cell.state === 'offline' && (
        <dl className="space-y-2 text-sm">
          <Row k="Status" v="Sensor unreachable" accent />
          <Row k="Last signed" v="4h 12m ago" />
          <Row k="Coverage" v="No new signed points until it reconnects" />
        </dl>
      )}
      {cell.state === 'none' && (
        <dl className="space-y-2 text-sm">
          <Row k="Latitude" v={cell.lat} />
          <Row k="Longitude" v={cell.lng} />
          <Row k="Sensor" v="No sensor deployed here yet" />
          <p className="pt-3 text-sm">
            <Link href="/presale" className="text-malama-accent hover:underline">Register interest in this cell →</Link>
          </p>
        </dl>
      )}
    </motion.div>
  )
}

function Row({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-malama-line/60 pb-2">
      <dt className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-malama-ink-faint">{k}</dt>
      <dd className={`text-right ${accent ? 'font-medium text-malama-accent' : 'text-malama-ink-dim'}`}>{v}</dd>
    </div>
  )
}

/* ── 02 · Estimated (wide band) vs Measured (narrow band) ──────────────── */
function BandViz() {
  return (
    <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
      {/* Estimated — wide error band */}
      <div className="rounded-malama border border-malama-line bg-malama-elev/40 p-6">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-malama-ink-faint">Estimated</p>
        <svg viewBox="0 0 240 90" className="w-full">
          <path d="M0 20 C60 8, 180 78, 240 26 L240 74 C180 52, 60 30, 0 68 Z" fill="#f0a86022" />
          <path d="M0 44 C60 20, 180 60, 240 40" fill="none" stroke="#f0a860" strokeWidth="1.5" strokeDasharray="4 3" />
        </svg>
        <p className="mt-3 text-xs text-malama-ink-dim">Modeled once. Wide error band. Reported by the party being measured. Annual, 12 to 18 months late.</p>
      </div>
      {/* Measured — narrow band */}
      <div className="rounded-malama border border-malama-accent/40 bg-malama-accent/[0.06] p-6">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-malama-accent">Measured</p>
        <svg viewBox="0 0 240 90" className="w-full">
          <path d="M0 44 C60 40, 180 48, 240 43 L240 49 C180 54, 60 46, 0 50 Z" fill="#c4f06126" />
          <path d="M0 47 C60 44, 180 50, 240 46" fill="none" stroke="#c4f061" strokeWidth="2" />
          {[10, 55, 100, 145, 190, 232].map((x, i) => (
            <circle key={i} cx={x} cy={46 + Math.sin(i) * 1.5} r={2.2} fill="#c4f061" />
          ))}
        </svg>
        <p className="mt-3 text-xs text-malama-ink">Signed every 5 seconds. Narrow band. Anchored on chain.</p>
      </div>
    </div>
  )
}

/* ── 03 · Animated Measure → Sign → Anchor sequence ────────────────────── */
const STEPS = [
  { n: '01', title: 'Measure', lead: 'A sensor in the field takes a reading.', body: 'Soil carbon at a biochar site. Power draw on a rack inside an AI data center. Continuous, high-frequency, at the source. Not once a year.', caption: 'Genesis 300 node, biochar site. Soil and atmospheric probes.' },
  { n: '02', title: 'Sign', lead: 'A secure chip signs it before it leaves the device.', body: 'Each sensor carries an ATECC608B secure element. Its private key is burned in at manufacture and never leaves the silicon. Change one digit of the reading and the signature breaks. This is the part no software-only system can copy.', caption: 'Secure element and tamper-evident seal. Studio.' },
  { n: '03', title: 'Anchor', lead: 'The signed record goes on chain as a SaveCard.', body: 'Independent Hex Node validators check the record and anchor it on Cardano. Registries, auditors, buyers, and regulators can all verify the same record. Nobody has to take our word for it.', caption: 'AI Power Sensor, rack install. Pilot hardware.', tech: 'Hardware-signed · ECDSA · Cardano · CIP-25 / CIP-68 · Liquidity on Base' },
]

function BuildSteps() {
  // CSS-driven staggered highlight — outline of 01 glows then fades, then 02, then
  // 03, on a loop. No JS timer (keeps the main thread idle).
  return (
    <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
      <style
        dangerouslySetInnerHTML={{
          __html: `
@keyframes buildpulse {
  0%, 24%, 100% { border-color: var(--malama-line, #1f2a20); box-shadow: none; }
  8%, 16% { border-color: #c4f061; box-shadow: 0 0 0 1px #c4f061, 0 0 34px rgba(196,240,97,0.20); }
}
@keyframes buildnum {
  0%, 24%, 100% { background: transparent; color: #c4f061; }
  8%, 16% { background: #c4f061; color: #0a0e0a; }
}
.build-step { animation: buildpulse 5.4s ease-in-out infinite; }
.build-step .build-num { animation: buildnum 5.4s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .build-step, .build-step .build-num { animation: none; } }
`,
        }}
      />
      {STEPS.map((s, i) => (
        <div
          key={s.n}
          className="build-step flex flex-col rounded-malama border border-malama-line bg-malama-elev/50 p-7 transition-transform hover:-translate-y-1"
          style={{ animationDelay: `${i * 1.8}s` }}
        >
          <div className="mb-4 flex items-center gap-3">
            <span
              className="build-num flex h-8 w-8 items-center justify-center rounded-full border border-malama-accent font-mono text-xs text-malama-accent"
              style={{ animationDelay: `${i * 1.8}s` }}
            >
              {s.n}
            </span>
            <span className="font-serif text-2xl">{s.title}</span>
          </div>
          <p className="mb-3 text-[15px] font-medium text-malama-ink">{s.lead}</p>
          <p className="mb-5 flex-1 text-sm leading-relaxed text-malama-ink-dim">{s.body}</p>
          {s.tech && <p className="mb-4 font-mono text-[10px] uppercase tracking-wide text-malama-accent">{s.tech}</p>}
          <p className="border-t border-malama-line pt-4 text-xs text-malama-ink-faint">{s.caption}</p>
        </div>
      ))}
    </div>
  )
}

/* ── 04 · Run card with image ──────────────────────────────────────────── */
function RunCard({
  image,
  status,
  title,
  body,
  href,
  cta,
}: {
  image: { src?: string; alt: string; rack?: boolean }
  status: string
  title: string
  body: string
  href: string
  cta: string
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className="flex flex-col overflow-hidden rounded-malama border border-malama-line bg-malama-bg/60"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-malama-elev">
        {image.rack ? (
          <RackGraphic />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image.src} alt={image.alt} className="h-full w-full object-cover" loading="lazy" />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-malama-bg/70 to-transparent" />
      </div>
      <div className="flex flex-1 flex-col p-7">
        <p className="mb-4 font-mono text-[10px] uppercase tracking-wide text-malama-accent">{status}</p>
        <h3 className="mb-3 font-serif text-xl">{title}</h3>
        <p className="mb-6 flex-1 text-sm leading-relaxed text-malama-ink-dim">{body}</p>
        <Link href={href} className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-malama-accent hover:underline">{cta}</Link>
      </div>
    </motion.div>
  )
}

// Placeholder data-center rack visual until a real photo is dropped in.
function RackGraphic() {
  return (
    <svg viewBox="0 0 320 180" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-label="Data-center rack">
      <rect width="320" height="180" fill="#0d130c" />
      {[0, 1].map((rack) =>
        Array.from({ length: 9 }).map((_, i) => (
          <g key={`${rack}-${i}`}>
            <rect x={40 + rack * 130} y={16 + i * 17} width="110" height="13" rx="2" fill="#161c13" stroke="#233019" />
            <circle cx={48 + rack * 130} cy={22 + i * 17} r="1.6" fill={i % 3 === 0 ? '#c4f061' : '#3a4632'} />
            <circle cx={54 + rack * 130} cy={22 + i * 17} r="1.6" fill={i % 4 === 0 ? '#f0a860' : '#3a4632'} />
            <rect x={120 + rack * 130} y={19 + i * 17} width="24" height="7" rx="1" fill="#0a0e0a" />
          </g>
        )),
      )}
    </svg>
  )
}
