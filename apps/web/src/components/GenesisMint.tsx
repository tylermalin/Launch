'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CardanoWallet, useWallet as useCardanoWallet } from '@meshsdk/react'
import { useAccount as useEVMWallet, useConnect as useEVMConnect, useDisconnect as useEVMDisconnect, useWriteContract, usePublicClient } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { parseAbi, parseUnits } from 'viem'
import { MapPin, ShoppingCart, ShieldCheck, Wallet, Globe, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

// Base Sepolia Mock Targets (Replace with genuine verified deployment hashes post-launch)
const MOCK_USDC_ADDR = '0x1111111111111111111111111111111111111111'
const MOCK_GENESIS_ADDR = '0x2222222222222222222222222222222222222222'

const USDC_ABI = parseAbi([
  "function approve(address spender, uint256 amount) public returns (bool)"
])

const MGEN_ABI = parseAbi([
  "function secureNode(string calldata hexId) external"
])

export default function GenesisMint({ hexId }: { hexId: string | null }) {
  const [step, setStep] = useState(1) // 1: Setup, 2: Review, 3: Payment, 4: Success
  
  const { connected: cardanoConnected, wallet: cardanoWallet, connecting: cardanoConnecting, connect: meshConnect, name: cardanoWalletName } = useCardanoWallet()
  const { address: evmAddress, isConnected: evmConnected } = useEVMWallet()
  const { connect: connectEVM } = useEVMConnect()
  const { disconnect: disconnectEVM } = useEVMDisconnect()
  
  // Viem/Wagmi Hooks for Native Dual-Signature EVM
  const publicClient = usePublicClient()
  const { writeContractAsync } = useWriteContract()

  const [loading, setLoading] = useState(false)
  const [evmTxStatus, setEvmTxStatus] = useState<'' | 'approving' | 'minting'>('')
  const [error, setError] = useState('')
  const [successData, setSuccessData] = useState<any>(null)

  const isSetupComplete = (cardanoConnected || evmConnected) && !!hexId

  const syncNodeToMap = (id: string | null) => {
    if (!id) return
    const existing = JSON.parse(localStorage.getItem('malamalabs_purchased_nodes') || '[]')
    if (!existing.includes(id)) {
      existing.push(id)
      localStorage.setItem('malamalabs_purchased_nodes', JSON.stringify(existing))
    }
  }

  const handlePayment = async () => {
    setLoading(true)
    setError('')
    try {
      if (!isSetupComplete) throw new Error("Wallet architecture not linked")
      
      if (evmConnected) {
        if (!publicClient) throw new Error("Crucial EVM Client not initialized locally")

        // 1. ERC-20 APPROVE $1,500 USDC
        setEvmTxStatus('approving')
        const exactPrice = parseUnits('1500', 6) // Strictly Native USDC natively bounds exactly 6 decimal layers.
        
        let approveHash;
        try {
           approveHash = await writeContractAsync({
             address: MOCK_USDC_ADDR as `0x${string}`,
             abi: USDC_ABI,
             functionName: 'approve',
             args: [MOCK_GENESIS_ADDR as `0x${string}`, exactPrice],
           })
        } catch (e: any) {
           throw new Error("Approval signature was actively blocked or rejected visually by operator.")
        }
        
        // Block processing gracefully tracking hash finality mathematically on Base
        await publicClient.waitForTransactionReceipt({ hash: approveHash })

        // 2. STAGE ERC-721 MINT PIPELINE 
        setEvmTxStatus('minting')
        let mintHash;
        try {
           mintHash = await writeContractAsync({
             address: MOCK_GENESIS_ADDR as `0x${string}`,
             abi: MGEN_ABI,
             functionName: 'secureNode',
             args: [hexId as string],
           })
        } catch (e: any) {
           throw new Error("Target territorial boundaries previously mathematically claimed or signature rejected.")
        }

        await publicClient.waitForTransactionReceipt({ hash: mintHash })

        syncNodeToMap(hexId)
        
        setSuccessData({ 
           genesisNumber: Math.floor(Math.random() * 50) + 248, 
           hash: mintHash,
           network: 'EVM L2 Settlement (Base Sepolia)'
        })
        setStep(4)
      } else if (cardanoConnected) {
        const cardanoAddress = await cardanoWallet.getChangeAddress()
        const res = await fetch('/api/presale', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ evmAddress: 'Cardano-Native', cardanoAddress, hexId })
        })
        const data = await res.json()
        
        if (!res.ok) throw new Error(data.error || "Failed to reserve mathematically bound constraints")
        
        syncNodeToMap(hexId)
        
        setSuccessData({ ...data, network: 'Cardano Master Node' })
        setStep(4)
      }
    } catch (err: any) {
      setError(err.message || "Payment bridge verification structurally rejected")
    } finally {
      setLoading(false)
      setEvmTxStatus('')
    }
  }

  const generateSubmitText = () => {
     if (loading && evmConnected) {
        if (evmTxStatus === 'approving') return "1/2 Awaiting USDC Treasury Contract Approval..."
        if (evmTxStatus === 'minting') return "2/2 Cryptographically Writing Boundaries to L2..."
        return "Synchronizing EVM Base Structure..."
     }
     if (loading && cardanoConnected) return "Forging Cardano Blockchain Asset Native Arrays..."
     return "Execute Strict Target Bind"
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
                <p className="text-gray-400 text-lg mt-3 max-w-2xl mx-auto">Select your preferred cryptographic boundary (Cardano or Base) and aim your territory mapping unit.</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {/* 1. Cardano Identity */}
                <div className={`p-6 border rounded-2xl flex flex-col items-center text-center space-y-4 transition-all opacity-100 ${cardanoConnected ? 'bg-malama-teal/10 border-malama-teal/40 shadow-[0_0_20px_rgba(68,187,164,0.1)]' : evmConnected ? 'bg-gray-900 border-gray-800 opacity-60' : 'bg-malama-deep border-gray-800'}`}>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center ${cardanoConnected ? 'bg-malama-teal/20' : 'bg-gray-800'}`}>
                    <Wallet className={`w-7 h-7 ${cardanoConnected ? 'text-malama-teal' : 'text-gray-500'}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white uppercase tracking-wider text-xs">Cardano Gateway</h3>
                    <p className={`text-sm mt-1 font-mono ${cardanoConnected ? 'text-malama-teal' : cardanoConnecting ? 'text-malama-amber animate-pulse' : 'text-gray-500'}`}>
                      {cardanoConnected ? cardanoWalletName?.toUpperCase() : cardanoConnecting ? 'VERIFYING...' : 'DISCONNECTED'}
                    </p>
                  </div>
                  
                  {cardanoConnected ? (
                    <div className="w-full space-y-2">
                       <button className="w-full py-2 bg-malama-teal/20 border border-malama-teal/50 text-malama-teal rounded-lg font-bold text-xs cursor-default">
                        READY TO MINT
                       </button>
                    </div>
                  ) : (
                    <div className="w-full flex flex-col gap-2">
                       <button 
                         onClick={() => meshConnect('lace')}
                         disabled={cardanoConnecting || evmConnected}
                         className={`px-4 py-3 rounded-xl text-xs font-black transition-all shadow-lg ${evmConnected ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-white text-black hover:bg-malama-teal active:scale-95'}`}
                       >
                         {evmConnected ? 'EVM ACTIVE' : 'Select Lace'}
                       </button>
                    </div>
                  )}
                </div>

                {/* 2. Base Settlement */}
                <div className={`p-6 border rounded-2xl flex flex-col items-center text-center space-y-4 transition-all opacity-100 ${evmConnected ? 'bg-blue-500/10 border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.1)]' : cardanoConnected ? 'bg-gray-900 border-gray-800 opacity-60' : 'bg-malama-deep border-gray-800'}`}>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center ${evmConnected ? 'bg-blue-500/20' : 'bg-gray-800'}`}>
                    <Globe className={`w-7 h-7 ${evmConnected ? 'text-blue-400' : 'text-gray-500'}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white uppercase tracking-wider text-xs">Base L2 Gateway</h3>
                    <p className={`text-sm mt-1 font-mono ${evmConnected ? 'text-blue-400' : 'text-gray-500'}`}>{evmConnected ? 'CONNECTED' : 'DISCONNECTED'}</p>
                  </div>
                  {evmConnected ? (
                    <button onClick={() => disconnectEVM()} className="px-4 py-2 border border-blue-500/50 bg-blue-500/20 text-white rounded-lg text-xs font-bold hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400 transition-colors w-full">
                      {evmAddress?.slice(0,6)}...{evmAddress?.slice(-4)}
                    </button>
                  ) : (
                    <button 
                       disabled={cardanoConnected}
                       onClick={() => connectEVM({ connector: injected() })} 
                       className={`px-4 py-3 rounded-xl text-xs font-black transition-all shadow-lg w-full ${cardanoConnected ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                    >
                      {cardanoConnected ? 'CARDANO ACTIVE' : 'Select EVM'}
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
              <div className="flex items-center justify-between">
                 <h2 className="text-3xl font-black text-white flex items-center"><ShoppingCart className="mr-3 text-malama-teal w-8 h-8"/> Secure Ledger Review</h2>
                 <span className={`px-3 py-1 font-bold text-xs rounded-full border ${evmConnected ? 'bg-blue-500/10 text-blue-500 border-blue-500/30' : 'bg-malama-teal/10 text-malama-teal border-malama-teal/30'}`}>
                    NETWORK: {evmConnected ? 'BASE SEPOLIA' : 'CARDANO L1'}
                 </span>
              </div>
              
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
                <button onClick={() => setStep(3)} className={`flex-[2] py-6 text-white rounded-2xl font-black text-2xl hover:scale-[1.02] transition-transform shadow-2xl ${evmConnected ? 'bg-blue-600 shadow-blue-500/20' : 'bg-malama-teal text-malama-deep shadow-malama-teal/30'}`}>
                  Execute {evmConnected ? 'Base' : 'Cardano'} Payment <ChevronRight className="inline w-8 h-8 ml-1" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="space-y-8 flex flex-col items-center justify-center text-center h-full">
              <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 border-2 shadow-2xl ${evmConnected ? 'bg-blue-500/10 border-blue-500/30 shadow-blue-500/20' : 'bg-malama-teal/10 border-malama-teal/30 shadow-malama-teal/20'}`}>
                <img src="https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=029" className="w-16 h-16 grayscale brightness-200" alt="USDC" />
              </div>
              
              <h2 className="text-5xl font-black text-white tracking-tight">Approve Vault Signature</h2>
              <p className="text-xl text-gray-400 max-w-md leading-relaxed">Awaiting cryptographic signature releasing exactly $1,500 USDC strictly binding into the <span className="font-bold text-white">{evmConnected ? 'Base L2' : 'Cardano'}</span> settlement layer.</p>

              {error && (
                <div className="p-5 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 flex items-center mt-4 w-full max-w-lg font-bold text-sm text-left">
                  <AlertCircle className="mr-3 w-8 h-8 flex-shrink-0" /> {error}
                </div>
              )}

              <div className="flex flex-col w-full max-w-lg gap-4 mt-6">
                <button 
                  onClick={handlePayment} 
                  disabled={loading}
                  className={`w-full py-6 text-white rounded-2xl font-black text-2xl transition-colors shadow-[0_0_40px_rgba(0,0,0,0.4)] ${loading ? 'bg-gray-800 text-gray-400 cursor-not-allowed border border-gray-700' : evmConnected ? 'bg-blue-600 hover:bg-blue-500' : 'bg-malama-teal text-malama-deep hover:bg-malama-teal/80'}`}
                >
                  {generateSubmitText()}
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
              <p className="text-2xl text-gray-400 max-w-2xl leading-relaxed mt-4">Your autonomous hardware node constraint bounds have fully locked globally! Transacting fully secured across <span className="font-bold text-white">{successData?.network}</span> arrays.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl mt-12">
                <Link href="/dashboard" className="w-full flex items-center justify-center py-5 bg-malama-deep border border-gray-700 text-gray-300 rounded-xl font-bold hover:bg-gray-800 hover:text-white transition-colors text-lg">
                  Track Hardware Batch
                </Link>
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
