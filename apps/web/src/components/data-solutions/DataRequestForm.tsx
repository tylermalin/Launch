'use client'

import { useState } from 'react'

const USE_CASES = ['Climate Research', 'Carbon Accounting', 'Parametric Insurance', 'Prediction Markets', 'Smart Cities', 'AI Data Centers', 'Energy Grids', 'Precision Agriculture', 'Other']

// Inline styles resolve the .ds-root CSS vars (this renders inside .ds-root).
const field: React.CSSProperties = {
  width: '100%', background: 'var(--bg-elev)', border: '1px solid var(--line-bright)', borderRadius: '2px',
  padding: '14px 16px', fontFamily: 'var(--sans)', fontSize: '14px', color: 'var(--ink)', outline: 'none',
}

export default function DataRequestForm() {
  const [form, setForm] = useState({ email: '', name: '', org: '', useCase: '', message: '' })
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email) { setError('Email is required'); return }
    setError(''); setSending(true)
    try {
      const res = await fetch('/api/data-solutions/request', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send — please try again')
    } finally {
      setSending(false)
    }
  }

  if (done) {
    return (
      <div style={{ fontFamily: 'var(--mono)', fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
        <span className="live-dot" />Request received. Our data team will be in touch.
      </div>
    )
  }

  return (
    <form onSubmit={submit} style={{ maxWidth: '560px', margin: '0 auto', display: 'grid', gap: '10px', textAlign: 'left', position: 'relative' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <input style={field} type="email" required placeholder="you@organization.org" value={form.email} onChange={set('email')} />
        <input style={field} type="text" placeholder="Name" value={form.name} onChange={set('name')} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <input style={field} type="text" placeholder="Organization" value={form.org} onChange={set('org')} />
        <select style={{ ...field, appearance: 'none', cursor: 'pointer' }} value={form.useCase} onChange={set('useCase')}>
          <option value="">Primary use case…</option>
          {USE_CASES.map((u) => <option key={u} value={u} style={{ background: '#0f1410' }}>{u}</option>)}
        </select>
      </div>
      <textarea style={{ ...field, minHeight: '90px', resize: 'vertical', fontFamily: 'var(--sans)' }} placeholder="What data are you looking for? (coverage, sensor type, frequency)" value={form.message} onChange={set('message')} />
      {error && <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--warn)', letterSpacing: '0.06em' }}>{error}</div>}
      <button type="submit" className="btn btn-primary" disabled={sending} style={{ justifyContent: 'center', opacity: sending ? 0.6 : 1 }}>
        {sending ? 'Sending…' : 'Request data access →'}
      </button>
    </form>
  )
}
