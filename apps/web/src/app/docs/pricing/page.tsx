import type { Metadata } from 'next'
import DocEmbed from '../_shared/DocEmbed'

export const metadata: Metadata = {
  title: 'Genesis Pricing v1.0 · Mālama Labs',
  description:
    'Genesis 200 Pricing Methodology v1.0. The ratified reward calculation: a 125,000 MLMA base scaled by the Genesis, Hex Type, and Data Demand Score multipliers, cohort-normalized to the 25M operator pool, milestone-vested over twelve months. Document MLM-DOCS-06.',
}

export default function GenesisPricingPage() {
  return (
    <DocEmbed
      navLabel="Genesis Pricing v1.0"
      eyebrow="Document 06 · Genesis 200 Pricing Methodology"
      titleLead="Genesis"
      titleEmphasis="Pricing."
      descriptor="The ratified reward calculation. A 125,000 MLMA base scaled by the Genesis, Hex Type, and Data Demand Score multipliers, cohort-normalized to the 25M operator pool, milestone-vested over twelve months."
      metaLine="Document MLM-DOCS-06 · Ratified 2026-05-23 · Pre-Launch · 5 pages"
      chips={[
        { label: 'Status', value: 'Pre-Launch' },
        { label: 'Framework', value: 'Six-Layer DePIN' },
        { label: 'Mainnet Target', value: 'Q4 2026' },
        { label: 'Cardano Preprod', value: 'Active' },
      ]}
      pdf="/docs/malama-genesis-pricing-v1.pdf"
      downloadAs="Malama-Labs-Genesis-Pricing-v1.pdf"
      iframeTitle="Genesis Pricing v1.0"
    />
  )
}
