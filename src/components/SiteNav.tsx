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
      <nav aria-label="Primary" className="mx-auto mt-6 w-max rounded-full border border-[rgba(30,77,183,0.14)] bg-white/80 backdrop-blur-xl px-3 py-2 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 px-3 py-2" aria-current="page">
            <PhoneCall size={20} weight="duotone" aria-hidden />
            <span className="text-base font-semibold">HealthCall</span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-950">
                {l.label}
              </Link>
            ))}
          </div>
          <Link href="#demo" className="btn-primary hidden md:inline-flex !text-sm">
            Book a demo
          </Link>
          <button
            className="md:hidden relative w-10 h-10 grid place-items-center"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X size={22} aria-hidden /> : <List size={22} aria-hidden />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="fixed inset-0 z-40 bg-white/80 backdrop-blur-3xl md:hidden">
          <div className="flex flex-col items-center gap-2 pt-24 px-6">
            {LINKS.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="translate-y-12 opacity-0 animate-fade-up text-2xl font-semibold py-2"
                style={{ animationDelay: `${100 + i * 50}ms` }}
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
