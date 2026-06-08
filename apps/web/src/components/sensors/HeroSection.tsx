'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, TrendingUp, ShieldCheck, Leaf } from 'lucide-react'

const SANS = 'var(--font-inter-tight), system-ui, sans-serif'
const MONO = 'var(--font-jetbrains), monospace'

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
        minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative',
        overflow: 'hidden', paddingTop: '80px', background: '#0a0a0a',
      }}
    >
      {/* Full-bleed field background */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/sensors/field-hero.png"
        alt="Mālama sensor node deployed in a Hawaiian taro field"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center right', zIndex: 0, opacity: loaded ? 1 : 0, transition: 'opacity 1.2s ease' }}
      />
      {/* Legibility overlay — darkest on the left where the copy sits */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(to right, rgba(10,10,10,0.94) 0%, rgba(10,10,10,0.82) 38%, rgba(10,10,10,0.4) 68%, rgba(10,10,10,0.55) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(to top, rgba(10,10,10,0.6) 0%, transparent 30%)' }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: '640px', opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(32px)', transition: 'opacity 0.9s cubic-bezier(0.23,1,0.32,1), transform 0.9s cubic-bezier(0.23,1,0.32,1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.3rem 0.75rem', borderRadius: '100px', background: 'rgba(10,10,10,0.55)', border: '1px solid rgba(139,255,71,0.3)', backdropFilter: 'blur(6px)' }}>
              <span className="led-dot" style={{ width: '6px', height: '6px' }} />
              <span className="section-label">Sensors · In Development</span>
            </span>
          </div>
          <h1 style={{ fontFamily: SANS, fontWeight: 800, fontSize: 'clamp(2.5rem, 5.5vw, 4.75rem)', lineHeight: 1.04, letterSpacing: '-0.03em', color: '#f5f5f5', marginBottom: '1.5rem', textShadow: '0 2px 30px rgba(0,0,0,0.5)' }}>
            Ground truth,<br /><span className="text-gradient-green">signed</span> at the source.
          </h1>
          <p style={{ fontFamily: SANS, fontSize: '1.15rem', fontWeight: 400, lineHeight: 1.65, color: 'rgba(245,245,245,0.78)', maxWidth: '520px', marginBottom: '2.5rem' }}>
            Hardware-signed environmental sensors — in active development — built to settle real-world outcomes. Tamper-evident field data for prediction-market settlement, parametric insurance triggers, and climate verification.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2.5rem' }}>
            {[{ icon: <TrendingUp size={13} />, label: 'Prediction Markets' }, { icon: <ShieldCheck size={13} />, label: 'Parametric Insurance' }, { icon: <Leaf size={13} />, label: 'Climate Settlement' }].map((b) => (
              <div key={b.label} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.85rem', background: 'rgba(10,10,10,0.5)', border: '1px solid rgba(139,255,71,0.25)', borderRadius: '100px', fontFamily: MONO, fontSize: '0.72rem', color: '#8bff47', letterSpacing: '0.04em', backdropFilter: 'blur(6px)' }}>
                {b.icon}{b.label}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="#products" className="btn-malama btn-malama-solid" onClick={(e) => { e.preventDefault(); document.querySelector('#products')?.scrollIntoView({ behavior: 'smooth' }) }}>
              Explore Systems <ArrowRight size={16} />
            </a>
            <a href="#use-cases" className="btn-malama" onClick={(e) => { e.preventDefault(); document.querySelector('#use-cases')?.scrollIntoView({ behavior: 'smooth' }) }}>
              See Use Cases
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
