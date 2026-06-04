import type { Metadata } from 'next'
import Link from 'next/link'
import '../legal-doc.css'
import TocScrollSpy from './TocScrollSpy'

export const metadata: Metadata = {
  title: 'Token & Rewards Risk Disclosure | Mālama Labs',
  description:
    'The plain-language risks of participating in the Mālama network. Token volatility, regulatory uncertainty, deployment forfeiture, audit gates, slashing, and the revenue-funding transition.',
}

/**
 * Token & Rewards Risk Disclosure
 *
 * Implementation of the claude.ai/design handoff:
 *   mH0CtQnwhGHbl-2gO-T4Mw → Token and Rewards Risk Disclosure.html
 *
 * This static route takes precedence over the dynamic [slug] route for
 * the `token-rewards-risk` slug. The other three legal docs (Terms,
 * Privacy, Hex Node Agreement) still fall through to [slug].
 */
export default function TokenRewardsRiskPage() {
  return (
    <div className="mlma-legal-doc">
      {/* document switcher */}
      <div className="crumb">
        <div className="crumb-inner">
          <Link className="back" href="/legal">
            ← All legal documents
          </Link>
          <div className="switcher">
            <Link href="/legal/terms">Terms &amp; Conditions</Link>
            <Link href="/legal/privacy">Privacy Policy</Link>
            <Link href="/legal/hex-node-purchase">Hex Node Agreement</Link>
            <Link href="/legal/token-rewards-risk" className="current">
              Risk Disclosure
            </Link>
          </div>
        </div>
      </div>

      {/* document control bar */}
      <div className="docbar" id="top">
        <div className="docbar-inner">
          <div className="left">
            <span className="live">Version 2 · In force</span>
            <span className="sep">/</span>
            <span>Doc · MLMA-LEGAL-005</span>
            <span className="sep">/</span>
            <span>Category · Risk disclosure</span>
          </div>
          <div className="right">
            <a href="#" id="mlma-copy-link">
              ↗ Copy link
            </a>
            <span className="dot">·</span>
            <a href="mailto:legal@malamalabs.com">✉ legal@malamalabs.com</a>
          </div>
        </div>
      </div>

      {/* hero */}
      <header className="hero">
        <div className="hero-inner">
          <div>
            <div className="eyebrow">
              <span className="num">DOC · 005</span> / Risk disclosure · Read before reserving
            </div>
            <h1>
              Token &amp; Rewards <em>Risk Disclosure.</em>
            </h1>
            <p className="lede">
              The plain-language risks of participating in the Mālama network. Token
              volatility, regulatory uncertainty, deployment forfeiture, audit gates,
              slashing, and the revenue-funding transition.
            </p>
          </div>

          <aside className="meta-card" aria-label="Document metadata">
            <div className="row">
              <span className="k">Status</span>
              <span className="v accent">In force</span>
            </div>
            <div className="row">
              <span className="k">Effective</span>
              <span className="v">April 11, 2026</span>
            </div>
            <div className="row">
              <span className="k">Last Updated</span>
              <span className="v">April 28, 2026</span>
            </div>
            <div className="row">
              <span className="k">Version</span>
              <span className="v">v2</span>
            </div>
            <div className="row">
              <span className="k">Sections</span>
              <span className="v">15 (+ 2a, 5a)</span>
            </div>
            <div className="row">
              <span className="k">Reading time</span>
              <span className="v">~20 min</span>
            </div>
          </aside>
        </div>
      </header>

      {/* main content */}
      <main className="layout">
        {/* TOC */}
        <aside className="toc" aria-label="Table of contents">
          <div className="toc-label">
            <span>Contents</span>
            <span className="count">15 sections</span>
          </div>
          <ol>
            <li>
              <a href="#s1">
                <span className="n">01</span>
                <span className="t">No guarantee of rewards</span>
              </a>
            </li>
            <li>
              <a href="#s2">
                <span className="n">02</span>
                <span className="t">Rewards are not investments</span>
              </a>
            </li>
            <li>
              <a href="#s2a">
                <span className="n">2A</span>
                <span className="t">Digital tool classification</span>
              </a>
            </li>
            <li>
              <a href="#s3">
                <span className="n">03</span>
                <span className="t">Token value &amp; market risk</span>
              </a>
            </li>
            <li>
              <a href="#s4">
                <span className="n">04</span>
                <span className="t">Regulatory uncertainty</span>
              </a>
            </li>
            <li>
              <a href="#s5">
                <span className="n">05</span>
                <span className="t">Network &amp; performance dependency</span>
              </a>
            </li>
            <li>
              <a href="#s5a">
                <span className="n">5A</span>
                <span className="t">Genesis 200-specific risks</span>
              </a>
            </li>
            <li>
              <a href="#s6">
                <span className="n">06</span>
                <span className="t">Technical &amp; operational risks</span>
              </a>
            </li>
            <li>
              <a href="#s7">
                <span className="n">07</span>
                <span className="t">Blockchain risks</span>
              </a>
            </li>
            <li>
              <a href="#s8">
                <span className="n">08</span>
                <span className="t">Wallet &amp; key management</span>
              </a>
            </li>
            <li>
              <a href="#s9">
                <span className="n">09</span>
                <span className="t">Environmental data &amp; credit risks</span>
              </a>
            </li>
            <li>
              <a href="#s10">
                <span className="n">10</span>
                <span className="t">Changes to reward structures</span>
              </a>
            </li>
            <li>
              <a href="#s11">
                <span className="n">11</span>
                <span className="t">Tax responsibility</span>
              </a>
            </li>
            <li>
              <a href="#s12">
                <span className="n">12</span>
                <span className="t">No reliance</span>
              </a>
            </li>
            <li>
              <a href="#s13">
                <span className="n">13</span>
                <span className="t">Third-party risks</span>
              </a>
            </li>
            <li>
              <a href="#s14">
                <span className="n">14</span>
                <span className="t">Limitation of liability</span>
              </a>
            </li>
            <li>
              <a href="#s15">
                <span className="n">15</span>
                <span className="t">Acknowledgment</span>
              </a>
            </li>
            <li>
              <a href="#contact">
                <span className="n">- -</span>
                <span className="t">Contact</span>
              </a>
            </li>
          </ol>
          <div className="toc-actions">
            <a className="btn" href="mailto:legal@malamalabs.com">
              <span>Contact legal</span>
              <span>↗</span>
            </a>
          </div>
        </aside>

        {/* content */}
        <article className="content">
          {/* preamble */}
          <div className="preamble">
            <p>
              This <strong>Token &amp; Rewards Risk Disclosure</strong> (&ldquo;Disclosure&rdquo;)
              applies to your participation in the Mālama network, including any interaction
              with Hex Nodes, MLMA tokens, validation rewards, environmental assets, or
              blockchain-enabled features (collectively, &ldquo;Rewards&rdquo;).
            </p>
            <p>
              This Disclosure is incorporated into the{' '}
              <Link
                href="/legal/terms"
                style={{
                  color: 'var(--mlma-accent)',
                  textDecoration: 'underline',
                  textDecorationColor: 'var(--mlma-line-bright)',
                  textUnderlineOffset: 3,
                }}
              >
                Mālama Terms and Conditions
              </Link>{' '}
              and the{' '}
              <Link
                href="/legal/hex-node-purchase"
                style={{
                  color: 'var(--mlma-accent)',
                  textDecoration: 'underline',
                  textDecorationColor: 'var(--mlma-line-bright)',
                  textUnderlineOffset: 3,
                }}
              >
                Hex Node Purchase &amp; Preorder Agreement
              </Link>
              .{' '}
              <strong>
                By purchasing a Hex Node, connecting a wallet, or participating in the
                network, you acknowledge and accept the risks described below.
              </strong>
            </p>
          </div>

          {/* §1 */}
          <section className="clause" id="s1">
            <div className="clause-head">
              <span className="num">§ 01</span>
              <h2>No guarantee of rewards or earnings</h2>
              <a className="anchor" href="#s1">
                #s1
              </a>
            </div>
            <div className="clause-body">
              <p>
                Participation in the Mālama network does not guarantee that you will receive
                any Rewards. Any potential Rewards:
              </p>
              <ul>
                <li>Are not guaranteed and may be zero in any given period.</li>
                <li>May vary substantially over time.</li>
                <li>
                  Depend on factors outside your control, including network size, data volume,
                  MLMA market price, and protocol governance decisions.
                </li>
                <li>
                  May be reduced to zero if your node fails to maintain required uptime, data
                  quality standards, or audit compliance.
                </li>
              </ul>
              <div className="callout warn">
                <span className="tag">▲ Notice · No profit expectation</span>
                <p>
                  Mālama does not promise income, yield, return on investment, appreciation in
                  value, or resale opportunity.{' '}
                  <strong>
                    You should not purchase a node or participate in the network with an
                    expectation of profit.
                  </strong>
                </p>
              </div>
            </div>
          </section>

          {/* §2 */}
          <section className="clause" id="s2">
            <div className="clause-head">
              <span className="num">§ 02</span>
              <h2>Rewards are not investment products</h2>
              <a className="anchor" href="#s2">
                #s2
              </a>
            </div>
            <div className="clause-body">
              <p>
                Rewards, tokens, credits, or similar instruments made available through the
                network:
              </p>
              <ul className="neg-list">
                <li>
                  Are not offered as securities and are not offered with a promise of profit
                  from the efforts of others.
                </li>
                <li>Are not investment contracts.</li>
                <li>Are not deposits or savings products.</li>
                <li>Are not insured by any government, agency, or financial institution.</li>
              </ul>
              <p>
                Nothing in Mālama materials constitutes financial advice, investment advice,
                or a recommendation to purchase or hold any digital asset.{' '}
                <strong>You are solely responsible for your decisions.</strong>
              </p>
            </div>
          </section>

          {/* §2A */}
          <section className="clause" id="s2a">
            <div className="clause-head">
              <span className="num">§ 2A</span>
              <h2>Digital tool classification</h2>
              <a className="anchor" href="#s2a">
                #s2a
              </a>
            </div>
            <div className="clause-body">
              <p>
                MLMA is classified as a{' '}
                <strong>digital tool under the March 17, 2026 SEC-CFTC Joint Interpretation
                (S7-2026-09)</strong>: an asset used to perform a function in the network, not
                held as an investment instrument. Its functions are:
              </p>

              <div className="spec-list">
                <div className="row">
                  <div className="k">Operator settlement</div>
                  <div className="v">
                    MLMA is issued to node operators in consideration of active, continuous
                    labor: hardware installation, uptime maintenance, and validated data
                    contributions.{' '}
                    <strong>MLMA is not designed to be earned by passive holding.</strong>
                  </div>
                </div>
                <div className="row">
                  <div className="k">Protocol fee burn</div>
                  <div className="v">
                    A portion of protocol revenue is used programmatically to purchase and
                    permanently remove MLMA from circulation, creating a function-driven demand
                    mechanism.
                  </div>
                </div>
                <div className="row">
                  <div className="k">Data payment settlement</div>
                  <div className="v">
                    Institutional buyers may pay for data access in MLMA, creating
                    transactional demand from enterprise data usage.
                  </div>
                </div>
                <div className="row">
                  <div className="k">veMLMA governance</div>
                  <div className="v">
                    MLMA may be voluntarily locked to receive non-transferable veMLMA, which
                    confers protocol governance rights over specified parameters, subject to
                    PONO credential eligibility.
                  </div>
                </div>
              </div>

              <p>
                Mālama classifies MLMA as a{' '}
                <strong>
                  digital tool under S7-2026-09: an asset used and consumed to perform a
                  function in the network, not a security, investment contract, share, deposit,
                  savings product, or claim on revenue.
                </strong>{' '}
                MLMA is not a &ldquo;utility token&rdquo; in the loose pre-Interpretation sense,
                which is not a category under S7-2026-09. The Company does not undertake
                managerial efforts for the benefit of MLMA holders and does not guarantee token
                value.
              </p>

              <div className="callout warn">
                <span className="tag">▲ Important limitation on this characterization</span>
                <p>
                  The regulatory classification of any digital asset is inherently uncertain
                  and depends on facts and circumstances that may change, including how the
                  token is marketed, traded, and perceived by purchasers.
                </p>
                <p>
                  Mālama&rsquo;s legal partner, <strong>Beneficial Technology</strong>, is
                  conducting an ongoing Howey test analysis.{' '}
                  <strong>
                    You should not rely on Mālama&rsquo;s intended characterization as a
                    determination of how regulators or courts in your jurisdiction will
                    classify MLMA.
                  </strong>{' '}
                  You must consult your own qualified legal counsel before acquiring MLMA or
                  participating in the network.
                </p>
              </div>
            </div>
          </section>

          {/* §3 */}
          <section className="clause" id="s3">
            <div className="clause-head">
              <span className="num">§ 03</span>
              <h2>Token value and market risk</h2>
              <a className="anchor" href="#s3">
                #s3
              </a>
            </div>
            <div className="clause-body">
              <p>If Rewards include MLMA tokens or other transferable digital assets:</p>
              <ul>
                <li>
                  Their value may be highly volatile and <strong>may decline to zero.</strong>
                </li>
                <li>
                  Liquid secondary markets may not exist or may become illiquid at any time.
                </li>
                <li>
                  Trading or transfer may be restricted or prohibited in your jurisdiction.
                </li>
                <li>
                  Prices may be influenced by external factors entirely unrelated to
                  Mālama&rsquo;s business or the protocol&rsquo;s performance.
                </li>
                <li>
                  The MLMA emission schedule is <strong>fixed</strong>. The protocol cannot
                  and will not issue additional tokens to stabilize price or compensate for
                  price decline.
                </li>
              </ul>
              <p>
                Mālama does not control secondary markets and does not guarantee that any MLMA
                token can be sold or exchanged at any particular price or at all.
              </p>
            </div>
          </section>

          {/* §4 */}
          <section className="clause" id="s4">
            <div className="clause-head">
              <span className="num">§ 04</span>
              <h2>Regulatory uncertainty</h2>
              <a className="anchor" href="#s4">
                #s4
              </a>
            </div>
            <div className="clause-body">
              <p>
                The legal and regulatory treatment of tokens, digital assets, environmental
                credits, and decentralized infrastructure is evolving rapidly. Risks include:
              </p>
              <ul>
                <li>
                  Tokens being reclassified as securities or other regulated instruments by
                  regulators.
                </li>
                <li>Restrictions on use, transfer, or trading in your jurisdiction.</li>
                <li>
                  Licensing or compliance requirements that affect Mālama&rsquo;s ability to
                  operate.
                </li>
                <li>Tax treatment changes, including retroactive changes.</li>
                <li>
                  Enforcement actions affecting availability, functionality, or value of
                  Rewards.
                </li>
              </ul>
              <p>
                Mālama may modify or discontinue token-related features, restrict access in
                certain jurisdictions, delay or limit distributions, or change reward
                structures in response to legal requirements.{' '}
                <strong>
                  Such changes do not constitute a breach of any agreement with you.
                </strong>
              </p>
            </div>
          </section>

          {/* §5 */}
          <section className="clause" id="s5">
            <div className="clause-head">
              <span className="num">§ 05</span>
              <h2>Network and performance dependency</h2>
              <a className="anchor" href="#s5">
                #s5
              </a>
            </div>
            <div className="clause-body">
              <p>Validation rewards, if any, depend on:</p>
              <ul>
                <li>
                  Node uptime above 90%. Nodes below this threshold earn{' '}
                  <strong>zero validation rewards</strong> for that period.
                </li>
                <li>
                  Your hex&rsquo;s Hex Type multiplier (0.95× to 1.30×: Urban Core, Urban,
                  Suburban, Rural, Remote), governance-reviewed and subject to change.
                </li>
                <li>
                  Your hex&rsquo;s Data Demand Score multiplier (0.70× to 1.30×), recomputed
                  quarterly from independent demand signals, not operator behavior.
                </li>
                <li>
                  Cohort composition -{' '}
                  <strong>rewards are cohort-normalized to the 25M Genesis pool, relative and not fixed.</strong>
                </li>
                <li>
                  Protocol updates, third-party sensor deployments, and enterprise data demand
                  in your hex zone.
                </li>
              </ul>
              <p>Failures or underperformance in any of these areas may reduce or eliminate Rewards.</p>
            </div>
          </section>

          {/* §5A */}
          <section className="clause" id="s5a">
            <div className="clause-head">
              <span className="num">§ 5A</span>
              <h2>Genesis 200-specific risks</h2>
              <a className="anchor" href="#s5a">
                #s5a
              </a>
            </div>
            <div className="clause-body">
              <p>
                The following risks are specific to the Genesis 200 program and should be
                understood before reserving a node.
              </p>

              <h3>Competitive reward dilution</h3>
              <p>
                Rewards are competitive and relative to the entire active validator set, not
                fixed per node. Each operator&rsquo;s Final Earned MLMA is their Calculated Eligibility
                divided by the cohort total, scaled to the fixed 25M Genesis pool.{' '}
                <strong>
                  As more Genesis operators qualify, each operator&rsquo;s share of the fixed
                  25M pool adjusts proportionally.
                </strong>{' '}
                Joining early does not lock in a specific reward amount. Final amounts depend
                on the full cohort&rsquo;s composition.
              </p>

              <h3>Allocation forfeiture risk</h3>
              <div className="callout warn">
                <span className="tag">▲ Forfeiture · 90-day deployment window</span>
                <p>
                  Failure to deploy your Hex Node within{' '}
                  <strong>90 days of hardware delivery</strong> results in permanent forfeiture
                  of your <strong>125,000 MLMA allocation</strong> and your{' '}
                  <strong>NFT-HEX License</strong>, with no refund.
                </p>
                <p>
                  The 90-day window begins at hardware delivery, not at reservation. Hardware
                  is estimated to ship by end of December 2026. If you cannot physically install
                  and register your node within 90 days of receiving it, you risk losing both
                  the hardware value and the entire MLMA allocation.
                </p>
                <p>
                  Extensions require written request to Mālama <strong>before</strong> the
                  window expires.
                </p>
              </div>

              <h3>Audit gate before emissions</h3>
              <p>
                MLMA validation rewards do not begin automatically at hardware boot. They
                begin following a Genesis Hex Sale audit in <strong>early 2027</strong> that
                confirms your node is operational, compliant, and properly registered. If your
                node does not pass the audit initially, rewards are withheld until compliance
                is confirmed. Your 125,000 MLMA vesting allocation is not affected by audit
                status. Only validation rewards are withheld during the period of
                non-compliance.
              </p>

              <h3>Genesis phase non-steady-state</h3>
              <p>
                Year 1 reward levels are a deliberately temporary bootstrapping mechanism. The{' '}
                <strong>1.5× Genesis Multiplier</strong>, constrained early validator
                competition, and front-loaded emission taper and the Year 1 Genesis multiplier produce elevated reward weight
                during the cold-start phase.{' '}
                <strong>
                  These economics are not sustainable or representative of long-term returns.
                </strong>{' '}
                The Genesis Multiplier expires permanently at the end of Year 1. Emissions follow a fixed 8-year smooth taper (60M MLMA total: 12 / 14 / 12 / 9 / 6 / 4 / 2 / 1M), winding down to zero after Year 8. Any projected earnings based on Year 1 Genesis
                phase economics will not persist beyond that phase.
              </p>

              <h3>Emission taper and revenue transition</h3>
              <div className="callout warn">
                <span className="tag">▲ Revenue-funding transition</span>
                <p>
                  Scheduled emissions follow a fixed 8-year smooth taper (60M MLMA total: 12 / 14 / 12 / 9 / 6 / 4 / 2 / 1M), winding down to zero after Year 8. The network transitions to revenue-funded operator distributions by Years 4-5; from Year 9 all operator rewards come from <strong>protocol revenue only</strong>.
                </p>
                <p>
                  If protocol revenue in Years 4-5 is lower than projected. Whether due to
                  slower enterprise customer adoption, registry acceptance delays, or
                  competitive pressure. Operator rewards will be proportionally lower.{' '}
                  <strong>Emissions taper toward zero over this period, so later-year distributions increasingly depend on actual protocol revenue.</strong>
                </p>
                <p>
                  Operators who model later-year economics based on peak early-year emission levels are modeling a different regime.
                </p>
              </div>

              <h3>Slashing penalty</h3>
              <p>
                Fraudulent, manipulated, or falsified attestations may trigger a{' '}
                <strong>10% MLMA slashing penalty</strong> applied to your staked or allocated
                MLMA. This includes spoofed sensor data, location fraud, double-signing, or
                any other attempt to manipulate the validation consensus.{' '}
                <strong>Slashing is protocol-enforced and is not reversible.</strong> Operators
                are responsible for ensuring their node software is correctly configured and
                that they have not tampered with the hardware or firmware.
              </p>

              <h3>veMLMA lock illiquidity</h3>
              <p>
                MLMA tokens voluntarily locked as veMLMA are illiquid for the duration of the
                lock period (<strong>3 to 24 months</strong>). If you lock your allocation or
                validation rewards as veMLMA, you cannot access, transfer, or sell those tokens
                until the lock expires, regardless of market conditions, personal financial
                need, or changes in your circumstances.{' '}
                <strong>
                  veMLMA locking is entirely voluntary but the illiquidity risk is absolute
                  once the lock is committed.
                </strong>
              </p>

              <h3>PONO governance eligibility</h3>
              <p>
                Participation in veMLMA governance votes requires a{' '}
                <strong>PONO non-transferable eligibility credential</strong> issued by the
                Mālama Foundation, in addition to holding veMLMA. PONO is issued based on KYB
                completion, active hardware deployment, and operating history. Holding MLMA or
                veMLMA alone does not entitle you to governance participation. PONO criteria
                will be published before mainnet governance goes live.{' '}
                <strong>PONO may be revoked for violations of network rules.</strong>
              </p>
            </div>
          </section>

          {/* §6 */}
          <section className="clause" id="s6">
            <div className="clause-head">
              <span className="num">§ 06</span>
              <h2>Technical and operational risks</h2>
              <a className="anchor" href="#s6">
                #s6
              </a>
            </div>
            <div className="clause-body">
              <p>Participation in the network involves technical risks, including:</p>
              <ul>
                <li>Hardware failure, connectivity issues, power interruptions.</li>
                <li>Firmware or software bugs and security vulnerabilities.</li>
                <li>Incorrect configuration or installation errors.</li>
                <li>Data transmission errors affecting data quality and validation acceptance.</li>
                <li>Incompatibility with required firmware or software updates.</li>
                <li>
                  Physical damage from weather, flooding, or other environmental conditions.
                </li>
              </ul>
              <p>
                Mālama is not responsible for losses resulting from improper setup or
                maintenance, failure to follow operating instructions, or environmental
                conditions affecting hardware performance.
              </p>
            </div>
          </section>

          {/* §7 */}
          <section className="clause" id="s7">
            <div className="clause-head">
              <span className="num">§ 07</span>
              <h2>Blockchain risks</h2>
              <a className="anchor" href="#s7">
                #s7
              </a>
            </div>
            <div className="clause-body">
              <p>
                The network uses Cardano and Base. If Rewards or system components
                interact with any of these blockchain networks:
              </p>
              <ul>
                <li>
                  Transactions are generally <strong>irreversible</strong>. Errors cannot be
                  undone.
                </li>
                <li>
                  Smart contracts may contain bugs or vulnerabilities not detected by audit.
                </li>
                <li>
                  Networks may experience congestion, hard forks, downtime, or deprecation.
                </li>
                <li>Transaction fees (gas) may fluctuate significantly.</li>
                <li>
                  Data recorded on-chain. Including your geographic hex cell assignment. Is{' '}
                  <strong>permanent and publicly readable</strong>.
                </li>
                <li>
                  The ATECC608B Device DID provisioned in your node is non-exportable. Loss of
                  the physical device without backup documentation may result in loss of
                  network identity.
                </li>
              </ul>
              <p>
                <strong>
                  You are responsible for understanding how blockchain systems work before
                  participating.
                </strong>
              </p>
            </div>
          </section>

          {/* §8 */}
          <section className="clause" id="s8">
            <div className="clause-head">
              <span className="num">§ 08</span>
              <h2>Wallet and key management</h2>
              <a className="anchor" href="#s8">
                #s8
              </a>
            </div>
            <div className="clause-body">
              <p>
                If you use a digital wallet to receive MLMA or hold your NFT-HEX License,{' '}
                <strong>you are solely responsible for securing your private keys and credentials.</strong>{' '}
                Loss of keys may result in permanent, irreversible loss of access to your
                tokens, License NFT, and any associated Rewards.
              </p>
              <p>
                Mālama does not store private keys, recover lost wallets, reverse transactions,
                or provide custody services except through the limited custodial checkout
                option described in the{' '}
                <Link href="/legal/terms#s8" style={{ color: 'var(--mlma-accent)' }}>
                  Terms and Conditions
                </Link>
                .
              </p>
            </div>
          </section>

          {/* §9 */}
          <section className="clause" id="s9">
            <div className="clause-head">
              <span className="num">§ 09</span>
              <h2>Environmental data and credit risks</h2>
              <a className="anchor" href="#s9">
                #s9
              </a>
            </div>
            <div className="clause-body">
              <p>
                If Rewards relate to environmental data, carbon markets, or sustainability
                metrics:
              </p>
              <ul>
                <li>
                  Environmental measurements may be estimated, modeled, or subject to inherent
                  sensor uncertainty.
                </li>
                <li>Verification standards applicable to carbon credits may evolve or tighten.</li>
                <li>
                  Acceptance of Mālama-attested data by registries (Isometric, Puro.earth,
                  Verra, or others) is <strong>not guaranteed</strong> and depends on
                  registry-specific methodology approval.
                </li>
                <li>
                  Environmental credits produced from data validated by your node may not be
                  issued, accepted, or monetized.
                </li>
                <li>Methodologies may be challenged, revised, or discontinued.</li>
                <li>Carbon market prices and demand are outside Mālama&rsquo;s control.</li>
              </ul>
              <div className="callout accent">
                <span className="tag">● Validation, not market outcome</span>
                <p>
                  Participation in the Mālama network does not guarantee issuance of carbon
                  credits, acceptance by any registry, or the ability to sell environmental
                  assets.{' '}
                  <strong>
                    The protocol validates data; it does not guarantee the downstream carbon
                    market outcome.
                  </strong>
                </p>
              </div>
            </div>
          </section>

          {/* §10 */}
          <section className="clause" id="s10">
            <div className="clause-head">
              <span className="num">§ 10</span>
              <h2>Changes to reward structures</h2>
              <a className="anchor" href="#s10">
                #s10
              </a>
            </div>
            <div className="clause-body">
              <p>
                Mālama and the veMLMA governance system reserve the right to modify reward
                formulas, change Hex Type or Data Demand Score coefficients, alter distribution
                schedules, adjust eligibility requirements, or discontinue Rewards entirely. For technical optimization, fraud prevention, regulatory compliance, or
                network sustainability.
              </p>
              <p>
                <strong>Immutable parameters</strong>. The 500M MLMA hard cap, the 8-year emission schedule (60M total), the Genesis 200 supply cap, and hex exclusivity. Cannot
                be changed through governance. All other reward parameters are subject to
                governance modification with notice as described in the{' '}
                <Link
                  href="/legal/hex-node-purchase#s6"
                  style={{ color: 'var(--mlma-accent)' }}
                >
                  Hex Node Purchase Agreement
                </Link>
                .
              </p>
            </div>
          </section>

          {/* §11 */}
          <section className="clause" id="s11">
            <div className="clause-head">
              <span className="num">§ 11</span>
              <h2>Tax responsibility</h2>
              <a className="anchor" href="#s11">
                #s11
              </a>
            </div>
            <div className="clause-body">
              <p>
                You are solely responsible for determining whether Rewards are taxable in your
                jurisdiction, reporting any income, gains, or losses, and complying with all
                applicable tax laws. <strong>Mālama does not provide tax advice</strong> and
                may not provide tax reporting documentation unless required by law.
              </p>

              <div className="callout accent">
                <span className="tag">● U.S. guidance note · Informational only, not tax advice</span>
                <p>
                  U.S. participants should be aware that the IRS has issued guidance on the
                  taxation of cryptocurrency received through validation-like activities,
                  including <strong>Revenue Ruling 2019-24</strong> (hard forks and airdrops)
                  and <strong>Revenue Ruling 2023-14</strong> (staking rewards treated as
                  ordinary income at fair market value when the taxpayer obtains dominion and
                  control). The IRS has not issued specific guidance on DePIN operator rewards,
                  but the ruling framework may be analogous.
                </p>
                <p>
                  Operators receiving MLMA through vesting events (boot tranche, PONO tranche,
                  or operational milestone tranches) may recognize ordinary income at the time
                  tokens become subject to the operator&rsquo;s control, valued at the MLMA
                  fair market value on that date, with a separate capital-gain or -loss event
                  on later sale. The <strong>18,750 MLMA boot tranche</strong>, the{' '}
                  <strong>18,750 MLMA PONO tranche</strong>, and each subsequent milestone
                  tranche (<strong>25,000 / 25,000 / 37,500 MLMA</strong> at the 6-, 9-, and
                  12-month milestones) would each separately trigger a potential income
                  recognition event under this framework.
                </p>
                <p>
                  State and local tax treatment varies.{' '}
                  <strong>
                    This note is informational only and does not constitute tax advice. You
                    must consult a qualified tax professional familiar with digital assets
                    before participating.
                  </strong>
                </p>
              </div>
            </div>
          </section>

          {/* §12 */}
          <section className="clause" id="s12">
            <div className="clause-head">
              <span className="num">§ 12</span>
              <h2>No reliance</h2>
              <a className="anchor" href="#s12">
                #s12
              </a>
            </div>
            <div className="clause-body">
              <p>
                You agree that you are <strong>not relying</strong> on any of the following as
                a basis for your participation decision:
              </p>
              <ul className="neg-list">
                <li>Statements about future MLMA value or price.</li>
                <li>
                  Projected earnings, reward estimates, or cost recovery timelines published by
                  Mālama or any third party.
                </li>
                <li>Marketing materials suggesting specific returns.</li>
                <li>Third-party commentary, social media, or community discussion.</li>
              </ul>
              <p>
                You are making an independent decision based on your own assessment of the
                risks described in this Disclosure, the whitepaper, and the operator
                documentation, after consulting your own advisors.
              </p>
            </div>
          </section>

          {/* §13 */}
          <section className="clause" id="s13">
            <div className="clause-head">
              <span className="num">§ 13</span>
              <h2>Third-party risks</h2>
              <a className="anchor" href="#s13">
                #s13
              </a>
            </div>
            <div className="clause-body">
              <p>
                The network relies on third-party systems including cloud infrastructure
                providers, Cardano and Base blockchain networks, hardware component
                manufacturers, environmental data registries, oracle networks,{' '}
                <strong>LayerZero cross-chain bridge infrastructure</strong>, and external
                APIs. Failures, changes, or discontinuation in any of these systems may affect
                Rewards or functionality.{' '}
                <strong>
                  Mālama is not responsible for third-party failures, upgrades, or policy
                  changes.
                </strong>
              </p>
            </div>
          </section>

          {/* §14 */}
          <section className="clause" id="s14">
            <div className="clause-head">
              <span className="num">§ 14</span>
              <h2>Limitation of liability</h2>
              <a className="anchor" href="#s14">
                #s14
              </a>
            </div>
            <div className="clause-body">
              <div className="callout warn">
                <span className="tag">▲ Notice · Read carefully</span>
                <p className="legalese">
                  <span className="caps">To the fullest extent permitted by law,</span> Mālama
                  is not liable for: loss of tokens or Rewards, loss of expected earnings,
                  market losses, wallet or key compromise, blockchain-related issues, hardware
                  failure, data quality penalties, slashing events, regulatory changes
                  affecting value or usability, or any other loss arising from participation in
                  the Mālama network.
                </p>
              </div>
              <p>
                This limitation <strong>supplements</strong> the limitations set forth in the{' '}
                <Link href="/legal/terms#s17" style={{ color: 'var(--mlma-accent)' }}>
                  Terms and Conditions
                </Link>{' '}
                and the{' '}
                <Link
                  href="/legal/hex-node-purchase#s13"
                  style={{ color: 'var(--mlma-accent)' }}
                >
                  Hex Node Purchase Agreement
                </Link>
                .
              </p>
            </div>
          </section>

          {/* §15 */}
          <section className="clause" id="s15">
            <div className="clause-head">
              <span className="num">§ 15</span>
              <h2>Acknowledgment</h2>
              <a className="anchor" href="#s15">
                #s15
              </a>
            </div>
            <div className="clause-body">
              <p>
                By reserving a Hex Node, connecting a wallet, or participating in the network,
                you acknowledge that:
              </p>
              <ol className="ack-list">
                <li>You have read and understand all risks described in this Disclosure.</li>
                <li>You are not relying on Mālama for financial, investment, tax, or legal advice.</li>
                <li>
                  You understand that participation may result in no financial return and may
                  result in a <strong>complete loss of your $2,000 entry cost</strong>.
                </li>
                <li>
                  You understand that Year 1 Genesis phase economics are a temporary
                  bootstrapping mechanism and are not indicative of steady-state returns.
                </li>
                <li>
                  You understand that MLMA rewards are competitive and relative to the active
                  validator set and are not fixed per node.
                </li>
                <li>
                  You understand that failure to deploy your node within{' '}
                  <strong>90 days of hardware delivery</strong> results in permanent forfeiture
                  of your 125,000 MLMA allocation and License without refund.
                </li>
                <li>
                  You understand that MLMA&rsquo;s regulatory classification is subject to
                  ongoing legal review and varies by jurisdiction, and you have consulted your
                  own legal counsel.
                </li>
                <li>
                  You are solely responsible for your decisions, actions, and tax obligations
                  arising from participation.
                </li>
              </ol>
            </div>
          </section>

          {/* contact */}
          <section className="clause" id="contact" style={{ borderBottom: 'none' }}>
            <div className="clause-head">
              <span className="num">CONTACT</span>
              <h2>Get in touch</h2>
              <a className="anchor" href="#contact">
                #contact
              </a>
            </div>
            <div className="clause-body">
              <p>
                Questions about this Disclosure or the risks of participation can be directed
                to the contacts below.
              </p>
              <div className="contact-block">
                <div className="cell">
                  <div className="k">Registered address</div>
                  <div className="v">
                    Mālama Labs Inc.
                    <br />
                    8 The Green, Suite A
                    <br />
                    Dover, Delaware 19901
                  </div>
                </div>
                <div className="cell">
                  <div className="k">Legal</div>
                  <div className="v">
                    <a href="mailto:legal@malamalabs.com">legal@malamalabs.com</a>
                  </div>
                </div>
                <div className="cell">
                  <div className="k">Website</div>
                  <div className="v">
                    <a href="https://malamalabs.com">malamalabs.com</a>
                  </div>
                </div>
                <div className="cell">
                  <div className="k">Related documents</div>
                  <div className="v">
                    <Link href="/legal/terms">Terms &amp; Conditions</Link> ·{' '}
                    <Link href="/legal/hex-node-purchase">Hex Node Agreement</Link>
                  </div>
                </div>
              </div>

              <div className="sig-strip">
                <div className="label">- END OF DOCUMENT</div>
                <p className="text">
                  Mālama Labs, Inc. · Token &amp; Rewards Risk Disclosure · Effective April 11,
                  2026 · Last Updated April 28, 2026 (v2)
                </p>
                <p className="footnote">
                  This Disclosure does not constitute investment, legal, or tax advice. MLMA
                  regulatory classification is subject to ongoing legal review.
                </p>
              </div>
            </div>
          </section>
        </article>
      </main>

      {/* scrollspy + copy-link client behavior */}
      <TocScrollSpy />
    </div>
  )
}
