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
    description: `${doc.title}. Mālama Labs legal document.`,
  }
}

// ─── Block classifier ────────────────────────────────────────────────────────

type Block =
  | { kind: 'doc-title'; text: string }
  | { kind: 'section-heading'; text: string }
  | { kind: 'numbered-section'; num: string; title: string }
  | { kind: 'effective-date'; text: string }
  | { kind: 'definition'; term: string; body: string }
  | { kind: 'bullet'; text: string }
  | { kind: 'paragraph'; text: string }

function classify(raw: string): Block {
  const t = raw.trim()

  // Effective / last-updated dates
  if (/^(effective date|last updated)\s*:/i.test(t)) {
    return { kind: 'effective-date', text: t }
  }

  // Numbered section heading: "1. Title" or "10. TITLE" — must come before ALL-CAPS check
  // because ALL-CAPS numbered lines (e.g. "10. DATA RETENTION") would otherwise mis-classify.
  const numMatch = t.match(/^(\d+)\.\s+([A-Z][^\n]{1,65})$/)
  if (numMatch && !numMatch[2].endsWith('.') && (numMatch[2].split(',').length <= 2)) {
    return { kind: 'numbered-section', num: numMatch[1], title: numMatch[2].trim() }
  }

  // Numbered sub-section: "1.1 ..." or "1.1. ..."
  const subNumMatch = t.match(/^(\d+\.\d+\.?)\s+([A-Z][^\n]{1,65})$/)
  if (subNumMatch && !subNumMatch[2].endsWith('.')) {
    return { kind: 'numbered-section', num: subNumMatch[1], title: subNumMatch[2].trim() }
  }

  // ALL-CAPS block with no lowercase — doc title or section header (unnumbered)
  if (t === t.toUpperCase() && /[A-Z]/.test(t) && t.length < 120) {
    // Short all-caps lines that are a single phrase → doc-title
    if (t.length < 60 && !t.includes(':')) {
      return { kind: 'doc-title', text: t }
    }
    return { kind: 'section-heading', text: t }
  }

  // Definition: "Term" means … — handles both straight and curly quotes
  const defMatch = t.match(/^[\u201C""]([^\u201D""]+)[\u201D""]\s+means\s+([\s\S]+)/)
  if (defMatch) {
    return { kind: 'definition', term: defMatch[1], body: defMatch[2] }
  }

  // Bullet / list item: starts with -, •, *, or (a) / (i)
  if (/^[-•*]\s/.test(t) || /^\([a-z]+\)\s/i.test(t)) {
    return { kind: 'bullet', text: t.replace(/^[-•*]\s+/, '').replace(/^\([a-z]+\)\s+/i, '') }
  }

  return { kind: 'paragraph', text: t }
}

function renderBlock(block: Block, i: number) {
  switch (block.kind) {
    case 'doc-title':
      // Skip if it's just the company name repetition at the top
      if (block.text === 'MĀLAMA LABS INC.' || block.text === 'MALAMA LABS INC.') return null
      return (
        <h1 key={i} className="text-2xl md:text-3xl font-black text-white tracking-tight mt-2 mb-6">
          {block.text}
        </h1>
      )

    case 'section-heading':
      return (
        <h2 key={i} className="text-sm font-black uppercase tracking-[0.15em] text-malama-accent mt-10 mb-4 border-b border-gray-800 pb-2">
          {block.text}
        </h2>
      )

    case 'numbered-section':
      // Rendered by the section grouping logic above — should not appear here standalone
      return null

    case 'effective-date':
      return (
        <p key={i} className="text-xs font-mono text-gray-500 mb-1">{block.text}</p>
      )

    case 'definition':
      return (
        <div key={i} className="mb-4 pl-4 border-l-2 border-gray-700">
          <span className="font-bold text-white">"{block.term}"</span>
          <span className="text-gray-300"> means {block.body}</span>
        </div>
      )

    case 'bullet':
      return (
        <li key={i} className="mb-2 flex gap-2 text-gray-300">
          <span className="text-malama-accent flex-shrink-0 mt-1">›</span>
          <span>{block.text}</span>
        </li>
      )

    case 'paragraph':
      return (
        <p key={i} className="mb-4 text-gray-300 leading-relaxed last:mb-0">
          {block.text}
        </p>
      )
  }
}

// ─── Grouping ────────────────────────────────────────────────────────────────

type SectionGroup = {
  heading: Block & { kind: 'numbered-section' }
  body: (Block | Block[])[]
}

type RenderItem =
  | { type: 'single'; block: Block }
  | { type: 'bullets'; blocks: Block[] }
  | { type: 'section'; group: SectionGroup }

/**
 * Groups the flat block list into:
 *  - top-level non-section blocks (doc-title, section-heading, paragraphs before first number)
 *  - numbered-section groups: the heading + all body blocks until the next heading/number
 *  Consecutive bullets within a group are wrapped together.
 */
