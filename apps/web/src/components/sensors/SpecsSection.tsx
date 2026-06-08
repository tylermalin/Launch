'use client'

import { useReveal } from './useReveal'

const specGroups = [
  { group: 'Connectivity', specs: [
    { param: 'Primary Radio', value: 'LoRa 915MHz' },
    { param: 'Secondary Radio', value: 'NB-IoT Cellular' },
    { param: 'Range (LoRa)', value: 'Up to 5km LOS' },
    { param: 'Bluetooth', value: 'BLE 5.0 (config)' },
    { param: 'Protocol', value: 'MQTT / HTTP / CoAP' },
  ] },
  { group: 'Power System', specs: [
    { param: 'Solar Input', value: '6.2V / 5W panel' },
    { param: 'Battery', value: '3.7V LiPo, 5000mAh' },
    { param: 'Backup Duration', value: '48+ hours' },
    { param: 'Charging', value: 'MPPT Solar Controller' },
    { param: 'Power Draw', value: '< 50mA active' },
  ] },
  { group: 'Soil Sensor', specs: [
    { param: 'pH Range', value: '0 – 14 pH (±0.1)' },
    { param: 'Moisture', value: '0 – 100% VWC' },
    { param: 'Temperature', value: '-40°C to +85°C' },
    { param: 'EC Range', value: '0 – 20 mS/cm' },
    { param: 'Probe Material', value: '316 Stainless Steel' },
  ] },
  { group: 'Physical', specs: [
    { param: 'Enclosure Rating', value: 'IP67 Weatherproof' },
    { param: 'Operating Temp', value: '-40°C to +70°C' },
    { param: 'Display', value: '2.8" Color TFT Touch' },
    { param: 'Sensor Ports', value: '2× (A + B)' },
    { param: 'Mounting', value: 'Pole / Wall / Surface' },
  ] },
]

export default function SpecsSection() {
  const ref = useReveal()
  return (
    <section id="specs" style={{ background: '#0f0f0f', padding: '8rem 0' }} ref={ref}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="reveal" style={{ marginBottom: '4rem' }}>
          <div className="section-label" style={{ marginBottom: '1rem' }}>Technical Specifications</div>
          <h2 style={{ fontFamily: "var(--font-inter-tight), system-ui, sans-serif", fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.03em', color: '#f5f5f5', lineHeight: 1.1 }}>
            Every detail,<br /><span className="text-gradient-green">precisely specified.</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {specGroups.map((group, gi) => (
            <div key={group.group} className={`reveal reveal-delay-${gi + 1}`} style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ padding: '1rem 1.5rem', background: 'rgba(139,255,71,0.05)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: '0.72rem', fontWeight: 600, color: '#8bff47', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{group.group}</span>
              </div>
              {group.specs.map((spec, si) => (
                <div key={spec.param} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1.5rem', borderBottom: si < group.specs.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <span style={{ fontFamily: "var(--font-inter-tight), system-ui, sans-serif", fontSize: '0.85rem', color: 'rgba(245,245,245,0.5)' }}>{spec.param}</span>
                  <span style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: '0.8rem', fontWeight: 500, color: '#f5f5f5', textAlign: 'right' }}>{spec.value}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="reveal" style={{ marginTop: '3rem', textAlign: 'center' }}>
          <p style={{ fontFamily: "var(--font-inter-tight), system-ui, sans-serif", fontSize: '0.9rem', color: 'rgba(245,245,245,0.4)', marginBottom: '1rem' }}>Full technical documentation available upon request</p>
          <a href="#cta" className="btn-malama" onClick={(e) => { e.preventDefault(); document.querySelector('#cta')?.scrollIntoView({ behavior: 'smooth' }) }}>Request Full Datasheet</a>
        </div>
      </div>
    </section>
  )
}
