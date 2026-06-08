'use client'

import { TrendingUp, ShieldCheck, Leaf } from 'lucide-react'
import { useReveal } from './useReveal'

const SANS = 'var(--font-inter-tight), system-ui, sans-serif'
const MONO = 'var(--font-jetbrains), monospace'

const cases = [
  {
    icon: <TrendingUp size={22} />,
    tag: 'Settlement Oracle',
    title: 'Prediction Markets',
    desc: 'Hardware-signed readings resolve real-world markets — rainfall, temperature, soil carbon, air quality. Each data point is signed at the sensor, so settlement runs on tamper-evident ground truth instead of a trusted reporter.',
  },
  {
    icon: <ShieldCheck size={22} />,
    tag: 'Automated Triggers',
    title: 'Parametric Insurance',
    desc: 'Crop, flood, and drought policies pay out the moment a signed threshold is crossed — no claims adjuster, no dispute. The sensor’s cryptographic signature is the proof, enabling instant, low-overhead payouts.',
  },
  {
    icon: <Leaf size={22} />,
    tag: 'Verified MRV',
    title: 'Climate & Carbon',
    desc: 'Continuous, signed soil and atmospheric data underpins measurement, reporting & verification for carbon and restoration projects — replacing periodic manual audits with a live, auditable evidence trail.',
  },
]

export default function UseCasesSection() {
  const ref = useReveal(0.12)
  return (
    <section id="use-cases" style={{ background: '#0a0a0a', padding: '8rem 0' }} ref={ref}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="section-label" style={{ marginBottom: '1rem' }}>Why It Matters · In Development</div>
          <h2 style={{ fontFamily: SANS, fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.03em', color: '#f5f5f5', lineHeight: 1.1, marginBottom: '1.25rem' }}>
            Data you can<br /><span className="text-gradient-green">settle on.</span>
          </h2>
          <p style={{ fontFamily: SANS, fontSize: '1.1rem', color: 'rgba(245,245,245,0.55)', maxWidth: '620px', margin: '0 auto', lineHeight: 1.7 }}>
            The sensors are still in development — but the architecture is built for one job: producing field data trustworthy enough to move money. Signed at the source, anchored on-chain, and ready to serve as the settlement layer for outcome-based markets.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {cases.map((c, i) => (
            <div key={c.title} className={`reveal reveal-delay-${i + 1} spec-card`} style={{ padding: '2.25rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(139,255,71,0.08)', border: '1px solid rgba(139,255,71,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8bff47', marginBottom: '1.5rem' }}>{c.icon}</div>
              <div style={{ fontFamily: MONO, fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8bff47', marginBottom: '0.5rem' }}>{c.tag}</div>
              <h3 style={{ fontFamily: SANS, fontWeight: 700, fontSize: '1.3rem', color: '#f5f5f5', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>{c.title}</h3>
              <p style={{ fontFamily: SANS, fontSize: '0.9rem', lineHeight: 1.65, color: 'rgba(245,245,245,0.55)' }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
