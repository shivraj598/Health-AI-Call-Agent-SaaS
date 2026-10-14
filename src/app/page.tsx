import Link from 'next/link'

export default function Home() {
  const demoId = process.env.NEXT_PUBLIC_DEMO_BUSINESS_ID
  return (
    <main className="min-h-screen gradient-mesh flex items-center justify-center p-6">
      <div className="card-raised max-w-xl w-full p-8 animate-fade-up">
        <p className="badge border-teal-600 text-teal-700 bg-teal-50">Phase 1 · Supabase connected</p>
        <h1 className="text-3xl font-bold mt-3 text-gradient-hero">Health AI Call Agent SaaS</h1>
        <p className="text-sm mt-2 text-slate-600">
          AI voice receptionist for clinics — appointments, patients, Twilio + widget, Stripe plans.
        </p>
        <div className="flex gap-3 mt-6">
          <Link href="/login" className="btn-primary">Login</Link>
          <Link href="/signup" className="btn-secondary">Sign up</Link>
          {demoId ? (
            <Link href={`/sites/${demoId}`} className="btn-secondary">Live demo</Link>
          ) : (
            <Link href="/widget-demo" className="btn-secondary">Widget demo</Link>
          )}
        </div>
      </div>
    </main>
  )
}
