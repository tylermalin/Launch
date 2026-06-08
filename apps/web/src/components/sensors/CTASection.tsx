'use client'

import { useState } from 'react'
import { ArrowRight, Send } from 'lucide-react'
import { useReveal } from './useReveal'

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.85rem 1rem', background: '#141414', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px', fontFamily: "var(--font-inter-tight), system-ui, sans-serif", fontSize: '0.9rem', color: '#f5f5f5', outline: 'none', transition: 'border-color 0.2s ease',
}

export default function CTASection() {
  const ref = useReveal()
  const [form, setForm] = useState({ name: '', email: '', org: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email) {
      setError('Please fill in your name and email.')
      return
    }
    setError('')
    setSending(true)
    try {
      const res = await fetch('/api/sensors/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Something went wrong')
      }
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send — please try again')
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="cta" style={{ background: '#0a0a0a', padding: '8rem 0', position: 'relative', overflow: 'hidden' }} ref={ref}>
      <div style={{ position: 'absolute', bottom: '-200px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,255,71,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="cta-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'start' }}>
          <div>
            <div className="reveal">
              <div className="section-label" style={{ marginBottom: '1rem' }}>Early Access · In Development</div>
              <h2 style={{ fontFamily: "var(--font-inter-tight), system-ui, sans-serif", fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.03em', color: '#f5f5f5', lineHeight: 1.1, marginBottom: '1.25rem' }}>
                Settle on<br /><span className="text-gradient-green">signed</span><br />ground truth.
              </h2>
              <p style={{ fontFamily: "var(--font-inter-tight), system-ui, sans-serif", fontSize: '0.95rem', lineHeight: 1.7, color: 'rgba(245,245,245,0.55)', marginBottom: '2rem' }}>
                The sensors are in development and we&apos;re lining up launch partners. If you run a prediction market, a parametric insurance product, or a climate / carbon program and want hardware-signed data as your settlement layer, tell us — we&apos;ll bring you into the pilot.
              </p>
            </div>
            <div className="reveal reveal-delay-2">
              {['Settlement oracle for prediction markets', 'Parametric insurance triggers', 'Climate & carbon MRV', 'Early pilot partner program'].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontFamily: "var(--font-inter-tight), system-ui, sans-serif", fontSize: '0.875rem', color: 'rgba(245,245,245,0.65)' }}>
                  <ArrowRight size={14} style={{ color: '#8bff47', flexShrink: 0 }} />{item}
                </div>
              ))}
            </div>
          </div>

          <div className="reveal reveal-delay-2">
            {submitted ? (
              <div style={{ background: '#141414', border: '1px solid rgba(139,255,71,0.25)', borderRadius: '16px', padding: '3rem 2rem', textAlign: 'center' }}>
                <div className="led-dot" style={{ margin: '0 auto 1.5rem' }} />
                <h3 style={{ fontFamily: "var(--font-inter-tight), system-ui, sans-serif", fontWeight: 700, fontSize: '1.5rem', color: '#f5f5f5', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>You&apos;re on the list.</h3>
                <p style={{ fontFamily: "var(--font-inter-tight), system-ui, sans-serif", fontSize: '0.9rem', color: 'rgba(245,245,245,0.55)', lineHeight: 1.65 }}>Thanks for your interest in the pilot — our team will reach out as the sensors move toward deployment.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {[
                  { key: 'name', label: 'Name *', type: 'text', placeholder: 'Your name' },
                  { key: 'email', label: 'Email *', type: 'email', placeholder: 'your@email.com' },
                  { key: 'org', label: 'Organization', type: 'text', placeholder: 'Company or institution' },
                ].map((f) => (
                  <div key={f.key}>
                    <label style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: '0.65rem', color: 'rgba(245,245,245,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>{f.label}</label>
                    <input type={f.type} placeholder={f.placeholder} value={form[f.key as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = 'rgba(139,255,71,0.4)')}
                      onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
                  </div>
                ))}
                <div>
                  <label style={{ fontFamily: "var(--font-jetbrains), monospace", fontSize: '0.65rem', color: 'rgba(245,245,245,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Message</label>
                  <textarea placeholder="Tell us about your deployment needs, quantity, and use case..." value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })} rows={4} style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }}
                    onFocus={(e) => (e.target.style.borderColor = 'rgba(139,255,71,0.4)')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
                </div>
                {error && <div style={{ fontFamily: "var(--font-inter-tight), system-ui, sans-serif", fontSize: '0.8rem', color: '#ff6b6b' }}>{error}</div>}
                <button type="submit" disabled={sending} className="btn-malama btn-malama-solid" style={{ width: '100%', justifyContent: 'center', gap: '0.5rem', opacity: sending ? 0.6 : 1 }}>
                  <Send size={16} />{sending ? 'Sending…' : 'Request Access'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <style>{`@media (max-width: 768px) { .cta-grid { grid-template-columns: 1fr !important; gap: 3rem !important; } }`}</style>
    </section>
  )
}
