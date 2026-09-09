'use client'

import { useEffect, useRef, useState } from 'react'
import { useReveal } from './useReveal'

function useCounter(target: number, duration: number, start: boolean) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime: number | null = null
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [start, target, duration])
  return count
}

const stats = [
  { value: 5, suffix: 'km+', label: 'LoRa Range', sublabel: 'Line of sight' },
  { value: 48, suffix: 'hr', label: 'Battery Backup', sublabel: 'Without solar' },
  { value: 99, suffix: '%', label: 'Uptime SLA', sublabel: 'Field-tested' },
  { value: 4, suffix: '×', label: 'Sensor Parameters', sublabel: 'Per probe' },
]

function StatCard({ stat, index }: { stat: (typeof stats)[0]; index: number }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const count = useCounter(stat.value, 1800, visible)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { setVisible(true); e.target.classList.add('visible') } }),
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return (
    <div ref={ref} className={`reveal reveal-delay-${index + 1}`} style={{ textAlign: 'center', padding: '3rem 2rem', borderRight: index < stats.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
      <div style={{ fontFamily: "var(--font-inter-tight), system-ui, sans-serif", fontWeight: 800, fontSize: 'clamp(3rem, 6vw, 5rem)', lineHeight: 1, letterSpacing: '-0.04em', color: '#f5f5f5', marginBottom: '0.5rem' }}>
        {count}<span style={{ color: '#8bff47' }}>{stat.suffix}</span>
      </div>
      <div style={{ fontFamily: "var(--font-inter-tight), system-ui, sans-serif", fontWeight: 600, fontSize: '1rem', color: '#f5f5f5', marginBottom: '0.25rem', letterSpacing: '-0.01em' }}>{stat.label}</div>
      <div style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: '0.7rem', color: 'rgba(245,245,245,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{stat.sublabel}</div>
    </div>
  )
}

export default function StatsSection() {
  const ref = useReveal(0.2)
  return (
    <section style={{ background: '#141414', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }} ref={ref}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {stats.map((stat, i) => <StatCard key={stat.label} stat={stat} index={i} />)}
        </div>
      </div>
      <style>{`@media (max-width: 768px) { .stats-grid { grid-template-columns: repeat(2, 1fr) !important; } .stats-grid > div { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.06); } }`}</style>
    </section>
  )
}
