'use client'

import Link from 'next/link'

const SCHEDULE = 'mailto:hello@malamalabs.com?subject=Schedule%20a%20call'

export default function Home() {
  return (
    <div className="flex w-full flex-col items-center bg-malama-bg text-malama-ink">
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[88vh] w-full flex-col items-center justify-center overflow-hidden px-5 pt-16 sm:px-10">
        <div className="absolute inset-0 z-0 opacity-[0.10]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hex" width="60" height="103.92" patternUnits="userSpaceOnUse" patternTransform="scale(1.4)">
                <path d="M30 0l30 17.32v34.64L30 69.28 0 51.96V17.32z" fill="none" stroke="#c4f061" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hex)" />
          </svg>
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-malama-bg" />

        <div className="z-10 flex max-w-4xl flex-col items-center text-center">
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
            <a href={SCHEDULE} className="btn-primary inline-flex items-center justify-center px-7 py-4 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-malama-bg">
              Schedule a Call
            </a>
            <Link href="/explorer" className="btn-ghost inline-flex items-center justify-center border border-malama-line-bright px-7 py-4 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-malama-ink transition hover:border-malama-accent hover:text-malama-accent">
              See the live network
            </Link>
          </div>
        </div>
      </section>

      {/* ── 01 · THE NETWORK, RIGHT NOW ──────────────────────────────── */}
      <Section eyebrow="01 · The network, right now" title="Every hex is a place. Every gold tick is a reading a machine signed.">
        <p className="mx-auto mb-10 max-w-3xl text-center text-malama-ink-dim">
          Hex Nodes validate signed readings inside their geographic cell. Click a cell to see what its
          sensor reported and the on-chain record that proves it.
        </p>

        {/* Illustrative cell layout */}
        <div className="mx-auto max-w-4xl rounded-malama border border-malama-line bg-malama-elev/60 p-6">
          <div className="grid grid-cols-6 gap-3 sm:grid-cols-9">
            {ILLUSTRATIVE_CELLS.map((state, i) => (
              <div
                key={i}
                className="relative flex aspect-square items-center justify-center rounded-md border"
                style={{ borderColor: CELL_COLOR[state], background: `${CELL_COLOR[state]}14` }}
                title={CELL_LABEL[state]}
              >
                {state === 'verified' && <span className="h-1.5 w-1.5 rounded-full bg-malama-accent" />}
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-widest text-malama-ink-faint">
            {(Object.keys(CELL_LABEL) as CellState[]).map((s) => (
              <span key={s} className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: CELL_COLOR[s] }} />
                {CELL_LABEL[s]}
              </span>
            ))}
          </div>

          <p className="mt-5 text-xs text-malama-ink-faint">
            Illustrative cell layout.{' '}
            <Link href="/explorer" className="text-malama-accent hover:underline">
              Live map with pan and zoom in the Hex Map Explorer →
            </Link>
          </p>
        </div>

        <div className="mx-auto mt-6 grid max-w-4xl gap-4 sm:grid-cols-2">
          <div className="rounded-malama border border-malama-line bg-malama-elev/40 p-5 text-sm text-malama-ink-dim">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-malama-ink-faint">
              Detail panel
            </p>
            <p>Uptime · Signed today · Cadence · last 24 h · gold tick = signed point</p>
          </div>
          <div className="rounded-malama border border-dashed border-malama-line bg-malama-elev/20 p-5 text-sm text-malama-ink-dim">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-malama-ink-faint">
              Empty cell
            </p>
            <p>
              No sensor deployed here yet.{' '}
              <Link href="/presale" className="text-malama-accent hover:underline">
                Register interest in this cell →
              </Link>
            </p>
          </div>
        </div>
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

        <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
          <div className="rounded-malama border border-malama-line bg-malama-elev/40 p-6">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-malama-ink-faint">Estimated</p>
            <ul className="space-y-1.5 text-sm text-malama-ink-dim">
              <li>Modeled once. Wide error band.</li>
              <li>Reported by the party being measured.</li>
              <li>Annual report, 12 to 18 months later.</li>
            </ul>
          </div>
          <div className="rounded-malama border border-malama-accent/40 bg-malama-accent/[0.06] p-6">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-malama-accent">Measured</p>
            <ul className="space-y-1.5 text-sm text-malama-ink">
              <li>Signed every 5 seconds.</li>
              <li>Anchored on chain.</li>
            </ul>
          </div>
        </div>
        <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-widest text-malama-ink-faint">
          How a claim gets made · illustrative
        </p>
      </Section>

      {/* ── 03 · WHAT WE BUILD ───────────────────────────────────────── */}
      <Section eyebrow="03 · What we build" title="A sensor that proves its own reading. Three steps.">
        <p className="mx-auto mb-12 max-w-3xl text-center text-malama-ink-dim">
          Put the signature where the data is born, not where the report is written. Everything
          downstream inherits that proof.
        </p>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          <StepCard
            n="01"
            title="Measure"
            lead="A sensor in the field takes a reading."
            body="Soil carbon at a biochar site. Power draw on a rack inside an AI data center. Continuous, high-frequency, at the source. Not once a year."
            caption="Genesis 300 node, biochar site. Soil and atmospheric probes."
          />
          <StepCard
            n="02"
            title="Sign"
            lead="A secure chip signs it before it leaves the device."
            body="Each sensor carries an ATECC608B secure element. Its private key is burned in at manufacture and never leaves the silicon. Change one digit of the reading and the signature breaks. This is the part no software-only system can copy."
            caption="Secure element and tamper-evident seal. Studio."
          />
          <StepCard
            n="03"
            title="Anchor"
            lead="The signed record goes on chain as a SaveCard."
            body="Independent Hex Node validators check the record and anchor it on Cardano. Registries, auditors, buyers, and regulators can all verify the same record. Nobody has to take our word for it."
            caption="AI Power Sensor, rack install. Pilot hardware."
            tech="Hardware-signed · ECDSA · Cardano · CIP-25 / CIP-68 · Liquidity on Base"
          />
        </div>
      </Section>

      {/* ── 04 · WHERE IT RUNS TODAY ─────────────────────────────────── */}
      <Section eyebrow="04 · Where it runs today" title="Carbon proved it. AI compute scales it." dark>
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          <RunCard
            status="Carbon dMRV · live since June 2024 · 2,786+ signed records"
            title="Proof that a project removed the carbon it claims."
            body="Genesis 300 sensors sit at biochar, rock-weathering, forestry, and soil projects and sign what they measure. Developers get pre-finance against verified evidence (LCO₂). Buyers get credits with a signed trail from field to registry (VCO₂). Compatible with Puro.earth, Isometric, and Verra."
            href="/sensors"
            cta="Sensor systems →"
          />
          <RunCard
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
          <a href={SCHEDULE} className="btn-primary inline-flex items-center justify-center px-7 py-4 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-malama-bg">
            Schedule a Call
          </a>
          <Link href="/explorer" className="btn-ghost inline-flex items-center justify-center border border-malama-line-bright px-7 py-4 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-malama-ink transition hover:border-malama-accent hover:text-malama-accent">
            See the live network
          </Link>
        </div>
      </section>
    </div>
  )
}

