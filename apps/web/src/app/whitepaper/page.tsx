import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Whitepaper v1.0 · Mālama Labs',
  description:
    'Mālama Labs institutional whitepaper — Hardware-verified truth for climate markets and AI compute. A six-layer DePIN architecture pairing edge-bound cryptographic hardware with a continuous, hardware-signed evidence pipeline.',
}

export default function WhitepaperPage() {
  return (
    <div className="min-h-screen bg-malama-bg">
      {/* ── Header bar ── */}
      <div className="border-b border-malama-line bg-malama-bg/95 sticky top-0 z-10 backdrop-blur">
        <div className="mx-auto max-w-7xl px-5 sm:px-10 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/docs"
              className="font-mono text-[10px] uppercase tracking-[0.12em] text-malama-ink-faint hover:text-malama-accent transition-colors"
            >
              ← Docs
            </Link>
            <span className="text-malama-line">·</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-malama-ink-dim">
              Whitepaper v1.0
            </span>
          </div>
          <a
            href="/whitepaper.pdf"
            download="Malama-Labs-Whitepaper-v1.pdf"
            className="inline-flex items-center gap-2 rounded-lg border border-malama-accent/40 bg-malama-accent/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-malama-accent hover:bg-malama-accent/20 transition-colors"
          >
            <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 12L3 7h3V1h4v6h3L8 12zM2 14h12v1.5H2z"/>
            </svg>
            Download PDF
          </a>
        </div>
      </div>

      {/* ── Title block ── */}
      <div className="mx-auto max-w-7xl px-5 sm:px-10 pt-10 pb-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-malama-accent/80 mb-3">
          Institutional Whitepaper · Six-Layer DePIN
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-malama-ink leading-tight max-w-2xl">
          Hardware-verified truth for climate markets and AI compute.
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-malama-ink-dim">
          Document <span className="font-mono">MLM-WP-v1.0</span> · May 2026 · Pre-Launch ·{' '}
          <span className="text-malama-ink-faint">33 pages</span>
        </p>

        {/* Metadata chips */}
        <div className="mt-6 flex flex-wrap gap-3">
          {[
            { label: 'Status', value: 'Pre-Launch' },
            { label: 'Framework', value: 'Six-Layer DePIN' },
            { label: 'Mainnet Target', value: 'Q3 2026' },
            { label: 'Cardano Preprod', value: 'Active' },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-lg border border-malama-line bg-malama-elev px-4 py-2"
            >
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-malama-ink-faint mb-0.5">
                {label}
              </p>
              <p className="font-mono text-xs font-medium text-malama-ink">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── PDF embed ── */}
      <div className="mx-auto max-w-7xl px-5 sm:px-10 pb-16">
        <div className="rounded-2xl border border-malama-line overflow-hidden shadow-2xl">
          <iframe
            src="/whitepaper.pdf"
            title="Mālama Labs Whitepaper v1.0"
            className="w-full"
            style={{ height: 'calc(100vh - 12rem)', minHeight: 600 }}
          />
        </div>

        {/* Fallback / mobile note */}
        <p className="mt-4 text-center font-mono text-[11px] text-malama-ink-faint">
          If the viewer doesn't load,{' '}
          <a
            href="/whitepaper.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-malama-accent hover:underline"
          >
            open the PDF directly
          </a>
          .
        </p>
      </div>
    </div>
  )
}
