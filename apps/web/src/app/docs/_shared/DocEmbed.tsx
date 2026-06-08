import Link from 'next/link'

/**
 * DocEmbed — thin PDF-embed page for the document-class V1 docs.
 *
 * Replicates the /whitepaper page pattern: a header bar with a back link,
 * doc name + version, and a download action; a title block with the
 * canonical eyebrow, headline, document id, and metadata chips; and an
 * in-page PDF viewer with a direct-open fallback.
 *
 * All metadata comes from the V1 PDF covers. Do not invent values here.
 */

export interface DocEmbedChip {
  label: string
  value: string
}

export interface DocEmbedProps {
  /** Short doc label for the header bar, e.g. "Tokenomics v1". */
  navLabel: string
  /** Monospace eyebrow, e.g. "Document 01 · Token Design and Economics". */
  eyebrow: string
  /** Headline. The fragment in `titleEmphasis` renders in the lime italic accent. */
  titleLead: string
  titleEmphasis: string
  /** One-line descriptor under the headline. */
  descriptor: string
  /** Document id + date line, e.g. "MLM-DOCS-01 · June 2026 · Pre-Launch · 9 pages". */
  metaLine: string
  /** Metadata chips. Values come from the PDF cover. */
  chips: DocEmbedChip[]
  /** Public path to the PDF, e.g. "/docs/malama-tokenomics-v1.pdf". */
  pdf: string
  /** Download filename. */
  downloadAs: string
  /** Accessible iframe title. */
  iframeTitle: string
}

export default function DocEmbed({
  navLabel,
  eyebrow,
  titleLead,
  titleEmphasis,
  descriptor,
  metaLine,
  chips,
  pdf,
  downloadAs,
  iframeTitle,
}: DocEmbedProps) {
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
              {navLabel}
            </span>
          </div>
          <a
            href={pdf}
            download={downloadAs}
            className="inline-flex items-center gap-2 rounded-lg border border-malama-accent/40 bg-malama-accent/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-malama-accent hover:bg-malama-accent/20 transition-colors"
          >
            <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 12L3 7h3V1h4v6h3L8 12zM2 14h12v1.5H2z" />
            </svg>
            Download PDF
          </a>
        </div>
      </div>

      {/* ── Title block ── */}
      <div className="mx-auto max-w-7xl px-5 sm:px-10 pt-10 pb-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-malama-accent/80 mb-3">
          {eyebrow}
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-malama-ink leading-tight max-w-2xl">
          {titleLead} <em className="text-malama-accent not-italic font-serif italic">{titleEmphasis}</em>
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-malama-ink-dim">{descriptor}</p>
        <p className="mt-3 max-w-2xl text-xs leading-relaxed text-malama-ink-faint font-mono">{metaLine}</p>

        {/* Metadata chips */}
        <div className="mt-6 flex flex-wrap gap-3">
          {chips.map(({ label, value }) => (
            <div key={label} className="rounded-lg border border-malama-line bg-malama-elev px-4 py-2">
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
            src={`${pdf}#view=FitH`}
            title={iframeTitle}
            className="w-full"
            style={{ height: 'calc(100vh - 12rem)', minHeight: 600 }}
          />
        </div>

        {/* Fallback / mobile note */}
        <p className="mt-4 text-center font-mono text-[11px] text-malama-ink-faint">
          If the viewer doesn&apos;t load,{' '}
          <a
            href={pdf}
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
