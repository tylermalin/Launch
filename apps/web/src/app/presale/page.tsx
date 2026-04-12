import type { Metadata } from 'next'
import GenesisMint from '@/components/GenesisMintDynamic'

export const metadata: Metadata = {
  title: 'Reserve with Crypto or Card | Genesis 200 | Mālama Labs',
  description:
    'Connect your wallet, pick your hex on the map, and reserve a Genesis validator node. $2,000 entry. 125K MLMA per node. 200 Genesis nodes (195 remaining). Oct 2026 revenue.',
}

export default async function PresalePage({
  searchParams,
}: {
  searchParams: Promise<{ hex?: string }>
}) {
  const { hex: hexId } = await searchParams
  const resolvedHexId = hexId || null

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] pt-16 pb-32 px-4 relative overflow-x-hidden flex items-center">
      <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-malama-accent/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 -right-1/4 w-[800px] h-[800px] bg-malama-accent-dim/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-6xl w-full mx-auto flex flex-col items-center relative z-10 text-center">
        <div className="inline-flex items-center px-4 py-1.5 mb-8 text-xs font-black uppercase tracking-[0.2em] text-malama-accent border border-malama-accent/30 rounded-full bg-malama-accent/10 shadow-[0_0_15px_rgba(196,240,97,0.2)]">
          <span className="w-2 h-2 rounded-full bg-malama-accent animate-pulse mr-2" />
          Genesis 200 — Scarcity Edition
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-8 drop-shadow-xl">
          Reserve with <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-malama-accent to-malama-accent-dim">
            Crypto or Card
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-400 max-w-4xl mx-auto leading-relaxed mb-6">
          Connect Lace, MetaMask, or another wallet — or pay by card and we’ll mint to a custodial wallet. Pick your hex on the map and complete your $2,000 reservation.
          125K MLMA allocation vests at first boot. Revenue starts October 2026.
        </p>
        <p className="text-sm text-gray-500 mb-10">
          <a
            href="/legal"
            target="_blank"
            rel="noopener noreferrer"
            className="text-malama-accent/90 hover:text-malama-accent underline underline-offset-2 font-semibold"
          >
            Terms, Privacy, Hex Node Agreement, and Token Risk Disclosure
          </a>{' '}
          apply to this purchase — you will confirm each at checkout.
        </p>

        <PresaleStats />

        {/* Step indicators */}
        <div className="flex items-center gap-2 md:gap-4 mt-12 mb-8 flex-wrap justify-center text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-malama-accent text-white font-black text-xs flex items-center justify-center">1</span>
            <span className="font-semibold text-gray-300">Connect Wallet</span>
          </div>
          <span className="text-gray-700 hidden md:block">→</span>
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-malama-accent/30 text-malama-accent font-black text-xs flex items-center justify-center border border-malama-accent/50">2</span>
            <span>Pick Hex on Map</span>
          </div>
          <span className="text-gray-700 hidden md:block">→</span>
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-malama-accent/30 text-malama-accent font-black text-xs flex items-center justify-center border border-malama-accent/50">3</span>
            <span>Review & Pay $2,000</span>
          </div>
          <span className="text-gray-700 hidden md:block">→</span>
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-malama-accent/30 text-malama-accent font-black text-xs flex items-center justify-center border border-malama-accent/50">4</span>
            <span>Node Reserved ✓</span>
          </div>
        </div>

        <div className="w-full mt-4">
          <GenesisMint hexId={resolvedHexId} />
        </div>
      </div>
    </div>
  )
}

async function PresaleStats() {
  let total = 200
  let remaining = 195
  let reserved = 5
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(`${base}/api/presale`, { cache: 'no-store' })
    const data = await res.json()
    total = data.total ?? 200
    remaining = data.remaining ?? 195
    reserved =
      typeof data.reserved === 'number'
        ? data.reserved
        : total - remaining
  } catch {}

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 border border-malama-line bg-malama-elev/80 backdrop-blur-md shadow-2xl rounded-3xl p-8 md:px-10 md:py-8 gap-8 md:gap-10 items-center">
      <div className="flex flex-col items-center">
        <span className="text-5xl md:text-6xl font-mono font-black text-white">{total}</span>
        <span className="text-xs tracking-[0.15em] text-gray-500 uppercase font-black mt-2 text-center leading-snug max-w-[9rem]">
          Genesis Nodes Available
        </span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-5xl md:text-6xl font-mono font-black text-white">{reserved}</span>
        <span className="text-xs tracking-[0.2em] text-gray-500 uppercase font-black mt-2">Reserved</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-5xl md:text-6xl font-mono font-black text-malama-accent drop-shadow-[0_0_10px_rgba(196,240,97,0.4)]">
          {remaining}
        </span>
        <span className="text-xs tracking-[0.2em] text-gray-500 uppercase font-black mt-2">Remaining</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-5xl md:text-6xl font-mono font-black text-white">$2K</span>
        <span className="text-xs tracking-[0.2em] text-gray-500 uppercase font-black mt-2">Entry Price</span>
      </div>
      <div className="flex flex-col items-center col-span-2 justify-self-center sm:col-span-1 max-sm:w-full max-sm:max-w-[12rem]">
        <span className="text-4xl md:text-5xl font-mono font-black text-malama-accent">125K</span>
        <span className="text-xs tracking-[0.2em] text-gray-500 uppercase font-black mt-2">MLMA / Node</span>
      </div>
    </div>
  )
}
