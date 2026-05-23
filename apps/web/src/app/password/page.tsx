'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function PasswordForm() {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from') ?? '/'

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: value, from }),
      })

      if (res.ok) {
        const { redirectTo } = await res.json()
        router.push(redirectTo)
        router.refresh()
      } else {
        setError('Incorrect password. Try again.')
        setValue('')
        inputRef.current?.focus()
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A1628] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo mark */}
        <div className="flex justify-center mb-10">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M24 4L44 15V33L24 44L4 33V15L24 4Z"
              fill="#0A1628"
              stroke="#65d9a5"
              strokeWidth="2"
            />
            <path d="M14 32V18L24 24L34 18V32" stroke="#65d9a5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </div>

        <h1 className="text-center text-white text-2xl font-black tracking-tight mb-1">
          Mālama Labs
        </h1>
        <p className="text-center text-gray-500 text-sm mb-10">
          Private preview. Enter password to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              ref={inputRef}
              type="password"
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              className="w-full bg-[#111f35] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#65d9a5] focus:ring-1 focus:ring-[#65d9a5] transition-colors"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || value.length === 0}
            className="w-full bg-[#65d9a5] hover:bg-[#4fc48f] disabled:opacity-40 disabled:cursor-not-allowed text-[#0A1628] font-black text-sm py-3 rounded-lg transition-colors"
          >
            {loading ? 'Verifying…' : 'Enter'}
          </button>
        </form>

        <p className="text-center text-gray-700 text-xs mt-10">
          © {new Date().getFullYear()} Mālama Labs Inc.
        </p>
      </div>
    </div>
  )
}

export default function PasswordPage() {
  return (
    <Suspense>
      <PasswordForm />
    </Suspense>
  )
}
