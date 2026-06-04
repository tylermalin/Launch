import type { Metadata } from 'next'
import DocEmbed from '../_shared/DocEmbed'

export const metadata: Metadata = {
  title: 'Data Demand Score v1.0 · Mālama Labs',
  description:
    'Data Demand Score Methodology v1.0. A five-component score from zero to one hundred measuring the commercial, regulatory, and research value of hardware-signed data from each hex, recomputed quarterly, feeding the bounded reward framework. Document MLM-DOCS-05.',
}

export default function DataDemandScorePage() {
  return (
    <DocEmbed
      navLabel="Data Demand Score v1.0"
      eyebrow="Document 05 · Data Demand Score Methodology"
      titleLead="Data Demand"
      titleEmphasis="Score."
      descriptor="A five-component score from zero to one hundred measuring the commercial, regulatory, and research value of hardware-signed data from each hex, recomputed quarterly, feeding the bounded reward framework."
      metaLine="Document MLM-DOCS-05 · Ratified 2026-05-23 · Pre-Launch · 4 pages"
      chips={[
        { label: 'Status', value: 'Pre-Launch' },
        { label: 'Framework', value: 'Six-Layer DePIN' },
        { label: 'Mainnet Target', value: 'Q4 2026' },
        { label: 'Cardano Preprod', value: 'Active' },
      ]}
      pdf="/docs/malama-data-demand-score-v1.pdf"
      downloadAs="Malama-Labs-Data-Demand-Score-v1.pdf"
      iframeTitle="Data Demand Score v1.0"
    />
  )
}
