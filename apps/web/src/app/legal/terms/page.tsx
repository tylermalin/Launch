import type { Metadata } from 'next'
import Link from 'next/link'
import '../legal-doc.css'
import LegalPageShell from '../_shared/LegalPageShell'

export const metadata: Metadata = {
  title: 'Terms and Conditions · Mālama Labs',
  description:
    'Binding agreement governing access to and use of the Mālama Labs website, dashboards, Hex Node sale flows, and the environmental data network. 27 sections including arbitration, opt-out, and token characterization.',
}

export default function TermsPage() {
  return (
    <LegalPageShell
      current="terms"
      docNumber="DOC · 001"
      eyebrowText="Legal · Terms and Conditions"
      titleLead="Terms and"
      titleEmphasis="Conditions."
      lede="The binding agreement between you and Mālama Labs Inc. governing access to and use of the Mālama website, dashboards, Hex Node sale flows, and the broader environmental data network."
      metaRows={[
        { k: 'Status', v: 'In force', accent: true },
        { k: 'Effective', v: 'April 11, 2026' },
        { k: 'Last Updated', v: 'April 28, 2026' },
        { k: 'Version', v: 'v2' },
        { k: 'Sections', v: '27' },
        { k: 'Reading time', v: '~18 min' },
      ]}
      docBar={{
        version: 'Version 2 · In force',
        docId: 'Doc · MLMA-LEGAL-001',
        category: 'Category · Master agreement',
      }}
    >
      <main className="layout">
        <aside className="toc" aria-label="Table of contents">
          <div className="toc-label"><span>Contents</span><span className="count">27 sections</span></div>
          <ol>
            {[
              ['s1','01','Definitions'],['s2','02','Agreement acceptance'],['s3','03','Services and network access'],
              ['s4','04','Eligibility and user accounts'],['s5','05','Pricing, billing, payments, sales'],
              ['s6','06','Hex Node sales and delivery'],['s7','07','Node operation'],['s8','08','Rewards, tokens, participation'],
              ['s9','09','No financial or legal advice'],['s10','10','Acceptable use'],['s11','11','Privacy and data protection'],
              ['s12','12','Intellectual property'],['s13','13','User content and feedback'],['s14','14','Third-party services'],
              ['s15','15','Environmental data disclaimers'],['s16','16','Warranty disclaimer'],['s17','17','Limitation of liability'],
              ['s18','18','Indemnification'],['s19','19','Force majeure'],['s20','20','Suspension and termination'],
              ['s21','21','Referrals and promotions'],['s22','22','Dispute resolution & arbitration'],['s23','23','Governing law'],
              ['s24','24','Modifications and updates'],['s25','25','Export controls and sanctions'],
              ['s26','26','Electronic communications'],['s27','27','Miscellaneous'],['contact','— —','Contact'],
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
            <p>These <strong>Terms and Conditions</strong>, together with any documents or policies they expressly incorporate by reference — including the Privacy Policy, any posted sale terms, any node-specific terms, and any token-related disclosures — govern your access to and use of the Mālama Labs website, launch pages, applications, dashboards, hardware purchase flows, Hex Node sale pages, and related products and services (collectively, the <strong>&ldquo;Services&rdquo;</strong>).</p>
            <p>These Terms form a binding agreement between you and <strong>Mālama Labs Inc.</strong> (&ldquo;Mālama,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). By accessing or using the Services, creating an account, joining a waitlist, purchasing or reserving a Hex Node, connecting a wallet, or participating in the Mālama network, you agree to be bound by these Terms. <strong>If you do not agree, do not use the Services.</strong></p>
          </div>

          <section className="clause" id="s1">
            <div className="clause-head"><span className="num">§ 01</span><h2>Definitions</h2><a className="anchor" href="#s1">#s1</a></div>
            <div className="clause-body">
              <p>For purposes of these Terms:</p>
              <table className="deftable">
                <thead><tr><th>Term</th><th>Definition</th></tr></thead>
                <tbody>
                  <tr><td>&ldquo;Account&rdquo;</td><td>A user account created to access certain parts of the Services.</td></tr>
                  <tr><td>&ldquo;Blockchain&rdquo;</td><td>Any distributed ledger or similar public or permissioned system used in connection with the Services, including Cardano, Hedera, and Base as applicable.</td></tr>
                  <tr><td>&ldquo;Hex Node&rdquo;</td><td>A hardware device, software-enabled device, or other approved node infrastructure made available by Mālama for environmental data collection, signing, relaying, verification, or related network participation.</td></tr>
                  <tr><td>&ldquo;Network&rdquo;</td><td>The Mālama environmental data network, including related node infrastructure, software systems, data verification systems, and blockchain integrations.</td></tr>
                  <tr><td>&ldquo;Rewards&rdquo;</td><td>Any points, tokens, credits, incentives, or similar benefits that may be made available in connection with participation in the Network.</td></tr>
                  <tr><td>&ldquo;Services&rdquo;</td><td>The website, launch site, applications, dashboards, APIs, hardware offerings, waitlists, reservation flows, node registration systems, data services, and related products and services offered by Mālama.</td></tr>
                  <tr><td>&ldquo;Tokens&rdquo;</td><td>Any blockchain-based digital assets, utility assets, environmental assets, rewards, credits, or similar instruments used or referenced in connection with the Services, including MLMA tokens.</td></tr>
                  <tr><td>&ldquo;User Content&rdquo;</td><td>Any information, files, messages, data, materials, or content submitted, uploaded, transmitted, or otherwise provided by you.</td></tr>
                  <tr><td>&ldquo;You&rdquo; / &ldquo;Your&rdquo;</td><td>The person or entity using the Services. If you use the Services on behalf of an organization, you represent that you are authorized to bind that organization to these Terms.</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="clause" id="s2">
            <div className="clause-head"><span className="num">§ 02</span><h2>Agreement acceptance</h2><a className="anchor" href="#s2">#s2</a></div>
            <div className="clause-body">
              <p>By accessing or using the Services, you acknowledge that you have read, understood, and agree to these Terms and the Privacy Policy. If you are using the Services on behalf of a company, DAO, foundation, nonprofit, or other organization, you represent and warrant that you have authority to bind that entity.</p>
              <p>You may not use the Services if:</p>
              <ul>
                <li>You are under 18 years old.</li>
                <li>You are prohibited from using the Services under applicable law.</li>
                <li>You are located in a sanctioned or restricted jurisdiction where access would be unlawful.</li>
                <li>Your use would violate any applicable export control, sanctions, securities, commodities, consumer protection, privacy, or other laws.</li>
              </ul>
            </div>
          </section>

          <section className="clause" id="s3">
            <div className="clause-head"><span className="num">§ 03</span><h2>Services and network access</h2><a className="anchor" href="#s3">#s3</a></div>
            <div className="clause-body">
              <p>Mālama provides environmental data infrastructure and related digital systems, which may include: launch and informational pages, node sale and reservation flows, customer accounts and support, node registration tools, environmental data dashboards, blockchain anchoring or verification tools, wallet-connected experiences, and software, firmware, APIs, and analytics.</p>
              <p>The Services may evolve over time. We do not guarantee that the Services, the Network, or any specific functionality will always be available, uninterrupted, secure, or error-free. Certain features may be offered only in specific regions or to specific users.</p>
            </div>
          </section>

          <section className="clause" id="s4">
            <div className="clause-head"><span className="num">§ 04</span><h2>Eligibility and user accounts</h2><a className="anchor" href="#s4">#s4</a></div>
            <div className="clause-body">
              <p>To access certain Services, you may need to create an Account. You agree to provide accurate, complete, and current information and to keep that information updated.</p>
              <p>You are responsible for maintaining the confidentiality of your login credentials, all activity occurring under your Account, and promptly notifying us of any unauthorized access. We may suspend, restrict, or terminate your Account if we reasonably believe you provided false information, your use creates legal or security risk, or you violated these Terms.</p>
            </div>
          </section>

          <section className="clause" id="s5">
            <div className="clause-head"><span className="num">§ 05</span><h2>Pricing, billing, payments, and sales</h2><a className="anchor" href="#s5">#s5</a></div>
            <div className="clause-body">
              <p>All prices are listed in the currency stated at the time of sale and may be changed at any time before purchase confirmation. Taxes, shipping, customs, duties, processing fees, gas fees, and similar charges may apply in addition to the stated price.</p>
              <p>You agree to pay all amounts due using an approved payment method. Unless otherwise stated in writing:</p>
              <ul>
                <li>Orders are subject to acceptance and we may reject or cancel orders in our discretion.</li>
                <li>Availability is not guaranteed.</li>
                <li>Quoted delivery windows are estimates only.</li>
                <li>Promotional offers may be withdrawn at any time.</li>
              </ul>
              <p>If you dispute a charge, you must contact us within <strong>thirty (30) days</strong> after the charge appears, unless a longer period is required by law.</p>
            </div>
          </section>

          <section className="clause" id="s6">
            <div className="clause-head"><span className="num">§ 06</span><h2>Hex Node sales, reservations, and delivery</h2><a className="anchor" href="#s6">#s6</a></div>
            <div className="clause-body">
              <p>A Hex Node purchase, preorder, or reservation may include hardware, software, licenses, embedded functionality, documentation, or future access rights as described at the time of sale. Unless expressly stated otherwise: preorder timelines are estimates, product specifications may evolve, and a reservation does not guarantee any specific shipment date, territory, yield, earnings level, or regulatory outcome.</p>
              <p>You are responsible for providing accurate shipping and contact information and for compliance with local laws relating to import, customs, operation, radio use, installation, electricity, data collection, land access, and similar requirements.</p>
            </div>
          </section>

          <section className="clause" id="s7">
            <div className="clause-head"><span className="num">§ 07</span><h2>Node operation and technical responsibility</h2><a className="anchor" href="#s7">#s7</a></div>
            <div className="clause-body">
              <p>If you own, operate, host, or manage a Hex Node, you are responsible for:</p>
              <ul>
                <li>Setup and installation.</li>
                <li>Obtaining adequate connectivity and power.</li>
                <li>Following any operating instructions.</li>
                <li>Maintaining the physical and digital security of the node.</li>
                <li>Maintaining required licenses, permissions, and site rights.</li>
                <li>Complying with applicable local laws and technical standards.</li>
                <li>Ensuring your operation does not interfere with the Network or third parties.</li>
              </ul>
              <p>You may not tamper with, reverse engineer, misconfigure, spoof, falsify, disable, or otherwise manipulate a node or related software in a way that compromises security, data integrity, or reward systems.</p>
            </div>
          </section>

          <section className="clause" id="s8">
            <div className="clause-head"><span className="num">§ 08</span><h2>Rewards, tokens, and network participation</h2><a className="anchor" href="#s8">#s8</a></div>
            <div className="clause-body">
              <p>Participation in the Network may, in Mālama&rsquo;s discretion, be associated with Rewards, Tokens, credits, or other incentives. Any such programs may depend on node uptime, data quality, location, verification status, network need, anti-fraud scoring, or other factors determined by Mālama or the protocol.</p>
              <p>You acknowledge and agree that: participation does not guarantee any Rewards, any reward framework may change or be discontinued, token values may fluctuate dramatically, and <strong>nothing in these Terms constitutes a promise of profit, return on investment, appreciation, liquidity, or resale opportunity.</strong></p>
              <p>You are solely responsible for understanding wallet and blockchain risks, safeguarding your private keys, determining whether participation is lawful in your jurisdiction, and reporting and paying all applicable taxes.</p>

              <h3>Custody</h3>
              <div className="callout accent">
                <span className="tag">● Custody · Non-custodial by default</span>
                <p>Mālama does not custody MLMA tokens, NFTs, or other digital assets on behalf of non-custodial wallet users. For users who elect a custodial checkout option, Mālama or its designated provider acts solely as a non-discretionary custodian. <strong>You retain beneficial ownership</strong> of assets minted to a custodial wallet and may transfer those assets to a self-custody wallet at any time.</p>
              </div>

              <h3>Token characterization</h3>
              <p>MLMA is designed as a utility and governance token. Mālama intends that MLMA&rsquo;s value derives from: <strong>(i)</strong> operator labor required to receive validation rewards (hardware installation, uptime maintenance, and active node operation); <strong>(ii)</strong> protocol utility functions including data-payment settlement and fee payment; and <strong>(iii)</strong> veMLMA governance participation.</p>
              <p>Mālama does not represent or warrant that MLMA will be treated as a non-security in any jurisdiction. Regulatory classification of MLMA is subject to ongoing legal review and varies by jurisdiction. Nothing in these Terms constitutes a representation that MLMA is lawful to purchase, hold, transfer, or use in your jurisdiction. <strong>You are solely responsible for making that determination with qualified legal counsel before acquiring or using MLMA.</strong></p>
              <p>MLMA is not offered as a claim on profits or revenue of Mālama Labs Inc. Validation rewards are compensation for active operator work performed on the network, contingent on hardware deployment, uptime, and data quality. Rewards are not passive income derived from the managerial or entrepreneurial efforts of Mālama Labs alone. These characterizations reflect Mālama&rsquo;s intent and design; they do not constitute legal conclusions about the regulatory treatment of MLMA under the laws of any jurisdiction.</p>
            </div>
          </section>

          <section className="clause" id="s9">
            <div className="clause-head"><span className="num">§ 09</span><h2>No financial, investment, tax, or regulatory advice</h2><a className="anchor" href="#s9">#s9</a></div>
            <div className="clause-body">
              <p>The Services are provided for informational and operational purposes only. Mālama does not provide investment, legal, tax, accounting, or regulatory advice. No statement on the site or in any community communication should be interpreted as an offer of securities, investment advice, a guarantee of yield or future token value, or a promise of regulatory treatment.</p>
              <p>You are solely responsible for obtaining your own professional advice before purchasing a node, acquiring a token, or participating in the Network.</p>
            </div>
          </section>

          <section className="clause" id="s10">
            <div className="clause-head"><span className="num">§ 10</span><h2>Acceptable use</h2><a className="anchor" href="#s10">#s10</a></div>
            <div className="clause-body">
              <p>You agree not to:</p>
              <ul>
                <li>Use the Services for unlawful purposes or interfere with the Services or the Network.</li>
                <li>Attempt unauthorized access to any account, device, wallet, node, or system.</li>
                <li>Upload malware, viruses, or malicious code.</li>
                <li>Scrape or harvest data except as expressly permitted.</li>
                <li>Impersonate any person or entity.</li>
                <li>Falsify environmental, technical, location, telemetry, or rewards-related data.</li>
                <li>Engage in manipulation, fraud, sybil behavior, wash activity, or gaming of incentive systems.</li>
                <li>Violate intellectual property, privacy, publicity, or contractual rights.</li>
              </ul>
            </div>
          </section>

          <section className="clause" id="s11">
            <div className="clause-head"><span className="num">§ 11</span><h2>Privacy and data protection</h2><a className="anchor" href="#s11">#s11</a></div>
            <div className="clause-body">
              <p>Our collection and use of Personal Data is governed by our <Link href="/legal/privacy" style={{ color: 'var(--mlma-accent)' }}>Privacy Policy</Link>, which is incorporated into these Terms by reference. You acknowledge that certain wallet, blockchain, transaction, and node-related information may be public or effectively irreversible once recorded on-chain, and that global cloud, infrastructure, and blockchain systems may involve international data processing.</p>
            </div>
          </section>

          <section className="clause" id="s12">
            <div className="clause-head"><span className="num">§ 12</span><h2>Intellectual property</h2><a className="anchor" href="#s12">#s12</a></div>
            <div className="clause-body">
              <p>The Services, including all software, code, designs, text, graphics, logos, databases, firmware, documentation, and related materials, are owned by Mālama or its licensors. Subject to these Terms, Mālama grants you a limited, revocable, non-exclusive, non-transferable license to access and use the Services for their intended purpose.</p>
              <p>You may not copy, reproduce, distribute, reverse engineer, decompile, or use our trademarks, names, or branding without permission.</p>
            </div>
          </section>

          <section className="clause" id="s13">
            <div className="clause-head"><span className="num">§ 13</span><h2>User content and feedback</h2><a className="anchor" href="#s13">#s13</a></div>
            <div className="clause-body">
              <p>If you submit User Content, you represent and warrant that you have all rights necessary to do so and that your User Content does not violate law or third-party rights. You grant Mālama a non-exclusive, worldwide, royalty-free license to use, host, store, reproduce, modify, and process User Content as reasonably necessary to operate and improve the Services. Feedback or feature suggestions may be used by Mālama without restriction or compensation.</p>
            </div>
          </section>

          <section className="clause" id="s14">
            <div className="clause-head"><span className="num">§ 14</span><h2>Third-party services and external links</h2><a className="anchor" href="#s14">#s14</a></div>
            <div className="clause-body">
              <p>The Services may integrate with or link to third-party services including payment processors, logistics providers, blockchain networks, wallets, exchanges, analytics providers, environmental registries, and cloud platforms. We do not control and are not responsible for third-party services, their content, availability, or their terms and privacy practices. Your use of such services is at your own risk.</p>
            </div>
          </section>

          <section className="clause" id="s15">
            <div className="clause-head"><span className="num">§ 15</span><h2>Environmental data and informational disclaimers</h2><a className="anchor" href="#s15">#s15</a></div>
            <div className="clause-body">
              <p>The Services may include environmental, operational, technical, or modeled data derived from hardware inputs, third-party inputs, estimation systems, AI models, or other sources. Measurements and estimates may contain errors, gaps, delays, or uncertainty. Except where expressly stated in writing, Mālama does not warrant that any environmental data, score, metric, or output is fit for any particular legal, compliance, registry, accounting, or investment use.</p>
            </div>
          </section>

          <section className="clause" id="s16">
            <div className="clause-head"><span className="num">§ 16</span><h2>Warranty disclaimer</h2><a className="anchor" href="#s16">#s16</a></div>
            <div className="clause-body">
              <div className="callout warn">
                <span className="tag">▲ Notice · Read carefully</span>
                <p className="legalese"><span className="caps">To the fullest extent permitted by law,</span> the Services and all related content, products, software, hardware, node systems, data, and materials are provided on an <span className="caps">&ldquo;As Is&rdquo;</span> and <span className="caps">&ldquo;As Available&rdquo;</span> basis. Mālama disclaims all warranties, express or implied, including any implied warranties of merchantability, fitness for a particular purpose, title, non-infringement, accuracy, compatibility, uptime, or results. Mālama does not warrant that the Services will be uninterrupted or error-free, that any node will remain continuously eligible for network participation, that any Rewards will be generated, or that any token or asset will retain or increase in value.</p>
              </div>
            </div>
          </section>

          <section className="clause" id="s17">
            <div className="clause-head"><span className="num">§ 17</span><h2>Limitation of liability</h2><a className="anchor" href="#s17">#s17</a></div>
            <div className="clause-body">
              <div className="callout warn">
                <span className="tag">▲ Notice · Read carefully</span>
                <p className="legalese"><span className="caps">To the fullest extent permitted by law,</span> Mālama and its affiliates, officers, directors, employees, contractors, licensors, suppliers, and agents will not be liable for any indirect, incidental, special, consequential, exemplary, or punitive damages, or for any loss of profits, revenue, business, opportunity, goodwill, reputation, use, data, digital assets, or tokens. Mālama will not be liable for damages arising from service interruption, blockchain failures, wallet compromise, token price volatility, node misconfiguration, inaccurate or delayed data, third-party acts, or regulatory actions.</p>
              </div>
              <p>Mālama&rsquo;s aggregate liability for all claims will not exceed the greater of: <strong>(a)</strong> the amount you paid to Mālama in the twelve months preceding the event giving rise to the claim, or <strong>(b)</strong> US$500.</p>

              <h3>Carve-outs</h3>
              <div className="callout accent">
                <span className="tag">● Carve-outs · This section does not limit</span>
                <p>Nothing in this Section 17 limits or excludes liability for:</p>
                <p><strong>(i)</strong> Mālama&rsquo;s fraud, gross negligence, or willful misconduct;<br/>
                   <strong>(ii)</strong> liability that cannot be excluded or limited under applicable law (including, where applicable, statutory consumer-protection rights, bodily injury, or death caused by negligence); or<br/>
                   <strong>(iii)</strong> Mālama&rsquo;s indemnification obligations for third-party intellectual-property infringement claims expressly undertaken in writing.</p>
                <p>For claims arising specifically out of the purchase and use of Hex Node hardware, the separate limitations in the <Link href="/legal/hex-node-purchase" style={{ color: 'var(--mlma-accent)' }}>Hex Node Purchase &amp; Preorder Agreement</Link> apply in addition to the foregoing.</p>
              </div>
            </div>
          </section>

          <section className="clause" id="s18">
            <div className="clause-head"><span className="num">§ 18</span><h2>Indemnification</h2><a className="anchor" href="#s18">#s18</a></div>
            <div className="clause-body">
              <p>You agree to defend, indemnify, and hold harmless Mālama and its affiliates, officers, directors, employees, contractors, licensors, suppliers, and agents from and against any claims, damages, liabilities, costs, and expenses — including reasonable attorneys&rsquo; fees — arising out of or related to your use of the Services, your node operation, your User Content, your violation of these Terms, your violation of any law or third-party right, or your misuse of tokens, rewards, wallets, or blockchain systems.</p>
            </div>
          </section>

          <section className="clause" id="s19">
            <div className="clause-head"><span className="num">§ 19</span><h2>Force majeure</h2><a className="anchor" href="#s19">#s19</a></div>
            <div className="clause-body">
              <p>Mālama will not be liable for any failure or delay in performance caused by circumstances beyond its reasonable control, including acts of God, natural disasters, war, terrorism, civil unrest, labor disputes, sanctions, supply chain failures, utility outages, internet failures, cloud outages, blockchain disruptions, cyberattacks, or changes in law.</p>
            </div>
          </section>

          <section className="clause" id="s20">
            <div className="clause-head"><span className="num">§ 20</span><h2>Suspension and termination</h2><a className="anchor" href="#s20">#s20</a></div>
            <div className="clause-body">
              <p>We may suspend, restrict, or terminate your access to some or all of the Services at any time, with or without notice. You may stop using the Services at any time. Termination will not affect rights and obligations that by their nature should survive, including payment obligations, disclaimers, limitations of liability, indemnification, dispute provisions, and intellectual property terms.</p>
            </div>
          </section>

          <section className="clause" id="s21">
            <div className="clause-head"><span className="num">§ 21</span><h2>Referral programs and promotional offers</h2><a className="anchor" href="#s21">#s21</a></div>
            <div className="clause-body">
              <p>Mālama may offer referral programs, discount codes, launch incentives, or similar promotions subject to additional terms. We may suspend, modify, revoke, or cancel any program or reward in the event of suspected fraud, abuse, self-referrals, duplicate accounts, ineligible transactions, or technical error.</p>
            </div>
          </section>

          <section className="clause" id="s22">
            <div className="clause-head"><span className="num">§ 22</span><h2>Dispute resolution and arbitration</h2><a className="anchor" href="#s22">#s22</a></div>
            <div className="clause-body">
              <div className="callout warn">
                <span className="tag">▲ Important · Affects your legal rights</span>
                <p>Please read this section carefully. It affects your legal rights, <strong>including your right to a jury trial and your right to participate in class actions.</strong></p>
              </div>
              <p>To the fullest extent permitted by law, any dispute, claim, or controversy arising out of or relating to these Terms or the Services will be resolved by binding individual arbitration and not in court, except that either party may bring an individual claim in small claims court if eligible.</p>
              <p>You and Mālama agree to waive any right to a jury trial, to waive any right to participate in a class action or class arbitration, and that disputes will be resolved only on an individual basis. Arbitration will be administered by the <strong>American Arbitration Association</strong> under its applicable rules, with the seat and venue in <strong>Delaware</strong>.</p>
              <p>If this arbitration section is found unenforceable as to a particular claim, that claim shall proceed in the state or federal courts located in Delaware, and the parties consent to that jurisdiction and venue.</p>

              <h3>30-Day Opt-Out</h3>
              <div className="callout accent">
                <span className="tag">● Opt-out · 30-day window</span>
                <p>You may opt out of the arbitration agreement and class-action waiver set forth in this Section 22 by sending a written opt-out notice to <strong><a href="mailto:legal@malamalabs.com" style={{ color: 'var(--mlma-accent)' }}>legal@malamalabs.com</a></strong> within thirty (30) days of your first purchase of a Hex Node or your first acceptance of these Terms, whichever is earlier.</p>
                <p>The notice must include:</p>
                <p>· Your full name<br/>
                   · The email associated with your account or purchase<br/>
                   · A clear statement that you wish to opt out of arbitration</p>
                <p>Opting out will not affect any other provisions of these Terms, and will not affect your ability to use the Services. <strong>If you do not opt out within the 30-day window, you will be bound by this Section 22.</strong></p>
              </div>
            </div>
          </section>

          <section className="clause" id="s23">
            <div className="clause-head"><span className="num">§ 23</span><h2>Governing law</h2><a className="anchor" href="#s23">#s23</a></div>
            <div className="clause-body">
              <p>These Terms and any dispute arising from them are governed by the laws of the State of Delaware, without regard to conflict of laws principles, except to the extent superseded by applicable federal law or non-waivable consumer protection law.</p>
            </div>
          </section>

          <section className="clause" id="s24">
            <div className="clause-head"><span className="num">§ 24</span><h2>Modifications and updates</h2><a className="anchor" href="#s24">#s24</a></div>
            <div className="clause-body">
              <p>We may modify these Terms from time to time. When we do, we will update the &ldquo;Last Updated&rdquo; date. Your continued use of the Services after revised Terms become effective constitutes your acceptance. If you do not agree to the updated Terms, you must stop using the Services.</p>
            </div>
          </section>

          <section className="clause" id="s25">
            <div className="clause-head"><span className="num">§ 25</span><h2>Export controls and sanctions compliance</h2><a className="anchor" href="#s25">#s25</a></div>
            <div className="clause-body">
              <p>You represent and warrant that you are not located in, organized under the laws of, or ordinarily resident in a country or territory subject to comprehensive sanctions, and that you will not use the Services in violation of export control or sanctions laws.</p>
            </div>
          </section>

          <section className="clause" id="s26">
            <div className="clause-head"><span className="num">§ 26</span><h2>Electronic communications</h2><a className="anchor" href="#s26">#s26</a></div>
            <div className="clause-body">
              <p>By using the Services, you consent to receive electronic communications from us, including notices, disclosures, agreements, receipts, updates, and customer service communications. You agree that such communications satisfy any legal requirement that communications be in writing.</p>
            </div>
          </section>

          <section className="clause" id="s27">
            <div className="clause-head"><span className="num">§ 27</span><h2>Miscellaneous</h2><a className="anchor" href="#s27">#s27</a></div>
            <div className="clause-body">
              <p>If any provision of these Terms is found invalid or unenforceable, the remaining provisions will remain in full force and effect. Our failure to enforce any provision is not a waiver of our right to do so later. You may not assign or transfer these Terms without our prior written consent. We may assign these Terms in connection with a merger, acquisition, or restructuring.</p>
              <p>These Terms, together with any documents expressly incorporated by reference and any written sale-specific or product-specific terms, constitute the <strong>entire agreement</strong> between you and Mālama regarding the Services.</p>
            </div>
          </section>

          <section className="clause" id="contact" style={{ borderBottom: 'none' }}>
            <div className="clause-head"><span className="num">CONTACT</span><h2>Get in touch</h2><a className="anchor" href="#contact">#contact</a></div>
            <div className="clause-body">
              <p>Questions about these Terms or your account can be directed to the contacts below. Arbitration opt-out notices must be sent within 30 days of first acceptance per Section 22.</p>
              <div className="contact-block">
                <div className="cell">
                  <div className="k">Registered address</div>
                  <div className="v">Mālama Labs Inc.<br/>8 The Green, Suite A<br/>Dover, Delaware 19901</div>
                </div>
                <div className="cell">
                  <div className="k">Legal email</div>
                  <div className="v"><a href="mailto:legal@malamalabs.com">legal@malamalabs.com</a></div>
                </div>
                <div className="cell">
                  <div className="k">Website</div>
                  <div className="v"><a href="https://malamalabs.com">malamalabs.com</a></div>
                </div>
                <div className="cell">
                  <div className="k">Arbitration opt-out</div>
                  <div className="v"><a href="mailto:legal@malamalabs.com">legal@malamalabs.com</a> <span style={{ color: 'var(--mlma-ink-faint)', fontFamily: 'var(--mlma-mono)', fontSize: 11 }}> · within 30 days</span></div>
                </div>
              </div>

              <div className="sig-strip">
                <div className="label">— END OF DOCUMENT</div>
                <p className="text">Mālama Labs, Inc. · Terms and Conditions · Effective April 11, 2026 · Last Updated April 28, 2026 (v2)</p>
                <p className="footnote">These Terms do not constitute investment, legal, tax, or regulatory advice. Regulatory classification of MLMA is subject to ongoing legal review.</p>
              </div>
            </div>
          </section>
        </article>
      </main>
    </LegalPageShell>
  )
}
