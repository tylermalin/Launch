import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Documentation | Mālama Labs',
  description:
    'MLMA tokenomics, Mālama Genesis pricing and reward mechanics, Phase 1 timeline, and operator documentation for the Mālama environmental data network.',
}

/**
 * Passthrough wrapper. Each sub-page renders its own chrome:
 *
 *   /docs              → redesigned Documentation Hub overview
 *                        (breadcrumb/switcher pattern, matches Legal Hub)
 *   /docs/tokenomics
 *   /docs/pricing-roi
 *   /docs/phase-1-timeline
 *   /docs/operators
 *                        → existing left-sidebar DocsLayout (each sub-page
 *                          mounts it directly until they're migrated to the
 *                          new design).
 */
export default function DocsRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
