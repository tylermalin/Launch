import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MLMA Tokenomics v1 · Mālama Labs',
  description:
    'MLMA token design v1: 500M hard cap, 60M eight-year smooth emission taper, allocation pools, governance, and a 45 / 20 / 15 / 20 revenue split to a 250M burn floor. Document MLM-DOCS-01.',
}

export default function TokenomicsLayout({ children }: { children: React.ReactNode }) {
  return children
}
