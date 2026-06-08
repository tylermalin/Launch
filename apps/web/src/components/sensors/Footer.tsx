'use client'

import { ArrowUpRight } from 'lucide-react'

const SANS = 'var(--font-inter-tight), system-ui, sans-serif'
const MONO = 'var(--font-jetbrains), monospace'

const anchorLinks = [
  { label: 'Sensor Systems', href: '#products' },
  { label: 'Use Cases', href: '#use-cases' },
  { label: 'Specifications', href: '#specs' },
  { label: 'Request Access', href: '#cta' },
]

const backLinks = [
  { label: 'Launch', href: 'https://launch.malamalabs.com' },
  { label: 'malamalabs.com', href: 'https://malamalabs.com' },
]

export default function SensorsFooter() {
  const year = new Date().getFullYear()
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }
  return (
    <footer style={{ background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '3rem 0' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem', marginBottom: '2rem' }}>
          <a href="/" className="flex items-center gap-2.5 no-underline" style={{ textDecoration: 'none' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-mark.png" alt="Mālama Labs" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
            <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: '0.95rem', color: '#f5f5f5' }}>Mālama Labs</span>
          </a>
          <nav style={{ display: 'flex', gap: '1.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {anchorLinks.map((link) => (
              <a key={link.label} href={link.href} onClick={(e) => handleClick(e, link.href)}
                style={{ fontFamily: SANS, fontSize: '0.85rem', color: 'rgba(245,245,245,0.45)', textDecoration: 'none', transition: 'color 0.2s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(245,245,245,0.8)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(245,245,245,0.45)')}>
                {link.label}
              </a>
            ))}
            {backLinks.map((b) => (
              <a key={b.label} href={b.href} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.15rem', fontFamily: SANS, fontSize: '0.85rem', color: 'rgba(245,245,245,0.45)', textDecoration: 'none', transition: 'color 0.2s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#8bff47')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(245,245,245,0.45)')}>
                {b.label}<ArrowUpRight size={12} />
              </a>
            ))}
          </nav>
        </div>
        <div className="hairline" style={{ marginBottom: '1.5rem' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <span style={{ fontFamily: MONO, fontSize: '0.7rem', color: 'rgba(245,245,245,0.25)', letterSpacing: '0.05em' }}>© {year} MĀLAMA LABS. ALL RIGHTS RESERVED.</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="led-dot" style={{ width: '5px', height: '5px' }} />
            <span style={{ fontFamily: MONO, fontSize: '0.65rem', color: '#8bff47', letterSpacing: '0.08em', opacity: 0.7 }}>SENSORS IN DEVELOPMENT</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
