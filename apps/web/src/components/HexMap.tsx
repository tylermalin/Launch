'use client'

import React, { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import HexPanel from './HexPanel'
import { Navigation } from 'lucide-react'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

export default function HexMap() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [selectedHex, setSelectedHex] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    
    if (!token) {
      console.error('HexMap: MISSING NEXT_PUBLIC_MAPBOX_TOKEN')
      setError('Missing Mapbox Token')
      return
    }

    mapboxgl.accessToken = token
    
    if (map.current || !mapContainer.current) return

    try {
      console.log('HexMap: Initializing Mapbox GL JS Map on container:', !!mapContainer.current)
      
      const m = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [-112.5, 43.5], 
        zoom: 6,
        pitch: 0,
        bearing: 0,
        attributionControl: false
      })

      map.current = m
    } catch (err: any) {
      console.error('CRITICAL: Mapbox Map failed to initialize:', err)
      setError(err.message || 'Mapbox failed to initialize')
      return
    }

    const m = map.current
    if (!m) return // Should never happen after the above check    
    m.on('style.load', () => {
      console.log('HexMap: Style Loaded! Map is now rendering.')
      m.setFog({
        color: 'rgb(10, 22, 40)',
        'high-color': 'rgb(17, 24, 39)',
        'horizon-blend': 0.1,
        'space-color': 'rgb(5, 10, 20)',
        'star-intensity': 0.8
      })
    })

    m.on('error', (e) => {
      console.error('HexMap: Map Error:', e.error?.message || e.error || 'Unknown Error')
      if (e.error?.message?.includes('token')) {
        setError('Mapbox Access Token Invalid or Inactive')
      }
    })

      m.on('load', async () => {
      try {
        const res = await fetch('/api/hexes')
        const data = await res.json()

        // Omnichain Local State Synchronization
        // Reads purchased nodes from the decoupled payment gateway and visibly renders them active.
        try {
          const purchasedString = localStorage.getItem('malamalabs_purchased_nodes')
          if (purchasedString) {
            const purchasedHexes: string[] = JSON.parse(purchasedString)
            if (purchasedHexes.length > 0 && Array.isArray(data.features)) {
              data.features.forEach((feature: any) => {
                if (feature.properties && purchasedHexes.includes(feature.properties.id)) {
                  feature.properties.status = 'active'
                  feature.properties.purchasedLocal = true // Flag it purely for diagnostic debugging
                }
              })
            }
          }
        } catch (e) {
          console.warn("Failed to sync purchased nodes", e)
        }

        m.addSource('hexes', {
          type: 'geojson',
          data
        })

        m.addLayer({
          id: 'hex-fill',
          type: 'fill',
          source: 'hexes',
          paint: {
            'fill-color': [
              'match',
              ['get', 'status'],
              'available', '#44BBA4', 
              'reserved', '#6B7280',  
              'active', '#22C55E',    
              'auction', '#F18F01',   
              '#374151'
            ],
            'fill-opacity': [
              'interpolate',
              ['linear'],
              ['get', 'dataScore'],
              0, 0.1,
              100, 0.7
            ]
          }
        })

        m.addLayer({
          id: 'hex-lines',
          type: 'line',
          source: 'hexes',
          paint: {
            'line-color': '#0A1628',
            'line-width': 1.5,
            'line-opacity': 0.8
          }
        })
        
        m.addLayer({
          id: 'hex-highlight',
          type: 'line',
          source: 'hexes',
          paint: {
            'line-color': '#FFFFFF',
            'line-width': 4,
            'line-opacity': 0.9
          },
          filter: ['==', 'id', '']
        })

        let opacity = 0.5
        let direction = 0.015
        
        const animatePulse = () => {
          if (!m.isStyleLoaded()) {
            requestAnimationFrame(animatePulse)
            return
          }
          opacity += direction
          if (opacity > 0.9) direction = -0.015
          if (opacity < 0.2) direction = 0.015
          
          m.setPaintProperty('hex-fill', 'fill-opacity', [
            'case',
            ['==', ['get', 'status'], 'active'],
            opacity,
            ['interpolate', ['linear'], ['get', 'dataScore'], 0, 0.1, 100, 0.7] 
          ])
          
          requestAnimationFrame(animatePulse)
        }
        
        animatePulse()

      } catch (err) {
        console.error('Failed to load hex data', err)
      }
    })

    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      className: 'malama-popup'
    })

    m.on('mousemove', 'hex-fill', (e) => {
      if (!e.features || e.features.length === 0) return
      m.getCanvas().style.cursor = 'pointer'
      const feature = e.features[0]
      const props = feature.properties as any

      const html = `
        <div class="bg-malama-deep/95 backdrop-blur-xl border border-gray-700 p-4 rounded-xl shadow-2xl text-white font-sans text-sm min-w-[180px]">
          <p class="font-mono text-xs font-black text-gray-500 tracking-widest mb-3 uppercase">${props.id}</p>
          <div class="flex justify-between items-center mb-2"><span class="text-gray-400 font-semibold">Score</span><span class="font-black text-malama-teal text-lg">${props.dataScore}</span></div>
          <div class="flex justify-between items-center"><span class="text-gray-400 font-semibold">Bid</span><span class="font-black text-malama-amber text-lg">$${props.startingBid}</span></div>
        </div>
      `
      popup.setLngLat(e.lngLat).setHTML(html).addTo(m)
    })

    m.on('mouseleave', 'hex-fill', () => {
      m.getCanvas().style.cursor = ''
      popup.remove()
    })

    m.on('click', 'hex-fill', (e) => {
      if (!e.features || e.features.length === 0) return
      const feature = e.features[0]
      const props = feature.properties
      
      m.setFilter('hex-highlight', ['==', 'id', props?.id])
      setSelectedHex(props)
    })

  }, [])

  const flyToLocation = () => {
    if (!map.current) return
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        map.current?.flyTo({
          center: [pos.coords.longitude, pos.coords.latitude],
          zoom: 7,
          duration: 2500,
          essential: true
        })
      })
    }
  }

  const regions = [
    { name: 'Core Alpha (Idaho)', center: [-112.5, 43.5], zoom: 6 },
    { name: 'Nexus Prime (NYC)', center: [-74.0060, 40.7128], zoom: 10 },
    { name: 'Thames Node (London)', center: [-0.1278, 51.5074], zoom: 10 },
    { name: 'Neo-Sovereign (Tokyo)', center: [139.6503, 35.6762], zoom: 10 }
  ]

  return (
    <div className="relative w-full h-full min-h-[500px] overflow-hidden">
      <div 
        ref={mapContainer} 
        className="absolute inset-0 z-1 w-full h-full" 
        style={{ minHeight: '500px' }}
      />
      
      {error && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6 text-center">
          <div className="max-w-md">
            <h2 className="text-2xl font-black text-red-500 mb-4 uppercase tracking-tighter">Topology Error</h2>
            <p className="text-gray-400 font-mono text-sm leading-relaxed mb-8">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-white text-black font-black uppercase tracking-widest rounded-full hover:bg-malama-teal transition-colors"
            >
              Restart Array
            </button>
          </div>
        </div>
      )}
      
      <div className="absolute top-24 left-8 z-10 pointer-events-none max-w-sm">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-3 h-3 bg-malama-teal rounded-full animate-pulse shadow-[0_0_10px_rgba(68,187,164,0.5)]" />
          <h1 className="text-xl font-black text-white uppercase tracking-tighter">Neural Topology</h1>
        </div>
        <p className="text-gray-400 text-xs font-mono uppercase tracking-[0.2em] leading-relaxed">
          Global Opportunity Matrix <span className="text-malama-teal">Active</span>
        </p>
      </div>

      <div className="absolute bottom-8 left-8 z-10 flex flex-col space-y-3">
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Jump to Region</p>
        <div className="flex flex-wrap gap-2 max-w-xl">
          {regions.map((r) => (
            <button
              key={r.name}
              onClick={() => {
                map.current?.flyTo({ center: r.center as [number, number], zoom: r.zoom, duration: 3000 })
              }}
              className="px-4 py-2 bg-malama-deep/80 backdrop-blur-md border border-gray-800 rounded-xl text-xs font-bold text-gray-300 hover:border-malama-teal hover:text-white transition-all shadow-xl"
            >
              {r.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="absolute top-24 right-8 z-10">
        <button 
          onClick={flyToLocation}
          className="bg-malama-deep/90 hover:bg-white backdrop-blur-md border border-gray-700 text-white hover:text-malama-deep p-4 rounded-full shadow-2xl transition-all group duration-300 pointer-events-auto"
          title="Fly to my location"
        >
          <Navigation className="w-7 h-7 transition-colors fill-current" />
        </button>
      </div>

      <style jsx global>{`
        .malama-popup .mapboxgl-popup-content {
          background: transparent !important;
          padding: 0 !important;
          box-shadow: none !important;
        }
        .malama-popup .mapboxgl-popup-tip {
          display: none !important;
        }
      `}</style>
      
      <HexPanel 
        data={selectedHex} 
        onClose={() => {
          setSelectedHex(null)
          if (map.current) map.current.setFilter('hex-highlight', ['==', 'id', ''])
        }} 
      />
    </div>
  )
}
