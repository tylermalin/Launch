import type { Metadata } from 'next'
import DocsLayout from '@/components/docs/DocsLayout'

export const metadata: Metadata = {
  title: 'Documentation | Mālama Labs',
  description:
    'MLMA tokenomics, Genesis 200 pricing and ROI, Phase 1 timeline, and operator documentation for the Mālama environmental data network.',
}

export default function DocsRootLayout({ children }: { children: React.ReactNode }) {
  return <DocsLayout>{children}</DocsLayout>
}
