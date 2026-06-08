'use client'

import { useState, useEffect } from 'react'
import { Menu, X, ArrowUpRight } from 'lucide-react'

const SANS = 'var(--font-inter-tight), system-ui, sans-serif'

const navLinks = [
  { label: 'Sensor Systems', href: '#products' },
  { label: 'Use Cases', href: '#use-cases' },
  { label: 'Specifications', href: '#specs' },
  { label: 'Deployments', href: '#deployments' },
]

const backLinks = [
  { label: 'Launch', href: 'https://launch.malamalabs.com' },
  { label: 'malamalabs.com', href: 'https://malamalabs.com' },
]

export default function SensorsNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setMenuOpen(false)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'blur(0px)',
        WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'blur(0px)',
        background: scrolled ? 'rgba(10,10,10,0.9)' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
      }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo → back to Launch home */}
          <a href="/" className="flex items-center gap-2.5 no-underline">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-mark.png" alt="Mālama Labs" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
            <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: '1rem', color: '#f5f5f5', letterSpacing: '-0.01em' }}>Mālama Labs</span>
          </a>

          {/* In-page anchors */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} onClick={(e) => handleNavClick(e, link.href)}
                style={{ fontFamily: SANS, fontSize: '0.875rem', fontWeight: 500, color: 'rgba(245,245,245,0.7)', textDecoration: 'none', transition: 'color 0.2s ease', letterSpacing: '-0.01em' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#f5f5f5')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(245,245,245,0.7)')}>
                {link.label}
              </a>
            ))}
          </div>

          {/* Back-links + CTA */}
          <div className="hidden md:flex items-center gap-4">
            {backLinks.map((b) => (
              <a key={b.label} href={b.href} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.15rem', fontFamily: SANS, fontSize: '0.8rem', fontWeight: 500, color: 'rgba(245,245,245,0.55)', textDecoration: 'none', transition: 'color 0.2s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#8bff47')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(245,245,245,0.55)')}>
                {b.label}<ArrowUpRight size={12} />
              </a>
            ))}
            <a href="#cta" onClick={(e) => handleNavClick(e, '#cta')} className="btn-malama" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>Request Access</a>
          </div>

          <button className="md:hidden p-2 rounded-md" style={{ color: '#f5f5f5', background: 'transparent', border: 'none' }} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden" style={{ background: 'rgba(10,10,10,0.97)', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '1rem 1.5rem 1.5rem' }}>
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} onClick={(e) => handleNavClick(e, link.href)}
              style={{ display: 'block', padding: '0.75rem 0', fontFamily: SANS, fontSize: '1rem', fontWeight: 500, color: 'rgba(245,245,245,0.8)', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              {link.label}
            </a>
          ))}
          {backLinks.map((b) => (
            <a key={b.label} href={b.href} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.75rem 0', fontFamily: SANS, fontSize: '0.95rem', fontWeight: 500, color: 'rgba(245,245,245,0.6)', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              {b.label}<ArrowUpRight size={13} />
            </a>
          ))}
          <a href="#cta" onClick={(e) => handleNavClick(e, '#cta')} className="btn-malama" style={{ marginTop: '1rem', display: 'inline-flex' }}>Request Access</a>
        </div>
      )}
    </nav>
  )
}
