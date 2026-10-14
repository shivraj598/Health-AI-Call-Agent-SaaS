import Link from 'next/link'

export default function TermsPage() {
  return (
    <main id="main" className="bg-page min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link href="/" className="text-sm font-medium text-[#111111]">Back to home</Link>
        <p className="font-mono text-xs uppercase tracking-[0.08em] text-[#787774]">Legal</p>
        <h1 className="font-serif-d text-4xl md:text-5xl mt-4 text-balance" style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}>Terms</h1>
        <div className="mt-8 space-y-4 text-base text-[#2F3437]">
          <p className="text-pretty">HealthCall provides an AI receptionist for appointment booking and patient records. Clinics remain responsible for clinical decisions and final confirmation of care.</p>
          <p className="text-pretty">Plans bill monthly and can be cancelled anytime from the dashboard. Cancelled clinics keep read access until the end of the billing period.</p>
          <p className="text-pretty">The Free plan includes 1 agent and 5 bookings per month. Paid limits follow the plan shown at checkout.</p>
        </div>
      </div>
    </main>
  )
}
