'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'
import {
  CheckCircle2,
  Circle,
  HelpCircle,
  BookOpen,
  Cpu,
  Radio,
  Wrench,
  Shield,
  Network,
  AlertTriangle,
} from 'lucide-react'

const TABS = [
  { id: 'onboard', label: 'Deployment' },
  { id: 'hardware', label: 'Hardware' },
  { id: 'node', label: 'Node operation' },
  { id: 'support', label: 'Support & FAQ' },
] as const

type TabId = (typeof TABS)[number]['id']

const CHECKLIST = [
  {
    icon: Radio,
    title: 'Choose a deployment location',
    body: 'Reliable power source (solar preferred), physical security, stable internet. Aim for clear sky view if using the included solar option. Ethernet preferred over Wi-Fi — keep packet loss low for validation windows.',
  },
  {
    icon: BookOpen,
    title: 'Inspect hardware on arrival',
    body: 'Verify NEMA 4X enclosure seals before first deployment. NEMA-rated enclosure protects electronics — verify gasket integrity before any exposure to weather. Check the full BOM against the packing list included in your kit.',
  },
  {
    icon: Wrench,
    title: 'Mount the hardware',
    body: 'Install using included mounts — most setups complete in under 30 minutes. Keep the sensor array exposed to open air for accurate atmospheric readings. Detailed mounting instructions ship with the kit.',
  },
  {
    icon: Cpu,
    title: 'Power on and wait for device boot',
    body: 'The ATECC608B secure element provisions its device DID on first boot. This takes approximately 60 seconds. The status LED sequence confirms successful provisioning — refer to the included quick-start card for the LED blink codes.',
  },
  {
    icon: Network,
    title: 'Register via the Mālama dApp',
    body: "Open the Mālama Labs dApp and connect your Base or Cardano wallet. Enter your node's Device DID (displayed on-screen after boot, also on your included device certificate card). This binds your node's hardware identity to your NFT-HEX geographic assignment and initiates the deployment registration that triggers MLMA vesting.",
  },
  {
    icon: Radio,
    title: 'Confirm network connectivity',
    body: "The dApp dashboard shows your node's live status: online/offline, last heartbeat timestamp, and validation queue. First SaveCard production should appear within 15–30 minutes of successful registration.",
  },
  {
    icon: Shield,
    title: 'Await Genesis audit clearance',
    body: 'MLMA validation rewards begin after the Genesis Hex Sale audit confirms your node is operational and compliant. The audit takes place in October 2026. You will be notified of clearance via the dApp and the email address on your reservation. Nodes that do not clear the audit are notified and supported through resolution before any vesting is affected.',
  },
]

const BOM = [
  ['Compute', 'Raspberry Pi Zero 2W', 'Edge processing, LoRaWAN uplink coordination'],
  ['Secure element', 'Microchip ATECC608B-TFLXTLS', 'ECDSA P-256 signing, non-exportable key, Device DID provisioning'],
  ['Cellular uplink', 'Waveshare SIM7600G LTE HAT', 'Primary network connectivity, GPS timestamp'],
  ['Soil sensing', 'RS485 7-in-1 probe', 'Moisture, electrical conductivity, temperature, pH (depth-dependent)'],
  ['Atmospheric', 'BME280', 'Temperature, humidity, barometric pressure'],
  ['Enclosure', 'NEMA 4X IP67', 'Field weatherproofing — verify seal on arrival'],
  ['Power', 'Solar panel + UPS battery', '7-day autonomy at nominal load; grid power preferred if available'],
]

const TECH_MIN = [
  { param: 'Network uptime', min: '99.0%', rec: '99.9%+ for uptime multiplier (UF = 1.1×)' },
  { param: 'Internet connection', min: '100 Mbps up/down', rec: '1 Gbps preferred for low-latency validation windows' },
  { param: 'Uptime below 90%', min: 'UF = 0 · zero rewards', rec: 'Node earns zero validation rewards for that epoch' },
]

