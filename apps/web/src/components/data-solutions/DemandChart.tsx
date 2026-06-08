'use client'

import { useEffect, useRef } from 'react'

// Modeled, illustrative — NOT actuals (see VOICE.md: never present projections as actuals).
const BARS: { label: string; value: number; blue?: boolean }[] = [
  { label: 'AI Data Centers', value: 100, blue: true },
  { label: 'Carbon Accounting', value: 82 },
  { label: 'Energy Grids', value: 71 },
  { label: 'Parametric Insurance', value: 58 },
  { label: 'Climate Research', value: 49 },
  { label: 'Smart Cities', value: 44 },
  { label: 'Precision Agriculture', value: 37 },
  { label: 'Prediction Markets', value: 28 },
]

export default function DemandChart() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = ref.current
    if (!card) return
    const fills = Array.from(card.querySelectorAll<HTMLElement>('.bar-fill'))
    const run = () => fills.forEach((f, i) => setTimeout(() => { f.style.width = f.dataset.w || '0%' }, 120 + i * 90))
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { run(); io.disconnect() } })
      }, { threshold: 0.3 })
      io.observe(card)
      return () => io.disconnect()
    }
    run()
  }, [])

  return (
    <div className="chart-card" ref={ref}>
      <div className="chart-head">
        <h4>Modeled Data Demand by Sector · 2025–2028</h4>
        <span className="chart-tag">Modeled · Illustrative</span>
      </div>
      <p className="chart-sub">
        Relative index of projected verifiable-data volume requirements. Figures are an internal base-case model for
        representation of market capabilities and are not actuals, commitments, or forecasts of Mālama revenue.
      </p>
      <div className="bars">
        {BARS.map((b) => (
          <div className="bar-row" key={b.label}>
            <div className="bar-label">{b.label}</div>
            <div className="bar-track"><div className={`bar-fill${b.blue ? ' blue' : ''}`} data-w={`${b.value}%`} /></div>
            <div className="bar-val">{b.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
