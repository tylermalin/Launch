'use client'

import { Radio, Leaf, Shield, Cpu, BarChart3, Globe } from 'lucide-react'
import { useReveal } from './useReveal'

const features = [
  { icon: <Radio size={24} />, label: 'Dual Radio', title: 'LoRa + NB-IoT', description: 'Seamless connectivity in any terrain. LoRa for long-range low-power mesh networks, NB-IoT for cellular fallback — your data always gets through.' },
  { icon: <Leaf size={24} />, label: 'Sustainable', title: 'Solar Powered', description: 'Integrated solar charging with 48-hour battery backup. Deploy anywhere without grid dependency — true off-grid environmental intelligence.' },
  { icon: <Shield size={24} />, label: 'Field Ready', title: 'IP67 Weatherproof', description: 'Engineered for the harshest conditions. Dust-tight, waterproof enclosures with industrial-grade connectors rated for extreme temperature ranges.' },
  { icon: <Cpu size={24} />, label: 'Intelligent', title: 'Edge Processing', description: 'On-device data processing reduces transmission overhead. Configurable sampling rates, threshold alerts, and local data buffering.' },
  { icon: <BarChart3 size={24} />, label: 'Analytics', title: 'Real-Time Dashboard', description: 'Live sensor data streams to your dashboard. Historical trends, anomaly detection, and exportable datasets for deeper analysis.' },
  { icon: <Globe size={24} />, label: 'Scalable', title: 'Multi-Site Networks', description: 'Deploy a single sensor or a thousand. Centralized fleet management with OTA firmware updates and remote configuration.' },
]

export default function FeaturesSection() {
  const ref = useReveal(0.15)
  return (
    <section id="features" style={{ padding: '8rem 0', background: '#0a0a0a' }} ref={ref}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="section-label" style={{ marginBottom: '1rem' }}>Why Mālama Labs</div>
          <h2 style={{ fontFamily: "var(--font-inter-tight), system-ui, sans-serif", fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.03em', color: '#f5f5f5', lineHeight: 1.1, marginBottom: '1.25rem' }}>
            Built for the field.<br /><span className="text-gradient-green">Designed for scale.</span>
          </h2>
          <p style={{ fontFamily: "var(--font-inter-tight), system-ui, sans-serif", fontSize: '1.1rem', color: 'rgba(245,245,245,0.55)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
            Every component of the Mālama Sensor System is engineered to deliver reliable data from the most demanding environments on earth.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5px', background: 'rgba(255,255,255,0.06)', borderRadius: '16px', overflow: 'hidden' }}>
          {features.map((feature, i) => (
            <div key={feature.title} className={`reveal reveal-delay-${(i % 3) + 1}`}
              style={{ background: '#0a0a0a', padding: '2.5rem', transition: 'background 0.25s ease', cursor: 'default' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#141414')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#0a0a0a')}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(139,255,71,0.08)', border: '1px solid rgba(139,255,71,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8bff47', marginBottom: '1.5rem' }}>
                {feature.icon}
              </div>
              <div className="section-label" style={{ marginBottom: '0.5rem', fontSize: '0.65rem' }}>{feature.label}</div>
              <h3 style={{ fontFamily: "var(--font-inter-tight), system-ui, sans-serif", fontWeight: 700, fontSize: '1.2rem', color: '#f5f5f5', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>{feature.title}</h3>
              <p style={{ fontFamily: "var(--font-inter-tight), system-ui, sans-serif", fontSize: '0.9rem', lineHeight: 1.65, color: 'rgba(245,245,245,0.55)' }}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
