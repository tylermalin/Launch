'use client'

import { motion } from 'framer-motion'
import { TokenomicsInteractive } from '@/components/docs/tokenomics/TokenomicsInteractive'
import { WhitepaperProse } from '@/components/docs/tokenomics/WhitepaperProse'

export default function TokenomicsPage() {
  return (
    <div className="max-w-4xl">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <p className="text-xs font-black uppercase tracking-widest text-malama-accent mb-2">Mālama Labs · April 2026</p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-3 leading-tight">
          MLMA Tokenomics Whitepaper
        </h1>
        <p className="text-base md:text-lg text-malama-accent/90 font-semibold mb-4">
          Complete token design, emission schedule, and operator economics
        </p>
        <p className="text-sm text-gray-500 border-l-2 border-malama-accent/50 pl-4">
          <span className="text-gray-400">Version 2.0</span> · April 2026 · Working draft pending Beneficial Technology legal review.
          Not for external distribution without that review complete.
          <br />
          <span className="text-gray-500">Author: Tyler Malin, CEO &amp; Co-Founder · Mālama Labs, Inc.</span>
        </p>
      </motion.header>

      <p className="text-gray-400 text-sm leading-relaxed mb-10">
        Use the <strong className="text-gray-300">table of contents</strong> to jump. Interactive charts and vesting simulator below;
        full narrative follows with tables aligned to the approved whitepaper.
      </p>

      <TokenomicsInteractive />
      <WhitepaperProse />
    </div>
  )
}
