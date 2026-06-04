import type { Metadata } from 'next'
import Link from 'next/link'
import '../legal-doc.css'
import LegalPageShell from '../_shared/LegalPageShell'
import ManageCookiesButton from '@/components/ManageCookiesButton'

export const metadata: Metadata = {
  title: 'Cookie Policy · Mālama Labs',
  description:
    'Disclosure of cookies and similar technologies used across malamalabs.com, the dashboards, and the launchpad, and the controls available to you per jurisdiction. MLMA-LEGAL-004, in force.',
}

export default function CookiePolicyPage() {
  return (
    <LegalPageShell
      current="cookies"
      docNumber="DOC · 004"
      eyebrowText="Legal · Cookie Policy"
      titleLead="Cookie"
      titleEmphasis="Policy."
      lede="How Mālama Labs and our providers use cookies and similar technologies across the website, dashboards, and launchpad, and the controls available to you per jurisdiction."
      metaRows={[
        { k: 'Status', v: 'In force', accent: true },
        { k: 'Version', v: 'v1' },
        { k: 'Effective', v: 'April 28, 2026' },
        { k: 'Applies to', v: 'malamalabs.com · dashboards · launchpad' },
        { k: 'Companion to', v: 'Privacy Policy' },
        { k: 'Reading time', v: '~7 min' },
      ]}
      docBar={{
        version: 'Version 1 · In force',
        docId: 'Doc · MLMA-LEGAL-004',
        category: 'Category · Privacy disclosure',
      }}
    >
      <main className="layout">
        <aside className="toc" aria-label="Table of contents">
          <div className="toc-label"><span>Contents</span><span className="count">10 sections</span></div>
          <ol>
            {[
              ['s1', '01', 'What cookies are'],
              ['s2', '02', 'Why we use them'],
              ['s3', '03', 'Categories we use'],
              ['s4', '04', 'Similar technologies'],
              ['s5', '05', 'Third-party cookies'],
              ['s6', '06', 'Legal bases and consent'],
              ['s7', '07', 'Your choices and controls'],
              ['s8', '08', 'Global Privacy Control & DNT'],
              ['s9', '09', 'Retention and changes'],
              ['s10', '10', 'Contact'],
            ].map(([id, n, t]) => (
              <li key={id}><a href={`#${id}`}><span className="n">{n}</span><span className="t">{t}</span></a></li>
            ))}
          </ol>
          <div className="toc-actions">
            <a className="btn" href="mailto:privacy@malamalabs.com"><span>Contact privacy</span><span>↗</span></a>
          </div>
        </aside>

        <article className="content">
          <div className="preamble">
            <p>
              This Cookie Policy explains how Mālama Labs, Inc. (&ldquo;Mālama,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;) and our service providers use cookies and similar technologies on{' '}
              <strong>malamalabs.com</strong>, the operator and partner <strong>dashboards</strong>, and the Genesis 200 <strong>launchpad</strong> (together, the &ldquo;Services&rdquo;). It is a companion to the{' '}
              <Link href="/legal/privacy" style={{ color: 'var(--mlma-accent)' }}>Privacy Policy</Link>, which governs how we handle Personal Data more broadly. Capitalized terms not defined here have the meaning given in the Privacy Policy.
            </p>
          </div>

          <section className="clause" id="s1">
            <div className="clause-head"><span className="num">§ 01</span><h2>What cookies are</h2><a className="anchor" href="#s1">#s1</a></div>
            <div className="clause-body">
              <p>Cookies are small text files placed on your device when you visit a website. They let a site recognize your device, remember preferences, keep you signed in, and understand how the site is used. Cookies set by the site you are visiting are <strong>first-party</strong> cookies; cookies set by another domain whose services are embedded in the page are <strong>third-party</strong> cookies. Cookies can be <strong>session</strong> cookies (deleted when you close your browser) or <strong>persistent</strong> cookies (which remain until they expire or you delete them).</p>
            </div>
          </section>

          <section className="clause" id="s2">
            <div className="clause-head"><span className="num">§ 02</span><h2>Why we use them</h2><a className="anchor" href="#s2">#s2</a></div>
            <div className="clause-body">
              <p>We use cookies and similar technologies to operate and secure the Services, to remember your settings, to authenticate sessions and protect against fraud and abuse, and, where you permit it, to measure how the Services are used so we can improve them. We do not use cookies to build advertising profiles, and Mālama&rsquo;s products do not serve third-party advertising.</p>
            </div>
          </section>

          <section className="clause" id="s3">
            <div className="clause-head"><span className="num">§ 03</span><h2>Categories we use</h2><a className="anchor" href="#s3">#s3</a></div>
            <div className="clause-body">
              <p>The cookie banner groups cookies into the categories below. Strictly necessary cookies are always active because the Services cannot function without them; the others are set only with your consent where consent is required.</p>
              <table className="matrix">
                <thead><tr><th>Category</th><th>Purpose</th><th>Consent</th></tr></thead>
                <tbody>
                  <tr><td>Strictly necessary</td><td>Session authentication, security, fraud prevention, load balancing, password-gate access, and remembering your cookie choices.</td><td>Always on</td></tr>
                  <tr><td>Functional</td><td>Remembering preferences such as wallet connection state, language, and interface settings.</td><td>Opt-in where required</td></tr>
                  <tr><td>Analytics / performance</td><td>Aggregate, privacy-respecting measurement of page views and feature use to improve the Services.</td><td>Opt-in where required</td></tr>
                </tbody>
              </table>
              <p style={{ fontSize: 14, color: 'var(--mlma-ink-faint)' }}>The exact cookie names, providers, and durations are enumerated in the consent banner&rsquo;s preference center.</p>
            </div>
          </section>

          <section className="clause" id="s4">
            <div className="clause-head"><span className="num">§ 04</span><h2>Similar technologies</h2><a className="anchor" href="#s4">#s4</a></div>
            <div className="clause-body">
              <p>Beyond cookies, the Services may use local storage and session storage to hold interface state on your device, and software development kits (SDKs) from providers such as our authentication and payment partners that set their own storage. These technologies are treated under the same categories and consent rules as cookies. Note that on-chain activity (transactions, wallet addresses, and SaveCard records anchored to Cardano or Base) is recorded on public blockchains and is outside the scope of cookies; see the <Link href="/legal/privacy" style={{ color: 'var(--mlma-accent)' }}>Privacy Policy</Link> for what immutable on-chain records mean for your rights.</p>
            </div>
          </section>

          <section className="clause" id="s5">
            <div className="clause-head"><span className="num">§ 05</span><h2>Third-party cookies</h2><a className="anchor" href="#s5">#s5</a></div>
            <div className="clause-body">
              <p>Some functions rely on third-party providers that may set their own cookies or storage when you use them, including our payment processor for card checkout, our custodial-wallet provider for Magic-managed wallets, and any analytics provider we enable. These providers process data under their own policies; the providers in use are identified in the <Link href="/legal/privacy" style={{ color: 'var(--mlma-accent)' }}>Privacy Policy</Link>. We do not control third-party cookies and recommend reviewing those providers&rsquo; notices.</p>
            </div>
          </section>

          <section className="clause" id="s6">
            <div className="clause-head"><span className="num">§ 06</span><h2>Legal bases and consent</h2><a className="anchor" href="#s6">#s6</a></div>
            <div className="clause-body">
              <p>Where the EU/UK ePrivacy rules and GDPR apply, strictly necessary cookies are set on the basis of our legitimate interest in operating the Services, and all other cookies are set only after you give consent through the banner. You can withdraw consent at any time, and withdrawal does not affect processing carried out before withdrawal. Where US state privacy laws apply (for example the CCPA/CPRA in California), we honor opt-out preferences for any sharing of personal information and recognize opt-out preference signals as described below. Mālama does not sell personal information.</p>
            </div>
          </section>

          <section className="clause" id="s7">
            <div className="clause-head"><span className="num">§ 07</span><h2>Your choices and controls</h2><a className="anchor" href="#s7">#s7</a></div>
            <div className="clause-body">
              <p>You can manage non-essential cookies through the consent banner&rsquo;s preference center, which lets you accept or reject each non-essential category and change your choice later. You can also control cookies through your browser settings, which allow you to block or delete cookies; blocking strictly necessary cookies may break parts of the Services. Mobile operating systems provide additional controls for advertising identifiers and tracking.</p>
              <div style={{ marginTop: 16 }}><ManageCookiesButton /></div>
            </div>
          </section>

          <section className="clause" id="s8">
            <div className="clause-head"><span className="num">§ 08</span><h2>Global Privacy Control and Do Not Track</h2><a className="anchor" href="#s8">#s8</a></div>
            <div className="clause-body">
              <p>We aim to honor the Global Privacy Control (GPC) signal as a valid opt-out of sharing where applicable law requires it. Browser &ldquo;Do Not Track&rdquo; signals are not standardized; where we cannot reliably interpret a DNT signal we rely on your banner choices and GPC instead.</p>
            </div>
          </section>

          <section className="clause" id="s9">
            <div className="clause-head"><span className="num">§ 09</span><h2>Retention and changes</h2><a className="anchor" href="#s9">#s9</a></div>
            <div className="clause-body">
              <p>Session cookies expire when you close your browser; persistent cookies remain for the duration disclosed in the preference center or until you delete them. We retain analytics data only for as long as needed for the purpose described, then aggregate or delete it. We may update this policy as the Services and our providers change; the effective date and version will be revised here, and material changes will be surfaced through the banner or a notice in the Services.</p>
            </div>
          </section>

          <section className="clause" id="s10" style={{ borderBottom: 'none' }}>
            <div className="clause-head"><span className="num">§ 10</span><h2>Contact</h2><a className="anchor" href="#s10">#s10</a></div>
            <div className="clause-body">
              <p>Questions about this Cookie Policy or your choices: <a href="mailto:privacy@malamalabs.com" style={{ color: 'var(--mlma-accent)' }}>privacy@malamalabs.com</a>. Mālama Labs, Inc., 8 The Green, Suite A, Dover, Delaware 19901.</p>
              <div className="sig-strip">
                <div className="label">- DOCS · MLMA-LEGAL-004 · v1 · IN FORCE</div>
                <p className="text">Cookie Policy · In force · Companion to the Privacy Policy.</p>
                <p className="footnote">Cookie categories and controls are described here; the consent banner&rsquo;s preference center enumerates the specific cookies in use.</p>
              </div>
            </div>
          </section>
        </article>
      </main>
    </LegalPageShell>
  )
}
