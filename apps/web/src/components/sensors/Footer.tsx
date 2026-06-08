'use client'

const footerLinks = [
  { label: 'Sensor Systems', href: '#products' },
  { label: 'Technology', href: '#technology' },
  { label: 'Specifications', href: '#specs' },
  { label: 'Agents', href: '#agents' },
  { label: 'Contact', href: '#cta' },
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(139,255,71,0.1)', border: '1px solid rgba(139,255,71,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', fontWeight: 700, color: '#8bff47' }}>ML</span>
            </div>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: '#f5f5f5' }}>Mālama Labs</span>
          </div>
          <nav style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {footerLinks.map((link) => (
              <a key={link.label} href={link.href} onClick={(e) => handleClick(e, link.href)}
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', color: 'rgba(245,245,245,0.45)', textDecoration: 'none', transition: 'color 0.2s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(245,245,245,0.8)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(245,245,245,0.45)')}>
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="hairline" style={{ marginBottom: '1.5rem' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: 'rgba(245,245,245,0.25)', letterSpacing: '0.05em' }}>© {year} MĀLAMA LABS. ALL RIGHTS RESERVED.</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="led-dot" style={{ width: '5px', height: '5px' }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: '#8bff47', letterSpacing: '0.08em', opacity: 0.7 }}>SYSTEMS ONLINE</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
