'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  SquaresFour,
  CalendarCheck,
  Stethoscope,
  Users,
  PhoneCall,
  CreditCard,
  Gear,
} from '@phosphor-icons/react'

const LINKS = [
  { href: '/dashboard', label: 'Overview', icon: SquaresFour },
  { href: '/appointments', label: 'Appointments', icon: CalendarCheck },
  { href: '/doctors', label: 'Doctors', icon: Stethoscope },
  { href: '/patients', label: 'Patients', icon: Users },
  { href: '/calls', label: 'Calls', icon: PhoneCall },
  { href: '/plans', label: 'Plans', icon: CreditCard },
  { href: '/settings', label: 'Settings', icon: Gear },
]

export default function DashboardNav({ email }: { email: string }) {
  const pathname = usePathname()
  return (
    <aside className="w-full md:w-60 shrink-0 md:min-h-screen bg-white border-b md:border-b-0 md:border-r divider">
      <div className="px-6 py-6">
        <p className="text-base font-semibold">HealthCall</p>
        <p className="font-mono text-xs text-[#787774] mt-1 truncate">{email}</p>
      </div>
      <nav aria-label="Dashboard" className="flex md:flex-col gap-1 px-3 pb-4 md:pb-6 overflow-x-auto">
        {LINKS.map((l) => {
          const active = pathname === l.href
          return (
            <Link
              key={l.href}
              href={l.href}
              aria-current={active ? 'page' : undefined}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                active ? 'bg-[#111111] text-white' : 'text-[#2F3437] hover:bg-[#F7F6F3]'
              }`}
            >
              <l.icon size={18} weight="fill" aria-hidden />
              {l.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
