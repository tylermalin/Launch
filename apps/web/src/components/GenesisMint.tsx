'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CardanoWallet, useWallet as useCardanoWallet } from '@meshsdk/react'
import { useAccount as useEVMWallet, useConnect as useEVMConnect, useDisconnect as useEVMDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { MapPin, ShoppingCart, ShieldCheck, Wallet, Globe, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function GenesisMint({ hexId }: { hexId: string | null }) {
  const [step, setStep] = useState(1) // 1: Setup, 2: Review, 3: Payment, 4: Success
  
  const { connected: cardanoConnected, wallet: cardanoWallet, connecting: cardanoConnecting, connect: meshConnect, name: cardanoWalletName } = useCardanoWallet()
  const { address: evmAddress, isConnected: evmConnected } = useEVMWallet()
  const { connect: connectEVM } = useEVMConnect()
  const { disconnect: disconnectEVM } = useEVMDisconnect()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successData, setSuccessData] = useState<any>(null)

  const isSetupComplete = cardanoConnected && evmConnected && !!hexId

  const handlePayment = async () => {
    setLoading(true)
    setError('')
    try {
      if (!evmAddress || !cardanoWallet) throw new Error("Wallets not fully connected")
      
      await new Promise(r => setTimeout(r, 2000))
      
      const cardanoAddress = await cardanoWallet.getChangeAddress()
      const res = await fetch('/api/presale', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ evmAddress, cardanoAddress, hexId })
      })
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error || "Failed to reserve mathematically bound constraints")
      
      setSuccessData(data)
      setStep(4)
    } catch (err: any) {
      setError(err.message || "Payment bridge verification rejected")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-malama-card border border-gray-800 rounded-3xl shadow-2xl overflow-hidden my-12">
      <div className="flex border-b border-gray-800 bg-gray-900/50">
        {[1,2,3,4].map((s) => (
          <div key={s} className={`flex-1 h-2 transition-colors ${s <= step ? 'bg-malama-teal' : 'bg-transparent'}`} />
        ))}
      </div>

      <div className="p-8 md:p-12 min-h-[500px] relative flex flex-col justify-center text-left">
        <AnimatePresence mode="wait">
          
          {step === 1 && (
            <motion.div key="step1" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="space-y-8">
              <div className="text-center mb-10">
                <h2 className="text-4xl font-black text-white flex items-center justify-center"><ShieldCheck className="mr-3 text-malama-teal w-10 h-10"/> Setup Foundation</h2>
                <p className="text-gray-400 text-lg mt-3 max-w-2xl mx-auto">Link your cryptographic identities and target a territory to secure your position in the Genesis 300 network.</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {/* 1. Cardano Identity */}
                <div className={`p-6 border rounded-2xl flex flex-col items-center text-center space-y-4 transition-all ${cardanoConnected ? 'bg-malama-teal/10 border-malama-teal/40 shadow-[0_0_20px_rgba(68,187,164,0.1)]' : 'bg-malama-deep border-gray-800'}`}>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center ${cardanoConnected ? 'bg-malama-teal/20' : 'bg-gray-800'}`}>
                    <Wallet className={`w-7 h-7 ${cardanoConnected ? 'text-malama-teal' : 'text-gray-500'}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white uppercase tracking-wider text-xs">Cardano Identity</h3>
                    <p className={`text-sm mt-1 font-mono ${cardanoConnected ? 'text-malama-teal' : cardanoConnecting ? 'text-malama-amber animate-pulse' : 'text-gray-500'}`}>
                      {cardanoConnected ? cardanoWalletName?.toUpperCase() : cardanoConnecting ? 'CONNECTING...' : 'AWAITING AUTH'}
                    </p>
                  </div>
                  
                  {cardanoConnected ? (
                    <div className="w-full space-y-2">
                       <button className="w-full py-2 bg-malama-teal/20 border border-malama-teal/50 text-malama-teal rounded-lg font-bold text-xs cursor-default">
                        IDENTITY LINKED
                       </button>
                    </div>
                  ) : (
                    <div className="w-full flex flex-col gap-2">
                      <button 
                        onClick={() => meshConnect('lace')}
                        disabled={cardanoConnecting}
                        className="px-4 py-3 bg-white text-black rounded-xl text-xs font-black hover:bg-malama-teal transition-all shadow-lg active:scale-95 disabled:opacity-50"
                      >
                        Connect Lace
                      </button>
                    </div>
                  )}
                </div>

                {/* 2. Base Settlement */}
                <div className={`p-6 border rounded-2xl flex flex-col items-center text-center space-y-4 transition-all ${evmConnected ? 'bg-blue-500/10 border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.1)]' : 'bg-malama-deep border-gray-800'}`}>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center ${evmConnected ? 'bg-blue-500/20' : 'bg-gray-800'}`}>
                    <Globe className={`w-7 h-7 ${evmConnected ? 'text-blue-400' : 'text-gray-500'}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white uppercase tracking-wider text-xs">Base Settlement</h3>
                    <p className={`text-sm mt-1 font-mono ${evmConnected ? 'text-blue-400' : 'text-gray-500'}`}>{evmConnected ? 'CONNECTED' : 'AWAITING AUTH'}</p>
                  </div>
                  {evmConnected ? (
                    <button onClick={() => disconnectEVM()} className="px-4 py-2 border border-blue-500/50 bg-blue-500/20 text-white rounded-lg text-xs font-bold hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400 transition-colors w-full">
                      {evmAddress?.slice(0,6)}...{evmAddress?.slice(-4)}
                    </button>
                  ) : (
                    <button onClick={() => connectEVM({ connector: injected() })} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-black transition-colors w-full shadow-lg">
                      Connect MetaMask
                    </button>
                  )}
                </div>

                {/* 3. Territory Target */}
                <div className={`p-6 border rounded-2xl flex flex-col items-center text-center space-y-4 transition-all ${hexId ? 'bg-malama-amber/10 border-malama-amber/40 shadow-[0_0_20px_rgba(241,143,1,0.1)]' : 'bg-malama-deep border-gray-800'}`}>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center ${hexId ? 'bg-malama-amber/20' : 'bg-gray-800'}`}>
                    <MapPin className={`w-7 h-7 ${hexId ? 'text-malama-amber' : 'text-gray-500'}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white uppercase tracking-wider text-xs">Target Territory</h3>
                    <p className={`text-sm mt-1 font-mono ${hexId ? 'text-malama-amber' : 'text-gray-500'}`}>{hexId ? hexId : 'NOT SELECTED'}</p>
                  </div>
                  <Link href="/map" className={`px-4 py-2 rounded-lg text-xs font-black transition-all w-full flex items-center justify-center ${hexId ? 'bg-malama-amber/20 border border-malama-amber/50 text-malama-amber' : 'bg-malama-amber text-malama-deep hover:scale-105 shadow-lg'}`}>
                    {hexId ? "Change Hex" : "Pick on Map"}
                  </Link>
                </div>
              </div>

              <div className="pt-8 flex flex-col items-center">
                <button 
                  onClick={() => setStep(2)}
                  disabled={!isSetupComplete}
                  className={`w-full max-w-lg py-5 rounded-2xl font-black text-2xl transition-all shadow-xl ${isSetupComplete ? 'bg-malama-teal text-malama-deep hover:scale-[1.02] shadow-malama-teal/30' : 'bg-gray-800 text-gray-600 cursor-not-allowed opacity-50'}`}
                >
                  {isSetupComplete ? "Review Commitment →" : "Complete Setup to Proceed"}
                </button>
                <p className="text-gray-500 text-xs mt-4 uppercase tracking-[0.2em] font-bold">Validated Cryptographic Hardware Registration</p>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="space-y-8">
              <h2 className="text-3xl font-black text-white flex items-center"><ShoppingCart className="mr-3 text-malama-teal w-8 h-8"/> Secure Ledger Review</h2>
              
              <div className="bg-malama-deep rounded-2xl border border-gray-800 overflow-hidden text-lg shadow-inner">
                <div className="p-8 border-b border-gray-800 flex justify-between items-center text-gray-300">
                  <span className="font-semibold">Genesis Node Hardware Extractor Kit</span>
                  <span className="font-mono text-white font-bold">$1,200 USDC</span>
                </div>
                <div className="p-8 border-b border-gray-800 flex justify-between items-center text-gray-300">
                  <span className="font-semibold">Genesis Ecosystem NFT Vault (Rights)</span>
                  <span className="font-mono text-white font-bold">$300 USDC</span>
                </div>
                <div className="p-8 bg-gray-900/80 flex justify-between items-center">
                  <span className="font-black text-white text-2xl">Total Commitment Due</span>
                  <span className="font-mono font-black text-malama-teal text-3xl drop-shadow-[0_0_10px_rgba(68,187,164,0.3)]">$1,500 USDC</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 pb-6 text-center">
                <div className="p-6 border border-gray-800 rounded-2xl bg-malama-deep flex flex-col justify-center">
                  <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest">Base Emission Rewards</h4>
                  <p className="text-3xl font-black text-green-400 mt-2">2,400 <span className="text-base text-green-600 font-bold">MALAMA/mo</span></p>
                </div>
                <div className="p-6 border border-gray-800 rounded-2xl bg-malama-deep flex flex-col justify-center">
                  <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest">Selected Territory</h4>
                  <p className="text-2xl font-mono font-bold text-white mt-2">{hexId}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="flex-1 py-6 bg-gray-900 border border-gray-800 text-gray-400 rounded-2xl font-black text-xl hover:bg-gray-800 transition-colors">
                  Back
                </button>
                <button onClick={() => setStep(3)} className="flex-[2] py-6 bg-malama-teal text-malama-deep rounded-2xl font-black text-2xl hover:scale-[1.02] transition-transform shadow-[0_0_30px_rgba(68,187,164,0.3)]">
                  Proceed to Native Payment <ChevronRight className="inline w-8 h-8 ml-1" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="space-y-8 flex flex-col items-center justify-center text-center h-full">
              <div className="w-32 h-32 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 border-2 border-blue-500/30 shadow-[0_0_50px_rgba(59,130,246,0.2)]">
                <img src="https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=029" className="w-16 h-16" alt="USDC" />
              </div>
              
              <h2 className="text-5xl font-black text-white tracking-tight">Execute Payment</h2>
              <p className="text-xl text-gray-400 max-w-md leading-relaxed">Awaiting cryptographic signature releasing exactly $1,500 USDC onto the Base Sepolia validator engine.</p>

              {error && (
                <div className="p-5 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 flex items-center mt-4 w-full max-w-lg font-bold">
                  <AlertCircle className="mr-3 w-6 h-6 flex-shrink-0" /> {error}
                </div>
              )}

              <div className="flex flex-col w-full max-w-lg gap-4 mt-10">
                <button 
                  onClick={handlePayment} 
                  disabled={loading}
                  className="w-full py-6 bg-blue-600 text-white rounded-2xl font-black text-2xl hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_40px_rgba(37,99,235,0.4)]"
                >
                  {loading ? "Confirming on EVM..." : "Approve Inside Provider"}
                </button>
                <button 
                  disabled={loading}
                  onClick={() => setStep(2)}
                  className="w-full py-3 bg-transparent text-gray-500 hover:text-gray-300 transition-colors font-bold uppercase tracking-widest text-sm"
                >
                  Cancel and Edit Review
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} className="space-y-8 flex flex-col items-center text-center pt-10">
              <CheckCircle2 className="w-40 h-40 text-malama-teal mb-6 drop-shadow-[0_0_40px_rgba(68,187,164,0.5)]" />
              <h2 className="text-6xl font-black text-white tracking-tighter">Genesis <span className="text-malama-teal">#{successData?.genesisNumber}</span> Secured</h2>
              <p className="text-2xl text-gray-400 max-w-2xl leading-relaxed mt-4">Your hardware node is queued! The CIP-25 Identity Receipt is executing securely directly to your native Cardano Lace structures.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl mt-12">
                <a href="/dashboard" className="w-full flex items-center justify-center py-5 bg-malama-deep border border-gray-700 text-gray-300 rounded-xl font-bold hover:bg-gray-800 hover:text-white transition-colors text-lg">
                  Track Hardware Batch
                </a>
                <a href="https://discord.gg/" target="_blank" rel="noreferrer" className="w-full flex items-center justify-center py-5 bg-[#5865F2] text-white rounded-xl font-bold hover:bg-[#4752C4] transition-colors text-lg shadow-[0_0_20px_rgba(88,101,242,0.3)]">
                  Enter Secure Discord
                </a>
                <Link href="/dashboard" className="w-full py-5 sm:col-span-2 bg-malama-teal text-malama-deep rounded-xl font-black text-xl hover:scale-[1.02] transition-transform shadow-[0_0_30px_rgba(68,187,164,0.2)]">
                  Return To Command Center
                </Link>
              </div>
            </motion.div>
          )}
          
        </AnimatePresence>
      </div>
    </div>
  )
}
