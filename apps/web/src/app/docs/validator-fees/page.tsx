import type { Metadata } from 'next'
import DocEmbed from '../_shared/DocEmbed'

export const metadata: Metadata = {
  title: 'Validator Fees v0.1 Draft · Mālama Labs',
  description:
    'Validator Fees v0.1 (Draft). Protocol revenue from commercial buyers of hardware-signed data, distributed in USDC to Genesis 200 operators, continuous and outside the MLMA emissions cap. Draft pending six implementation items. Document MLM-DOCS-07.',
}

export default function ValidatorFeesPage() {
  return (
    <DocEmbed
      navLabel="Validator Fees v0.1 Draft"
      eyebrow="Document 07 · Validator Fees"
      titleLead="Validator"
      titleEmphasis="Fees."
      descriptor="Protocol revenue from commercial buyers of hardware-signed data, distributed in USDC to Genesis 200 operators, continuous and outside the MLMA emissions cap. Draft pending six implementation items."
      metaLine="Document MLM-DOCS-07 · v0.1 Draft · 2026-05-23 · Pre-Launch · 4 pages"
      chips={[
        { label: 'Status', value: 'Pre-Launch' },
        { label: 'Framework', value: 'Six-Layer DePIN' },
        { label: 'Mainnet Target', value: 'Q4 2026' },
        { label: 'Cardano Preprod', value: 'Active' },
      ]}
      pdf="/docs/malama-validator-fees-v1.pdf"
      downloadAs="Malama-Labs-Validator-Fees-v1.pdf"
      iframeTitle="Validator Fees v0.1 Draft"
    />
  )
}