const PIPELINE = [
  { n: '01', title: 'Sensor produces signed reading', body: 'An enterprise sensor (ERW site, biochar kiln, AI data center rack) produces a hardware-signed reading. Every reading is ECDSA-signed at the source before transmission.' },
  { n: '02', title: 'Data broadcasts to the Hex Node network', body: 'Verified data is broadcast to the validator network. Your node receives data assigned to your hex zone or allocated via the network\'s fallback routing.' },
  { n: '03', title: 'Your node performs decentralized audit', body: 'Your node participates in Proof-of-Truth consensus: validating the cryptographic signature, cross-checking against neighboring validators, and contributing to the consensus outcome for the data packet.' },
  { n: '04', title: 'Validated data becomes a SaveCard', body: 'Once consensus is reached, data is anchored to Cardano via CIP-25/CIP-68 as a SaveCard. For carbon: feeds LCO₂ pre-finance and VCO₂ credit conversion. For AI compute: produces a hardware-verified Scope 2 disclosure record.' },
]

const SUPPORT_TABLE = [
  { type: 'Hardware and firmware', channel: 'Discord #hardware-support · hardware ticket queue', include: 'Your Device DID · hex zone ID · LED status code · photo of enclosure' },
  { type: 'Registration and dApp', channel: 'Discord #dapp-support', include: 'Your reservation ID · wallet address (Base or Cardano) · screenshot of error' },
  { type: 'Audit and compliance', channel: 'Discord #audit · support email', include: 'Your reservation ID · deployment date · node registration confirmation' },
  { type: 'Billing and reservation', channel: 'Support email', include: 'Your reservation ID and the email used at reservation' },
  { type: 'Scheduled phone call', channel: 'Book via dApp or email', include: 'Available for critical deployment issues · allow 48-hour notice' },
]

const FAQS = [
  {
    q: 'Where do I get firmware or pairing help?',
    a: "Use the Launch Discord #hardware-support channel and the hardware ticket queue. Include your Device DID (from the device certificate card or the dApp) and your hex zone ID from your reservation confirmation. Do not share your wallet private key with support under any circumstances.",
  },
  {
    q: 'Can I move my node to a different hex?',
    a: "Your geographic license (NFT-HEX) is tied to a specific H3 hex cell. Relocation is governed by the NFT-HEX transfer and resale rules in your reservation agreement. Contact support before physically relocating — unauthorized relocation may trigger clawback review. If your hex zone has persistent demand issues, the Mālama team will work with you on options.",
  },
  {
    q: 'What if validation volume is low at my hex at launch?',
    a: "Network demand ramps as enterprise sensor deployments come online across carbon MRV, AI compute monitoring, and parametric insurance verticals. Your node also validates data from across the network, not only data produced in your specific hex zone. The Geographic Multiplier (GM) reflects the scarcity value of your zone and is applied to all validation work your node performs, including data assigned from other zones. See Pricing & Reward Mechanics for the full formula. No earnings guarantees are made.",
  },
  {
    q: 'My node has been offline for several days. What do I do?',
    a: "Nodes offline for 90 or more consecutive days without notification are subject to hex clawback review. For shorter outages, check power and connectivity first, then open a hardware ticket in Discord with your Device DID. Brief outages do not affect your vesting schedule — only validation rewards are reduced during offline periods per the Uptime Factor (UF) formula.",
  },
  {
    q: 'When does my MLMA allocation begin vesting?',
    a: "Vesting begins at hardware boot and successful deployment registration, not at reservation. The 31,250 MLMA boot tranche (25%) releases when your Device DID is successfully bound to your NFT-HEX in the Mālama dApp. The remaining 93,750 MLMA (75%) vests linearly over 12 months at approximately 7,813 MLMA per month. Vesting is separate from validation rewards and is not affected by the Genesis audit outcome.",
  },
  {
    q: 'What is the Device DID and where do I find it?',
    a: "The Device DID is the cryptographic identity of your specific node hardware, derived from the ATECC608B secure element provisioned at manufacture. It is displayed on the node screen during first boot and printed on the device certificate card included in your hardware kit. You need it for dApp registration. It is different from your wallet address and cannot be changed or transferred — it is permanently bound to that piece of hardware.",
  },
  {
    q: 'Do I need to own or deploy sensors to earn validation rewards?',
    a: "No. A Genesis 200 Hex Node is a validation node, not a sensor. You receive MLMA rewards for validating data produced by enterprise sensor deployments — ERW sites, biochar kilns, AI data center racks — operated by carbon project developers, data center operators, and industrial clients. You do not need to deploy any sensors. Sensor deployment by a node operator is optional and would increase local data volume in your zone, potentially increasing your reward weight.",
  },
]

