import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import regionsData from '@/data/regions.json'
import { buildGenesisHexListItems } from '@/lib/genesis-hexes'
import { getClaimByHex } from '@/lib/genesis-claim-registry'
import GenesisHexDetail from '@/components/GenesisHexDetail'

type Props = { params: Promise<{ hexId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { hexId: raw } = await params
  const hexId = decodeURIComponent(raw)
  return {
    title: `Genesis hex ${hexId.slice(0, 10)}… | Mālama Labs`,
    description: 'Genesis 200 hex node license detail, NFT preview, boundary, score, and terms.',
  }
}

export default async function GenesisHexDetailPage({ params }: Props) {
  const { hexId: raw } = await params
  const hexId = decodeURIComponent(raw)
  const items = buildGenesisHexListItems(regionsData)
  const item = items.find((i) => i.hexId === hexId)
  if (!item) notFound()
  const claim = getClaimByHex(hexId) ?? null

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-malama-deep">
      <div className="flex shrink-0 flex-wrap items-center gap-4 border-b border-gray-800 px-4 py-3">
        <Link href="/list" className="text-sm font-bold text-malama-teal hover:underline">
          ← Back to list
        </Link>
        <Link href="/map" className="text-sm text-gray-500 hover:text-white">
          Map
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <GenesisHexDetail variant="page" item={item} claim={claim} />
      </div>
    </div>
  )
}
