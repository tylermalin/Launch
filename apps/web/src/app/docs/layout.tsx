import type { Metadata } from 'next'
import DocsLayout from '@/components/docs/DocsLayout'

export const metadata: Metadata = {
  title: 'Documentation | Mālama Labs',
  description:
    'MLMA tokenomics, Mālama Genesis pricing and reward mechanics, Phase 1 timeline, and operator documentation for the Mālama environmental data network.',
}

export default function DocsRootLayout({ children }: { children: React.ReactNode }) {
  return <DocsLayout>{children}</DocsLayout>
}
