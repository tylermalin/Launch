'use client'

import { Zap, Signal, Thermometer, Droplets } from 'lucide-react'
import { useReveal } from './useReveal'

const techPoints = [
  { icon: <Zap size={20} />, title: 'Solar Energy Management', desc: 'Monocrystalline solar cells with MPPT charging controller. Maintains operation through 5 consecutive cloudy days.' },
  { icon: <Signal size={20} />, title: 'Dual-Radio Architecture', desc: 'Primary LoRa 915MHz for mesh networking up to 5km. NB-IoT cellular fallback ensures zero data loss.' },
  { icon: <Thermometer size={20} />, title: 'Precision Calibration', desc: 'Factory-calibrated sensors with ±0.1°C temperature accuracy. NIST-traceable calibration certificates available.' },
  { icon: <Droplets size={20} />, title: 'Multi-Parameter Sensing', desc: 'Simultaneous measurement of soil moisture, pH, temperature, and electrical conductivity from a single probe insertion.' },
]

export default function TechSection() {
  const ref = useReveal()
  return (
    <section id="technology" style={{ background: '#0a0a0a', padding: '8rem 0' }} ref={ref}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="reveal" style={{ marginBottom: '5rem' }}>
          <div className="section-label" style={{ marginBottom: '1rem' }}>Engineering</div>
          <h2 style={{ fontFamily: "var(--font-inter-tight), system-ui, sans-serif", fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.03em', color: '#f5f5f5', lineHeight: 1.1, maxWidth: '600px' }}>
            Precision engineering<br />at every layer.
          </h2>
        </div>

        <div className="reveal" style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', marginBottom: '5rem', border: '1px solid rgba(255,255,255,0.06)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/sensors/2_c58834b3.png" alt="Mālama 200 Genesis solar panel close-up" style={{ width: '100%', height: '500px', objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.3) 50%, rgba(10,10,10,0.1) 100%)' }} />
          <div style={{ position: 'absolute', top: '50%', left: '3rem', transform: 'translateY(-50%)', maxWidth: '420px' }}>
            <div className="section-label" style={{ marginBottom: '0.75rem' }}>Mālama 200 Genesis</div>
            <h3 style={{ fontFamily: "var(--font-inter-tight), system-ui, sans-serif", fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', color: '#f5f5f5', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '1rem' }}>
              Engineered for<br /><span className="text-gradient-green">perpetual power.</span>
            </h3>
            <p style={{ fontFamily: "var(--font-inter-tight), system-ui, sans-serif", fontSize: '0.95rem', color: 'rgba(245,245,245,0.65)', lineHeight: 1.65 }}>
              High-efficiency monocrystalline solar cells with precision-machined aluminum frame. The Mālama 200 Genesis delivers reliable charging even in low-light conditions.
            </p>
          </div>
          <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', padding: '0.5rem 1rem', background: 'rgba(10,10,10,0.8)', border: '1px solid rgba(139,255,71,0.3)', borderRadius: '6px' }}>
            <span className="mono-data">SOLAR CHARGING: 6.2V</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {techPoints.map((point, i) => (
            <div key={point.title} className={`reveal reveal-delay-${i + 1} spec-card`}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(139,255,71,0.08)', border: '1px solid rgba(139,255,71,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8bff47', marginBottom: '1.25rem' }}>
                {point.icon}
              </div>
              <h4 style={{ fontFamily: "var(--font-inter-tight), system-ui, sans-serif", fontWeight: 700, fontSize: '1rem', color: '#f5f5f5', marginBottom: '0.6rem', letterSpacing: '-0.02em' }}>{point.title}</h4>
              <p style={{ fontFamily: "var(--font-inter-tight), system-ui, sans-serif", fontSize: '0.875rem', lineHeight: 1.65, color: 'rgba(245,245,245,0.55)' }}>{point.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
