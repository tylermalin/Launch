import type { Metadata } from 'next'
import MapPageClient from '@/components/MapPageClient'

export const metadata: Metadata = {
  title: 'Opportunity Map | Mālama Labs',
  description:
    'Explore the Genesis 200 H3 grid: 200 geographic node licenses across Idaho, NYC, London, and Tokyo.',
}

export default function MapPage() {
  return (
    <div className="h-[calc(100vh-4rem)] w-full overflow-hidden bg-malama-deep">
      <MapPageClient />
    </div>
  )
}
