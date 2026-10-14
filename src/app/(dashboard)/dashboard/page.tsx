import Link from 'next/link'
import { getActiveBusiness, monthStartISO } from '@/lib/dal'
import { PLAN_LIMITS } from '@/lib/plans'
import CreateBusinessForm from '@/components/CreateBusinessForm'

function bar(used: number, limit: number) {
  if (limit === 0) return 'Unlimited'
  return `${used} of ${limit} used`
}

export default async function DashboardHome() {
  const { supabase, business } = await getActiveBusiness()
  if (!business) {
    return (
      <div className="py-12">
        <CreateBusinessForm />
      </div>
    )
  }

  const bid = business.id
  const [{ count: doctors }, { count: patients }, { count: bookings }, { data: upcoming }, { data: calls }] =
    await Promise.all([
      supabase.from('doctors').select('id', { count: 'exact', head: true }).eq('business_id', bid),
      supabase.from('patients').select('id', { count: 'exact', head: true }).eq('business_id', bid),
      supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('business_id', bid).neq('status', 'cancelled').gte('created_at', monthStartISO()),
      supabase.from('appointments').select('id,starts_at,status,doctors(name),patients(full_name)').eq('business_id', bid).eq('status', 'booked').gte('starts_at', new Date().toISOString()).order('starts_at').limit(5),
      supabase.from('calls').select('id,channel,summary,created_at').eq('business_id', bid).order('created_at', { ascending: false }).limit(5),
    ])

  const limits = PLAN_LIMITS[business.plan]

  return (
    <div className="space-y-8">
      <div>
        <p className="badge border-teal-600 text-teal-700 bg-white">{business.plan} plan</p>
        <h1 className="text-3xl font-semibold mt-3 text-balance">{business.name}</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          ['Doctors', String(doctors ?? 0), bar(doctors ?? 0, limits.agents), '/doctors'],
          ['Patients', String(patients ?? 0), 'total records', '/patients'],
          ['Bookings this month', String(bookings ?? 0), bar(bookings ?? 0, limits.bookings), '/appointments'],
          ['Calls logged', String(calls?.length ?? 0), 'latest below', '/calls'],
        ].map(([label, value, sub, href]) => (
          <Link key={label} href={href} className="stat-card p-6 block">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="text-4xl font-semibold mt-2">{value}</p>
            <p className="text-sm text-slate-500 mt-1">{sub}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="card-raised p-6" aria-label="Upcoming visits">
          <h2 className="text-xl font-semibold">Upcoming visits</h2>
          {(upcoming ?? []).length === 0 ? (
            <div className="mt-4 text-center py-8">
              <p className="text-base font-medium">No upcoming visits</p>
              <p className="text-sm text-slate-500 mt-1 text-pretty">Add a doctor and a patient, then book the first visit.</p>
              <Link href="/appointments" className="btn-secondary mt-4">Book a visit</Link>
            </div>
          ) : (
            <ul className="mt-4 space-y-2">
              {(upcoming ?? []).map((a: { id: string; starts_at: string; doctors: { name: string } | null; patients: { full_name: string } | null }) => (
                <li key={a.id} className="card-surface p-3 text-sm">
                  <strong>{new Date(a.starts_at).toLocaleString()}</strong>
                  <span className="text-slate-500"> · {a.doctors?.name} · {a.patients?.full_name}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card-raised p-6" aria-label="Recent calls">
          <h2 className="text-xl font-semibold">Recent calls</h2>
          {(calls ?? []).length === 0 ? (
            <div className="mt-4 text-center py-8">
              <p className="text-base font-medium">No calls yet</p>
              <p className="text-sm text-slate-500 mt-1 text-pretty">Widget and Twilio calls will appear here with transcripts.</p>
            </div>
          ) : (
            <ul className="mt-4 space-y-2">
              {(calls ?? []).map((c: { id: string; channel: string; summary: string | null; created_at: string }) => (
                <li key={c.id} className="card-surface p-3 text-sm">
                  <strong>{c.channel}</strong>
                  <span className="text-slate-500"> · {c.summary ?? 'No summary yet'}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
