const specs = [
  'LoRa 915MHz', 'NB-IoT Connectivity', 'Solar Charging', 'IP67 Rated', 'Dual Sensor Ports',
  'Real-Time Dashboard', 'Soil pH + Moisture', 'Atmospheric Sensing', 'GPS Tracking',
  'OTA Updates', '5km+ Range', '48hr Battery Backup', 'Gold Level System', 'QTY Discounts Available',
]

export default function SpecTicker() {
  const items = [...specs, ...specs] // duplicate for seamless loop
  return (
    <div style={{ background: '#141414', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0.85rem 0', overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '80px', background: 'linear-gradient(to right, #141414, transparent)', zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '80px', background: 'linear-gradient(to left, #141414, transparent)', zIndex: 2, pointerEvents: 'none' }} />
      <div className="ticker-track" style={{ display: 'flex', gap: '0', whiteSpace: 'nowrap' }}>
        {items.map((spec, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '1.5rem' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', fontWeight: 500, color: 'rgba(245,245,245,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 2rem' }}>{spec}</span>
            <span style={{ color: '#8bff47', fontSize: '0.5rem' }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}
