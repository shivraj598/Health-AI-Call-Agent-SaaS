import Link from 'next/link'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'

export default function PrivacyPage() {
  return (
    <div className="bg-page min-h-screen">
      <SiteNav />
      <main id="main" className="mx-auto max-w-3xl px-6 py-16">
        <Link href="/" className="text-sm font-medium text-[#111111]">Back to home</Link>
        <p className="font-mono text-xs uppercase tracking-[0.08em] text-[#787774]">Legal</p>
        <h1 className="font-serif-d text-4xl md:text-5xl mt-4 text-balance" style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}>Privacy policy</h1>
        <div className="mt-8 space-y-4 text-base text-[#2F3437]">
          <p className="text-pretty">HealthCall stores clinic data, patient records, call transcripts, and appointment details in a dedicated database per clinic. Each clinic can only read its own rows.</p>
          <p className="text-pretty">Demo requests keep your name, clinic, email, and phone so the team can reply. Nothing is sold or shared with advertisers.</p>
          <p className="text-pretty">To request export or deletion of your data, reply to any message from the team.</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
