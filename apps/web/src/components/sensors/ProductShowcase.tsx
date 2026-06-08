'use client'

import { CheckCircle2 } from 'lucide-react'
import { useReveal } from './useReveal'

const products = [
  {
    id: 'gold', label: 'Gold Level System', title: 'Complete Sensor Suite', subtitle: 'Everything you need, right out of the box.',
    description: 'The Mālama Sensor System Gold Level delivers professional-grade environmental monitoring with dual-radio connectivity, solar power management, and a full-color touchscreen display. Designed for demanding agricultural, environmental, and research applications.',
    image: '/sensors/sensor-hub.jpg', imageAlt: 'Mālama sensor hub with probe',
    features: ['Dual-antenna LoRa + NB-IoT radio system', 'Full-color touchscreen status display', 'Solar charging with battery management', 'Dual sensor port configuration (A + B)', 'Industrial-grade weatherproof enclosure', 'Quantity discounts available'],
    reverse: false,
  },
  {
    id: 'soil', label: 'Soil Intelligence', title: 'Mālama Soil Sensor', subtitle: 'Precision data from the root zone.',
    description: 'The Mālama soil sensor penetrates deep into the root zone to deliver continuous pH, moisture, temperature, and charge data. Stainless steel probe construction with the signature Mālama Labs green LED status indicator.',
    image: '/sensors/3_b0588513.png', imageAlt: 'Mālama Labs soil sensor probe with green LED',
    features: ['Soil pH measurement (±0.1 accuracy)', 'Volumetric water content sensing', 'Soil temperature profiling', 'Electrical conductivity measurement', 'IP67 waterproof stainless probe', '15m cable standard, extendable'],
    reverse: true,
  },
  {
    id: 'kit', label: 'Complete Kit', title: 'Everything Included', subtitle: 'Deploy in under 30 minutes.',
    description: 'The Mālama Sensor System ships as a complete deployment kit. Every cable, mount, fastener, and accessory is included. No additional purchases required — just unbox, configure, and deploy.',
    image: '/sensors/sensor-kit.jpg', imageAlt: 'Mālama Sensor System complete kit contents',
    features: ['Main sensor hub unit', 'Mounting bracket + hardware', '12V power adapter', 'Waterproof cable set (15m)', 'Hose clamp + cable ties', 'Quick-start configuration guide'],
    reverse: false,
  },
]

export default function ProductShowcase() {
  const ref = useReveal()
  return (
    <section id="products" style={{ background: '#0a0a0a', padding: '6rem 0' }} ref={ref}>
      {products.map((product, idx) => (
        <div key={product.id} style={{ padding: '6rem 0', borderTop: idx > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="product-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center', direction: product.reverse ? 'rtl' : 'ltr' }}>
              <div className="reveal" style={{ direction: 'ltr', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: '-10%', background: 'radial-gradient(circle, rgba(139,255,71,0.05) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={product.image} alt={product.imageAlt} style={{ width: '100%', height: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.7))', position: 'relative', zIndex: 1, borderRadius: '8px' }} />
              </div>
              <div className="reveal reveal-delay-2" style={{ direction: 'ltr' }}>
                <div className="section-label" style={{ marginBottom: '1rem' }}>{product.label}</div>
                <h2 style={{ fontFamily: "var(--font-inter-tight), system-ui, sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', letterSpacing: '-0.03em', color: '#f5f5f5', lineHeight: 1.1, marginBottom: '0.5rem' }}>{product.title}</h2>
                <p style={{ fontFamily: "var(--font-inter-tight), system-ui, sans-serif", fontSize: '1.1rem', fontWeight: 500, color: '#8bff47', marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>{product.subtitle}</p>
                <p style={{ fontFamily: "var(--font-inter-tight), system-ui, sans-serif", fontSize: '0.95rem', lineHeight: 1.7, color: 'rgba(245,245,245,0.6)', marginBottom: '2rem' }}>{product.description}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0' }}>
                  {product.features.map((feat, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontFamily: "var(--font-inter-tight), system-ui, sans-serif", fontSize: '0.9rem', color: 'rgba(245,245,245,0.75)' }}>
                      <CheckCircle2 size={16} style={{ color: '#8bff47', flexShrink: 0, marginTop: '2px' }} />{feat}
                    </li>
                  ))}
                </ul>
                <a href="#cta" className="btn-malama" onClick={(e) => { e.preventDefault(); document.querySelector('#cta')?.scrollIntoView({ behavior: 'smooth' }) }}>Request Pricing</a>
              </div>
            </div>
          </div>
        </div>
      ))}
      <style>{`@media (max-width: 768px) { .product-row { grid-template-columns: 1fr !important; direction: ltr !important; gap: 2.5rem !important; } }`}</style>
    </section>
  )
}
