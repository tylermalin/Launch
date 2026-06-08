'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, Zap, Wifi, Sun } from 'lucide-react'

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', position: 'relative', overflow: 'hidden', paddingTop: '80px', background: '#0a0a0a',
      }}
    >
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', height: '800px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,255,71,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '80px 80px', pointerEvents: 'none' }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="sensors-hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          {/* Left: text */}
          <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(32px)', transition: 'opacity 0.9s cubic-bezier(0.23,1,0.32,1), transform 0.9s cubic-bezier(0.23,1,0.32,1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <div className="led-dot" />
              <span className="section-label">Mālama Sensor System</span>
            </div>
            <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: 1.05, letterSpacing: '-0.03em', color: '#f5f5f5', marginBottom: '1.5rem' }}>
              Intelligence<br /><span className="text-gradient-green">Rooted</span> in<br />the Field.
            </h1>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '1.15rem', fontWeight: 400, lineHeight: 1.65, color: 'rgba(245,245,245,0.6)', maxWidth: '480px', marginBottom: '2.5rem', opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.9s 0.15s cubic-bezier(0.23,1,0.32,1), transform 0.9s 0.15s cubic-bezier(0.23,1,0.32,1)' }}>
              Solar-powered environmental monitoring with dual-radio connectivity. Soil, atmosphere, and remote sensing — built for the harshest conditions.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2.5rem', opacity: loaded ? 1 : 0, transition: 'opacity 0.9s 0.25s cubic-bezier(0.23,1,0.32,1)' }}>
              {[{ icon: <Wifi size={13} />, label: 'LoRa + NB-IoT' }, { icon: <Sun size={13} />, label: 'Solar Powered' }, { icon: <Zap size={13} />, label: 'Real-Time Data' }].map((b) => (
                <div key={b.label} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.85rem', background: 'rgba(139,255,71,0.07)', border: '1px solid rgba(139,255,71,0.2)', borderRadius: '100px', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', color: '#8bff47', letterSpacing: '0.04em' }}>
                  {b.icon}{b.label}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(16px)', transition: 'opacity 0.9s 0.35s cubic-bezier(0.23,1,0.32,1), transform 0.9s 0.35s cubic-bezier(0.23,1,0.32,1)' }}>
              <a href="#products" className="btn-malama btn-malama-solid" onClick={(e) => { e.preventDefault(); document.querySelector('#products')?.scrollIntoView({ behavior: 'smooth' }) }}>
                Explore Systems <ArrowRight size={16} />
              </a>
              <a href="#specs" className="btn-malama" onClick={(e) => { e.preventDefault(); document.querySelector('#specs')?.scrollIntoView({ behavior: 'smooth' }) }}>
                View Specs
              </a>
            </div>
          </div>

          {/* Right: floating product image */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', opacity: loaded ? 1 : 0, transform: loaded ? 'scale(1)' : 'scale(0.95)', transition: 'opacity 1s 0.2s cubic-bezier(0.23,1,0.32,1), transform 1s 0.2s cubic-bezier(0.23,1,0.32,1)' }}>
            <div style={{ position: 'absolute', inset: '-20%', background: 'radial-gradient(circle, rgba(139,255,71,0.08) 0%, transparent 65%)', borderRadius: '50%', pointerEvents: 'none' }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/manus-storage/4_deda1c38.png" alt="Mālama Sensor System — Gold Level" className="product-float" style={{ width: '100%', maxWidth: '600px', height: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.8))', position: 'relative', zIndex: 1 }} />
          </div>
        </div>
      </div>
    </section>
  )
}
