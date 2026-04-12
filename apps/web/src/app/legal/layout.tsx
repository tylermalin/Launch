import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Legal | Mālama Labs',
  description:
    'Terms and Conditions, Privacy Policy, Hex Node Purchase Agreement, and Token & Rewards Risk Disclosure for Mālama Labs.',
}

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex-grow">{children}</div>
}
