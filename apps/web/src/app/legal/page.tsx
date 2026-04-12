import Link from 'next/link'
import { FileText } from 'lucide-react'
import { LEGAL_DOCS } from '@/lib/legal-docs'

export default function LegalIndexPage() {
  return (
    <div className="min-h-screen bg-[#0A1628] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <p className="text-xs font-black uppercase tracking-widest text-malama-accent mb-3">Mālama Labs Inc.</p>
        <h1 className="text-4xl font-black text-white tracking-tight mb-4">Legal documents</h1>
        <p className="text-gray-400 text-sm leading-relaxed mb-10">
          These documents govern your use of the Services, your purchase or preorder of a Hex Node, and risks related to tokens and
          rewards. They are incorporated into the checkout and mint flows.
        </p>
        <ul className="space-y-3">
          {LEGAL_DOCS.map((d) => (
            <li key={d.slug}>
              <Link
                href={`/legal/${d.slug}`}
                className="flex items-center gap-3 p-4 rounded-xl border border-gray-800 bg-[#0d1e35] hover:border-malama-accent/40 hover:bg-malama-accent/5 transition-colors group"
              >
                <FileText className="w-5 h-5 text-malama-accent/80 group-hover:text-malama-accent flex-shrink-0" />
                <span className="font-bold text-white group-hover:text-malama-accent-dim">{d.title}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-xs text-gray-600">
          Effective dates appear at the top of each document. For questions:{' '}
          <a href="mailto:support@malamalabs.com" className="text-malama-accent/80 hover:text-malama-accent">
            support@malamalabs.com
          </a>
        </p>
      </div>
    </div>
  )
}
