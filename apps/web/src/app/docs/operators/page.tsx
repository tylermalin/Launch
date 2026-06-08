import type { Metadata } from 'next'
import Link from 'next/link'
import '../docs-hub.css'
import DocsPageShell from '../_shared/DocsPageShell'

export const metadata: Metadata = {
  title: 'Operator Guide · Mālama Labs',
  description:
    'Genesis 200 Operator Guide. Deployment, hardware bill of materials, node operation, PONO qualification, support and FAQ. Companion to shipped hardware runbooks.',
}

export default function OperatorsPage() {
  return (
    <DocsPageShell
      current="operators"
      docNumber="DOCS · 04"
      eyebrowText="Genesis 200 · Operator guide"
      titleLead="Operator"
      titleEmphasis="Guide."
      lede="Deploy, connect, and steward your Hex Node through the Genesis phase and the four operational milestones that vest 85% of your MLMA allocation. Onboarding checklist, hardware specs, node operation, PONO qualification, and support channels."
      metaRows={[
        { k: 'Setup time', v: '~30 minutes' },
        { k: 'Uptime target', v: '99.0%+', accent: true },
        { k: 'Readings / 30 days', v: '1,000+ signed' },
        { k: 'Anchor participation', v: '95%+' },
        { k: 'PONO qualifying', v: '90 days' },
        { k: 'Support', v: 'Discord · email' },
      ]}
    >
      <main className="layout layout--with-toc">
        <aside className="toc" aria-label="Table of contents">
          <div className="toc-label"><span>Contents</span><span className="count">5 sections</span></div>
          <ol>
            <li><a href="#nav"><span className="n">00</span><span className="t">Quick navigation</span></a></li>
            <li><a href="#deploy"><span className="n">A</span><span className="t">Deployment</span></a></li>
            <li><a href="#hw"><span className="n">B</span><span className="t">Hardware</span></a></li>
            <li><a href="#ops"><span className="n">C</span><span className="t">Node operation</span></a></li>
            <li><a href="#pono"><span className="n">D</span><span className="t">PONO qualification</span></a></li>
            <li><a href="#support"><span className="n">E</span><span className="t">Support &amp; FAQ</span></a></li>
          </ol>
          <div className="toc-actions">
            <Link className="btn" href="/docs/phase-1-timeline"><span>← Prev · Timeline</span><span></span></Link>
            <a className="btn" href="https://discord.gg/PcKRRUcJ" target="_blank" rel="noopener noreferrer"><span>Join Discord</span><span>↗</span></a>
          </div>
        </aside>

        <article className="content">
          <div className="preamble">
            <p>Welcome to the Genesis 200 node stack. By operating this hardware you anchor a geographic hex zone on the Mālama validation network. This guide is the companion to the runbooks that ship with your kit.</p>
          </div>

          <section className="clause" id="nav">
            <div className="clause-head"><span className="num">§ 00</span><h2>Quick navigation</h2><a className="anchor" href="#nav">#nav</a></div>
            <div className="clause-body">
              <table className="matrix">
                <thead><tr><th>Section</th><th>What&rsquo;s covered</th></tr></thead>
                <tbody>
                  <tr><td><a href="#deploy" style={{ color: 'var(--mlma-accent)' }}>A · Deployment</a></td><td>Step-by-step setup from unboxing to first validation</td></tr>
                  <tr><td><a href="#hw" style={{ color: 'var(--mlma-accent)' }}>B · Hardware</a></td><td>Bill of materials, technical minimums, Device DID identity</td></tr>
                  <tr><td><a href="#ops" style={{ color: 'var(--mlma-accent)' }}>C · Node Operation</a></td><td>Data pipeline, audit, slashing, multi-vendor silicon</td></tr>
                  <tr><td><a href="#pono" style={{ color: 'var(--mlma-accent)' }}>D · PONO Qualification</a></td><td>KYB requirements, operational thresholds, qualifying period</td></tr>
                  <tr><td><a href="#support" style={{ color: 'var(--mlma-accent)' }}>E · Support &amp; FAQ</a></td><td>Channels, escalation, common questions</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="clause" id="deploy">
            <div className="clause-head"><span className="num">§ A</span><h2>Deployment</h2><a className="anchor" href="#deploy">#deploy</a></div>
            <div className="clause-body">
              <h3>Pre-arrival checklist</h3>
              <p>Before hardware arrives, prepare:</p>
              <ul>
                <li><strong>Deployment site.</strong> Reliable power, physical security, stable internet. Clear sky view if using the solar option.</li>
                <li><strong>Network plan.</strong> Ethernet preferred over Wi-Fi. Keep packet loss low for validation windows.</li>
                <li><strong>Wallet.</strong> Cardano or Base wallet ready, with the Device DID registration flow in the Mālama dApp tested.</li>
                <li><strong>KYB documentation.</strong> Legal entity verification documents, UBO disclosure, sanctions-screening-ready (required for PONO qualification at day 90).</li>
                <li><strong>Reservation confirmation.</strong> Your reservation ID and hex zone ID accessible.</li>
              </ul>

              <h3>On-arrival checklist</h3>
              <p>Progress saves in your browser.</p>
              <ol style={{ paddingLeft: 20, fontSize: 15.5, lineHeight: 1.7, color: 'var(--mlma-ink-dim)', marginBottom: 16 }}>
                <li><strong style={{ color: 'var(--mlma-ink)' }}>Inspect hardware on arrival.</strong> Verify NEMA 4X enclosure seals before any field exposure. Check the full BOM against the packing list. Confirm device certificate card is included.</li>
                <li><strong style={{ color: 'var(--mlma-ink)' }}>Mount the hardware.</strong> Install using the included mounts. Most setups complete in under 30 minutes. Keep the sensor array exposed to open air for accurate atmospheric readings.</li>
                <li><strong style={{ color: 'var(--mlma-ink)' }}>Power on and wait for device boot.</strong> The secure element provisions its Device DID on first boot, approximately 60 seconds. The status LED sequence confirms successful provisioning.</li>
                <li><strong style={{ color: 'var(--mlma-ink)' }}>Register via the Mālama dApp.</strong> Connect your Base or Cardano wallet. Enter your node&rsquo;s Device DID. This binds your hardware identity to your NFT-HEX geographic assignment and triggers the boot tranche unlock (18,750 MLMA, 15%).</li>
                <li><strong style={{ color: 'var(--mlma-ink)' }}>Confirm network connectivity.</strong> The dApp dashboard shows live status: online or offline, last heartbeat timestamp, validation queue. First SaveCard production should appear within 15 to 30 minutes of successful registration.</li>
                <li><strong style={{ color: 'var(--mlma-ink)' }}>Await Genesis audit clearance.</strong> Validation distributions begin after the Genesis Hex Sale audit confirms your node is operational and compliant. Audit takes place in early 2027.</li>
                <li><strong style={{ color: 'var(--mlma-ink)' }}>Begin the 90-day PONO qualifying period.</strong> From successful boot, you have 90 days of continuous operation to qualify for PONO. See Section D below.</li>
              </ol>

              <h3>Field notes</h3>
              <ul>
                <li>Use extension cables if the enclosure must sit in partial shade. <strong>Prioritize panel exposure over enclosure placement convenience.</strong></li>
                <li>Verify gasket seals before the first storm season. NEMA-rated housing protects electronics but does not protect sensor calibration if moisture reaches the probe assembly.</li>
                <li>Ethernet preferred. Wi-Fi bridge acceptable if packet loss stays consistently below the validation window threshold.</li>
                <li>Nodes offline for <strong>30 consecutive days during the qualifying period restart the 90-day clock</strong>. Nodes offline for 90+ consecutive days post-PONO trigger revocation review.</li>
              </ul>
            </div>
          </section>

          <section className="clause" id="hw">
            <div className="clause-head"><span className="num">§ B</span><h2>Hardware</h2><a className="anchor" href="#hw">#hw</a></div>
            <div className="clause-body">
              <h3>Bill of materials</h3>
              <table className="matrix">
                <thead><tr><th>Component</th><th>Specification</th><th>Role</th></tr></thead>
                <tbody>
                  <tr><td>Compute</td><td>Raspberry Pi Zero 2W</td><td>Edge processing, LoRaWAN uplink coordination</td></tr>
                  <tr><td>Secure element</td><td>ATECC608B-TFLXTLS (Microchip, primary)</td><td>ECDSA P-256 signing, non-exportable key, Device DID provisioning</td></tr>
                  <tr><td>Cellular uplink</td><td>Waveshare SIM7600G LTE HAT</td><td>Primary network connectivity, GPS timestamp</td></tr>
                  <tr><td>Soil sensing</td><td>RS485 7-in-1 probe</td><td>Moisture, electrical conductivity, temperature, pH (depth-dependent)</td></tr>
                  <tr><td>Atmospheric</td><td>BME280</td><td>Temperature, humidity, barometric pressure</td></tr>
                  <tr><td>Enclosure</td><td>NEMA 4X IP67</td><td>Field weatherproofing. Verify seal on arrival.</td></tr>
                  <tr><td>Power</td><td>Solar panel + UPS battery</td><td>7-day autonomy at nominal load. Grid power preferred if available.</td></tr>
                </tbody>
              </table>

              <h3>Multi-vendor silicon strategy</h3>
              <p>The protocol is silicon-agnostic. SaveCards are valid if signed by any whitelisted hardware root. The whitelist is governed by the DAO. Qualified alternatives:</p>
              <table className="matrix">
                <thead><tr><th>Silicon</th><th>Vendor</th><th>Status</th></tr></thead>
                <tbody>
                  <tr><td>ATECC608B</td><td>Microchip</td><td><span className="accent">Primary, deployed in Genesis 200</span></td></tr>
                  <tr><td>ATECC608A</td><td>Microchip</td><td>Drop-in compatible, secondary supply path</td></tr>
                  <tr><td>TA100</td><td>Microchip</td><td>Larger memory, planned for Genesis 400</td></tr>
                  <tr><td>SE050</td><td>NXP Semiconductors</td><td>Qualified alternative</td></tr>
                  <tr><td>OPTIGA Trust M</td><td>Infineon Technologies</td><td>Qualified alternative</td></tr>
                  <tr><td>STSAFE-A110</td><td>STMicroelectronics</td><td>Qualified alternative</td></tr>
                  <tr><td>DS28E38</td><td>Analog Devices</td><td>Qualified alternative, strong tamper detection</td></tr>
                </tbody>
              </table>
              <p>Multi-vendor qualification means a single-vendor supply disruption does not halt operator onboarding. Foundation maintains <strong>12-month silicon inventory bond</strong> for production continuity.</p>

              <h3>Technical minimums</h3>
              <table className="matrix">
                <thead><tr><th>Parameter</th><th>Minimum</th><th>Recommended</th></tr></thead>
                <tbody>
                  <tr><td>Network uptime</td><td>99.0% (for PONO eligibility)</td><td>99.9%+ for the 1.5× uptime multiplier</td></tr>
                  <tr><td>Reading volume</td><td>1,000 valid signed readings / 30 days</td><td>Higher volume scales validation contribution</td></tr>
                  <tr><td>Anchor participation</td><td>95% of monthly Merkle anchors</td><td>Maintained automatically by hardware</td></tr>
                  <tr><td>Geographic coherence</td><td>100% within declared hex boundary</td><td>Verified per reading via GPS timestamp</td></tr>
                  <tr><td>Internet connection</td><td>100 Mbps up/down</td><td>1 Gbps for low-latency validation windows</td></tr>
                </tbody>
              </table>

              <h3>The Device DID</h3>
              <p>Your node&rsquo;s identity is its Device DID, derived from the secure element provisioned at manufacture. <strong>The private key is non-exportable.</strong> It exists only in that specific chip. Every SaveCard your node produces is signed by this key.</p>
              <p>The Device DID is displayed on the node screen during first boot and printed on your included device certificate card. You need it for dApp registration.</p>

              <div className="callout warn">
                <span className="tag">▲ Do not confuse Device DID with wallet address</span>
                <p>They are separate identities:</p>
              </div>
              <table className="matrix">
                <thead><tr><th>Identity</th><th>Purpose</th><th>Where it lives</th></tr></thead>
                <tbody>
                  <tr><td>Wallet address</td><td>Receives MLMA distributions, holds NFT-HEX</td><td>Your chosen wallet (Base or Cardano)</td></tr>
                  <tr><td>Device DID</td><td>Proves origin of every SaveCard your node signs</td><td>Permanently bound to your specific secure element</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="clause" id="ops">
            <div className="clause-head"><span className="num">§ C</span><h2>Node operation</h2><a className="anchor" href="#ops">#ops</a></div>
            <div className="clause-body">
              <h3>What your node produces</h3>
              <div className="callout accent">
                <span className="tag">● Validation node · not a sensor</span>
                <p>Your Genesis 200 Hex Node is a <strong>validation node, not a sensor</strong>. It validates SaveCards and compute packets produced by enterprise sensor deployments in your hex zone and across the network. You do not need to own sensors to operate a validation node.</p>
              </div>

              <p>The data your node validates flows through this pipeline:</p>
              <ol style={{ paddingLeft: 20, fontSize: 15.5, lineHeight: 1.7, color: 'var(--mlma-ink-dim)', marginBottom: 16 }}>
                <li><strong style={{ color: 'var(--mlma-ink)' }}>Sensor produces signed reading.</strong> An enterprise sensor (ERW site, biochar kiln, AI data center rack) produces a hardware-signed reading. ECDSA-signed at the source before transmission.</li>
                <li><strong style={{ color: 'var(--mlma-ink)' }}>Data broadcasts to the Hex Node network.</strong> Verified data is broadcast to the validator network. Your node receives data assigned to your hex zone or allocated via fallback routing.</li>
                <li><strong style={{ color: 'var(--mlma-ink)' }}>Your node performs decentralized audit.</strong> Your node participates in Proof-of-Truth consensus: validating the cryptographic signature, cross-checking against neighboring validators, and contributing to the consensus outcome for the data packet.</li>
                <li><strong style={{ color: 'var(--mlma-ink)' }}>Validated data becomes a SaveCard.</strong> Once consensus is reached, data is anchored to Cardano via CIP-25 / CIP-68 as a SaveCard. For carbon: feeds LCO₂ pre-finance and VCO₂ credit conversion. For AI compute: produces a hardware-verified Scope 2 disclosure record.</li>
              </ol>

              <h3>Genesis Hex Sale audit</h3>
              <p>MLMA validation distributions do not begin automatically at a calendar date. They begin after the audit confirms your node is operational, compliant, and properly registered. The audit takes place in <strong>early 2027</strong>.</p>
              <ul>
                <li>Nodes that pass receive full Year 1 Genesis multiplier benefits (1.5×) from the clearance date.</li>
                <li>Nodes that do not yet pass are notified with specific remediation steps.</li>
                <li>The boot tranche (15%) is not affected by audit status. Only validation distributions are withheld until compliance is confirmed.</li>
              </ul>

              <h3>Data retention</h3>
              <p>Operators are <strong>not responsible</strong> for raw sensor data retention. That obligation sits with sensor operators and Mālama Labs (10-year S3-compatible off-chain retention with immutability lock). Your node&rsquo;s validation records are anchored on-chain permanently via Cardano.</p>
              <p>Retain locally:</p>
              <ul>
                <li>Your reservation agreement.</li>
                <li>Your Device DID certificate card.</li>
                <li>Your deployment registration confirmation.</li>
                <li>KYB documentation (required for annual renewal).</li>
              </ul>

              <h3>Fraudulent attestations and slashing</h3>
              <div className="callout warn">
                <span className="tag">▲ Slashing · 10% MLMA penalty</span>
                <p>Validators who sign false or manipulated attestations face a <strong>10% MLMA slashing penalty</strong> plus immediate PONO suspension. Byzantine Fault Tolerant consensus identifies and penalizes isolated malicious validators without affecting the wider network. Sustained falsification triggers PONO revocation (governance supermajority) and forfeiture of all unvested milestone tranches.</p>
              </div>
            </div>
          </section>

          <section className="clause" id="pono">
            <div className="clause-head"><span className="num">§ D</span><h2>PONO qualification</h2><a className="anchor" href="#pono">#pono</a></div>
            <div className="clause-body">
              <p>PONO is a non-transferable on-chain credential issued automatically by the Mālama protocol to operators meeting specific KYB, uptime, and operational criteria. PONO is required for governance and is the qualification condition for the 90-day MLMA tranche (15%, 18,750 MLMA).</p>

              <h3>KYB requirements</h3>
              <ul>
                <li>Legal entity verification (corporation, LLC, partnership, or natural person operating as sole proprietor).</li>
                <li>Jurisdiction of organization disclosed.</li>
                <li><strong>Ultimate Beneficial Ownership (UBO)</strong> above 25% threshold disclosed.</li>
                <li>Sanctions screening against OFAC SDN, EU consolidated, UN consolidated, and UK HMT lists (zero positive matches required).</li>
                <li>Operational address verified.</li>
                <li>Politically Exposed Person (PEP) screening (positive matches require enhanced due diligence approval).</li>
                <li>For natural persons operating as sole proprietors: government-issued ID plus proof of address (utility bill or bank statement &lt; 90 days old).</li>
                <li><strong>KYB renewal annually</strong> with material-change reporting interim.</li>
              </ul>

              <h3>Operational requirements · throughout 90-day qualifying period</h3>
              <ul>
                <li><strong>Active hardware:</strong> connected and signing readings for 99.0% of the qualifying period (measured per minute, aggregated monthly).</li>
                <li><strong>Reading volume:</strong> minimum 1,000 valid signed readings per 30-day window.</li>
                <li><strong>Anchor participation:</strong> hardware contributed to at least 95% of monthly Merkle anchors.</li>
                <li><strong>Geographic coherence:</strong> 100% of signed readings within declared hex zone boundary (no GPS drift).</li>
                <li><strong>Hardware tamper status:</strong> no detected tampering events (secure-element tamper detection signals).</li>
              </ul>

              <h3>Qualifying period mechanics</h3>
              <ul>
                <li>90 consecutive days of operation post-deployment registration on mainnet.</li>
                <li>Operator must meet all KYB, uptime, reading volume, anchor participation, and geographic coherence requirements continuously.</li>
                <li>During the qualifying period, the operator earns the boot tranche but cannot vote in governance (probationary status).</li>
                <li><strong>30 consecutive days of non-compliance during the qualifying period restart the 90-day clock.</strong></li>
              </ul>

              <h3>Post-issuance maintenance</h3>
              <table className="matrix">
                <thead><tr><th>Event</th><th>Trigger</th><th>Consequence</th></tr></thead>
                <tbody>
                  <tr><td>Issuance</td><td>End of 90-day qualifying period, all conditions met</td><td><span className="accent">Automatic on-chain mint</span></td></tr>
                  <tr><td>Suspension</td><td>30 consecutive days non-compliance post-issuance</td><td>PONO suspended · distributions continue at <strong>0.5×</strong></td></tr>
                  <tr><td>Restoration</td><td>Meeting conditions again</td><td>Automatic restoration</td></tr>
                  <tr><td>Revocation</td><td>Sustained non-operation (90+ days), data falsification, regulatory violation, KYB re-verification failure</td><td>Governance supermajority (&gt;66%) required for full removal</td></tr>
                </tbody>
              </table>

              <h3>10% UBO governance cap</h3>
              <div className="callout accent">
                <span className="tag">● Anti-capture · UBO ceiling</span>
                <p>No single beneficial owner controls more than <strong>10% of PONO-weighted vote</strong> on any individual proposal. Coordinated entities (common control, proxy arrangements) are aggregated. Vote weight above the 10% cap is forfeited for that proposal. <strong>Non-disclosure of coordination is grounds for PONO revocation.</strong></p>
              </div>
            </div>
          </section>

          <section className="clause" id="support" style={{ borderBottom: 'none' }}>
            <div className="clause-head"><span className="num">§ E</span><h2>Support &amp; FAQ</h2><a className="anchor" href="#support">#support</a></div>
            <div className="clause-body">
              <h3>Getting help</h3>
              <p>Primary support runs through Discord and the hardware ticket queue. Phone support is available for scheduled calls on critical deployment issues.</p>
              <table className="matrix">
                <thead><tr><th>Issue type</th><th>Channel</th><th>What to include</th></tr></thead>
                <tbody>
                  <tr><td>Hardware &amp; firmware</td><td>Discord #hardware-support, hardware ticket queue</td><td>Device DID, hex zone ID, LED status code, photo of enclosure</td></tr>
                  <tr><td>Registration &amp; dApp</td><td>Discord #dapp-support</td><td>Reservation ID, wallet address (Base or Cardano), screenshot of error</td></tr>
                  <tr><td>Audit &amp; compliance</td><td>Discord #audit, support email</td><td>Reservation ID, deployment date, node registration confirmation</td></tr>
                  <tr><td>PONO qualification</td><td>Discord #pono, support email</td><td>Device DID, KYB completion status, current uptime metric</td></tr>
                  <tr><td>Billing &amp; reservation</td><td>Support email</td><td>Reservation ID and the email used at reservation</td></tr>
                  <tr><td>Scheduled phone call</td><td>Book via dApp or email</td><td>Available for critical deployment issues. Allow 48-hour notice.</td></tr>
                </tbody>
              </table>
              <div className="callout warn">
                <span className="tag">▲ Security</span>
                <p><strong>Never share your wallet private key with support under any circumstances.</strong></p>
              </div>

              <h3>Frequently asked questions</h3>

              <p><strong style={{ color: 'var(--mlma-ink)' }}>Where do I get firmware or pairing help?</strong></p>
              <p>Use the Launch Discord #hardware-support channel and the hardware ticket queue. Include your Device DID (from the device certificate card or the dApp) and your hex zone ID from your reservation confirmation.</p>

              <p><strong style={{ color: 'var(--mlma-ink)' }}>Can I move my node to a different hex?</strong></p>
              <p>Your geographic license (NFT-HEX) is tied to a specific H3 hex cell. Relocation is governed by the NFT-HEX transfer and resale rules in your reservation agreement. <strong>Contact support before physically relocating.</strong> Unauthorized relocation may trigger PONO suspension and milestone forfeiture review.</p>

              <p><strong style={{ color: 'var(--mlma-ink)' }}>What if validation volume is low at my hex at launch?</strong></p>
              <p>Network demand ramps as enterprise sensor deployments come online across carbon MRV, AI compute monitoring, and parametric insurance verticals. Your node also validates data from across the network, not only data produced in your specific hex zone. Your Hex Type and Data Demand Score reflect the commercial, regulatory, and research value of your zone and feed the bounded reward calculation for the validation work your node performs. No distribution guarantees are made.</p>

              <p><strong style={{ color: 'var(--mlma-ink)' }}>My node has been offline for several days. What do I do?</strong></p>
              <p>Open a hardware ticket in Discord with your Device DID immediately. Brief outages reduce your uptime score but do not automatically forfeit milestones. During the 90-day qualifying period, 30 consecutive offline days restart the clock. Post-PONO, 30 consecutive offline days suspend PONO and reduce distributions to 0.5×. 90+ offline days trigger revocation review.</p>

              <p><strong style={{ color: 'var(--mlma-ink)' }}>When does my MLMA allocation begin vesting?</strong></p>
              <p>Vesting begins at hardware boot and successful deployment registration. The boot tranche (15%, 18,750 MLMA) unlocks at successful registration. The next tranche (15%, 18,750 MLMA) unlocks at PONO issuance after the 90-day qualifying period. The remaining 70% vests across three operational milestones at 6, 9, and 12 months (20% / 20% / 30%). See <Link href="/docs/phase-1-timeline" style={{ color: 'var(--mlma-accent)' }}>Phase 1 Timeline</Link> for dates.</p>

              <p><strong style={{ color: 'var(--mlma-ink)' }}>What is the Device DID and where do I find it?</strong></p>
              <p>The Device DID is the cryptographic identity of your specific node hardware, derived from the secure element provisioned at manufacture. It is displayed on the node screen during first boot and printed on the device certificate card included in your hardware kit. You need it for dApp registration. It is different from your wallet address, cannot be changed or transferred, and is permanently bound to that piece of hardware.</p>

              <p><strong style={{ color: 'var(--mlma-ink)' }}>Do I need to own or deploy sensors to receive validation distributions?</strong></p>
              <p>No. A Genesis 200 Hex Node is a validation node, not a sensor. You receive MLMA distributions for validating data produced by enterprise sensor deployments (ERW sites, biochar kilns, AI data center racks) operated by carbon project developers, data center operators, and industrial clients. You do not need to deploy any sensors. Sensor deployment by a node operator is optional and would increase local data volume in your zone, potentially increasing your validation weight.</p>

              <p><strong style={{ color: 'var(--mlma-ink)' }}>Is operating a Hex Node passive income?</strong></p>
              <p>No. Operating a Genesis 200 Hex Node requires labor: physical installation, network setup, ongoing uptime maintenance, and active stewardship of validation work. <strong>Only 15% of the MLMA allocation unlocks at boot.</strong> The remaining 85% vests against operational milestones (PONO 90-day, 6-month, 9-month, 12-month). Missed milestones forfeit unvested tranches.</p>

              <p><strong style={{ color: 'var(--mlma-ink)' }}>What happens to my node if I stop operating it?</strong></p>
              <p>Nodes offline for 90+ consecutive days trigger PONO revocation review. Affected operators forfeit unvested milestone tranches to the post-emission governance reserve. Vested MLMA remains in your wallet. Your NFT-HEX may be reclaimed by the protocol via governance vote.</p>

              <p><strong style={{ color: 'var(--mlma-ink)' }}>What if I miss an operational milestone but want to come back?</strong></p>
              <p>Operators reentering compliance after a missed milestone may petition the DAO for a partial-restoration vote (&gt;50% threshold). Restoration is discretionary and not guaranteed. The simpler path is maintaining continuous PONO eligibility.</p>

              <p><strong style={{ color: 'var(--mlma-ink)' }}>Does the Stewardship multiplier apply to me?</strong></p>
              <p>The 1.5× Stewardship Multiplier applies to operators on Indigenous lands or in partnership with Native communities, in regions where the Stewardship Pool has been activated via FPIC consultation, cultural advisor sign-off, and governance supermajority. Regional activation is community-led. Operators interested in qualifying for the Stewardship multiplier should contact the Mālama team to discuss partnership pathways.</p>

              <div className="sig-strip">
                <div className="label">- END OF GUIDE</div>
                <p className="text">Mālama Labs, Inc. · Genesis 200 Operator Guide · Companion to shipped hardware runbooks</p>
                <p className="footnote">Questions: <a href="mailto:support@malamalabs.com" style={{ color: 'var(--mlma-accent)' }}>support@malamalabs.com</a> · Discord communities are the fastest path to resolution.</p>
              </div>
            </div>
          </section>
        </article>
      </main>
    </DocsPageShell>
  )
}
