'use client'

import { useEffect } from 'react'

/**
 * Two small client-side behaviors for the legal document:
 *
 *   1. TOC scrollspy — adds .active to the TOC link whose section is in
 *      the upper third of the viewport.
 *   2. Copy-link button — replaces the link href in the address bar
 *      with the current page URL (sans hash) and shows a transient ✓.
 *
 * Direct port of the inline <script> at the bottom of the design HTML
 * (Token and Rewards Risk Disclosure.html, lines 589–623).
 */
export default function TocScrollSpy() {
  useEffect(() => {
    const tocLinks = document.querySelectorAll<HTMLAnchorElement>(
      '.mlma-legal-doc .toc a[href^="#"]',
    )
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('.mlma-legal-doc section.clause[id]'),
    )
    const byId = new Map<string, HTMLAnchorElement>()
    tocLinks.forEach((a) => {
      const href = a.getAttribute('href')
      if (href) byId.set(href.slice(1), a)
    })

    const io = new IntersectionObserver(
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

    sections.forEach((s) => io.observe(s))

    const copyBtn = document.getElementById('mlma-copy-link') as HTMLAnchorElement | null
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
      io.disconnect()
      copyBtn?.removeEventListener('click', onCopyClick)
    }
  }, [])

  return null
}
