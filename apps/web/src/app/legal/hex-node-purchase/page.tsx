import type { Metadata } from 'next'
import Link from 'next/link'
import '../legal-doc.css'
import LegalPageShell from '../_shared/LegalPageShell'

export const metadata: Metadata = {
  title: 'Hex Node Purchase & Preorder Agreement · Mālama Labs',
  description:
    'Sale-specific agreement for the Genesis 200 program. Pricing, deployment window, MLMA vesting, validation reward formula, and mutable / immutable protocol parameters.',
}

export default function HexNodePurchasePage() {
  return (
    <LegalPageShell
      current="hex-node-purchase"
      docNumber="DOC · 003"
      eyebrowText="Sale agreement · Genesis 200"
      titleLead="Hex Node Purchase &"
      titleEmphasis="Preorder."
      lede="The sale-specific agreement for the Genesis 200 program. Supplements the Mālama Terms & Conditions and Privacy Policy; controls on conflict for Hex Node purchases."
      metaRows={[
        { k: 'Status', v: 'In force', accent: true },
        { k: 'Effective', v: 'April 11, 2026' },
        { k: 'Last Updated', v: 'April 28, 2026' },
        { k: 'Version', v: 'v2' },
        { k: 'Sections', v: '18' },
        { k: 'Reading time', v: '~22 min' },
      ]}
      docBar={{
        version: 'Version 2 · In force',
        docId: 'Doc · MLMA-LEGAL-003',
        category: 'Category · Sale agreement',
      }}
    >
      <main className="layout">
        <aside className="toc" aria-label="Table of contents">
          <div className="toc-label"><span>Contents</span><span className="count">18 sections</span></div>
          <ol>
            {[
              ['s1','01','Scope of agreement'],['s2','02','Preorders and reservations'],
              ['s3','03','Pricing and payment'],['s4','04','Order acceptance & cancellation'],
              ['s5','05','Delivery and fulfillment'],['s6','06','Protocol parameters'],
              ['s6a','6A','Hardware specifications'],['s7','07','Returns, refunds, cancellations'],
              ['s8','08','Limited hardware warranty'],['s9','09','Node activation'],
              ['s10','10','No guarantee of rewards'],['s11','11','Tokens, wallets, blockchain risk'],
              ['s12','12','Compliance with laws'],['s13','13','Limitation of liability'],
              ['s14','14','Indemnification'],['s15','15','Force majeure'],
              ['s16','16','Termination'],['s17','17','Governing law & disputes'],
              ['s18','18','Entire agreement'],['contact','- -','Contact'],
            ].map(([id, n, t]) => (
              <li key={id}><a href={`#${id}`}><span className="n">{n}</span><span className="t">{t}</span></a></li>
            ))}
          </ol>
          <div className="toc-actions">
            <a className="btn" href="mailto:legal@malamalabs.com"><span>Contact legal</span><span>↗</span></a>
          </div>
        </aside>

        <article className="content">
          <div className="preamble">
            <p>This <strong>Hex Node Purchase &amp; Preorder Agreement</strong> (&ldquo;Agreement&rdquo;) governs your purchase, reservation, or preorder of a <strong>Genesis 200 Hex Node</strong> and any associated software, licenses, or services offered by <strong>Mālama Labs Inc.</strong> (&ldquo;Mālama,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;).</p>
            <p>This Agreement supplements and incorporates by reference the <Link href="/legal/terms" style={{ color: 'var(--mlma-accent)', textDecoration: 'underline', textDecorationColor: 'var(--mlma-line-bright)', textUnderlineOffset: 3 }}>Mālama Terms and Conditions</Link> and <Link href="/legal/privacy" style={{ color: 'var(--mlma-accent)', textDecoration: 'underline', textDecorationColor: 'var(--mlma-line-bright)', textUnderlineOffset: 3 }}>Privacy Policy</Link> (collectively, the &ldquo;Platform Terms&rdquo;). <strong>In the event of conflict, this Agreement controls with respect to Hex Node purchases.</strong> By placing an order, reservation, or preorder, you (&ldquo;Customer&rdquo;) agree to be bound by this Agreement.</p>
          </div>

          <section className="clause" id="s1">
            <div className="clause-head"><span className="num">§ 01</span><h2>Scope of agreement</h2><a className="anchor" href="#s1">#s1</a></div>
            <div className="clause-body">
              <p>This Agreement applies to:</p>
              <ul>
                <li>Genesis 200 Hex Node purchases and preorder reservations.</li>
                <li>Deposits and payments associated with reservations.</li>
                <li>Bundled hardware and software packages.</li>
                <li>NFT-HEX geographic licenses and access rights.</li>
                <li>Fulfillment, delivery, and activation processes.</li>
              </ul>
              <p>A <strong>&ldquo;Hex Node&rdquo;</strong> as used in this Agreement means the hardware device, embedded firmware, Device DID, geographic hex cell license (NFT-HEX), and associated network participation rights sold as part of the Genesis 200 program.</p>
              <div className="callout accent">
                <span className="tag">● Validation, not measurement</span>
                <p>The Genesis 200 Hex Node is a <strong>validation node</strong>: it validates SaveCards and compute packets produced by third-party sensor deployments. It does not itself produce sensor data unless the operator independently deploys sensors in the same zone.</p>
              </div>
            </div>
          </section>

          <section className="clause" id="s2">
            <div className="clause-head"><span className="num">§ 02</span><h2>Preorders and reservations</h2><a className="anchor" href="#s2">#s2</a></div>
            <div className="clause-body">
              <p>Mālama offers Genesis 200 Hex Nodes through a preorder reservation beginning <strong>May 2, 2026</strong>. If you place a preorder:</p>
              <ul>
                <li>You may be required to pay the full purchase price at reservation.</li>
                <li>Your order secures a place in the production and delivery queue based on reservation order.</li>
                <li>Estimated delivery timelines are non-binding and subject to change.</li>
              </ul>
              <p>You acknowledge that preorder products may not yet be manufactured or finalized, specifications may evolve within the scope permitted by Section 6A, and delivery dates may shift due to supply chain, regulatory, or technical factors.</p>
              <p>Unless otherwise stated at checkout: deposits may be refundable within a defined window; after that window, deposits may become non-refundable. <strong>See Section 7</strong> for full refund terms.</p>
            </div>
          </section>

          <section className="clause" id="s3">
            <div className="clause-head"><span className="num">§ 03</span><h2>Pricing and payment</h2><a className="anchor" href="#s3">#s3</a></div>
            <div className="clause-body">
              <div className="spec-list">
                <div className="row"><div className="k">Genesis 200 entry</div><div className="v"><strong>US$2,000</strong> per node. Hardware $380 + geographic license $1,620, as stated at checkout. Taxes, duties, or import charges may be billed separately.</div></div>
                <div className="row"><div className="k">Accepted methods</div><div className="v">Credit / debit cards · Wire transfers · Digital assets or stablecoins where supported · Third-party payment providers.</div></div>
                <div className="row"><div className="k">Digital asset notes</div><div className="v">Transaction finality is irreversible. Exchange rates may fluctuate. You are responsible for gas fees and transaction accuracy.</div></div>
              </div>
              <p>Mālama reserves the right to cancel orders for pricing errors, limit quantities, and reject suspicious or high-risk transactions.</p>
            </div>
          </section>

          <section className="clause" id="s4">
            <div className="clause-head"><span className="num">§ 04</span><h2>Order acceptance and cancellation</h2><a className="anchor" href="#s4">#s4</a></div>
            <div className="clause-body">
              <p>Your order is not final until accepted by Mālama. We may cancel or refuse any order due to inventory limitations, suspected fraud, regulatory concerns, pricing or listing errors, or logistical constraints. If we cancel after payment, we will refund the amount paid using the original payment method where possible.</p>
            </div>
          </section>

          <section className="clause" id="s5">
            <div className="clause-head"><span className="num">§ 05</span><h2>Delivery and fulfillment</h2><a className="anchor" href="#s5">#s5</a></div>
            <div className="clause-body">
              <p>Estimated shipping is <strong>end of December 2026</strong>. This is a non-binding estimate subject to change. Delays may occur due to manufacturing, logistics, customs, or regulatory issues. Partial shipments may occur and fulfillment partners may be used.</p>
              <p>You are responsible for providing accurate shipping details, import duties, customs clearance, local compliance, and receiving the shipment. Unless otherwise required by law, <strong>risk of loss transfers upon delivery to the carrier.</strong></p>
            </div>
          </section>

          <section className="clause" id="s6">
            <div className="clause-head"><span className="num">§ 06</span><h2>Protocol parameters (incorporated by reference)</h2><a className="anchor" href="#s6">#s6</a></div>
            <div className="clause-body">
              <p>Genesis 200 Hex Node Licenses (&ldquo;Licenses&rdquo;) are issued subject to the parameters published in the <strong>Mālama Protocol Whitepaper v2.0</strong> (the &ldquo;Whitepaper&rdquo;). The following protocol parameters are expressly incorporated into this Agreement as of the Last Updated date above.</p>

              <div className="callout accent">
                <span className="tag">● Notice · Material whitepaper amendments</span>
                <p>The Whitepaper is incorporated by reference. Mālama will provide written notice to all registered License holders of any material amendment to parameters that affect operator economic rights or deployment obligations. Including changes to the Hex Type or Data Demand Score multipliers, the 25M Genesis pool sizing, or uptime requirements. At least <strong>thirty (30) days</strong> before such amendments take effect.</p>
                <p>This notice obligation does not apply to governance updates made through the veMLMA process described in the Whitepaper, for which operators may participate directly as token holders.</p>
              </div>

              <h3>Mutable protocol parameters</h3>

              <div className="spec-list">
                <div className="row">
                  <div className="k">Genesis supply</div>
                  <div className="v">Two hundred (<strong>200</strong>) total Genesis Licenses. <strong>195</strong> Licenses available for external sale. <strong>5</strong> Licenses reserved for Mālama Labs team and production use (Dallas / DFW area). Each License is represented as an NFT-HEX geographic rights object on Cardano (CIP-68) and Base (ERC-721) via cross-chain state synchronization. <strong>One License per geographic hex cell</strong>. A single License conveys rights on both chains, not a separate License per chain.<span className="pill mutable">● Mutable</span></div>
                </div>
                <div className="row">
                  <div className="k">Hex exclusivity</div>
                  <div className="v">Each License conveys the exclusive right to operate a Hex Node within one <strong>H3 resolution-7</strong> hex cell. No more than one active License may be issued per hex cell globally across all chains.<span className="pill mutable">● Mutable</span></div>
                </div>
                <div className="row">
                  <div className="k">MLMA allocation</div>
                  <div className="v"><strong>125,000 MLMA</strong> per License, milestone-vested across five tranches: <strong>15%</strong> (18,750 MLMA) at boot upon deployment registration, KYB, and first signed reading. <strong>15%</strong> (18,750 MLMA) at PONO 90-day qualification. <strong>20%</strong> (25,000 MLMA) at the 6-month milestone. <strong>20%</strong> (25,000 MLMA) at the 9-month milestone. <strong>30%</strong> (37,500 MLMA) at the 12-month milestone. Milestones require continuous PONO qualification, ≥99% uptime, and no tamper events. <em>Tokens are not vested at purchase. They are earned against operational milestones beginning at hardware boot. Validation compensation depends on network conditions and is not guaranteed.</em><span className="pill mutable">● Mutable</span></div>
                </div>
                <div className="row">
                  <div className="k">Genesis multiplier</div>
                  <div className="v">Genesis 200 operators receive a <strong>1.5× Genesis Multiplier (GX)</strong> applied to their validation reward formula for <strong>Year 1 only</strong> (twelve months from network emissions commencement). The Genesis Multiplier expires permanently at the end of Year 1. It is a bootstrapping incentive, not a permanent feature of the reward formula.<span className="pill mutable">● Mutable</span></div>
                </div>
              </div>

              <h3>Reward formula</h3>
              <p>Genesis 200 MLMA rewards follow the ratified Genesis Pricing v1.0 model in the Whitepaper. Each operator&rsquo;s eligibility is a fixed base scaled by three bounded multipliers, then normalized across the cohort to the 25M Genesis pool:</p>

              <div className="formula">
                <div className="tag">GENESIS 200 REWARD · GENESIS PRICING v1.0</div>
                <div className="eq">
                  <span className="lhs">Eligibility</span><span className="op">=</span>125,000<span className="op">×</span>Genesis<span className="op">×</span>HexType<span className="op">×</span>DDS
                </div>
                <div className="vars">
                  <div className="var"><span className="sym">125,000</span><span>Base allocation per operator (MLMA).</span></div>
                  <div className="var"><span className="sym">Genesis</span><span>Genesis Year 1 multiplier · 1.5× in Year 1 only.</span></div>
                  <div className="var"><span className="sym">HexType</span><span>Hex Type multiplier · 0.95× to 1.30× (Urban Core, Urban, Suburban, Rural, Remote).</span></div>
                  <div className="var"><span className="sym">DDS</span><span>Data Demand Score multiplier · 0.70× to 1.30× (0.70 + DDS × 0.006).</span></div>
                  <div className="var"><span className="sym">Final</span><span>Final Earned = Eligibility × (25,000,000 / total cohort eligibility), cohort-normalized to the 25M Genesis pool.</span></div>
                </div>
              </div>
              <p>Rewards are <strong>relative and cohort-normalized, not fixed</strong>, and vest on the 15 / 15 / 20 / 20 / 30 milestone schedule over twelve months. There is <strong>no emission-pool draw and no geographic 0.5× to 3.0× multiplier</strong>. Separately, USDC validator fees are paid to operators on an ongoing basis, outside the 25M cap. Mālama does not guarantee any particular dollar or token return.</p>

              <h3>Emission schedule</h3>
              <div className="spec-list">
                <div className="row"><div className="k">Year 1</div><div className="v"><strong>12.0M MLMA</strong> · 1.000M / month.</div></div>
                <div className="row"><div className="k">Year 2</div><div className="v"><strong>14.0M MLMA</strong> · 1.167M / month.</div></div>
                <div className="row"><div className="k">Year 3</div><div className="v"><strong>12.0M MLMA</strong> · 1.000M / month.</div></div>
                <div className="row"><div className="k">Year 4</div><div className="v"><strong>9.0M MLMA</strong> · 0.750M / month.</div></div>
                <div className="row"><div className="k">Year 5</div><div className="v"><strong>6.0M MLMA</strong> · 0.500M / month.</div></div>
                <div className="row"><div className="k">Year 6</div><div className="v"><strong>4.0M MLMA</strong> · 0.333M / month.</div></div>
                <div className="row"><div className="k">Year 7</div><div className="v"><strong>2.0M MLMA</strong> · 0.167M / month.</div></div>
                <div className="row"><div className="k">Year 8</div><div className="v"><strong>1.0M MLMA</strong> · 0.083M / month.</div></div>
                <div className="row"><div className="k">Year 9+</div><div className="v"><strong>Zero emissions.</strong> All operator distributions funded by protocol revenue.</div></div>
              </div>
              <p>Emissions commence following Genesis Hex Sale audit clearance, not automatically at a calendar date.</p>

              <h3>Audit gate before emissions</h3>
              <div className="callout warn">
                <span className="tag">▲ Audit · Rewards begin only after audit clearance</span>
                <p>MLMA validation rewards <strong>do not begin automatically at hardware boot or at a fixed calendar date.</strong> They begin following an independent audit of the Genesis Hex Sale confirming that deployed nodes are operational, compliant, and properly registered. The audit is conducted in <strong>early 2027</strong>.</p>
                <p>Nodes that do not pass the audit are notified and supported through remediation. <strong>Vesting of the 125,000 MLMA allocation is not affected by audit status. Only validation rewards are withheld until compliance is confirmed.</strong></p>
              </div>

              <h3>Uptime requirement</h3>
              <p>Active operators must maintain at least <strong>90% uptime</strong> measured over any rolling 30-day window. Nodes below 90% uptime for an epoch earn zero validation rewards for that period. Nodes offline for <strong>90 or more consecutive days</strong> without prior written notification to Mālama are subject to License suspension review under protocol rules.</p>

              <h3>Deployment window</h3>
              <div className="callout warn">
                <span className="tag">▲ 90-day deployment window · Forfeiture clause</span>
                <p>Customer must install, power on, and register their Hex Node using the Mālama dApp within <strong>ninety (90) days of hardware delivery</strong> to the shipping address provided at checkout. The 90-day window begins <em>at hardware delivery</em>, not at reservation.</p>
                <p>Licenses not activated within this window, <strong>and any unvested MLMA allocation associated with them, are automatically forfeited</strong> to the Mālama protocol treasury without refund.</p>
                <p>The 90-day window may be extended in Mālama&rsquo;s sole discretion on written request prior to expiration, for reasons such as verified shipping delay, permitting, or force majeure.</p>
              </div>

              <h3>Relocation</h3>
              <p>Hex Nodes may not be physically relocated outside the H3 hex cell claimed under the License. Relocation invalidates the historical data baseline for that cell and may result in reputation slashing or License suspension under protocol rules. <strong>Contact support before any relocation attempt.</strong></p>

              <h3>Governance updates</h3>
              <p>Hex Type and Data Demand Score multiplier coefficients, the Genesis pool sizing, and methodology approvals may be modified through veMLMA governance processes described in the Whitepaper. Operators holding MLMA with a valid PONO credential may participate in governance votes on these parameters.</p>

              <h3>Immutable protocol parameters</h3>
              <p>The following parameters are <strong>immutable and cannot be modified through governance.</strong> Changes to immutable parameters would require a new smart contract deployment and separate Customer consent.</p>

              <div className="spec-list">
                <div className="row">
                  <div className="k">500M MLMA hard cap</div>
                  <div className="v">The MLMA token has a hard supply cap of <strong>500,000,000</strong>, enforced on-chain. No governance action can increase the total supply beyond this figure. <span className="pill immutable">▲ Immutable</span></div>
                </div>
                <div className="row">
                  <div className="k">Fixed 8-year emission schedule</div>
                  <div className="v">Scheduled emissions follow a fixed 8-year smooth taper (60M MLMA total: 12 / 14 / 12 / 9 / 6 / 4 / 2 / 1M), winding down to zero after Year 8. No governance action can extend or alter the emission schedule. <strong>Operation is revenue-funded thereafter.</strong> <span className="pill immutable">▲ Immutable</span></div>
                </div>
                <div className="row">
                  <div className="k">Genesis 200 supply</div>
                  <div className="v">Two hundred (200) total Genesis Licenses: 195 external sale + 5 team / production. <strong>No additional Genesis Licenses can be issued.</strong> <span className="pill immutable">▲ Immutable</span></div>
                </div>
                <div className="row">
                  <div className="k">Hex exclusivity</div>
                  <div className="v">One active License per H3 hex cell. No governance action can change the one-license-per-hex constraint. <span className="pill immutable">▲ Immutable</span></div>
                </div>
              </div>

              <h3>NFT-HEX license scope</h3>
              <p>The NFT-HEX Hex Node License evidences a <strong>revocable, non-exclusive</strong> (as between Customer and Mālama, but <strong>exclusive as to the claimed hex cell</strong> against other network participants) license to operate a Hex Node within the claimed hex cell for so long as the Customer remains in compliance with this Agreement and the Whitepaper.</p>

              <p>The License NFT <strong>does not</strong> convey:</p>
              <ul className="neg-list">
                <li>Real property rights in the geographic area represented by the hex cell.</li>
                <li>Equity, membership, or partnership interests in Mālama Labs Inc.</li>
                <li>A claim on Mālama Labs&rsquo; revenue or profits.</li>
                <li>A guaranteed allocation of MLMA tokens independent of deployment, uptime, and performance.</li>
              </ul>

              <p>License NFTs are transferable. The transferee inherits all obligations under this Agreement including deployment timing (<strong>the 90-day window does not reset on transfer</strong>), uptime requirements, and forfeiture provisions. The transferee&rsquo;s vesting schedule runs from the original hardware boot date, not from the transfer date.</p>
            </div>
          </section>

          <section className="clause" id="s6a">
            <div className="clause-head"><span className="num">§ 6A</span><h2>Hardware specifications and changes</h2><a className="anchor" href="#s6a">#s6a</a></div>
            <div className="clause-body">
              <p>Hex Nodes are evolving technical products. Mālama reserves the right to update specifications, change components, improve performance, and modify firmware or software requirements, provided the core intended function. <strong>validation of SaveCards and compute packets on the Mālama network</strong>. Is materially preserved.</p>
              <p>Images, diagrams, and marketing materials are illustrative and may not reflect final production units. The <strong>ATECC608B secure element</strong> and <strong>Device DID provisioning</strong> are confirmed components of the production design.</p>
            </div>
          </section>

          <section className="clause" id="s7">
            <div className="clause-head"><span className="num">§ 07</span><h2>Returns, refunds, and cancellations</h2><a className="anchor" href="#s7">#s7</a></div>
            <div className="clause-body">
              <h3>Preorders</h3>
              <p>Refund eligibility for preorders depends on the policy stated at checkout. Generally: a refund window may apply <strong>prior to production allocation lock</strong>; after that window, deposits may become non-refundable as manufacturing has commenced.</p>
              <h3>Delivered nodes</h3>
              <p>Unless required by applicable law or explicitly stated otherwise: <strong>hardware sales are final after shipment</strong>, and returns are not accepted for deployed or activated nodes. If a return is allowed, the product must be unused and in original condition, return shipping may be at your cost, and restocking fees may apply.</p>
              <h3>Payment disputes</h3>
              <p>You must notify us of billing disputes within <strong>30 days</strong> of the charge.</p>
            </div>
          </section>

          <section className="clause" id="s8">
            <div className="clause-head"><span className="num">§ 08</span><h2>Limited hardware warranty</h2><a className="anchor" href="#s8">#s8</a></div>
            <div className="clause-body">
              <p>If provided, a separate written hardware warranty will apply to physical defects in materials or workmanship for a defined period from the date of delivery. Unless otherwise stated, the warranty does not cover misuse, improper installation, environmental damage, unauthorized modification, firmware tampering, or normal wear. Warranty remedies may include repair, replacement, or equivalent substitution at Mālama&rsquo;s election.</p>
              <p><strong>Except for any express written warranty, hardware is provided &ldquo;as is.&rdquo;</strong></p>
            </div>
          </section>

          <section className="clause" id="s9">
            <div className="clause-head"><span className="num">§ 09</span><h2>Node activation and network participation</h2><a className="anchor" href="#s9">#s9</a></div>
            <div className="clause-body">
              <p>Purchase of a Hex Node does not automatically guarantee activation, connectivity, eligibility for network participation, or generation of Rewards. Activation requires:</p>
              <ul>
                <li>Account setup.</li>
                <li>dApp registration.</li>
                <li>Hardware boot.</li>
                <li>Device DID binding to your NFT-HEX.</li>
                <li>Audit clearance as described in Section 6.</li>
              </ul>
              <p>You are responsible for proper installation and operation, maintaining connectivity and power, maintaining at least 90% uptime, and compliance with applicable laws and permits.</p>
            </div>
          </section>

          <section className="clause" id="s10">
            <div className="clause-head"><span className="num">§ 10</span><h2>No guarantee of rewards or earnings</h2><a className="anchor" href="#s10">#s10</a></div>
            <div className="clause-body">
              <div className="callout warn">
                <span className="tag">▲ Technical infrastructure · Not a financial product</span>
                <p>A Hex Node is technical infrastructure, not a financial product. <strong>There is no guarantee of Rewards, Tokens, or earnings.</strong> Reward mechanisms may change or be discontinued through governance processes.</p>
              </div>
              <p>Validation rewards depend on network conditions, data volume in your hex zone, your Hex Type, your hex&rsquo;s Data Demand Score, your uptime and PONO standing, the cohort composition, and MLMA market conditions. All of which vary and are outside Mālama&rsquo;s control or guarantee.</p>
              <p>Year 1 Genesis phase reward levels are a deliberately <strong>front-loaded bootstrapping mechanism</strong>. They are not indicative of steady-state returns. Emissions follow a fixed 8-year smooth taper (60M MLMA total: 12 / 14 / 12 / 9 / 6 / 4 / 2 / 1M), winding down to zero after Year 8. Nothing in this Agreement constitutes an investment contract, a promise of profit, or financial advice.</p>
            </div>
          </section>

          <section className="clause" id="s11">
            <div className="clause-head"><span className="num">§ 11</span><h2>Tokens, wallets, and blockchain risk</h2><a className="anchor" href="#s11">#s11</a></div>
            <div className="clause-body">
              <p>If your node interacts with blockchain systems, including Cardano and Base:</p>
              <ul>
                <li>You are solely responsible for managing your wallet and private keys.</li>
                <li>Blockchain transactions are irreversible.</li>
                <li>On-chain data. Including your NFT-HEX geographic assignment. Is public and permanent.</li>
                <li>Token values may fluctuate dramatically and may reach zero.</li>
              </ul>
              <p>Mālama is not responsible for lost keys, incorrect transactions, wallet compromise, or third-party wallet failures. MLMA is classified as a digital tool under the March 17, 2026 SEC-CFTC Joint Interpretation (S7-2026-09): an asset used to perform a function in the network, not held as an investment instrument. This classification is preliminary, subject to ongoing legal review by qualified securities counsel, and varies by jurisdiction. <strong>You are solely responsible for determining whether participation is lawful in your jurisdiction before reserving a node.</strong></p>
            </div>
          </section>

          <section className="clause" id="s12">
            <div className="clause-head"><span className="num">§ 12</span><h2>Compliance with laws</h2><a className="anchor" href="#s12">#s12</a></div>
            <div className="clause-body">
              <p>You are responsible for ensuring that purchase, import, and use of the Hex Node is legal in your jurisdiction, and that you comply with all applicable laws including:</p>
              <ul>
                <li>Export controls and sanctions requirements.</li>
                <li>Telecommunications and radio frequency regulations.</li>
                <li>Environmental monitoring and data collection laws.</li>
                <li>Land use, permitting, and property access requirements.</li>
                <li>Token or digital asset regulations applicable to you.</li>
              </ul>
              <p>Mālama may restrict delivery or activation in certain jurisdictions at its discretion.</p>
            </div>
          </section>

          <section className="clause" id="s13">
            <div className="clause-head"><span className="num">§ 13</span><h2>Limitation of liability</h2><a className="anchor" href="#s13">#s13</a></div>
            <div className="clause-body">
              <div className="callout warn">
                <span className="tag">▲ Notice · Read carefully</span>
                <p className="legalese"><span className="caps">To the fullest extent permitted by law,</span> Mālama is not liable for indirect, incidental, or consequential damages arising from your purchase, receipt, or operation of a Hex Node, including loss of profits, data, tokens, expected returns, or network participation.</p>
              </div>
              <p>Total liability to you for any claim arising under this Agreement is limited to the amount you paid to Mālama for the specific node giving rise to the claim.</p>
              <p>This limitation <strong>supplements, and does not supersede,</strong> the limitations and carve-outs in the Mālama <Link href="/legal/terms#s17" style={{ color: 'var(--mlma-accent)' }}>Terms and Conditions</Link>.</p>
            </div>
          </section>

          <section className="clause" id="s14">
            <div className="clause-head"><span className="num">§ 14</span><h2>Indemnification</h2><a className="anchor" href="#s14">#s14</a></div>
            <div className="clause-body">
              <p>You agree to defend, indemnify, and hold harmless Mālama and its affiliates, officers, directors, employees, contractors, licensors, and agents from and against any claims, damages, liabilities, costs, and expenses. Including reasonable attorneys&rsquo; fees. Arising out of or related to your purchase, use, or operation of the Hex Node, your violation of applicable law or third-party rights, your misuse of data, tokens, or network systems, or your breach of this Agreement.</p>
            </div>
          </section>

          <section className="clause" id="s15">
            <div className="clause-head"><span className="num">§ 15</span><h2>Force majeure</h2><a className="anchor" href="#s15">#s15</a></div>
            <div className="clause-body">
              <p>Mālama is not liable for delays or failure to perform due to circumstances beyond its reasonable control, including supply chain disruption, semiconductor shortages, natural disasters, acts of government, regulatory changes, war, pandemic, or infrastructure failures. In such events, Mālama will notify affected customers and, where feasible, provide updated delivery estimates or refund options.</p>
            </div>
          </section>

          <section className="clause" id="s16">
            <div className="clause-head"><span className="num">§ 16</span><h2>Termination</h2><a className="anchor" href="#s16">#s16</a></div>
            <div className="clause-body">
              <p>Mālama may cancel or suspend orders or activation if you violate this Agreement or the Platform Terms, if required by applicable law, or if necessary to protect the integrity of the network. Termination does not automatically entitle you to a refund unless required by applicable law or expressly stated in Section 7.</p>
            </div>
          </section>

          <section className="clause" id="s17">
            <div className="clause-head"><span className="num">§ 17</span><h2>Governing law and disputes</h2><a className="anchor" href="#s17">#s17</a></div>
            <div className="clause-body">
              <p>This Agreement is governed by the laws of the State of Delaware, without regard to conflict of laws principles, as further specified in the Mālama Terms and Conditions. Disputes arising under this Agreement will be resolved in accordance with the arbitration provisions in the Terms and Conditions, including the <Link href="/legal/terms#s22" style={{ color: 'var(--mlma-accent)' }}><strong>30-day opt-out right</strong></Link> described therein.</p>
            </div>
          </section>

          <section className="clause" id="s18">
            <div className="clause-head"><span className="num">§ 18</span><h2>Entire agreement</h2><a className="anchor" href="#s18">#s18</a></div>
            <div className="clause-body">
              <p>This Agreement, together with the Mālama <Link href="/legal/terms" style={{ color: 'var(--mlma-accent)' }}>Terms and Conditions</Link>, <Link href="/legal/privacy" style={{ color: 'var(--mlma-accent)' }}>Privacy Policy</Link>, and any checkout-specific terms, constitutes the entire agreement between the parties regarding the Hex Node purchase and supersedes all prior representations, discussions, and proposals. <strong>No modification of this Agreement is binding unless in writing and signed by an authorized representative of Mālama.</strong></p>
            </div>
          </section>

          <section className="clause" id="contact" style={{ borderBottom: 'none' }}>
            <div className="clause-head"><span className="num">CONTACT</span><h2>Get in touch</h2><a className="anchor" href="#contact">#contact</a></div>
            <div className="clause-body">
              <p>Questions about this Agreement or your Genesis 200 reservation can be directed to the contacts below.</p>
              <div className="contact-block">
                <div className="cell"><div className="k">Registered address</div><div className="v">Mālama Labs Inc.<br/>8 The Green, Suite A<br/>Dover, Delaware 19901</div></div>
                <div className="cell"><div className="k">Legal email</div><div className="v"><a href="mailto:legal@malamalabs.com">legal@malamalabs.com</a></div></div>
                <div className="cell"><div className="k">Website</div><div className="v"><a href="https://malamalabs.com">malamalabs.com</a></div></div>
                <div className="cell"><div className="k">Related documents</div><div className="v"><Link href="/legal/terms">Terms &amp; Conditions</Link> · <Link href="/legal/privacy">Privacy Policy</Link></div></div>
              </div>

              <div className="sig-strip">
                <div className="label">- END OF DOCUMENT</div>
                <p className="text">Mālama Labs, Inc. · Hex Node Purchase &amp; Preorder Agreement · Effective April 11, 2026 · Last Updated April 28, 2026 (v2)</p>
                <p className="footnote">This Agreement does not constitute investment advice or a guarantee of rewards. Beneficial Technology legal review required before external publication.</p>
              </div>
            </div>
          </section>
        </article>
      </main>
    </LegalPageShell>
  )
}
