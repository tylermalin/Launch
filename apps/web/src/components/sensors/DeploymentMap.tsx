'use client'

import { useEffect, useRef, useState } from 'react'
import { MapPin, Leaf, CloudRain, Beaker, Mountain, Waves, Sprout } from 'lucide-react'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useReveal } from './useReveal'

const SANS = 'var(--font-inter-tight), system-ui, sans-serif'
const MONO = 'var(--font-jetbrains), monospace'

interface Deployment {
  id: string; name: string; location: string; lat: number; lng: number
  sensors: string[]; description: string; status: 'active' | 'monitoring' | 'reporting'
  dataPoints: string; icon: React.ReactNode; color: string
}

const deployments: Deployment[] = [
  { id: 'napa', name: 'Napa Valley Vineyard', location: 'Napa, CA', lat: 38.2975, lng: -122.2869, sensors: ['Soil pH', 'Soil Moisture', 'Temperature', 'LoRa'], description: 'Precision viticulture monitoring across 240 acres. Soil pH and moisture data drives irrigation scheduling and harvest timing decisions.', status: 'active', dataPoints: '2.4M readings', icon: <Leaf size={16} />, color: '#8bff47' },
  { id: 'columbia', name: 'Columbia River Basin', location: 'Portland, OR', lat: 45.5231, lng: -122.6765, sensors: ['Water Quality', 'Flow Rate', 'Soil Erosion', 'NB-IoT'], description: 'Watershed health monitoring for the Columbia River Basin. Tracks soil erosion, runoff chemistry, and sediment load across 12 monitoring stations.', status: 'monitoring', dataPoints: '890K readings', icon: <Waves size={16} />, color: '#47c8ff' },
  { id: 'hawaii', name: 'Maui Reforestation Project', location: 'Maui, HI', lat: 20.7984, lng: -156.3319, sensors: ['Soil Health', 'Moisture', 'Atmospheric', 'Solar'], description: 'Native forest restoration monitoring across 1,800 acres. Sensor data guides planting schedules and tracks soil health recovery over time.', status: 'active', dataPoints: '1.1M readings', icon: <Sprout size={16} />, color: '#8bff47' },
  { id: 'iowa', name: 'Iowa Corn Belt Research', location: 'Ames, IA', lat: 42.0308, lng: -93.6319, sensors: ['Soil NPK', 'Moisture', 'Temperature', 'LoRa Mesh'], description: 'University research partnership monitoring nutrient cycling and carbon sequestration across 500 acres of row crop agriculture.', status: 'reporting', dataPoints: '3.2M readings', icon: <Beaker size={16} />, color: '#ffb347' },
  { id: 'colorado', name: 'Rocky Mountain Snowpack', location: 'Aspen, CO', lat: 39.1911, lng: -106.8175, sensors: ['Soil Moisture', 'Snow Depth', 'Temperature', 'NB-IoT'], description: 'High-altitude snowpack and soil moisture monitoring for water resource management. Data feeds into downstream irrigation forecasting models.', status: 'active', dataPoints: '670K readings', icon: <Mountain size={16} />, color: '#c8a8ff' },
  { id: 'florida', name: 'Everglades Restoration', location: 'Miami, FL', lat: 25.6866, lng: -80.8987, sensors: ['Water Table', 'Salinity', 'Soil Carbon', 'Solar'], description: 'Wetland restoration monitoring across the Florida Everglades. Tracks water table levels, soil carbon accumulation, and salinity intrusion.', status: 'monitoring', dataPoints: '1.8M readings', icon: <CloudRain size={16} />, color: '#47c8ff' },
]

const statusColors: Record<string, string> = { active: '#8bff47', monitoring: '#47c8ff', reporting: '#ffb347' }
const statusLabels: Record<string, string> = { active: 'ACTIVE', monitoring: 'MONITORING', reporting: 'REPORTING' }

