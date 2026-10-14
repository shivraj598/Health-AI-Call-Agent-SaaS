import Link from 'next/link'
import { PhoneCall } from '@phosphor-icons/react/dist/ssr'

export default function SiteFooter() {
  return (
    <footer className="border-t divider mt-32">
      <div className="mx-auto max-w-5xl px-6 py-16 flex flex-col md:flex-row gap-8 items-start justify-between">
        <div>
          <p className="flex items-center gap-2 text-base font-semibold">
            <PhoneCall size={20} weight="fill" aria-hidden />
            HealthCall
          </p>
          <p className="text-sm text-[#787774] mt-2 text-pretty">
            The AI receptionist that books patient visits.
          </p>
        </div>
        <nav aria-label="Footer" className="flex gap-16 text-sm">
          <div className="flex flex-col gap-2">
            <span className="font-semibold">Product</span>
            <Link href="/#benefits" className="text-[#787774] hover:text-[#111111]">Benefits</Link>
            <Link href="/#how" className="text-[#787774] hover:text-[#111111]">How it works</Link>
            <Link href="/widget-demo" className="text-[#787774] hover:text-[#111111]">Widget demo</Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-semibold">Legal</span>
            <Link href="/privacy" className="text-[#787774] hover:text-[#111111]">Privacy policy</Link>
            <Link href="/terms" className="text-[#787774] hover:text-[#111111]">Terms</Link>
          </div>
        </nav>
      </div>
    </footer>
  )
}
