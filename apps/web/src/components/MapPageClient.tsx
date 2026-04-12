'use client'

import Link from 'next/link'
import { List } from 'lucide-react'
import HexMapDynamic from './HexMapDynamic'

export default function MapPageClient() {
  return (
    <div className="relative h-full w-full min-h-0 bg-malama-deep">
      <HexMapDynamic />
      <div className="pointer-events-none absolute inset-0 z-30">
        <div className="pointer-events-auto absolute right-4 top-4 max-w-[min(100%,20rem)] sm:right-8 sm:top-24">
          <Link
            href="/list"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-700 bg-malama-deep/95 px-4 py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-xl backdrop-blur-md transition-colors hover:border-malama-teal hover:text-malama-teal"
          >
            <List className="h-4 w-4 shrink-0" aria-hidden />
            See list view
          </Link>
        </div>
      </div>
    </div>
  )
}