const PAGE_FOOTER = 'Genesis 200 Phase 1 Operator Guide · companion to shipped hardware runbooks · Tokenomics Whitepaper v2.0 · April 2026'

export default function OperatorsPage() {
  const [tab, setTab] = useState<TabId>('onboard')
  const [done, setDone] = useState<Record<number, boolean>>({})
  const toggle = (i: number) => setDone((d) => ({ ...d, [i]: !d[i] }))

  return (
    <div className="max-w-3xl">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <p className="text-xs font-black uppercase tracking-widest text-amber-400 mb-2">Genesis 200 · Phase 1</p>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
          Operator<br />documentation.
        </h1>
        <p className="text-base text-gray-400 leading-relaxed">
          How to deploy, connect, and steward your Hex Node through the Genesis phase. Work through the onboarding
          checklist, review hardware requirements, understand your data obligations, and reach support.
        </p>
      </motion.header>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-800 pb-4">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              tab === t.id ? 'bg-amber-500 text-black' : 'text-gray-500 hover:text-white hover:bg-white/5'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ── Deployment tab ── */}
        {tab === 'onboard' && (
          <motion.div key="onboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <p className="text-gray-400 text-sm leading-relaxed">
              Welcome to the Genesis 200 node stack. By operating this hardware you anchor a geographic hex zone on the Mālama
              validation network. Work through the checklist — progress saves in your browser.
            </p>
            <p className="text-xs font-black uppercase tracking-widest text-amber-400 mb-2">Deployment Checklist</p>
            {CHECKLIST.map((s, i) => {
              const Icon = s.icon
              const checked = !!done[i]
              return (
                <button
                  key={s.title}
                  type="button"
                  onClick={() => toggle(i)}
                  className={`w-full text-left rounded-2xl border p-5 flex gap-4 transition-all ${
                    checked ? 'border-malama-accent/50 bg-malama-accent/5' : 'border-gray-800 bg-[#0d1e35] hover:border-gray-700'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    checked ? 'bg-malama-accent/20 text-malama-accent' : 'bg-gray-800 text-gray-500'
                  }`}>
                    {checked ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-white mb-1 text-sm">{s.title}</p>
                    <p className="text-xs text-gray-400 leading-relaxed">{s.body}</p>
                    <p className="text-[10px] text-gray-600 mt-2 flex items-center gap-1">
                      {checked
                        ? <><CheckCircle2 className="w-3 h-3 text-malama-accent" /> Complete</>
                        : <><Circle className="w-3 h-3" /> Tap to mark complete</>
                      }
                    </p>
                  </div>
                </button>
              )
            })}
            <div className="rounded-xl border border-gray-800 bg-[#0d1e35] p-4 mt-2">
              <p className="text-xs font-black uppercase tracking-widest text-malama-accent mb-3 flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5" /> Field Notes
              </p>
              <ul className="space-y-2 text-xs text-gray-400 leading-relaxed">
                <li>• Use extension cables if the enclosure must sit in partial shade — prioritize panel exposure over enclosure placement convenience.</li>
                <li>• Verify gasket seals before the first storm season. NEMA-rated housing protects electronics but does not protect sensor calibration if moisture reaches the probe assembly.</li>
                <li>• Ethernet preferred; Wi-Fi bridge acceptable if packet loss stays consistently below the validation window threshold.</li>
                <li>• Nodes offline for 90 or more consecutive days without notification are subject to hex clawback review per your reservation agreement.</li>
              </ul>
            </div>
            <p className="text-xs text-gray-600 border-t border-gray-800 pt-4">{PAGE_FOOTER}</p>
          </motion.div>
        )}

        {/* ── Hardware tab ── */}
        {tab === 'hardware' && (
          <motion.div key="hardware" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-amber-400 mb-3">Hardware Bill of Materials</p>
              <div className="overflow-x-auto rounded-2xl border border-gray-800 bg-[#0d1e35]">
                <table className="w-full text-sm min-w-[520px]">
                  <thead>
                    <tr className="border-b border-gray-800 text-left">
                      {['Component', 'Specification', 'Role'].map((h) => (
                        <th key={h} className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-gray-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {BOM.map(([comp, spec, role], i) => (
                      <tr key={i} className="border-t border-gray-800/80 hover:bg-white/[0.02]">
                        <td className="px-4 py-2.5 font-semibold text-white">{comp}</td>
                        <td className="px-4 py-2.5 text-malama-accent font-mono text-xs">{spec}</td>
                        <td className="px-4 py-2.5 text-gray-400">{role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-widest text-amber-400 mb-3">Technical Minimums</p>
              <div className="overflow-x-auto rounded-2xl border border-gray-800 bg-[#0d1e35]">
                <table className="w-full text-sm min-w-[480px]">
                  <thead>
                    <tr className="border-b border-gray-800 text-left">
                      {['Parameter', 'Minimum', 'Recommended'].map((h) => (
                        <th key={h} className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-gray-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {TECH_MIN.map((row, i) => (
                      <tr key={i} className="border-t border-gray-800/80 hover:bg-white/[0.02]">
                        <td className="px-4 py-2.5 font-semibold text-white">{row.param}</td>
                        <td className="px-4 py-2.5 text-gray-300">{row.min}</td>
                        <td className="px-4 py-2.5 text-malama-accent">{row.rec}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-[#0d1e35] p-6">
              <p className="text-xs font-black uppercase tracking-widest text-amber-400 mb-3 flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5" /> The Device DID
              </p>
              <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
                <p>
                  Your node's identity is its <strong className="text-white">Device DID</strong>, derived from the ATECC608B secure element
                  provisioned at manufacture. The private key is non-exportable — it exists only in that specific chip. Every SaveCard your
                  node produces is signed by this key. The Device DID is displayed on the node screen during first boot and printed on your
                  included device certificate card. You will need it for dApp registration.
                </p>
                <p className="text-gray-400">
                  Do not confuse the Device DID with your wallet address. They are separate identities. Your wallet holds your NFT-HEX and
                  receives MLMA rewards. Your node's Device DID proves the origin of the data it signs.
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              Hardware ships September 2026. Detailed BOM, wiring diagrams, mounting templates, and LED status code reference ship
              with your kit. For pre-shipment technical questions, use the Discord #hardware channel and include your reservation ID.
            </p>
            <p className="text-xs text-gray-600 border-t border-gray-800 pt-4">{PAGE_FOOTER}</p>
          </motion.div>
        )}

        {/* ── Node operation tab ── */}
        {tab === 'node' && (
          <motion.div key="node" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-amber-400 mb-3">What Your Node Produces</p>
              <p className="text-sm text-gray-300 leading-relaxed mb-5">
                Your Genesis 200 Hex Node is a <strong className="text-white">validation node, not a sensor</strong>. It validates SaveCards
                and compute packets produced by enterprise sensor deployments in your hex zone and across the network. You do not need to own
                sensors to operate a validation node. The data your node validates flows through the following pipeline:
              </p>
              <div className="space-y-3">
                {PIPELINE.map((step, i) => (
                  <div key={step.n} className="flex gap-4 rounded-xl border border-gray-800 bg-[#0d1e35] p-4">
                    <div className="w-8 h-8 rounded-lg bg-malama-accent/10 border border-malama-accent/30 flex items-center justify-center shrink-0">
                      <span className="font-mono text-[10px] font-black text-malama-accent">{step.n}</span>
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm mb-1">{step.title}</p>
                      <p className="text-xs text-gray-400 leading-relaxed">{step.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6">
              <p className="text-xs font-black uppercase tracking-widest text-amber-400 mb-3 flex items-center gap-2">
                <Shield className="w-3.5 h-3.5" /> Genesis Hex Sale Audit
              </p>
              <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
                <p>MLMA validation rewards do not begin automatically at a calendar date. They begin after the Genesis Hex Sale audit confirms that your node is operational, compliant, and properly registered. The audit takes place in October 2026.</p>
                <p>Nodes that pass the audit receive full Year 1 Genesis multiplier benefits (1.5×) from the clearance date.</p>
                <p>Nodes that do not yet pass are notified with specific remediation steps. Vesting is not affected by audit status — only validation rewards are withheld until compliance is confirmed.</p>
                <p>The audit is conducted by an independent reviewer engaged by Mālama Labs. Results are communicated via the dApp and your reservation email.</p>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-[#0d1e35] p-6">
              <p className="text-xs font-black uppercase tracking-widest text-amber-400 mb-3">PONO Governance Credential</p>
              <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
                <p>PONO is a non-transferable, on-chain credential issued by the Mālama Foundation to operators who have completed KYB verification, deployed active hardware, and demonstrated consistent node operation over a qualifying period.</p>
                <ul className="space-y-1.5 text-xs text-gray-400 pl-4">
                  <li>• PONO is required to participate in veMLMA governance votes. Holding MLMA or veMLMA alone is not sufficient.</li>
                  <li>• You do not need PONO to receive validation rewards or your 125,000 MLMA allocation.</li>
                  <li>• PONO issuance criteria will be published before mainnet governance goes live.</li>
                  <li>• PONO is revocable by governance supermajority for operators who violate network rules: data tampering, hardware fraud, or prolonged offline status without notification.</li>
                </ul>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-[#0d1e35] p-6">
              <p className="text-xs font-black uppercase tracking-widest text-amber-400 mb-3">Data Retention</p>
              <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
                <p>Operators are not responsible for raw sensor data retention — that obligation sits with sensor operators and Mālama Labs (10-year S3-compatible off-chain retention with immutability lock). Your node's validation records are anchored on-chain permanently via Cardano.</p>
                <p>You should retain your reservation agreement, your Device DID certificate card, and your deployment registration confirmation. These are your proof of participation for any future governance or compliance purposes.</p>
              </div>
            </div>

            <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-5 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="text-sm text-gray-300 leading-relaxed">
                <p className="font-bold text-red-400 mb-1">Fraudulent attestations — slashing</p>
                <p>Validators who sign false or manipulated attestations face a <strong className="text-white">10% MLMA slashing penalty</strong>. Byzantine Fault Tolerant consensus means isolated malicious validators are identified and penalized without affecting the wider network. Do not attempt to validate data you have not received through the standard network protocol.</p>
              </div>
            </div>
            <p className="text-xs text-gray-600 border-t border-gray-800 pt-4">{PAGE_FOOTER}</p>
          </motion.div>
        )}

        {/* ── Support & FAQ tab ── */}
        {tab === 'support' && (
          <motion.div key="support" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-amber-400 mb-3">Getting Help</p>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                Primary support for Genesis 200 operators runs through Discord and the hardware ticket queue. Phone support is
                available for scheduled calls on critical deployment issues.
              </p>
              <div className="overflow-x-auto rounded-2xl border border-gray-800 bg-[#0d1e35]">
                <table className="w-full text-sm min-w-[520px]">
                  <thead>
                    <tr className="border-b border-gray-800 text-left">
                      {['Issue type', 'Channel', 'What to include'].map((h) => (
                        <th key={h} className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-gray-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SUPPORT_TABLE.map((row, i) => (
                      <tr key={i} className="border-t border-gray-800/80 hover:bg-white/[0.02]">
                        <td className="px-4 py-2.5 font-semibold text-white text-xs">{row.type}</td>
                        <td className="px-4 py-2.5 text-malama-accent text-xs">{row.channel}</td>
                        <td className="px-4 py-2.5 text-gray-400 text-xs">{row.include}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-widest text-amber-400 mb-3">Frequently Asked Questions</p>
              <div className="space-y-3">
                {FAQS.map((faq) => (
                  <div key={faq.q} className="rounded-2xl border border-gray-800 bg-[#0d1e35] p-5">
                    <div className="flex gap-2 text-white font-bold text-sm mb-2">
                      <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      {faq.q}
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed pl-6">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-800">
              <Link href="/docs/pricing-roi" className="text-sm font-bold text-malama-accent hover:text-malama-accent/80">
                Pricing &amp; Reward Mechanics →
              </Link>
              <Link href="/docs/tokenomics" className="text-sm font-bold text-gray-500 hover:text-gray-300">
                Tokenomics Whitepaper →
              </Link>
              <Link href="/" className="text-sm font-bold text-gray-500 hover:text-gray-300">
                Launch page →
              </Link>
            </div>
            <p className="text-xs text-gray-600 border-t border-gray-800 pt-4">{PAGE_FOOTER}</p>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
