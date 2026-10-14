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
      <div className="p-4 md:p-6">
        <p className="flex items-center gap-2 text-base font-semibold">HealthCall</p>
        <p className="text-sm text-slate-500 mt-1 truncate">{email}</p>
      </div>
      <nav aria-label="Dashboard" className="flex md:flex-col gap-1 px-3 pb-4 md:pb-6 overflow-x-auto">
        {LINKS.map((l) => {
          const active = pathname === l.href
          return (
            <Link
              key={l.href}
              href={l.href}
              aria-current={active ? 'page' : undefined}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                active ? 'bg-teal-50 text-teal-800 border border-[rgba(30,77,183,0.2)]' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <l.icon size={18} weight="duotone" aria-hidden />
              {l.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
