import Link from 'next/link'

export default function TermsPage() {
  return (
    <main id="main" className="bg-page min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link href="/" className="text-sm font-medium text-teal-700">Back to home</Link>
        <h1 className="text-3xl font-semibold mt-4 text-balance">Terms</h1>
        <div className="mt-8 space-y-4 text-base text-slate-700">
          <p className="text-pretty">HealthCall provides an AI receptionist for appointment booking and patient records. Clinics remain responsible for clinical decisions and final confirmation of care.</p>
          <p className="text-pretty">Plans bill monthly and can be cancelled anytime from the dashboard. Cancelled clinics keep read access until the end of the billing period.</p>
          <p className="text-pretty">The Free plan includes 1 agent and 5 bookings per month. Paid limits follow the plan shown at checkout.</p>
        </div>
      </div>
    </main>
  )
}
