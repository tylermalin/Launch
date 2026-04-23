import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MLMA Tokenomics Whitepaper | Mālama Labs',
  description:
    'Complete MLMA token design: 500M cap, Mālama Genesis allocation (200 Base + 200 Cardano), Years 1–3 emissions, burn and veMLMA governance, reward mechanics, and operator obligations.',
}

export default function TokenomicsLayout({ children }: { children: React.ReactNode }) {
  return children
}
