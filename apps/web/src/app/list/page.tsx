import type { Metadata } from 'next'
import Link from 'next/link'
import GenesisHexList from '@/components/GenesisHexList'

export const metadata: Metadata = {
  title: 'Genesis Hex List | Mālama Labs',
  description: 'Full inventory of Genesis 200 geographic node licenses: regions, listing prices, and reserve.',
}

export default function GenesisHexListPage() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col overflow-hidden bg-malama-deep">
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-gray-800 px-4 py-3">
        <Link href="/map" className="text-sm font-bold text-malama-teal hover:underline">
          ← Back to map
        </Link>
        <p className="hidden text-center text-[11px] font-mono uppercase tracking-widest text-gray-500 sm:block">
          Listing prices match map tooltips · reserve $2,000 USDC
        </p>
        <span className="hidden w-32 sm:block" aria-hidden />
      </header>
      <GenesisHexList className="min-h-0 flex-1" />
    </div>
  )
}
