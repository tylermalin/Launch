'use client'

import { useEffect } from 'react'

/**
 * TOC scrollspy + copy-link client behavior for every sub-page in the
 * Documentation Hub. Direct port of
 *   /tmp/malama-docs-design/legal-docs/project/assets/doc-script.js
 *
 * Scoped to .mlma-docs-hub so it doesn't run on unrelated routes.
 */
export default function DocsPageScrollSpy() {
  useEffect(() => {
    const tocLinks = document.querySelectorAll<HTMLAnchorElement>(
      '.mlma-docs-hub .toc a[href^="#"]',
    )
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('.mlma-docs-hub section.clause[id]'),
    )
    const byId = new Map<string, HTMLAnchorElement>()
    tocLinks.forEach((a) => {
      const href = a.getAttribute('href')
      if (href) byId.set(href.slice(1), a)
    })

    let io: IntersectionObserver | null = null
    if (tocLinks.length > 0 && sections.length > 0) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return
            const id = (entry.target as HTMLElement).id
            const link = byId.get(id)
            if (!link) return
            tocLinks.forEach((l) => l.classList.remove('active'))
            link.classList.add('active')
          })
        },
        { rootMargin: '-30% 0px -60% 0px', threshold: 0 },
      )
      sections.forEach((s) => io!.observe(s))
    }

    const copyBtn = document.getElementById('mlma-docs-copy-link') as HTMLAnchorElement | null
    const onCopyClick = (e: MouseEvent) => {
      e.preventDefault()
      if (!copyBtn) return
      const url = window.location.href.split('#')[0]
      const orig = copyBtn.textContent
      navigator.clipboard
        ?.writeText(url)
        .then(() => {
          copyBtn.textContent = '✓ Copied'
          setTimeout(() => {
            if (copyBtn) copyBtn.textContent = orig
          }, 1600)
        })
        .catch(() => {
          if (copyBtn) copyBtn.textContent = orig
        })
    }
    copyBtn?.addEventListener('click', onCopyClick)

    return () => {
      io?.disconnect()
      copyBtn?.removeEventListener('click', onCopyClick)
    }
  }, [])

  return null
}
