import fs from 'fs/promises'
import path from 'path'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LEGAL_DOCS, getLegalBySlug } from '@/lib/legal-docs'

export async function generateStaticParams() {
  return LEGAL_DOCS.map((d) => ({ slug: d.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const doc = getLegalBySlug(slug)
  if (!doc) return {}
  return {
    title: `${doc.title} | Mālama Labs`,
    description: `${doc.title} — Mālama Labs legal document.`,
  }
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const doc = getLegalBySlug(slug)
  if (!doc) notFound()

  const filePath = path.join(process.cwd(), 'src/content/legal', doc.fileName)
  let text: string
  try {
    text = await fs.readFile(filePath, 'utf-8')
  } catch {
    notFound()
  }

  const blocks = text.split(/\n\n+/).map((b) => b.trim()).filter(Boolean)

  return (
    <div className="min-h-screen bg-[#0A1628] py-12 px-4 pb-24">
      <div className="max-w-3xl mx-auto">
        <Link href="/legal" className="text-sm text-malama-accent hover:text-malama-accent-dim mb-8 inline-block font-semibold">
          ← All legal documents
        </Link>
        <header className="mb-10 border-b border-gray-800 pb-8">
          <p className="text-xs font-black uppercase tracking-widest text-malama-accent/90 mb-2">Mālama Labs Inc.</p>
          <h1 className="text-4xl font-black text-white tracking-tight">{doc.title}</h1>
        </header>
        <article className="text-gray-300 text-sm md:text-[15px] leading-relaxed">
          {blocks.map((block, i) => (
            <p key={i} className="mb-4 whitespace-pre-wrap last:mb-0">
              {block}
            </p>
          ))}
        </article>
      </div>
    </div>
  )
}
