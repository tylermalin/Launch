'use client'

import { useEffect } from 'react'

/**
 * Copy-link behavior for the Documentation Hub overview page.
 *
 * The overview doesn't render a TOC (single-column layout, only three
 * clauses), so we skip the scrollspy that the legal-doc routes use and
 * keep just the docbar's "↗ Copy link" button.
 *
 * Direct port of /tmp/malama-docs-design/legal-docs/project/assets/doc-script.js
 */
export default function DocsHubScrollSpy() {
  useEffect(() => {
    const copyBtn = document.getElementById('mlma-docs-copy-link') as HTMLAnchorElement | null
    if (!copyBtn) return
    const onCopyClick = (e: MouseEvent) => {
      e.preventDefault()
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
    copyBtn.addEventListener('click', onCopyClick)
    return () => {
      copyBtn.removeEventListener('click', onCopyClick)
    }
  }, [])

  return null
}
