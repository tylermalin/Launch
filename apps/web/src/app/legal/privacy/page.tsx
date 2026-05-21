import type { Metadata } from 'next'
import '../legal-doc.css'
import LegalPageShell from '../_shared/LegalPageShell'

export const metadata: Metadata = {
  title: 'Privacy Policy · Mālama Labs',
  description:
    'How Mālama Labs Inc. collects, uses, discloses, and protects Personal Data. 17 sections including GDPR, CCPA, blockchain-immutability limitations, and 72-hour breach notification.',
}

export default function PrivacyPage() {
  return (
    <LegalPageShell
      current="privacy"
      docNumber="DOC · 002"
      eyebrowText="Legal · Privacy Policy"
      titleLead="Privacy"
      titleEmphasis="Policy."
      lede="How Mālama Labs Inc. collects, uses, discloses, and protects Personal Data — and what public, immutable blockchain records mean for your data-subject rights."
      metaRows={[
        { k: 'Status', v: 'In force', accent: true },
        { k: 'Effective', v: 'April 11, 2026' },
        { k: 'Last Updated', v: 'April 28, 2026' },
        { k: 'Version', v: 'v2' },
        { k: 'Sections', v: '17' },
        { k: 'Reading time', v: '~14 min' },
      ]}
      docBar={{
        version: 'Version 2 · In force',
        docId: 'Doc · MLMA-LEGAL-002',
        category: 'Category · Privacy disclosure',
      }}
    >
      <main className="layout">
        <aside className="toc" aria-label="Table of contents">
          <div className="toc-label"><span>Contents</span><span className="count">17 sections</span></div>
          <ol>
            {[
              ['s1','01','Introduction and scope'],['s2','02','Contact information'],
              ['s3','03','Categories of data collected'],['s4','04','Lawful basis for processing'],
              ['s5','05','Purposes of processing'],['s6','06','Cookies and tracking'],
              ['s7','07','Data disclosures'],['s8','08','Data security'],
              ['s9','09','International data transfers'],['s10','10','Data retention'],
              ['s11','11','User rights'],['s12','12','Children’s data'],
              ['s13','13','Blockchain & sensor disclaimer'],['s14','14','Limitation of liability'],
              ['s15','15','Changes to this policy'],['s16','16','Governing law'],
              ['s17','17','Definitions'],['contact','— —','Privacy inquiries'],
            ].map(([id, n, t]) => (
              <li key={id}><a href={`#${id}`}><span className="n">{n}</span><span className="t">{t}</span></a></li>
            ))}
          </ol>
          <div className="toc-actions">
            <a className="btn" href="mailto:privacy@malamalabs.com"><span>Contact privacy team</span><span>↗</span></a>
          </div>
        </aside>

        <article className="content">
          <div className="preamble">
            <p>This <strong>Privacy Policy</strong> governs the collection, use, disclosure, storage, and protection of Personal Data by <strong>Mālama Labs Inc.</strong>, a Delaware corporation (&ldquo;Mālama,&rdquo; &ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). By accessing or using Mālama services, you acknowledge that you have read and understood this Privacy Policy.</p>
            <p>Mālama Labs Inc. acts as the <strong>Controller</strong> of Personal Data unless otherwise specified.</p>
          </div>

          <section className="clause" id="s1">
            <div className="clause-head"><span className="num">§ 01</span><h2>Introduction and scope</h2><a className="anchor" href="#s1">#s1</a></div>
            <div className="clause-body">
              <p>This Policy applies to all Personal Data collected through:</p>
              <ul>
                <li>Websites and launch platforms operated by Mālama.</li>
                <li>Hex Node sales, reservations, and deployments.</li>
                <li>Applications, dashboards, APIs, and developer tools.</li>
                <li>Customer support and communications.</li>
                <li>Token-enabled or blockchain-integrated features.</li>
                <li>Any related online or offline interactions.</li>
              </ul>
            </div>
          </section>

          <section className="clause" id="s2">
            <div className="clause-head"><span className="num">§ 02</span><h2>Contact information</h2><a className="anchor" href="#s2">#s2</a></div>
            <div className="clause-body">
              <div className="contact-block">
                <div className="cell"><div className="k">Data Controller</div><div className="v">Mālama Labs Inc.<br/>8 The Green, Suite A<br/>Dover, Delaware 19901<br/>United States</div></div>
                <div className="cell"><div className="k">Privacy inquiries</div><div className="v"><a href="mailto:privacy@malamalabs.com">privacy@malamalabs.com</a></div></div>
                <div className="cell"><div className="k">GDPR requests</div><div className="v"><a href="mailto:privacy@malamalabs.com?subject=GDPR%20Request">privacy@malamalabs.com</a><br/><span style={{ color: 'var(--mlma-ink-faint)', fontFamily: 'var(--mlma-mono)', fontSize: 11 }}>subject line: &ldquo;GDPR Request&rdquo;</span></div></div>
                <div className="cell"><div className="k">CCPA / CPRA requests</div><div className="v"><a href="mailto:privacy@malamalabs.com?subject=CCPA%20Request">privacy@malamalabs.com</a><br/><span style={{ color: 'var(--mlma-ink-faint)', fontFamily: 'var(--mlma-mono)', fontSize: 11 }}>subject line: &ldquo;CCPA Request&rdquo;</span></div></div>
              </div>
            </div>
          </section>

          <section className="clause" id="s3">
            <div className="clause-head"><span className="num">§ 03</span><h2>Categories of data collected</h2><a className="anchor" href="#s3">#s3</a></div>
            <div className="clause-body">
              <p>We collect Personal Data proportionate to the nature of your interaction with our systems.</p>
              <h3>Identity Data</h3>
              <p>Name, username, organization, role, and where required, identity verification documentation.</p>
              <h3>Contact Data</h3>
              <p>Email address, phone number, billing and shipping address, and communication records.</p>
              <h3>Financial and Transaction Data</h3>
              <p>Purchase records, payment metadata (processed via third-party payment processors such as Stripe or equivalent), wallet addresses, and blockchain transaction identifiers.</p>
              <h3>Technical Data</h3>
              <p>IP address, device identifiers, operating system, browser type, session logs, and diagnostic data.</p>
              <h3>Profile Data</h3>
              <p>Account credentials, preferences, node ownership status, participation history, and support interactions.</p>
              <h3>Usage Data</h3>
              <p>Behavioral interaction data such as page views, clicks, feature usage, and session analytics.</p>
              <h3>Node and Infrastructure Data</h3>
              <ul>
                <li>Node registration and hardware identifiers, including Device DID.</li>
                <li>Deployment metadata and geographic hex cell assignment.</li>
                <li>Telemetry and uptime data.</li>
                <li>Environmental measurement data.</li>
                <li>Approximate geolocation (H3 hex cell resolution — see disclosure below).</li>
                <li>Signed sensor outputs and verification data.</li>
              </ul>

              <div className="callout warn">
                <span className="tag">▲ Important · Public, on-chain geolocation</span>
                <p><strong>Geolocation is published on-chain by design.</strong> The H3 hex cell associated with each Hex Node License is published to the Cardano, Hedera, and/or Base blockchain as required to enforce geographic exclusivity and anchor signed sensor readings to their claimed location.</p>
                <p>H3 hex cells provide approximate geographic location (not precise coordinates). Because blockchain records are immutable and globally readable, the hex-cell association <strong>cannot be deleted, reversed, or restricted</strong> after it is recorded on-chain, even in response to a data-subject deletion request.</p>
                <p>If you do not wish the approximate geographic area of your node to be publicly associated with your license, do not operate a Hex Node.</p>
              </div>

              <h3>Blockchain Data</h3>
              <ul>
                <li>Public wallet addresses.</li>
                <li>Smart contract interactions on Cardano, Hedera, and Base.</li>
                <li>Token holdings or reward eligibility indicators.</li>
                <li>On-chain transaction history.</li>
              </ul>
              <p>Blockchain data is inherently public and immutable. Mālama does not control third-party access to such data.</p>

              <h3>Aggregated Data</h3>
              <p>We may generate anonymized, aggregated datasets for system optimization, network research, and operational reporting. Aggregated data does not identify individuals and is not considered Personal Data under applicable law.</p>
            </div>
          </section>

          <section className="clause" id="s4">
            <div className="clause-head"><span className="num">§ 04</span><h2>Lawful basis for processing</h2><a className="anchor" href="#s4">#s4</a></div>
            <div className="clause-body">
              <p>We process Personal Data under one or more of the following legal bases under applicable law, including <strong>GDPR Article 6</strong>:</p>
              <table className="deftable">
                <thead><tr><th>Basis</th><th>When we rely on it</th></tr></thead>
                <tbody>
                  <tr><td>Performance of contract</td><td>Fulfilling node orders, processing reservations, operating accounts, and providing the core Services you have requested.</td></tr>
                  <tr><td>Legal obligation</td><td>Complying with applicable law, tax obligations, sanctions screening, law enforcement cooperation, and regulatory reporting requirements.</td></tr>
                  <tr><td>Legitimate interests</td><td>Operating and improving the Network, fraud prevention, security monitoring, abuse prevention, and business analytics — balanced against your rights and interests. Records of our Legitimate Interests Assessments are available on request.</td></tr>
                  <tr><td>Consent</td><td>Marketing communications to EU/EEA/UK residents, and any other processing where we have explicitly requested and obtained your consent. Consent may be withdrawn at any time without affecting prior processing.</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="clause" id="s5">
            <div className="clause-head"><span className="num">§ 05</span><h2>Purposes of processing</h2><a className="anchor" href="#s5">#s5</a></div>
            <div className="clause-body">
              <table className="deftable">
                <thead><tr><th>Purpose</th><th>Activities &amp; lawful basis</th></tr></thead>
                <tbody>
                  <tr><td>Service Delivery</td><td>Account creation and management, node provisioning and registration, order fulfillment and logistics. <em>Basis:</em> Contract.</td></tr>
                  <tr><td>Transaction Processing</td><td>Payments, billing, refunds, fraud screening, tax reporting. <em>Basis:</em> Contract; Legal obligation.</td></tr>
                  <tr><td>Network Operations</td><td>Device authentication, sensor validation and telemetry monitoring, reward calculations, MRV system integrity and auditability. <em>Basis:</em> Contract; Legitimate interests.</td></tr>
                  <tr><td>Communications</td><td>Transaction notifications, technical updates, security alerts, customer support. <em>Basis:</em> Contract; Legitimate interests.</td></tr>
                  <tr><td>Product Improvement</td><td>Analytics, performance monitoring, debugging, and system optimization. <em>Basis:</em> Legitimate interests.</td></tr>
                  <tr><td>Legal Compliance</td><td>Regulatory reporting, sanctions screening, law enforcement cooperation. <em>Basis:</em> Legal obligation.</td></tr>
                  <tr><td>Rights Protection</td><td>Enforcement of agreements, dispute resolution, abuse prevention. <em>Basis:</em> Legitimate interests; Legal obligation.</td></tr>
                  <tr><td>Marketing</td><td>Product announcements and updates to existing users (opt-out available at any time). For EU/EEA/UK residents: marketing communications require your prior consent and will only be sent where consent has been obtained. <em>Basis:</em> Legitimate interests (non-EU); Consent (EU/EEA/UK).</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="clause" id="s6">
            <div className="clause-head"><span className="num">§ 06</span><h2>Cookies and tracking technologies</h2><a className="anchor" href="#s6">#s6</a></div>
            <div className="clause-body">
              <p>We use cookies and similar technologies on our websites and applications. Cookies fall into the following categories:</p>
              <table className="deftable">
                <thead><tr><th>Category</th><th>Purpose &amp; consent</th></tr></thead>
                <tbody>
                  <tr><td>Strictly necessary</td><td>Session management, authentication, security, and core site functionality. Cannot be disabled without breaking the Services. <em>Consent:</em> Not required (exempt).</td></tr>
                  <tr><td>Functional</td><td>Storing your preferences (language, display settings) and maintaining user state. <em>Consent:</em> Varies by jurisdiction.</td></tr>
                  <tr><td>Analytics</td><td>Understanding how users interact with the Services, measuring traffic and performance, and improving functionality. <em>Consent:</em> Required (EU/EEA/UK).</td></tr>
                  <tr><td>Marketing</td><td>Tracking interactions to serve relevant communications. We do not use third-party advertising networks. <em>Consent:</em> Required where applicable.</td></tr>
                </tbody>
              </table>
              <p>You may control non-essential cookies through your browser settings, our cookie preference manager where available, or applicable platform-level controls. Functional and analytics cookies are retained for up to <strong>13 months</strong> unless you withdraw consent or clear them earlier.</p>
            </div>
          </section>

          <section className="clause" id="s7">
            <div className="clause-head"><span className="num">§ 07</span><h2>Data disclosures</h2><a className="anchor" href="#s7">#s7</a></div>
            <div className="clause-body">
              <p>We disclose Personal Data only where necessary and have entered into data processing agreements (DPAs) with service providers acting as processors on our behalf, as required by <strong>GDPR Article 28</strong> and applicable equivalents.</p>
              <table className="deftable">
                <thead><tr><th>Recipient</th><th>Examples</th></tr></thead>
                <tbody>
                  <tr><td>Service providers (processors)</td><td>Cloud hosting, analytics, payment processors, logistics, CRM, identity verification. All engaged under DPAs.</td></tr>
                  <tr><td>Professional advisors</td><td>Legal, accounting, audit, insurance, and compliance providers — bound by confidentiality obligations.</td></tr>
                  <tr><td>Ecosystem partners</td><td>Hardware manufacturers, environmental registry partners, infrastructure operators, and data verification entities — engaged under appropriate agreements.</td></tr>
                  <tr><td>Authorities</td><td>Regulators, courts, and law enforcement where legally required or permitted.</td></tr>
                  <tr><td>Corporate transactions</td><td>Acquirers, successors, or financing parties in the event of a merger, acquisition, restructuring, or financing.</td></tr>
                  <tr><td>Blockchain networks</td><td>Certain data is permanently recorded on public Cardano, Hedera, and/or Base networks and is accessible globally and indefinitely.</td></tr>
                </tbody>
              </table>
              <div className="callout accent">
                <span className="tag">● No sale · No cross-context behavioral advertising</span>
                <p>We do <strong>not</strong> sell Personal Data for monetary consideration. We do <strong>not</strong> share Personal Data for cross-context behavioral advertising purposes.</p>
              </div>
            </div>
          </section>

          <section className="clause" id="s8">
            <div className="clause-head"><span className="num">§ 08</span><h2>Data security</h2><a className="anchor" href="#s8">#s8</a></div>
            <div className="clause-body">
              <p>We implement commercially reasonable safeguards, including encryption where applicable, access control frameworks, secure key management, monitoring and logging systems, and vendor security assessments.</p>
              <div className="callout warn">
                <span className="tag">▲ Limitation</span>
                <p>No system, including blockchain or IoT infrastructure, is fully secure. Users assume inherent technological risks associated with decentralized networks, hardware devices, and wallet self-custody.</p>
              </div>
            </div>
          </section>

          <section className="clause" id="s9">
            <div className="clause-head"><span className="num">§ 09</span><h2>International data transfers</h2><a className="anchor" href="#s9">#s9</a></div>
            <div className="clause-body">
              <p>Data may be processed in the United States and other jurisdictions. Where we transfer Personal Data outside the European Economic Area, United Kingdom, or Switzerland to countries not recognized as providing adequate protection, we implement appropriate safeguards including <strong>Standard Contractual Clauses</strong> approved by the European Commission, or equivalent mechanisms.</p>
              <p>Distributed systems — including Cardano, Hedera, Base, and cloud infrastructure — may involve global data propagation. Public blockchain data is accessible worldwide by construction and cannot be restricted by geographic transfer limitations.</p>
            </div>
          </section>

          <section className="clause" id="s10">
            <div className="clause-head"><span className="num">§ 10</span><h2>Data retention</h2><a className="anchor" href="#s10">#s10</a></div>
            <div className="clause-body">
              <table className="deftable">
                <thead><tr><th>Data type</th><th>Retention period</th></tr></thead>
                <tbody>
                  <tr><td>Transaction and account data</td><td>7 years from the date of transaction or account closure, unless a longer period is required by applicable law or a legal hold is in effect.</td></tr>
                  <tr><td>Support and communication records</td><td>3 years from the close of the relevant matter, or as required for dispute resolution.</td></tr>
                  <tr><td>Technical logs and diagnostic data</td><td>Up to 12 months for operational and security purposes, unless required longer for an ongoing investigation.</td></tr>
                  <tr><td>Marketing consent records</td><td>Retained for the duration of the relationship and for 3 years thereafter to demonstrate consent compliance.</td></tr>
                  <tr><td>Blockchain and on-chain data</td><td>Indefinite — blockchain data is immutable and cannot be deleted by Mālama or anyone else.</td></tr>
                  <tr><td>Aggregated and anonymized data</td><td>Indefinite — not Personal Data once genuinely anonymized.</td></tr>
                </tbody>
              </table>
              <p>When data is no longer required, we delete, anonymize, or archive it securely in accordance with applicable legal requirements.</p>
            </div>
          </section>

          <section className="clause" id="s11">
            <div className="clause-head"><span className="num">§ 11</span><h2>User rights</h2><a className="anchor" href="#s11">#s11</a></div>
            <div className="clause-body">
              <p>Subject to applicable law and the limitations described below, you may request to access, correct, delete, restrict processing of, or receive a portable copy of your Personal Data, and to withdraw consent or opt out of marketing at any time. To exercise any right, contact <a href="mailto:privacy@malamalabs.com" style={{ color: 'var(--mlma-accent)' }}>privacy@malamalabs.com</a>.</p>

              <div className="callout warn">
                <span className="tag">▲ Important limitations</span>
                <p>Blockchain records — including on-chain hex cell assignments, wallet addresses, transaction history, and SaveCard data — <strong>cannot be altered or deleted</strong> by Mālama or any other party.</p>
                <p>Legal, contractual, and regulatory obligations may also prevent deletion or restrict processing of certain data. Identity verification is required before we can fulfill data-subject requests.</p>
              </div>

              <h3>11.1 · EU/EEA, UK, and Swiss residents (GDPR / UK GDPR)</h3>
              <p>If you are located in the European Economic Area, United Kingdom, or Switzerland, you have the following rights under the General Data Protection Regulation or equivalent UK/Swiss law:</p>
              <table className="deftable">
                <tbody>
                  <tr><td>Access</td><td>To your Personal Data (Article 15).</td></tr>
                  <tr><td>Rectification</td><td>Of inaccurate data (Article 16).</td></tr>
                  <tr><td>Erasure</td><td>&ldquo;Right to be forgotten,&rdquo; subject to the on-chain immutability limitation above (Article 17).</td></tr>
                  <tr><td>Restriction</td><td>Of processing in specified circumstances (Article 18).</td></tr>
                  <tr><td>Data portability</td><td>Where processing is automated and based on contract or consent (Article 20).</td></tr>
                  <tr><td>Objection</td><td>To processing based on legitimate interests (Article 21).</td></tr>
                  <tr><td>Withdrawal of consent</td><td>At any time where processing is consent-based, without affecting prior processing (Article 7).</td></tr>
                </tbody>
              </table>
              <p>You have the right to lodge a complaint with your local <strong>Data Protection Authority</strong> at any time.</p>

              <div className="callout accent">
                <span className="tag">● Breach notification · 72 hours</span>
                <p>Mālama will notify the competent supervisory authority of any Personal Data breach that poses a risk to rights and freedoms within <strong>seventy-two (72) hours</strong> of becoming aware, as required under GDPR Article 33.</p>
                <p>Where a breach is likely to result in a high risk to your rights and freedoms, Mālama will also notify affected individuals directly without undue delay, as required under GDPR Article 34, unless an exemption applies.</p>
              </div>

              <p><strong>EU/UK Representative.</strong> Mālama is in the process of designating an EU/UK representative as required by GDPR Article 27 and UK GDPR Article 27. Until this designation is complete, direct all EU/UK data protection inquiries to <a href="mailto:privacy@malamalabs.com?subject=GDPR%20Request" style={{ color: 'var(--mlma-accent)' }}>privacy@malamalabs.com</a> with subject line &ldquo;GDPR Request.&rdquo; Mālama will not commence active marketing to EU/EEA/UK residents at scale prior to completing this designation.</p>

              <h3>11.2 · California residents (CCPA / CPRA)</h3>
              <p>If you are a California resident, you have the following rights under the California Consumer Privacy Act as amended by the California Privacy Rights Act:</p>
              <ul>
                <li>Know what Personal Information is collected, used, shared, or sold.</li>
                <li>Delete Personal Information collected from you, subject to certain exceptions.</li>
                <li>Correct inaccurate Personal Information.</li>
                <li>Opt out of the sale or sharing of Personal Information for cross-context behavioral advertising.</li>
                <li>Limit the use and disclosure of sensitive Personal Information.</li>
                <li>Non-discrimination for exercising these rights.</li>
              </ul>
              <p>Mālama does not sell Personal Information for monetary consideration. Mālama does not share Personal Information for cross-context behavioral advertising. Mālama does not knowingly sell or share the Personal Information of consumers under 16.</p>
              <p>To exercise a CCPA/CPRA right: email <a href="mailto:privacy@malamalabs.com?subject=CCPA%20Request" style={{ color: 'var(--mlma-accent)' }}>privacy@malamalabs.com</a> with subject line &ldquo;CCPA Request,&rdquo; your full name, California residency address, and the specific right you wish to exercise. We will respond within <strong>forty-five (45) days</strong> and may extend by an additional forty-five (45) days with notice, as permitted by law.</p>

              <h3>11.3 · Other U.S. state privacy laws</h3>
              <p>If you are a resident of Virginia (VCDPA), Colorado (CPA), Connecticut (CTDPA), Utah (UCPA), or another U.S. state with a comprehensive privacy law, you may have rights substantially similar to those described in Section 11.2. Contact us at <a href="mailto:privacy@malamalabs.com?subject=State%20Privacy%20Request" style={{ color: 'var(--mlma-accent)' }}>privacy@malamalabs.com</a> with subject line &ldquo;State Privacy Request&rdquo; and identify your state of residence.</p>
            </div>
          </section>

          <section className="clause" id="s12">
            <div className="clause-head"><span className="num">§ 12</span><h2>Children&rsquo;s data</h2><a className="anchor" href="#s12">#s12</a></div>
            <div className="clause-body">
              <p>Our Services are not intended for individuals under 18. We do not knowingly collect Personal Data from anyone under 18. If we become aware that we have collected Personal Data from a minor without appropriate authorization, we will take prompt corrective action, including deletion where possible and permitted by applicable law.</p>
            </div>
          </section>

          <section className="clause" id="s13">
            <div className="clause-head"><span className="num">§ 13</span><h2>Blockchain and sensor system disclaimer</h2><a className="anchor" href="#s13">#s13</a></div>
            <div className="clause-body">
              <p>Due to the nature of Mālama&rsquo;s infrastructure:</p>
              <ul>
                <li>Sensor data may be cryptographically signed and permanently recorded on public blockchains (Cardano, Hedera, Base).</li>
                <li>Environmental measurement data produced by your node — including SaveCards used in carbon credit verification and AI compute energy attestation — may be used in regulatory, financial, or carbon market contexts by third parties.</li>
                <li>Blockchain entries cannot be modified or erased by Mālama or any other party.</li>
                <li>Third parties may independently analyze or derive insights from public blockchain data.</li>
                <li>Geographic hex cell assignments are public and permanent once recorded on-chain.</li>
              </ul>
              <p>Users acknowledge and accept these characteristics as a condition of operating a Hex Node or participating in the Network.</p>
            </div>
          </section>

          <section className="clause" id="s14">
            <div className="clause-head"><span className="num">§ 14</span><h2>Limitation of liability (privacy context)</h2><a className="anchor" href="#s14">#s14</a></div>
            <div className="clause-body">
              <div className="callout warn">
                <span className="tag">▲ Notice · Read carefully</span>
                <p className="legalese"><span className="caps">To the maximum extent permitted by law:</span></p>
              </div>
              <ul>
                <li>Mālama is not liable for third-party access to, use of, or analysis of public blockchain data.</li>
                <li>Mālama does not guarantee anonymity in decentralized systems — public wallet addresses and on-chain activity may be linkable to individuals by third parties using blockchain analytics.</li>
                <li>Mālama is not responsible for privacy breaches arising from your own negligence, wallet compromise, private key loss, or failures in external infrastructure not operated by Mālama.</li>
              </ul>
            </div>
          </section>

          <section className="clause" id="s15">
            <div className="clause-head"><span className="num">§ 15</span><h2>Changes to this policy</h2><a className="anchor" href="#s15">#s15</a></div>
            <div className="clause-body">
              <p>We may update this Privacy Policy periodically. When we make material changes, we will update the &ldquo;Last Updated&rdquo; date at the top of this page and, where required by law or where we have your contact information, provide notice by email or prominent website announcement. Continued use of the Services after revised terms become effective constitutes acceptance of the updated Policy.</p>
            </div>
          </section>

          <section className="clause" id="s16">
            <div className="clause-head"><span className="num">§ 16</span><h2>Governing law</h2><a className="anchor" href="#s16">#s16</a></div>
            <div className="clause-body">
              <p>This Privacy Policy is governed by the laws of the State of Delaware, without regard to conflict of law principles, except to the extent superseded by applicable federal law or mandatory data protection law in the user&rsquo;s jurisdiction (including <strong>GDPR</strong> for EU/EEA/UK residents).</p>
            </div>
          </section>

          <section className="clause" id="s17">
            <div className="clause-head"><span className="num">§ 17</span><h2>Definitions</h2><a className="anchor" href="#s17">#s17</a></div>
            <div className="clause-body">
              <table className="deftable">
                <thead><tr><th>Term</th><th>Definition</th></tr></thead>
                <tbody>
                  <tr><td>Personal Data</td><td>Information that identifies or can reasonably be linked to an identified or identifiable natural person, as defined by applicable law including GDPR and CCPA.</td></tr>
                  <tr><td>Controller</td><td>Entity that determines the purposes and means of processing Personal Data. Mālama Labs Inc. is the Controller for Personal Data collected through its Services.</td></tr>
                  <tr><td>Processor</td><td>Entity that processes Personal Data on behalf of the Controller. Mālama&rsquo;s service providers acting on written instructions under a DPA.</td></tr>
                  <tr><td>Blockchain Data</td><td>Public, immutable ledger data recorded on Cardano, Hedera, Base, or other blockchain networks.</td></tr>
                  <tr><td>DPA</td><td>Data Processing Agreement — a written agreement between Controller and Processor governing the terms of processing as required by GDPR Article 28.</td></tr>
                  <tr><td>LIA</td><td>Legitimate Interests Assessment — a balancing test conducted to document that Mālama&rsquo;s legitimate interests are not overridden by data-subject rights when relying on the legitimate interests lawful basis.</td></tr>
                  <tr><td>H3 Hex Cell</td><td>A geographic area defined by Uber&rsquo;s H3 geospatial indexing system. H3 hex cells used in the Mālama network provide approximate location, not precise GPS coordinates.</td></tr>
                  <tr><td>SaveCard</td><td>A cryptographically signed, on-chain environmental data record produced by Mālama sensor infrastructure and validated by Hex Nodes.</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="clause" id="contact" style={{ borderBottom: 'none' }}>
            <div className="clause-head"><span className="num">CONTACT</span><h2>All privacy inquiries</h2><a className="anchor" href="#contact">#contact</a></div>
            <div className="clause-body">
              <p>Use the routing below so requests reach the correct handler under the applicable framework. Identity verification is required before fulfillment.</p>
              <div className="contact-block">
                <div className="cell"><div className="k">Registered address</div><div className="v">Mālama Labs Inc.<br/>8 The Green, Suite A<br/>Dover, Delaware 19901</div></div>
                <div className="cell"><div className="k">General privacy</div><div className="v"><a href="mailto:privacy@malamalabs.com">privacy@malamalabs.com</a></div></div>
                <div className="cell"><div className="k">GDPR requests</div><div className="v"><a href="mailto:privacy@malamalabs.com?subject=GDPR%20Request">privacy@malamalabs.com</a><br/><span style={{ color: 'var(--mlma-ink-faint)', fontFamily: 'var(--mlma-mono)', fontSize: 11 }}>subject: &ldquo;GDPR Request&rdquo;</span></div></div>
                <div className="cell"><div className="k">CCPA / CPRA requests</div><div className="v"><a href="mailto:privacy@malamalabs.com?subject=CCPA%20Request">privacy@malamalabs.com</a><br/><span style={{ color: 'var(--mlma-ink-faint)', fontFamily: 'var(--mlma-mono)', fontSize: 11 }}>subject: &ldquo;CCPA Request&rdquo;</span></div></div>
                <div className="cell"><div className="k">Other U.S. state requests</div><div className="v"><a href="mailto:privacy@malamalabs.com?subject=State%20Privacy%20Request">privacy@malamalabs.com</a><br/><span style={{ color: 'var(--mlma-ink-faint)', fontFamily: 'var(--mlma-mono)', fontSize: 11 }}>subject: &ldquo;State Privacy Request&rdquo; + state</span></div></div>
                <div className="cell"><div className="k">Website</div><div className="v"><a href="https://malamalabs.com">malamalabs.com</a></div></div>
              </div>

              <div className="sig-strip">
                <div className="label">— END OF DOCUMENT</div>
                <p className="text">Mālama Labs, Inc. · Privacy Policy · Effective April 11, 2026 · Last Updated April 28, 2026 (v2)</p>
                <p className="footnote">Questions: <a href="mailto:privacy@malamalabs.com" style={{ color: 'var(--mlma-accent)' }}>privacy@malamalabs.com</a> · 8 The Green, Suite A, Dover, Delaware 19901.</p>
              </div>
            </div>
          </section>
        </article>
      </main>
    </LegalPageShell>
  )
}
