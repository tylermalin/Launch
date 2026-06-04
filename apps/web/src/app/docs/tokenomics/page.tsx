import type { Metadata } from 'next'
import DocEmbed from '../_shared/DocEmbed'

export const metadata: Metadata = {
  title: 'MLMA Tokenomics v1 · Mālama Labs',
  description:
    'MLMA Tokenomics v1. A 500M hard-capped digital tool coordinating the validation network: 60M eight-year emission taper into revenue-funded operation, and a 45 / 20 / 15 / 20 revenue split to a 250M burn floor. Document MLM-DOCS-01.',
}

export default function TokenomicsPage() {
  return (
    <DocEmbed
      navLabel="Tokenomics v1"
      eyebrow="Document 01 · Token Design and Economics"
      titleLead="MLMA"
      titleEmphasis="Tokenomics."
      descriptor="A 500M hard-capped digital tool coordinating the validation network, with a 60M eight-year emission taper into permanent revenue-funded operation, and a 45 / 20 / 15 / 20 revenue split to a 250M burn floor."
      metaLine="Document MLM-DOCS-01 · June 2026 · Pre-Launch · 9 pages"
      chips={[
        { label: 'Status', value: 'Pre-Launch' },
        { label: 'Framework', value: 'Six-Layer DePIN' },
        { label: 'Mainnet Target', value: 'Q4 2026' },
        { label: 'Cardano Preprod', value: 'Active' },
      ]}
      pdf="/docs/malama-tokenomics-v1.pdf"
      downloadAs="Malama-Labs-Tokenomics-v1.pdf"
      iframeTitle="MLMA Tokenomics v1"
    />
  )
}
