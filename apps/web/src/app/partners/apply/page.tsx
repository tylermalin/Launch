'use client'

import { useState, FormEvent } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, AlertCircle, Twitter, Wallet, User, Mail, FileText } from 'lucide-react'
import Link from 'next/link'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.35 } }),
}

type FormState = 'idle' | 'submitting' | 'success' | 'error'

export default function ApplyPage() {
  const [state, setState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [result, setResult] = useState<{ id: string; referralUrl: string; vanityUrl: string } | null>(null)

  const [form, setForm] = useState({
    displayName: '',
    email: '',
    walletAddress: '',
    twitterHandle: '',
    bio: '',
    promoMethod: '',
  })

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setState('submitting')
    setErrorMsg('')

    try {
      const res = await fetch('/api/partners/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Submission failed')
      setResult(data)
      setState('success')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong')
      setState('error')
    }
  }

  if (state === 'success' && result) {
    return (
      <div className="min-h-screen bg-malama-bg flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-malama-card border border-malama-line rounded-malama p-10 text-center"
        >
          <CheckCircle2 size={40} className="text-malama-accent mx-auto mb-4" />
          <h2 className="text-2xl font-serif font-black text-white mb-2">Application received!</h2>
          <p className="text-malama-ink-dim text-sm leading-relaxed mb-8">
            We review applications within 24 hours. Once approved, your referral links go live and you can
            start earning.
          </p>

          <div className="bg-malama-elev border border-malama-line rounded-malama p-4 text-left mb-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-malama-ink-faint mb-3">
              Your referral links (active after approval)
            </p>
            {[
              { label: 'Standard link', url: result.referralUrl },
              { label: 'Vanity link', url: result.vanityUrl },
            ].map((link) => (
              <div key={link.label} className="mb-3 last:mb-0">
                <p className="text-[10px] text-malama-ink-faint mb-1">{link.label}</p>
                <button
                  onClick={() => navigator.clipboard.writeText(link.url)}
                  className="w-full flex items-center justify-between gap-2 bg-malama-bg border border-malama-line rounded px-3 py-2 text-xs font-mono text-malama-ink hover:border-malama-accent/50 transition-colors group"
                >
                  <span className="truncate">{link.url}</span>
                  <span className="text-malama-ink-faint group-hover:text-malama-accent transition-colors shrink-0">
                    Copy
                  </span>
                </button>
              </div>
            ))}
          </div>

          <Link
            href="/partners/dashboard"
            className="inline-flex items-center gap-2 text-malama-accent text-sm font-black hover:underline"
          >
            Go to dashboard <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-malama-bg">
      <div className="max-w-2xl mx-auto px-6 pt-20 pb-20">
        <motion.div initial="hidden" animate="show" variants={fadeUp} custom={0} className="mb-10">
          <Link href="/partners" className="text-xs text-malama-ink-faint hover:text-malama-accent transition-colors mb-6 inline-block">
            ← Back to Partners
          </Link>
          <p className="text-xs font-black uppercase tracking-widest text-malama-accent mb-3">
            Partner Application
          </p>
          <h1 className="text-4xl font-serif font-black text-white tracking-tight mb-3">
            Join the program
          </h1>
          <p className="text-malama-ink-dim leading-relaxed">
            Tell us about yourself and how you plan to spread the word. We'll review within 24 hours.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <motion.div initial="hidden" animate="show" variants={fadeUp} custom={1}>
            <label className="block text-xs font-black uppercase tracking-wider text-malama-ink-dim mb-2">
              <User size={11} className="inline mr-1" />Full name *
            </label>
            <input
              required
              value={form.displayName}
              onChange={set('displayName')}
              placeholder="Tyler Malin"
              className="w-full bg-malama-card border border-malama-line rounded-malama px-4 py-3 text-sm text-malama-ink placeholder-malama-ink-faint focus:outline-none focus:border-malama-accent/50 transition-colors"
            />
          </motion.div>

          {/* Email */}
          <motion.div initial="hidden" animate="show" variants={fadeUp} custom={2}>
            <label className="block text-xs font-black uppercase tracking-wider text-malama-ink-dim mb-2">
              <Mail size={11} className="inline mr-1" />Email *
            </label>
            <input
              required
              type="email"
              value={form.email}
              onChange={set('email')}
              placeholder="you@example.com"
              className="w-full bg-malama-card border border-malama-line rounded-malama px-4 py-3 text-sm text-malama-ink placeholder-malama-ink-faint focus:outline-none focus:border-malama-accent/50 transition-colors"
            />
          </motion.div>

          {/* Wallet */}
          <motion.div initial="hidden" animate="show" variants={fadeUp} custom={3}>
            <label className="block text-xs font-black uppercase tracking-wider text-malama-ink-dim mb-2">
              <Wallet size={11} className="inline mr-1" />Base wallet address (USDC payout) *
            </label>
            <input
              required
              value={form.walletAddress}
              onChange={set('walletAddress')}
              placeholder="0x..."
              className="w-full bg-malama-card border border-malama-line rounded-malama px-4 py-3 text-sm font-mono text-malama-ink placeholder-malama-ink-faint focus:outline-none focus:border-malama-accent/50 transition-colors"
            />
            <p className="text-[11px] text-malama-ink-faint mt-1">
              USDC commissions are paid to this address on Base network.
            </p>
          </motion.div>

          {/* Twitter */}
          <motion.div initial="hidden" animate="show" variants={fadeUp} custom={4}>
            <label className="block text-xs font-black uppercase tracking-wider text-malama-ink-dim mb-2">
              <Twitter size={11} className="inline mr-1" />X / Twitter handle
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-malama-ink-faint text-sm">@</span>
              <input
                value={form.twitterHandle}
                onChange={set('twitterHandle')}
                placeholder="yourhandle"
                className="w-full bg-malama-card border border-malama-line rounded-malama pl-7 pr-4 py-3 text-sm text-malama-ink placeholder-malama-ink-faint focus:outline-none focus:border-malama-accent/50 transition-colors"
              />
            </div>
          </motion.div>

          {/* Bio */}
          <motion.div initial="hidden" animate="show" variants={fadeUp} custom={5}>
            <label className="block text-xs font-black uppercase tracking-wider text-malama-ink-dim mb-2">
              <FileText size={11} className="inline mr-1" />Brief bio
            </label>
            <textarea
              rows={3}
              value={form.bio}
              onChange={set('bio')}
              placeholder="Tell us who you are — crypto KOL, climate researcher, DePIN enthusiast..."
              className="w-full bg-malama-card border border-malama-line rounded-malama px-4 py-3 text-sm text-malama-ink placeholder-malama-ink-faint focus:outline-none focus:border-malama-accent/50 transition-colors resize-none"
            />
          </motion.div>

          {/* Promo method */}
          <motion.div initial="hidden" animate="show" variants={fadeUp} custom={6}>
            <label className="block text-xs font-black uppercase tracking-wider text-malama-ink-dim mb-2">
              How will you promote Mālama? *
            </label>
            <textarea
              required
              rows={4}
              value={form.promoMethod}
              onChange={set('promoMethod')}
              placeholder="e.g. Twitter thread campaign, YouTube video, newsletter to 5k subscribers, Telegram group, podcast appearance..."
              className="w-full bg-malama-card border border-malama-line rounded-malama px-4 py-3 text-sm text-malama-ink placeholder-malama-ink-faint focus:outline-none focus:border-malama-accent/50 transition-colors resize-none"
            />
          </motion.div>

          {state === 'error' && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-malama px-4 py-3"
            >
              <AlertCircle size={14} className="text-red-400 shrink-0" />
              <p className="text-red-400 text-sm">{errorMsg}</p>
            </motion.div>
          )}

          <motion.div initial="hidden" animate="show" variants={fadeUp} custom={7}>
            <button
              type="submit"
              disabled={state === 'submitting'}
              className="w-full flex items-center justify-center gap-2 bg-malama-accent text-malama-bg font-black text-sm uppercase tracking-wider py-3 rounded-malama hover:bg-malama-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {state === 'submitting' ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Submitting…
                </span>
              ) : (
                <>Submit application <ArrowRight size={14} /></>
              )}
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  )
}
