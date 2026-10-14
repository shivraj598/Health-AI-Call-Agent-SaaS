'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PhoneCall, List, X } from '@phosphor-icons/react'

const LINKS = [
  { href: '#benefits', label: 'Benefits' },
  { href: '#how', label: 'How it works' },
  { href: '#proof', label: 'Clinics' },
  { href: '#faq', label: 'FAQ' },
]

export default function SiteNav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#F7F6F3]/80 backdrop-blur-md border-b divider">
        <nav aria-label="Primary" className="mx-auto max-w-5xl px-6 py-4 flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2" aria-current="page">
            <PhoneCall size={20} weight="fill" aria-hidden />
            <span className="text-base font-semibold">HealthCall</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="text-sm text-[#787774] hover:text-[#111111]">
                {l.label}
              </Link>
            ))}
          </div>
          <Link href="#demo" className="btn-primary !text-sm ml-auto hidden md:inline-flex">
            Book a demo
          </Link>
          <button
            className="md:hidden ml-auto w-10 h-10 grid place-items-center"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X size={22} weight="bold" aria-hidden /> : <List size={22} weight="bold" aria-hidden />}
          </button>
        </nav>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 bg-white/90 backdrop-blur-3xl md:hidden">
          <div className="flex flex-col items-center gap-2 pt-24 px-6">
            {LINKS.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="opacity-0 animate-fade-up font-serif-d text-4xl py-2"
                style={{ animationDelay: `${100 + i * 80}ms` }}
              >
                {l.label}
              </Link>
            ))}
            <Link href="#demo" onClick={() => setOpen(false)} className="btn-primary mt-4">
              Book a demo
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