export default function DeploymentMap() {
  const [selected, setSelected] = useState('napa')
  const [mapError, setMapError] = useState(false)
  const sectionRef = useReveal(0.05)
  const containerRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null)
  const markersRef = useRef<Record<string, HTMLElement>>({})
  const selectedRef = useRef(selected)
  selectedRef.current = selected

  const selectedDeployment = deployments.find((d) => d.id === selected) || deployments[0]

  // Initialize Mapbox (dynamic import keeps it out of the SSR bundle).
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
      if (!token || !containerRef.current) { setMapError(true); return }
      const mapboxgl = (await import('mapbox-gl')).default
      if (cancelled || !containerRef.current) return
      mapboxgl.accessToken = token

      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [-98, 38],
        zoom: 3.1,
        attributionControl: false,
        projection: { name: 'mercator' },
      })
      mapRef.current = map
      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right')

      deployments.forEach((dep) => {
        const el = document.createElement('div')
        el.style.cssText = `width:30px;height:30px;border-radius:50%;background:rgba(10,10,10,0.9);border:2px solid ${dep.color};display:flex;align-items:center;justify-content:center;cursor:pointer;transition:transform .2s ease,box-shadow .2s ease;box-shadow:0 0 12px ${dep.color}40;`
        el.innerHTML = `<div style="width:8px;height:8px;border-radius:50%;background:${dep.color}"></div>`
        el.addEventListener('click', () => setSelected(dep.id))
        markersRef.current[dep.id] = el
        new mapboxgl.Marker({ element: el }).setLngLat([dep.lng, dep.lat]).addTo(map)
      })

      map.on('load', () => {
        if (cancelled) return
        const d = deployments.find((x) => x.id === selectedRef.current) || deployments[0]
        map.flyTo({ center: [d.lng, d.lat], zoom: 4.5, duration: 800 })
      })
    })()
    return () => { cancelled = true; mapRef.current?.remove(); mapRef.current = null }
  }, [])

  // Fly to + highlight the selected deployment.
  useEffect(() => {
    const dep = deployments.find((d) => d.id === selected)
    if (dep && mapRef.current) mapRef.current.flyTo({ center: [dep.lng, dep.lat], zoom: 6, duration: 1000 })
    for (const d of deployments) {
      const el = markersRef.current[d.id]
      if (!el) continue
      const sel = d.id === selected
      el.style.transform = `scale(${sel ? 1.4 : 1})`
      el.style.boxShadow = `0 0 ${sel ? 24 : 12}px ${d.color}${sel ? '80' : '40'}`
      el.style.zIndex = sel ? '3' : '1'
    }
  }, [selected])

  return (
    <section id="deployments" ref={sectionRef} style={{ background: '#0a0a0a', padding: '8rem 0' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="reveal" style={{ marginBottom: '3rem' }}>
          <div className="section-label" style={{ marginBottom: '1rem' }}>Target Deployments</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
            <h2 style={{ fontFamily: SANS, fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.03em', color: '#f5f5f5', lineHeight: 1.1 }}>
              Built for deployment<br /><span className="text-gradient-green">across every terrain.</span>
            </h2>
            <div style={{ display: 'flex', gap: '1.5rem', flexShrink: 0 }}>
              {Object.entries(statusLabels).map(([key, label]) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusColors[key] }} />
                  <span style={{ fontFamily: MONO, fontSize: '0.65rem', color: 'rgba(245,245,245,0.45)', letterSpacing: '0.08em' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <p style={{ fontFamily: MONO, fontSize: '0.7rem', color: 'rgba(245,245,245,0.35)', letterSpacing: '0.08em', marginTop: '0.75rem' }}>
            ILLUSTRATIVE PILOT SITES — SENSORS IN DEVELOPMENT
          </p>
        </div>

        <div className="reveal map-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '1.5px', background: 'rgba(255,255,255,0.06)', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', minHeight: '560px' }}>
          {/* Mapbox panel */}
          <div style={{ position: 'relative', background: '#0a0a0a', minHeight: '560px' }}>
            <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />
            {mapError && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
                <span style={{ fontFamily: MONO, fontSize: '0.7rem', color: 'rgba(245,245,245,0.4)', letterSpacing: '0.08em' }}>MAP UNAVAILABLE — SET NEXT_PUBLIC_MAPBOX_TOKEN</span>
              </div>
            )}
            <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', padding: '0.85rem 1.25rem', background: 'rgba(10,10,10,0.92)', border: `1px solid ${statusColors[selectedDeployment.status]}40`, borderRadius: '10px', backdropFilter: 'blur(12px)', maxWidth: '280px', transition: 'all 0.3s ease', zIndex: 2, pointerEvents: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusColors[selectedDeployment.status], flexShrink: 0 }} />
                <span style={{ fontFamily: MONO, fontSize: '0.62rem', color: statusColors[selectedDeployment.status], letterSpacing: '0.1em' }}>{statusLabels[selectedDeployment.status]}</span>
              </div>
              <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: '0.9rem', color: '#f5f5f5', marginBottom: '0.2rem' }}>{selectedDeployment.name}</div>
              <div style={{ fontFamily: MONO, fontSize: '0.65rem', color: 'rgba(245,245,245,0.45)', letterSpacing: '0.05em' }}>{selectedDeployment.dataPoints} projected</div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ background: '#0f0f0f', overflowY: 'auto', maxHeight: '560px' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, background: '#0f0f0f', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={14} style={{ color: '#8bff47' }} />
                <span style={{ fontFamily: MONO, fontSize: '0.68rem', color: 'rgba(245,245,245,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{deployments.length} Pilot Sites</span>
              </div>
            </div>
            {deployments.map((dep) => {
              const isSelected = dep.id === selected
              return (
                <button key={dep.id} onClick={() => setSelected(dep.id)}
                  style={{ width: '100%', textAlign: 'left', padding: '1.25rem 1.5rem', background: isSelected ? 'rgba(139,255,71,0.05)' : 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)', borderLeft: isSelected ? `3px solid ${dep.color}` : '3px solid transparent', cursor: 'pointer', transition: 'background 0.2s ease, border-color 0.2s ease' }}
                  onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
                  onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'transparent' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ color: dep.color }}>{dep.icon}</div>
                      <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: '0.875rem', color: '#f5f5f5', letterSpacing: '-0.01em' }}>{dep.name}</span>
                    </div>
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: statusColors[dep.status], flexShrink: 0, marginTop: '6px' }} />
                  </div>
                  <div style={{ fontFamily: MONO, fontSize: '0.65rem', color: 'rgba(245,245,245,0.35)', letterSpacing: '0.06em', marginBottom: '0.6rem' }}>{dep.location}</div>
                  {isSelected && <p style={{ fontFamily: SANS, fontSize: '0.8rem', lineHeight: 1.6, color: 'rgba(245,245,245,0.6)', marginBottom: '0.75rem' }}>{dep.description}</p>}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {dep.sensors.map((s) => (
                      <span key={s} style={{ padding: '0.2rem 0.55rem', background: isSelected ? `${dep.color}15` : 'rgba(255,255,255,0.04)', border: `1px solid ${isSelected ? dep.color + '30' : 'rgba(255,255,255,0.07)'}`, borderRadius: '100px', fontFamily: MONO, fontSize: '0.6rem', color: isSelected ? dep.color : 'rgba(245,245,245,0.4)', letterSpacing: '0.04em', transition: 'all 0.2s ease' }}>{s}</span>
                    ))}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="reveal reveal-delay-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1px', background: 'rgba(255,255,255,0.06)', borderRadius: '12px', overflow: 'hidden', marginTop: '1.5px', border: '1px solid rgba(255,255,255,0.06)' }}>
          {[
            { value: '6', label: 'Target Regions', sub: 'Across North America' },
            { value: '3', label: 'Settlement Use Cases', sub: 'Markets · Insurance · Climate' },
            { value: '24/7', label: 'Signed Monitoring', sub: 'Continuous, on-chain' },
            { value: '3', label: 'Sensor Types', sub: 'Soil, Atmos, Water' },
          ].map((stat) => (
            <div key={stat.label} style={{ padding: '1.5rem 2rem', background: '#0f0f0f', textAlign: 'center' }}>
              <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: '1.75rem', color: '#f5f5f5', letterSpacing: '-0.03em', lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: '0.85rem', color: 'rgba(245,245,245,0.7)', marginTop: '0.35rem' }}>{stat.label}</div>
              <div style={{ fontFamily: MONO, fontSize: '0.62rem', color: 'rgba(245,245,245,0.3)', marginTop: '0.2rem', letterSpacing: '0.05em' }}>{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media (max-width: 900px) { .map-layout { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  )
}
