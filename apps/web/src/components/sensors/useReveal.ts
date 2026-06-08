'use client'

import { useEffect, useRef } from 'react'

/** Adds `.visible` to descendant `.reveal` elements as they scroll into view. */
export function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold }
    )
    el.querySelectorAll('.reveal').forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [threshold])
  return ref
}
