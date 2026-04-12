'use client'

import { useId } from 'react'
import { LEGAL_DOCS } from '@/lib/legal-docs'

export type LegalAckState = Record<string, boolean>

const SLUGS = LEGAL_DOCS.map((d) => d.slug)

export function initialLegalAck(): LegalAckState {
  return Object.fromEntries(SLUGS.map((s) => [s, false])) as LegalAckState
}

export function allLegalAcknowledged(state: LegalAckState) {
  return SLUGS.every((s) => state[s])
}

type Props = {
  value: LegalAckState
  onChange: (next: LegalAckState) => void
}

/** One-line reminder on mint step; links only (acknowledgment captured on review step). */
export function LegalMintReminder() {
  return (
    <p className="text-xs text-gray-500 text-left max-w-lg mx-auto leading-relaxed">
      By minting you confirm you have read and agree to <LegalInlineLinks />.
    </p>
  )
}

export function PurchaseLegalAcknowledgement({ value, onChange }: Props) {
  const baseId = useId()

  const toggle = (slug: string) => {
    onChange({ ...value, [slug]: !value[slug] })
  }

  return (
    <div className="rounded-2xl border border-gray-800 bg-[#0d1e35] p-5 text-left">
      <p className="text-white font-bold text-sm mb-1">Legal acknowledgment</p>
      <p className="text-xs text-gray-500 mb-4 leading-relaxed">
        You must review and accept each document before continuing. Opens in a new tab.
      </p>
      <ul className="space-y-3">
        {LEGAL_DOCS.map((d) => {
          const id = `${baseId}-${d.slug}`
          const checked = !!value[d.slug]
          return (
            <li key={d.slug} className="flex gap-3 items-start">
              <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={() => toggle(d.slug)}
                className="mt-1 rounded border-gray-600 bg-gray-900 text-malama-accent focus:ring-malama-accent"
              />
              <label htmlFor={id} className="text-sm text-gray-300 leading-snug cursor-pointer">
                I have read and agree to the{' '}
                <a
                  href={`/legal/${d.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-malama-accent hover:text-malama-accent-dim font-semibold underline underline-offset-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {d.shortLabel}
                </a>
                .
              </label>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function LegalInlineLinks() {
  return (
    <>
      {LEGAL_DOCS.map((d, i) => (
        <span key={d.slug}>
          {i === 0 ? '' : i === LEGAL_DOCS.length - 1 ? ', and ' : ', '}
          <a
            href={`/legal/${d.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-malama-accent/90 hover:text-malama-accent underline underline-offset-2"
          >
            {d.shortLabel}
          </a>
        </span>
      ))}
    </>
  )
}
