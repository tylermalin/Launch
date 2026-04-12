'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@meshsdk/react'
import { useAccount, useConnect } from 'wagmi'
import { ShieldCheck, Cpu, MapPin, CheckCircle2, Box, Radio, AlertCircle, TrendingUp, Lock } from 'lucide-react'
import Link from 'next/link'

// Helper to decode Cardano hex-encoded asset names safely
function hexToAscii(hexStr: string | undefined) {
  if (!hexStr || typeof hexStr !== 'string') return '';
  let str = '';
  for (let i = 0; i < hexStr.length; i += 2) {
    str += String.fromCharCode(parseInt(hexStr.substr(i, 2), 16));
  }
  return str;
}

export default function Dashboard() {
  // Cardano Mesh Context
  const { connected: isCardanoConnected, wallet: cardanoWallet, connect: connectCardano, connecting: isCardanoConnecting } = useWallet()
  
  // Base EVM Wagmi Context
  const { isConnected: isEvmConnected } = useAccount()
  const { connectors, connect: connectEvm, isPending: isEvmConnecting } = useConnect()

  // Unified Omnichain State
  const isAuthenticated = isCardanoConnected || isEvmConnected

  const [hexes, setHexes] = useState<string[]>([])
  const [loadingAssets, setLoadingAssets] = useState(false)

  const currentStatus = hexes.length > 0 ? "Hardware Pending" : "Awaiting Genesis License"
  const activePredictionMarkets = hexes.length > 0 ? 8 : 0

  useEffect(() => {
    async function resolveAssets() {
      if (isCardanoConnected && cardanoWallet) {
        setLoadingAssets(true)
        try {
          const rawAssets = await cardanoWallet.getAssets()
          // Natively guard against undefined structures
          const assets = Array.isArray(rawAssets) ? rawAssets : []
          const foundHexes: string[] = []
          
          for (const asset of assets) {
            // Mesh SDK returns { unit: string, quantity: string }
            if (asset && asset.unit && typeof asset.unit === 'string') {
               // PolicyID is 56 chars, the remainder is the hex-encoded asset name
               const assetNameHex = asset.unit.length > 56 ? asset.unit.slice(56) : ''
               if (assetNameHex.length > 0) {
                 try {
                   const decodedName = hexToAscii(assetNameHex)
                   if (decodedName.startsWith("Hex")) {
                     const rawTty = decodedName.replace("Hex", "")
                     foundHexes.push(rawTty)
                   }
                 } catch (e) {
                   // Silently ignore structurally corrupted UTxO hex maps
                 }
               }
            }
          }
          setHexes(foundHexes)
        } catch (e) {
          console.error("Failed to fetch Cardano assets", e)
        } finally {
          setLoadingAssets(false)
        }
      } else if (isEvmConnected) {
        setLoadingAssets(true)
        // Note: For now, EVM NFTs are physically resolving via mock until ERC-721 Oracle mirrors are fired
        setTimeout(() => {
           setHexes(["EVM-Mock-Tty"]); // Placeholder until ERC-721 contract reads are injected into UI
           setLoadingAssets(false);
        }, 1200)
      } else {
        setHexes([])
      }
    }
    resolveAssets()
  }, [isCardanoConnected, cardanoWallet, isEvmConnected])

  return (
    <div className="min-h-screen bg-black text-gray-200 p-6 md:p-12 font-sans selection:bg-malama-teal selection:text-black relative">
      
      {/* Header */}
      <header className="max-w-6xl mx-auto flex items-center justify-between border-b border-gray-800 pb-8 mb-10">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter">Node Command Center</h1>
          <p className="text-malama-teal font-mono mt-1 text-sm">{loadingAssets ? 'Scanning Omnichain Ledger...' : `${hexes.length} Genesis Licenses Active`}</p>
        </div>
        
        <div className="flex space-x-4 items-center">
          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Network Status</p>
                <div className="flex items-center space-x-2">
                   {isEvmConnected && <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>}
                   {isCardanoConnected && <span className="w-2 h-2 rounded-full bg-malama-teal animate-pulse"></span>}
                   <p className="text-white font-bold text-lg">{currentStatus}</p>
                </div>
              </div>
              <div className="w-12 h-12 bg-malama-deep border border-malama-teal/30 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(196,240,97,0.2)]">
                <Cpu className="text-malama-teal w-6 h-6" />
              </div>
            </div>
          ) : (
            <div className="flex space-x-2">
              <button 
                onClick={() => connectCardano('lace')}
                disabled={isCardanoConnecting || isEvmConnecting}
                className="px-4 py-2 bg-malama-teal/20 border border-malama-teal/50 text-malama-teal rounded-lg font-bold hover:bg-malama-teal hover:text-black transition-colors"
               >
                Access Lace
               </button>
               <button 
                onClick={() => connectEvm({ connector: connectors[0] })}
                disabled={isCardanoConnecting || isEvmConnecting}
                className="px-4 py-2 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-lg font-bold hover:bg-blue-500 hover:text-white transition-colors"
               >
                Access EVM
               </button>
            </div>
          )}
        </div>
      </header>

      {/* Authentication Gateway */}
      {!isAuthenticated && (
        <div className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/60 pt-32">
          <div className="bg-malama-card border border-gray-800 p-10 rounded-3xl text-center max-w-md shadow-2xl">
            <ShieldCheck className="w-20 h-20 text-malama-teal mx-auto mb-6 drop-shadow-[0_0_20px_rgba(196,240,97,0.3)]" />
            <h2 className="text-2xl font-black text-white mb-2 tracking-tight">DePIN Sign-In Required</h2>
            <p className="text-gray-400 mb-8 leading-relaxed">Secure your identity via Web3. The Omnichain Oracle supports active routing across Cardano and Base.</p>
            
            <div className="space-y-3">
              <button 
                onClick={() => connectCardano('lace')}
                disabled={isCardanoConnecting || isEvmConnecting}
                className="w-full py-4 bg-malama-teal/10 border-2 border-malama-teal/50 text-malama-teal rounded-xl font-black hover:bg-malama-teal hover:text-black transition-colors shadow-xl"
              >
                {isCardanoConnecting ? "Verifying Keys..." : "Authenticate via Cardano (Lace)"}
              </button>
              
              <button 
                onClick={() => connectEvm({ connector: connectors[0] })}
                disabled={isCardanoConnecting || isEvmConnecting}
                className="w-full py-4 bg-blue-500/10 border-2 border-blue-500/50 text-blue-400 rounded-xl font-black hover:bg-blue-500 hover:text-white transition-colors shadow-xl"
              >
                {isEvmConnecting ? "Verifying Keys..." : "Authenticate via Base EVM"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Dashboard UI (Blurs when disconnected) */}
      <div className={`max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 transition-opacity duration-500 ${!isAuthenticated ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
        
        {/* Left Column: Progress & Status */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Activation Protocol Tracker */}
          <section className="bg-malama-card border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-malama-teal to-blue-600"></div>
            <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">Node Activation Protocol</h2>
            
            <div className="flex flex-col md:flex-row justify-between mb-8 relative">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-800 -z-10 hidden md:block"></div>
              
              {/* Step 1: License */}
              <div className={`flex flex-col items-center bg-malama-card p-2 z-10 w-32 text-center ${hexes.length === 0 ? 'opacity-40' : ''}`}>
                <CheckCircle2 className={`w-10 h-10 mb-2 bg-malama-card rounded-full ${hexes.length > 0 ? 'text-malama-teal shadow-[0_0_20px_rgba(196,240,97,0.3)]' : 'text-gray-600'}`} />
                <span className={`font-bold ${hexes.length > 0 ? 'text-white' : 'text-gray-400'}`}>License Ownership</span>
                <span className="text-xs text-gray-500 mt-1">{hexes.length > 0 ? 'Genesis Deed Secured' : 'No License Found'}</span>
              </div>
              
              {/* Step 2: Hardware Delivery */}
              <div className={`flex flex-col items-center bg-malama-card p-2 z-10 w-32 text-center ${hexes.length === 0 ? 'opacity-20 grayscale' : ''}`}>
                <div className={`w-10 h-10 rounded-full border-4 flex items-center justify-center mb-2 ${hexes.length > 0 ? 'border-malama-teal bg-malama-teal/20' : 'border-gray-700 bg-gray-800'}`}>
                  <Box className={`w-4 h-4 ${hexes.length > 0 ? 'text-malama-teal' : 'text-gray-500'}`} />
                </div>
                <span className={`font-bold ${hexes.length > 0 ? 'text-malama-teal' : 'text-gray-500'}`}>Hardware Shipped</span>
                <span className="text-xs text-malama-teal/80 mt-1">{hexes.length > 0 ? 'In Transit - Expected in 6 Months' : 'Pending Verification'}</span>
              </div>
              
              {/* Step 3: Data Uplink */}
              <div className="flex flex-col items-center bg-malama-card p-2 z-10 w-32 text-center opacity-40">
                <Radio className="w-10 h-10 text-gray-600 mb-2 bg-malama-card" />
                <span className="font-bold text-gray-400">Data Uplink</span>
                <span className="text-xs text-gray-500 mt-1">Awaiting Sensor Boot</span>
              </div>
            </div>

            <div className="bg-blue-500/10 p-6 rounded-2xl border border-blue-500/30">
               <div className="flex items-start">
                 <AlertCircle className="w-6 h-6 text-blue-400 mr-4 flex-shrink-0 mt-1" />
                 <div>
                   <h3 className="font-bold text-blue-400 text-lg">Next Step: Plug & Play Validation</h3>
                   <p className="text-sm text-gray-300 mt-1 leading-relaxed">
                     Once your sensor arrives, simply connect it to a standard power source within your Hex territory. It will immediately begin broadcasting cryptographically-signed spatial data constraints natively to the base network without any technical setup routing required.
                   </p>
                 </div>
               </div>
            </div>
          </section>

          {/* Active Hexes List */}
          <section className="bg-malama-card border border-gray-800 rounded-3xl p-8 shadow-xl">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Your Validator Network Licenses</h2>
             </div>
             
             {loadingAssets ? (
               <div className="p-10 border border-dashed border-gray-700 rounded-2xl flex flex-col items-center justify-center text-center">
                 <div className="w-8 h-8 rounded-full border-t-2 border-malama-teal animate-spin mb-4"></div>
                 <p className="text-gray-400 font-bold">Scanning Ledger Utilities...</p>
               </div>
             ) : hexes.length === 0 ? (
               <div className="p-10 border border-dashed border-gray-700 rounded-2xl flex flex-col items-center justify-center text-center bg-gray-900/30">
                 <Lock className="w-10 h-10 text-gray-600 mb-4" />
                 <p className="text-xl font-bold text-gray-400 mb-2">No Genesis Licenses Discovered</p>
                 <p className="text-gray-500 max-w-sm mb-6">Your connected wallet currently holds exactly 0 verified Node Operator Licenses.</p>
               </div>
             ) : (
               <div className="space-y-4">
                {hexes.map((hex, i) => (
                  <div key={`${hex}-${i}`} className="p-5 bg-malama-deep border border-gray-700 rounded-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-malama-amber/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    
                    <div className="flex justify-between items-start relative z-10">
                      <div>
                        <div className="flex items-center space-x-2">
                           <span className={`text-[10px] font-bold px-2 py-1 rounded ${isEvmConnected ? 'bg-blue-500/20 text-blue-400' : 'bg-malama-teal/20 text-malama-teal'}`}>GENESIS TIER</span>
                        </div>
                        <p className="font-mono text-2xl text-white font-bold mt-2">{hex}</p>
                        <p className="text-gray-500 text-sm mt-1">Target Physical Coordinate Base</p>
                      </div>
                      
                      <div className="text-right">
                         <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Active Data Markets</p>
                         <p className="text-2xl font-black text-malama-amber mb-2">{activePredictionMarkets}</p>
                         <Link 
                           href={`/map?hex=${hex}`}
                           className="inline-flex items-center text-xs font-bold text-malama-teal hover:text-white transition-colors bg-malama-teal/10 px-3 py-1.5 rounded-lg border border-malama-teal/20 hover:border-malama-teal"
                         >
                           <MapPin className="w-3 h-3 mr-1" /> View Map
                         </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
             )}
            
            <Link href="/map" className="block mt-8 w-full py-4 text-center bg-gray-900 border border-gray-800 text-white rounded-xl font-black text-lg hover:bg-gray-800 hover:text-white transition-colors">
                 Acquire Additional Territory
            </Link>
            
          </section>

        </div>

        {/* Right Column: Earnings & Stats */}
        <div className="space-y-8">
          
          <section className="bg-malama-card border border-gray-800 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center space-x-3 mb-6">
              <TrendingUp className="w-8 h-8 text-malama-teal" />
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">Validator Fee Accruals</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Prediction Market Yields</p>
                <div className="flex items-baseline space-x-2">
                  <p className={`text-4xl font-mono font-black ${hexes.length > 0 ? 'text-white' : 'text-gray-600'}`}>$0.00</p>
                  <p className="text-sm font-bold text-gray-500">USDC</p>
                </div>
              </div>
              
              <div className="h-px bg-gray-800 w-full"></div>
              
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Data Feed Bounties</p>
                <div className="flex items-baseline space-x-2">
                  <p className={`text-3xl font-mono font-bold ${hexes.length > 0 ? 'text-gray-300' : 'text-gray-600'}`}>0.00</p>
                  <p className="text-sm font-bold text-malama-teal">MALAMA</p>
                </div>
              </div>
            </div>

            <div className="mt-8 w-full">
               <button disabled className="w-full py-3 border border-gray-700 bg-gray-900/50 text-gray-500 rounded-lg font-bold text-sm cursor-not-allowed">
                 Claim Yields (Awaiting Uplink)
               </button>
            </div>
            
            <div className="mt-4 p-4 bg-malama-teal/10 border border-malama-teal/30 rounded-xl">
              <p className="text-xs text-malama-teal/90 font-bold leading-relaxed">
                As soon as your hardware establishes a secure uplink, external Prediction Markets resolving inside your Hex automatically pay validation fees directly into this ledger!
              </p>
            </div>
          </section>
          
        </div>
      </div>
    </div>
  )
}
