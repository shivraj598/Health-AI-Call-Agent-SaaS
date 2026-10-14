import type { Metadata } from 'next'
import { Manrope, Instrument_Serif, JetBrains_Mono } from 'next/font/google'
import '@/styles/globals.css'

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' })
const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', variable: '--font-serif' })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'HealthCall, the AI receptionist that books patient visits',
  description:
    'HealthCall answers every clinic call, books visits into your doctors calendar, and keeps one record per patient. Free plan, no credit card, cancel anytime.',
  openGraph: {
    title: 'HealthCall, the AI receptionist that books patient visits',
    description:
      'More booked visits without adding front desk staff. Free plan, no credit card, cancel anytime.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${serif.variable} ${mono.variable}`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-3 focus:py-2 focus:rounded-md focus:text-base"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  )
}
