'use client'

import { useEffect, useRef } from 'react'

export default function TaglineReveal({ lines }: { lines: string[] }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const words = Array.from(root.querySelectorAll('.tag-word'))
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = words.indexOf(e.target as HTMLElement)
            window.setTimeout(() => (e.target as HTMLElement).classList.add('is-on'), idx * 90)
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.6 }
    )
    words.forEach((w) => io.observe(w))
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className="mx-auto max-w-3xl px-6">
      <p className="text-4xl md:text-6xl font-semibold leading-tight text-balance">
        {lines.map((line, li) => (
          <span key={li} className="block">
            {line.split(' ').map((w, wi) => (
              <span key={wi} className="tag-word">
                {w}
                {wi < line.split(' ').length - 1 ? ' ' : ''}
              </span>
            ))}
          </span>
        ))}
      </p>
    </div>
  )
}
