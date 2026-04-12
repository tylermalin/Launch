'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X, FileText, ExternalLink } from 'lucide-react'
import type { GenesisHexListItem } from '@/lib/genesis-hexes'
import type { GenesisClaim } from '@/lib/genesis-claim-registry'
import { formatGenesisListingUsd, GENESIS_ENTRY_USD } from '@/lib/h3'
import { NFT_PREVIEW_TOKEN_ID } from '@/lib/nft-preview'
import HexBoundaryPreview from './HexBoundaryPreview'

function nftImagePath(item: GenesisHexListItem, claim: GenesisClaim | null): string {
  const tokenId =
    claim?.evmTokenId != null && claim.evmTokenId > 0 ? claim.evmTokenId : NFT_PREVIEW_TOKEN_ID
  const qs = new URLSearchParams({
    hexId: item.hexId,
    chain: 'base',
  })
  if (claim?.claimId) qs.set('claimId', claim.claimId)
  return `/api/nft/${tokenId}/image?${qs.toString()}`
}

function metadataPath(item: GenesisHexListItem, claim: GenesisClaim | null): string {
  const tokenId =
    claim?.evmTokenId != null && claim.evmTokenId > 0 ? claim.evmTokenId : NFT_PREVIEW_TOKEN_ID
  const qs = new URLSearchParams({ hexId: item.hexId })
  return `/api/nft/${tokenId}?${qs.toString()}`
}

export default function GenesisHexDetail({
  item,
  claim,
  open = true,
  onClose = () => {},
  variant = 'drawer',
}: {
  item: GenesisHexListItem | null
  claim: GenesisClaim | null
  open?: boolean
  onClose?: () => void
  variant?: 'drawer' | 'page'
}) {
  if (!item) return null
  if (variant === 'drawer' && !open) return null

  const imgSrc = nftImagePath(item, claim)
  const metaSrc = metadataPath(item, claim)
  const canReserve = item.status === 'available'

  const shell =
    variant === 'page'
      ? 'relative w-full max-w-2xl mx-auto'
      : 'fixed top-0 right-0 z-[60] h-[100dvh] w-full max-w-[min(480px,100%)] shadow-2xl'

  const inner = (
    <div
      className={`flex h-full min-h-0 flex-col overflow-y-auto bg-malama-deep/98 p-6 shadow-2xl backdrop-blur-xl ${
        variant === 'drawer' ? 'border-l border-gray-800' : 'rounded-2xl border border-gray-800'
      }`}
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Genesis hex node</p>
          <p className="mt-1 break-all font-mono text-sm font-black text-white">{item.hexId}</p>
          <p className="mt-1 text-xs font-semibold text-malama-accent">{item.regionLabel}</p>
        </div>
        {variant === 'drawer' && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-800 hover:text-white"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      <div className="space-y-8">
        <section>
          <h3 className="mb-3 text-xs font-black uppercase tracking-widest text-gray-500">License NFT</h3>
          <div className="relative aspect-[2/3] w-full max-w-[280px] overflow-hidden rounded-2xl border border-gray-800 bg-black/50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgSrc}
              alt={`Genesis NFT preview for ${item.hexId}`}
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
          </div>
          <a
            href={metaSrc}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-malama-teal hover:underline"
          >
            <FileText className="h-4 w-4" />
            View ERC-721 metadata JSON
            <ExternalLink className="h-3 w-3 opacity-70" />
          </a>
          {claim && (
            <p className="mt-2 text-[11px] text-gray-500">
              Claim <span className="font-mono text-gray-400">{claim.claimId}</span>
              {claim.evmTokenId != null ? (
                <>
                  {' '}
                  · Token <span className="font-mono">{claim.evmTokenId}</span>
                </>
              ) : null}
            </p>
          )}
        </section>

        <section>
          <h3 className="mb-3 text-xs font-black uppercase tracking-widest text-gray-500">
            Geographic boundary &amp; location
          </h3>
          <HexBoundaryPreview hexId={item.hexId} genesisRegionLabel={item.regionLabel} />
        </section>

        <section>
          <h3 className="mb-3 text-xs font-black uppercase tracking-widest text-gray-500">Data demand score</h3>
          <div className="rounded-2xl border border-gray-800 bg-malama-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Score</span>
              <span className="text-3xl font-black text-malama-teal">
                {item.dataScore}
                <span className="text-base text-gray-600">/100</span>
              </span>
            </div>
            <div className="mt-3 h-2 w-full rounded-full bg-gray-900">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-malama-teal to-blue-500"
                style={{ width: `${item.dataScore}%` }}
              />
            </div>
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-xs font-black uppercase tracking-widest text-gray-500">Pricing</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex justify-between">
              <span className="text-gray-500">Listing (reference)</span>
              <span className="font-mono font-bold">{formatGenesisListingUsd(item.startingBid)}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-500">Genesis reserve</span>
              <span className="font-mono font-bold text-white">{formatGenesisListingUsd(GENESIS_ENTRY_USD)}</span>
            </li>
          </ul>
        </section>

        <section>
          <h3 className="mb-3 text-xs font-black uppercase tracking-widest text-gray-500">Terms of sale</h3>
          <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed text-gray-400">
            <li>One-time Genesis entry covers hardware kit and geographic license for this H3 cell.</li>
            <li>125,000 MLMA vests per operator schedule after verified hardware boot.</li>
            <li>Rewards depend on network data inflow; not guaranteed.</li>
            <li>
              Full preorder and purchase terms:{' '}
              <a
                href="/legal/hex-node-purchase"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-malama-teal hover:underline"
              >
                Hex Node Purchase &amp; Preorder Agreement
              </a>
            </li>
            <li>
              <a href="/legal/terms" target="_blank" rel="noopener noreferrer" className="text-malama-teal hover:underline">
                Terms and Conditions
              </a>
              {' · '}
              <a
                href="/legal/token-rewards-risk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-malama-teal hover:underline"
              >
                Token &amp; rewards risk
              </a>
            </li>
          </ul>
        </section>

        {item.sold && (
          <p className="rounded-xl border border-gray-600/80 bg-gray-900/70 p-4 text-sm text-gray-300">
            <span className="font-black uppercase tracking-wider text-gray-400">SOLD</span>
            {' — '}This Genesis NFT is not available for public purchase.
          </p>
        )}

        <div className="pt-2">
          {canReserve ? (
            <Link
              href={`/presale?hex=${encodeURIComponent(item.hexId)}`}
              className="block w-full rounded-2xl bg-malama-accent py-4 text-center text-lg font-black text-white shadow-[0_0_30px_rgba(196,240,97,0.3)] transition-transform hover:scale-[1.02]"
            >
              Reserve this hex — {formatGenesisListingUsd(GENESIS_ENTRY_USD)}
            </Link>
          ) : (
            <div className="rounded-2xl border border-gray-700 bg-gray-900/80 py-4 text-center text-sm font-bold text-gray-500">
              Not available to reserve
            </div>
          )}
        </div>
      </div>
    </div>
  )

  if (variant === 'page') {
    return <div className={shell}>{inner}</div>
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black md:bg-black/70"
            aria-label="Close detail"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28 }}
            className={shell}
          >
            {inner}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
