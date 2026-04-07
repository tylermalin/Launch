import { ShieldCheck, Cpu, Activity, MapPin, CheckCircle2, Box, Radio, AlertCircle, TrendingUp } from 'lucide-react'

export default function Dashboard() {
  const currentStatus = "Hardware Pending" // Mock State
  const hexes = ["85289493fffffff"]
  const activePredictionMarkets = 8

  return (
    <div className="min-h-screen bg-black text-gray-200 p-6 md:p-12 font-sans selection:bg-malama-teal selection:text-black">
      
      {/* Header */}
      <header className="max-w-6xl mx-auto flex items-center justify-between border-b border-gray-800 pb-8 mb-10">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter">Node Command Center</h1>
          <p className="text-malama-teal font-mono mt-1 text-sm">{hexes.length} Genesis License Active</p>
        </div>
        <div className="flex space-x-3 items-center">
          <div className="text-right mr-3 hidden sm:block">
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Network Status</p>
            <p className="text-white font-bold text-lg">{currentStatus}</p>
          </div>
          <div className="w-12 h-12 bg-malama-deep border border-malama-teal/30 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(68,187,164,0.2)]">
            <Cpu className="text-malama-teal w-6 h-6" />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Progress & Status */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Activation Protocol Tracker */}
          <section className="bg-malama-card border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-malama-teal to-blue-600"></div>
            <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">Node Activation Protocol</h2>
            
            <div className="flex flex-col md:flex-row justify-between mb-8 relative">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-800 -z-10 hidden md:block"></div>
              
              {/* Step 1: License */}
              <div className="flex flex-col items-center bg-malama-card p-2 z-10 w-32 text-center">
                <CheckCircle2 className="w-10 h-10 text-malama-teal mb-2 bg-malama-card rounded-full shadow-[0_0_20px_rgba(68,187,164,0.3)]" />
                <span className="font-bold text-white">License Ownership</span>
                <span className="text-xs text-gray-500 mt-1">Genesis Deed Secured</span>
              </div>
              
              {/* Step 2: Hardware Delivery */}
              <div className="flex flex-col items-center bg-malama-card p-2 z-10 w-32 text-center">
                <div className="w-10 h-10 rounded-full border-4 border-malama-teal flex items-center justify-center bg-malama-teal/20 mb-2">
                  <Box className="w-4 h-4 text-malama-teal" />
                </div>
                <span className="font-bold text-malama-teal">Hardware Shipped</span>
                <span className="text-xs text-malama-teal/70 mt-1">In Transit - Expected March 12</span>
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
             
             <div className="space-y-4">
              {hexes.map(hex => (
                <div key={hex} className="p-5 bg-malama-deep border border-gray-700 rounded-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-malama-amber/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
                  
                  <div className="flex justify-between items-start relative z-10">
                    <div>
                      <div className="flex items-center space-x-2">
                         <span className="bg-malama-teal/20 text-malama-teal text-[10px] font-bold px-2 py-1 rounded">GENESIS TIER</span>
                      </div>
                      <p className="font-mono text-2xl text-white font-bold mt-2">{hex}</p>
                      <p className="text-gray-500 text-sm mt-1">Target Physical Coordinate Base</p>
                    </div>
                    
                    <div className="text-right">
                       <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Active Data Markets</p>
                       <p className="text-2xl font-black text-malama-amber">{activePredictionMarkets}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="mt-8 w-full py-4 bg-gray-900 border border-gray-800 text-white rounded-xl font-black text-lg hover:bg-gray-800 hover:text-white transition-colors">
                 Acquire Additional Territory
            </button>
            
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
                  <p className="text-4xl font-mono font-black text-white">$0.00</p>
                  <p className="text-sm font-bold text-gray-500">USDC</p>
                </div>
              </div>
              
              <div className="h-px bg-gray-800 w-full"></div>
              
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Data Feed Bounties</p>
                <div className="flex items-baseline space-x-2">
                  <p className="text-3xl font-mono font-bold text-gray-300">0.00</p>
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
