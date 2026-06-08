'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Sensor Systems', href: '#products' },
  { label: 'Technology', href: '#technology' },
  { label: 'Specifications', href: '#specs' },
  { label: 'Agents', href: '#agents' },
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
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'blur(0px)',
        WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'blur(0px)',
        background: scrolled ? 'rgba(10,10,10,0.9)' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#hero" onClick={(e) => handleNavClick(e, '#hero')} className="flex items-center gap-2.5 no-underline">
            <div className="flex items-center justify-center w-8 h-8 rounded-md" style={{ background: 'rgba(139,255,71,0.1)', border: '1px solid rgba(139,255,71,0.3)' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', fontWeight: 700, color: '#8bff47', letterSpacing: '0.05em' }}>ML</span>
            </div>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#f5f5f5', letterSpacing: '-0.01em' }}>Mālama Labs</span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} onClick={(e) => handleNavClick(e, link.href)}
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.875rem', fontWeight: 500, color: 'rgba(245,245,245,0.7)', textDecoration: 'none', transition: 'color 0.2s ease', letterSpacing: '-0.01em' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#f5f5f5')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(245,245,245,0.7)')}>
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a href="#cta" onClick={(e) => handleNavClick(e, '#cta')} className="btn-malama" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>Get a Quote</a>
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
              style={{ display: 'block', padding: '0.75rem 0', fontFamily: "'DM Sans', sans-serif", fontSize: '1rem', fontWeight: 500, color: 'rgba(245,245,245,0.8)', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              {link.label}
            </a>
          ))}
          <a href="#cta" onClick={(e) => handleNavClick(e, '#cta')} className="btn-malama" style={{ marginTop: '1rem', display: 'inline-flex' }}>Get a Quote</a>
        </div>
      )}
    </nav>
  )
}
