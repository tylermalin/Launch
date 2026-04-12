import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MLMA Tokenomics Whitepaper | Mālama Labs',
  description:
    'Complete MLMA token design: 500M cap, Genesis 200 allocation, Years 1–5 emissions, burn and veMLMA governance, revenue model, and operator economics.',
}

export default function TokenomicsLayout({ children }: { children: React.ReactNode }) {
  return children
}
