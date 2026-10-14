import Link from 'next/link'
import { PhoneCall } from '@phosphor-icons/react/dist/ssr'

export default function SiteFooter() {
  return (
    <footer className="border-t divider mt-24">
      <div className="mx-auto max-w-5xl px-6 py-12 flex flex-col md:flex-row gap-8 items-start justify-between">
        <div>
          <p className="flex items-center gap-2 text-base font-semibold">
            <PhoneCall size={20} weight="duotone" aria-hidden />
            HealthCall
          </p>
          <p className="text-sm text-slate-500 mt-2 text-pretty">
            The AI receptionist that books patient visits.
          </p>
        </div>
        <nav aria-label="Footer" className="flex gap-12 text-sm">
          <div className="flex flex-col gap-2">
            <span className="font-semibold">Product</span>
            <Link href="#benefits" className="text-slate-500 hover:text-slate-900">Benefits</Link>
            <Link href="#how" className="text-slate-500 hover:text-slate-900">How it works</Link>
            <Link href="/widget-demo" className="text-slate-500 hover:text-slate-900">Widget demo</Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-semibold">Legal</span>
            <Link href="/privacy" className="text-slate-500 hover:text-slate-900">Privacy policy</Link>
            <Link href="/terms" className="text-slate-500 hover:text-slate-900">Terms</Link>
          </div>
        </nav>
      </div>
    </footer>
  )
}