// ── Cell states for the illustrative map ────────────────────────────────────
type CellState = 'verified' | 'pending' | 'offline' | 'none'
const CELL_LABEL: Record<CellState, string> = {
  verified: 'Verified',
  pending: 'Pending',
  offline: 'Offline',
  none: 'No sensor yet',
}
const CELL_COLOR: Record<CellState, string> = {
  verified: '#c4f061',
  pending: '#f0a860',
  offline: '#6b7280',
  none: '#2a3325',
}
const ILLUSTRATIVE_CELLS: CellState[] = [
  'verified','verified','pending','none','verified','none','pending','verified','none',
  'none','verified','none','offline','verified','pending','none','verified','none',
  'pending','none','verified','none','verified','none','none','pending','verified',
]

function Section({
  eyebrow,
  title,
  children,
  dark,
}: {
  eyebrow: string
  title: string
  children: React.ReactNode
  dark?: boolean
}) {
  return (
    <section className={`w-full px-5 py-[110px] sm:px-10 ${dark ? 'border-y border-malama-line bg-malama-elev' : ''}`}>
      <div className="mx-auto max-w-[1200px]">
        <p className="mb-3 text-center font-mono text-xs uppercase tracking-[0.2em] text-malama-accent">{eyebrow}</p>
        <h2 className="mx-auto mb-8 max-w-4xl text-center font-serif text-[clamp(1.9rem,3.6vw,3rem)] font-normal tracking-tight">
          {title}
        </h2>
        {children}
      </div>
    </section>
  )
}

function StepCard({
  n,
  title,
  lead,
  body,
  caption,
  tech,
}: {
  n: string
  title: string
  lead: string
  body: string
  caption: string
  tech?: string
}) {
  return (
    <div className="flex flex-col rounded-malama border border-malama-line bg-malama-elev/50 p-7">
      <div className="mb-4 flex items-center gap-3">
        <span className="font-mono text-xs text-malama-accent">{n}</span>
        <span className="font-serif text-2xl">{title}</span>
      </div>
      <p className="mb-3 text-[15px] font-medium text-malama-ink">{lead}</p>
      <p className="mb-5 flex-1 text-sm leading-relaxed text-malama-ink-dim">{body}</p>
      {tech && (
        <p className="mb-4 font-mono text-[10px] uppercase tracking-wide text-malama-accent">{tech}</p>
      )}
      <p className="border-t border-malama-line pt-4 text-xs text-malama-ink-faint">{caption}</p>
    </div>
  )
}

function RunCard({
  status,
  title,
  body,
  href,
  cta,
}: {
  status: string
  title: string
  body: string
  href: string
  cta: string
}) {
  return (
    <div className="flex flex-col rounded-malama border border-malama-line bg-malama-bg/60 p-7">
      <p className="mb-4 font-mono text-[10px] uppercase tracking-wide text-malama-accent">{status}</p>
      <h3 className="mb-3 font-serif text-xl">{title}</h3>
      <p className="mb-6 flex-1 text-sm leading-relaxed text-malama-ink-dim">{body}</p>
      <Link href={href} className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-malama-accent hover:underline">
        {cta}
      </Link>
    </div>
  )
}