function buildRenderItems(blocks: Block[]): RenderItem[] {
  const result: RenderItem[] = []
  let i = 0

  const flushBullets = (target: (Block | Block[])[], bullets: Block[]) => {
    if (bullets.length > 0) {
      target.push([...bullets])
      bullets.length = 0
    }
  }

  while (i < blocks.length) {
    const block = blocks[i]

    if (block.kind === 'numbered-section') {
      const group: SectionGroup = { heading: block as any, body: [] }
      i++
      const localBullets: Block[] = []
      while (
        i < blocks.length &&
        blocks[i].kind !== 'numbered-section' &&
        blocks[i].kind !== 'section-heading' &&
        blocks[i].kind !== 'doc-title'
      ) {
        if (blocks[i].kind === 'bullet') {
          localBullets.push(blocks[i])
        } else {
          flushBullets(group.body, localBullets)
          group.body.push(blocks[i])
        }
        i++
      }
      flushBullets(group.body, localBullets)
      result.push({ type: 'section', group })
    } else if (block.kind === 'bullet') {
      const bullets: Block[] = []
      while (i < blocks.length && blocks[i].kind === 'bullet') {
        bullets.push(blocks[i])
        i++
      }
      result.push({ type: 'bullets', blocks: bullets })
    } else {
      result.push({ type: 'single', block })
      i++
    }
  }

  return result
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const doc = getLegalBySlug(slug)
  if (!doc) notFound()

  const filePath = path.join(process.cwd(), 'src/content/legal', doc.fileName)
  let fileContent: string
  try {
    fileContent = await fs.readFile(filePath, 'utf-8')
  } catch {
    notFound()
  }

  const isHtml = doc.fileName.endsWith('.html')

  // ── HTML mode: strip the outer <html>/<head>/<body> shell if present,
  //    keeping only the inner fragment, then render with dangerouslySetInnerHTML.
  //    These are admin-controlled static files — no XSS risk.
  let htmlFragment = ''
  if (isHtml) {
    // Extract content inside <body>...</body> if a full doc was saved; otherwise use as-is
    const bodyMatch = fileContent.match(/<body[^>]*>([\s\S]*)<\/body>/i)
    htmlFragment = bodyMatch ? bodyMatch[1].trim() : fileContent
  }

  // ── Text mode: classic block parser (kept as fallback for .txt files)
  let items: ReturnType<typeof buildRenderItems> = []
  if (!isHtml) {
    const normalizedText = fileContent.replace(/\n([ \t]*[*•\-]\s)/g, '\n\n$1')
    const rawBlocks = normalizedText.split(/\n\n+/).map((b) => b.trim()).filter(Boolean)
    const blocks = rawBlocks.map(classify)
    items = buildRenderItems(blocks)
  }

  const renderBodyItems = (bodyItems: (Block | Block[])[], keyPrefix: string) =>
    bodyItems.map((item, j) => {
      if (Array.isArray(item)) {
        return (
          <ul key={`${keyPrefix}-ul-${j}`} className="mb-4 space-y-1 list-none pl-0">
            {item.map((b, k) => renderBlock(b, k))}
          </ul>
        )
      }
      return renderBlock(item, j)
    })

  return (
    <div className="min-h-screen bg-[#0A1628] py-12 px-4 pb-24">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/legal"
          className="text-sm text-malama-accent hover:text-malama-accent-dim mb-8 inline-block font-semibold"
        >
          ← All legal documents
        </Link>

        {/* HTML docs: full self-contained fragment with its own styles */}
        {isHtml ? (
          <div
            className="legal-html-doc"
            dangerouslySetInnerHTML={{ __html: htmlFragment }}
          />
        ) : (
          <>
            <header className="mb-10 border-b border-gray-800 pb-8">
              <p className="text-xs font-black uppercase tracking-widest text-malama-accent/90 mb-2">
                Mālama Labs Inc.
              </p>
              <h1 className="text-4xl font-black text-white tracking-tight">{doc.title}</h1>
            </header>

            <article className="text-sm md:text-[15px]">
              {items.map((item, i) => {
                if (item.type === 'single') {
                  return renderBlock(item.block, i)
                }
                if (item.type === 'bullets') {
                  return (
                    <ul key={`ul-${i}`} className="mb-6 space-y-1 list-none pl-0">
                      {item.blocks.map((b, j) => renderBlock(b, j))}
                    </ul>
                  )
                }
                const { heading, body } = item.group
                return (
                  <div key={`sec-${i}`}>
                    <div className="mt-8 mb-3 flex items-baseline gap-3">
                      <span className="text-malama-accent font-black text-sm font-mono flex-shrink-0 w-8">
                        {heading.num}
                      </span>
                      <h3 className="text-base font-black text-white">{heading.title}</h3>
                    </div>
                    {body.length > 0 && (
                      <div className="pl-11">
                        {renderBodyItems(body, `sec-${i}`)}
                      </div>
                    )}
                  </div>
                )
              })}
            </article>
          </>
        )}
      </div>
    </div>
  )
}
