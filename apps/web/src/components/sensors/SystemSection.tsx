'use client'

import { MapPin, Layers, Activity } from 'lucide-react'
import { useReveal } from './useReveal'

const systemLevels = [
  { icon: <Activity size={20} />, name: 'Core System', desc: 'Central hub with display, dual radio, and power management. The brain of your sensor network.', tag: 'SENSOR HUB' },
  { icon: <Layers size={20} />, name: 'Soil Zone', desc: 'Multi-parameter soil probe measuring pH, moisture, temperature, and electrical conductivity.', tag: 'SOIL SENSOR' },
  { icon: <MapPin size={20} />, name: 'Weather Station', desc: 'Atmospheric monitoring for temperature, humidity, pressure, and precipitation.', tag: 'ATMOSPHERE' },
]

export default function SystemSection() {
  const ref = useReveal()
  return (
    <section id="system" style={{ background: '#0a0a0a', padding: '8rem 0' }} ref={ref}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <div className="section-label" style={{ marginBottom: '1rem' }}>Complete System</div>
          <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.03em', color: '#f5f5f5', lineHeight: 1.1, marginBottom: '1.25rem' }}>
            Core. Soil. Atmosphere.<br /><span className="text-gradient-green">One unified platform.</span>
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1.1rem', color: 'rgba(245,245,245,0.55)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
            The Mālama Sensor System integrates three measurement domains into a single, cohesive platform — giving you complete environmental awareness from a single deployment.
          </p>
        </div>

        <div className="reveal" style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', marginBottom: '4rem', border: '1px solid rgba(255,255,255,0.06)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/sensors/5_8e682334.png" alt="Mālama Sensor System — Core, Soil, Atmosphere deployment" style={{ width: '100%', height: '560px', objectFit: 'cover', objectPosition: 'center 30%', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(10,10,10,0.9) 100%)' }} />
          <div style={{ position: 'absolute', top: '2rem', right: '2rem', padding: '0.75rem 1.25rem', background: 'rgba(10,10,10,0.85)', border: '1px solid rgba(139,255,71,0.25)', borderRadius: '10px', backdropFilter: 'blur(12px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <div className="led-dot" style={{ width: '6px', height: '6px' }} />
              <span className="mono-data" style={{ fontSize: '0.65rem' }}>SIGNAL: STRONG</span>
            </div>
            <div className="mono-data" style={{ fontSize: '0.65rem', color: 'rgba(139,255,71,0.7)' }}>LoRa: ACTIVE</div>
            <div className="mono-data" style={{ fontSize: '0.65rem', color: 'rgba(139,255,71,0.5)' }}>POWER: SOLAR 6.2V</div>
          </div>
          <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {['SOIL ZONE', 'WEATHER STATION', 'SENSOR HUB'].map((label) => (
              <div key={label} style={{ padding: '0.4rem 0.9rem', background: 'rgba(10,10,10,0.8)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: 'rgba(245,245,245,0.7)', letterSpacing: '0.1em' }}>{label}</div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {systemLevels.map((level, i) => (
            <div key={level.name} className={`reveal reveal-delay-${i + 1} spec-card`} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(139,255,71,0.08)', border: '1px solid rgba(139,255,71,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8bff47', flexShrink: 0 }}>{level.icon}</div>
              <div>
                <div className="section-label" style={{ fontSize: '0.6rem', marginBottom: '0.35rem' }}>{level.tag}</div>
                <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#f5f5f5', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>{level.name}</h4>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.875rem', lineHeight: 1.6, color: 'rgba(245,245,245,0.55)' }}>{level.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
