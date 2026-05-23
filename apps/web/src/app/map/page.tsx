import type { Metadata } from 'next'
import MapPageClient from '@/components/MapPageClient'

export const metadata: Metadata = {
  title: 'Opportunity Map | Mālama Labs',
  description:
    'Explore the Mālama Genesis H3 grid: 200 geographic hex zones with cross-chain mirror on credit-card purchase. Regions: Idaho, NYC, London, Tokyo.',
}

export default function MapPage() {
  return (
    <div className="h-[calc(100vh-4rem)] w-full overflow-hidden bg-malama-deep">
      <MapPageClient />
    </div>
  )
}
