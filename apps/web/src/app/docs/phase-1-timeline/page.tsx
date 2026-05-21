import type { Metadata } from 'next'
import Link from 'next/link'
import '../docs-hub.css'
import DocsPageShell from '../_shared/DocsPageShell'

export const metadata: Metadata = {
  title: 'Phase 1 Timeline · Mālama Labs',
  description:
    'Genesis 200 timeline — from the Public Hex Launch (June 1, 2026) through full milestone vesting (~Q4 2027). Six phases: reserve, close, ship, boot + audit (mainnet live ahead of TGE), PONO qualify, operational milestones.',
}

export default function Phase1TimelinePage() {
  return (
    <DocsPageShell
      current="phase-1-timeline"
      docNumber="DOCS · 03"
      eyebrowText="Genesis 200 timeline"
      titleLead="Phase 1"
      titleEmphasis="Timeline."
      lede="From the Public Hex Launch through Year 1 milestone vesting. Six phases — three cover reservation through hardware shipment, three cover boot, audit, PONO qualification, and the operational milestones that vest 85% of your MLMA allocation across the first 12 months. Mainnet goes live in Q4 2026, ahead of TGE."
      metaRows={[
        { k: 'Public Hex Launch', v: 'June 1, 2026', accent: true },
        { k: 'Sale closes', v: 'When 195 sold' },
        { k: 'Hardware ships', v: 'Q4 2026' },
        { k: 'Mainnet live · audit', v: 'Q4 2026 (pre-TGE)' },
        { k: 'PONO qualify', v: '~Q1 2027' },
        { k: 'Fully vested', v: '~Q4 2027', accent: true },
      ]}
    >
      <main className="layout layout--with-toc">
        <aside className="toc" aria-label="Table of contents">
          <div className="toc-label"><span>Contents</span><span className="count">3 sections</span></div>
          <ol>
            <li><a href="#s1"><span className="n">01</span><span className="t">Timeline at a glance</span></a></li>
            <li><a href="#s2"><span className="n">02</span><span className="t">Phase walkthrough</span></a></li>
            <li><a href="#s3"><span className="n">03</span><span className="t">Full milestone reference</span></a></li>
          </ol>
          <div className="toc-actions">
            <Link className="btn" href="/docs/pricing-roi"><span>← Prev · Pricing</span><span></span></Link>
            <Link className="btn" href="/docs/operators"><span>Next · Operator Guide</span><span>→</span></Link>
          </div>
        </aside>

        <article className="content">
          <div className="preamble">
            <p>Six phases govern your Genesis 200 journey from reservation through full vesting. The first three cover reservation through hardware shipment. The last three cover boot, audit, PONO qualification, and the four operational milestones that vest 85% of your MLMA allocation across the first 12 months.</p>
          </div>

          <section className="clause" id="s1">
            <div className="clause-head"><span className="num">§ 01</span><h2>Timeline at a glance</h2><a className="anchor" href="#s1">#s1</a></div>
            <div className="clause-body">
              <table className="matrix">
                <thead><tr><th>Step</th><th>Phase</th><th>Window</th><th>What changes on-chain</th></tr></thead>
                <tbody>
                  <tr><td>01</td><td>Public Hex Launch</td><td>June 1, 2026 (open)</td><td>NFT-HEX minted on Cardano and Base</td></tr>
                  <tr><td>02</td><td>Sale closes</td><td>When 195 sold</td><td>Zone assignment locked</td></tr>
                  <tr><td>03</td><td>Ship</td><td>Q4 2026</td><td>Hardware delivered with pre-provisioned Device DID</td></tr>
                  <tr><td>04</td><td>Mainnet · Boot + Audit</td><td>Q4 2026 (pre-TGE)</td><td><span className="accent">15% boot tranche</span> · audit clearance · first distributions begin</td></tr>
                  <tr><td>05</td><td>PONO Qualify</td><td>~Q1 2027 (90 days post-boot)</td><td><span className="accent">15% PONO tranche</span> · governance eligibility</td></tr>
                  <tr><td>06</td><td>Operational Milestones</td><td>~Q2 / Q3 / Q4 2027</td><td><span className="accent">20% + 20% + 30%</span> milestone tranches</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="clause" id="s2">
            <div className="clause-head"><span className="num">§ 02</span><h2>Phase walkthrough</h2><a className="anchor" href="#s2">#s2</a></div>
            <div className="clause-body">

              <div className="timeline-step">
                <div className="num">STEP · 01</div>
                <div className="body">
                  <h3>Public Hex Launch</h3>
                  <div className="when">June 1, 2026</div>
                  <p><strong>What happens.</strong> Public Hex Launch — the Genesis 200 sale opens to the world. Operators reserve a Genesis 200 node for $2,000 total ($380 hardware + $1,620 geographic hex license).</p>
                  <p><strong>What you receive at reservation.</strong> Your NFT-HEX geographic rights object is minted on Cardano and Base on payment. The Cardano CIP-25 token is your on-chain proof of reservation. Hardware pre-order is queued immediately based on reservation order. Your unit ships in Q4 2026.</p>
                  <p><strong>What you do NOT receive at reservation.</strong> The 125,000 MLMA allocation does not arrive at reservation. The first tranche (15%, 18,750 MLMA) unlocks at boot. The remaining 85% unlocks across PONO qualification and operational milestones.</p>
                  <p><strong>Pre-qualification.</strong> The reservation portal confirms region availability, capital requirement, and shipping address before payment is processed.</p>
                </div>
              </div>

              <div className="timeline-step">
                <div className="num">STEP · 02</div>
                <div className="body">
                  <h3>Reservation window closes</h3>
                  <div className="when">When 195 sold (first-come, first-served)</div>
                  <p><strong>What happens.</strong> Zone assignment locks on-chain at close. No further hex transfers permitted except per the resale rules in your reservation agreement.</p>
                  <p><strong>Reserved nodes.</strong> Five nodes are reserved for Mālama Labs team and production use (Dallas / DFW area) and are not available for external reservation.</p>
                </div>
              </div>

              <div className="timeline-step">
                <div className="num">STEP · 03</div>
                <div className="body">
                  <h3>Hardware deployment</h3>
                  <div className="when">Q4 2026</div>
                  <p><strong>What ships.</strong> Each kit contains the Mālama-provisioned NEMA 4X IP67 enclosure, Raspberry Pi Zero 2W, ATECC608B-class secure element, RS485 7-in-1 soil probe, BME280 atmospheric sensor, Waveshare SIM7600G LTE HAT, solar panel, UPS battery, device certificate card, and quick-start documentation.</p>
                  <p><strong>Shipping order.</strong> Earlier reservations ship first. Hardware ships with a pre-configured Mālama node image and your Device DID pre-provisioned on the secure element.</p>
                  <p><strong>Setup time.</strong> Most setups complete in under 30 minutes. Detailed mounting instructions and LED status code reference ship with the kit.</p>
                </div>
              </div>

              <div className="timeline-step">
                <div className="num">STEP · 04</div>
                <div className="body">
                  <h3>Mainnet live · Boot, register, and audit</h3>
                  <div className="when">Q4 2026 — ahead of TGE</div>
                  <p><strong>Mainnet live ahead of TGE.</strong> The Mālama protocol goes live in Q4 2026 — before the Token Generation Event. Validation is operational and verifiable on-chain before any token enters circulation.</p>
                  <p><strong>Boot.</strong> Power on. The secure element provisions its Device DID, approximately 60 seconds. The LED status sequence confirms successful provisioning.</p>
                  <p><strong>Register.</strong> Open the Mālama dApp and connect your Base or Cardano wallet. Enter your node&rsquo;s Device DID to bind your hardware identity to your NFT-HEX geographic assignment.</p>
                  <div className="callout accent">
                    <span className="tag">● Boot tranche unlock · 18,750 MLMA (15%)</span>
                    <p>Deployment registration triggers the boot tranche. Conditions: hardware registered, KYB complete, first signed reading recorded on Cardano. Tranche accrues at boot; liquidity follows at TGE.</p>
                  </div>
                  <p><strong>Genesis Hex Sale audit.</strong> An independent reviewer engaged by Mālama Labs confirms your node is operational and compliant. The audit window runs through Q4 2026.</p>
                  <ul>
                    <li><em>Pass:</em> Full Year 1 Genesis multiplier benefits (1.5×) apply from clearance date. Validation distributions begin.</li>
                    <li><em>Not yet passing:</em> Notification with specific remediation steps. The boot tranche is not affected by audit status. Only validation distributions are withheld until compliance is confirmed.</li>
                  </ul>
                </div>
              </div>

              <div className="timeline-step">
                <div className="num">STEP · 05</div>
                <div className="body">
                  <h3>PONO qualification</h3>
                  <div className="when">~ Q1 2027 · 90 days post-boot</div>
                  <p><strong>Qualifying period requirements.</strong> Throughout the 90 days, your node must continuously satisfy:</p>
                  <ul>
                    <li>Active hardware connected and signing readings for <strong>99.0%</strong> of the period (measured per minute, aggregated monthly).</li>
                    <li><strong>Reading volume:</strong> minimum 1,000 valid signed readings per 30-day window.</li>
                    <li><strong>Anchor participation:</strong> hardware contributed to at least 95% of monthly Merkle anchors.</li>
                    <li><strong>Geographic coherence:</strong> 100% of signed readings within declared hex zone boundary (no GPS drift).</li>
                    <li>No hardware tamper events.</li>
                    <li>KYB current with UBO disclosure.</li>
                  </ul>
                  <p><strong>PONO issuance.</strong> Automatic on-chain credential mint at end of the 90-day period if all conditions are met. PONO is a soulbound (non-transferable) ERC-721 on Base.</p>
                  <div className="callout accent">
                    <span className="tag">● PONO tranche unlock · 18,750 MLMA (15%) · Cumulative 30%</span>
                    <p>PONO is required to vote in veMLMA governance. Holding MLMA or veMLMA alone is not sufficient. Without PONO, you can earn distributions and stake, but you cannot vote.</p>
                  </div>
                  <p><strong>If qualification fails.</strong> Notification of which condition is unmet. The boot tranche is retained. The PONO tranche is withheld until qualification conditions are met.</p>
                </div>
              </div>

              <div className="timeline-step">
                <div className="num">STEP · 06</div>
                <div className="body">
                  <h3>Operational milestones · 6, 9, 12 months</h3>
                  <div className="when">~ Q2 · Q3 · Q4 2027</div>
                  <p>Three operational milestones vest the remaining <strong>70%</strong> of your MLMA allocation. Each requires continuous PONO eligibility plus ≥99% uptime within the milestone window, no tamper events, and no falsification detection.</p>

                  <table className="matrix">
                    <thead><tr><th>Milestone</th><th>When</th><th className="num">MLMA</th><th className="num">Cumulative</th></tr></thead>
                    <tbody>
                      <tr><td>6-month</td><td>~ Q2 2027 (months 4 – 6)</td><td className="num">25,000 (20%)</td><td className="num">50%</td></tr>
                      <tr><td>9-month</td><td>~ Q3 2027 (months 7 – 9)</td><td className="num">25,000 (20%)</td><td className="num">70%</td></tr>
                      <tr><td>12-month</td><td>~ Q4 2027 (months 10 – 12)</td><td className="num"><span className="accent">37,500 (30%)</span></td><td className="num"><span className="accent">100%</span></td></tr>
                    </tbody>
                  </table>

                  <div className="callout warn">
                    <span className="tag">▲ Forfeiture · PONO suspension</span>
                    <p><strong>Forfeiture.</strong> Operators failing a milestone forfeit that tranche and all subsequent tranches. Forfeited MLMA rolls into the post-emission governance reserve.</p>
                    <p><strong>Restoration.</strong> Operators reentering compliance after a missed milestone may petition the DAO for a partial-restoration vote (&gt;50% threshold).</p>
                    <p><strong>PONO suspension.</strong> Failure to maintain PONO conditions for 30 consecutive days after issuance triggers automatic PONO suspension. During suspension, validation distributions continue at <strong>0.5×</strong>. PONO can be restored by meeting conditions again. PONO revocation (full removal) requires governance supermajority (&gt;66%).</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="clause" id="s3" style={{ borderBottom: 'none' }}>
            <div className="clause-head"><span className="num">§ 03</span><h2>Full milestone reference</h2><a className="anchor" href="#s3">#s3</a></div>
            <div className="clause-body">
              <table className="matrix">
                <thead><tr><th>Step</th><th>Milestone</th><th>Date</th><th>What you receive</th></tr></thead>
                <tbody>
                  <tr><td>01</td><td>Public Hex Launch</td><td>June 1, 2026</td><td>NFT-HEX geographic rights object minted on Cardano and Base</td></tr>
                  <tr><td>02</td><td>Reservation closes</td><td>When 195 sold</td><td>Zone assignment locked on-chain</td></tr>
                  <tr><td>03</td><td>Hardware deployment</td><td>Q4 2026</td><td>Pre-configured node with pre-provisioned Device DID</td></tr>
                  <tr><td>04</td><td>Mainnet · Boot + Audit</td><td>Q4 2026 (pre-TGE)</td><td>18,750 MLMA (15% boot) + audit clearance + first distributions</td></tr>
                  <tr><td>05</td><td>PONO qualification</td><td>~ Q1 2027</td><td>18,750 MLMA (15% PONO tranche) + governance eligibility</td></tr>
                  <tr><td>06a</td><td>6-month milestone</td><td>~ Q2 2027</td><td>25,000 MLMA (20% tranche)</td></tr>
                  <tr><td>06b</td><td>9-month milestone</td><td>~ Q3 2027</td><td>25,000 MLMA (20% tranche)</td></tr>
                  <tr><td>06c</td><td>12-month milestone</td><td>~ Q4 2027</td><td><span className="accent">37,500 MLMA (30% tranche) — fully vested</span></td></tr>
                </tbody>
              </table>

              <div className="sig-strip">
                <div className="label">— END OF PAGE</div>
                <p className="text">Phase 1 covers June 1, 2026 → ~ Q4 2027. Mainnet goes live in Q4 2026, ahead of TGE. Subsequent phases govern Year 2+ operation and Years 4 – 5 revenue transition.</p>
                <p className="footnote">Next: <Link href="/docs/operators" style={{ color: 'var(--mlma-accent)' }}>Operator Guide →</Link></p>
              </div>
            </div>
          </section>
        </article>
      </main>
    </DocsPageShell>
  )
}
