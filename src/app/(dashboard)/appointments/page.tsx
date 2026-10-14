import { requireBusiness } from '@/lib/dal'
import { BookingForm, AppointmentActions } from '@/components/BookingForm'

export default async function AppointmentsPage() {
  const { supabase, business } = await requireBusiness()
  const bid = business.id
  const [{ data: doctors }, { data: patients }, { data: upcoming }, { data: past }] = await Promise.all([
    supabase.from('doctors').select('id,name').eq('business_id', bid).order('name'),
    supabase.from('patients').select('id,full_name').eq('business_id', bid).order('full_name'),
    supabase
      .from('appointments')
      .select('id,starts_at,ends_at,status,doctors(name),patients(full_name)')
      .eq('business_id', bid)
      .eq('status', 'booked')
      .gte('starts_at', new Date().toISOString())
      .order('starts_at')
      .limit(30),
    supabase
      .from('appointments')
      .select('id,starts_at,status,doctors(name),patients(full_name)')
      .eq('business_id', bid)
      .neq('status', 'booked')
      .order('starts_at', { ascending: false })
      .limit(20),
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-balance">Appointments</h1>
        <p className="text-base text-slate-600 mt-2 text-pretty">The day sheet. Book into open slots, hours and overlaps enforced.</p>
      </div>

      <BookingForm doctors={doctors ?? []} patients={patients ?? []} />

      {/* Day sheet timeline (signature) */}
      <section className="card-raised p-6" aria-label="Day sheet">
        <h2 className="text-xl font-semibold">Day sheet</h2>
        {(upcoming ?? []).length === 0 ? (
          <div className="text-center py-8">
            <p className="text-base font-medium">Sheet is clear</p>
            <p className="text-sm text-slate-500 mt-1 text-pretty">Upcoming booked visits will line up here by time.</p>
          </div>
        ) : (
          <ol className="mt-4 relative border-l divider ml-2 space-y-4">
            {(upcoming ?? []).map((a: { id: string; starts_at: string; ends_at: string; doctors: { name: string } | null; patients: { full_name: string } | null }) => (
              <li key={a.id} className="ml-6 relative">
                <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-teal-600 ring-4 ring-teal-50" aria-hidden />
                <div className="card-surface p-3 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-sm">
                    <strong>
                      {new Date(a.starts_at).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </strong>
                    <span className="text-slate-500"> · {a.doctors?.name} · {a.patients?.full_name}</span>
                  </span>
                  <AppointmentActions id={a.id} />
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      {(past ?? []).length > 0 && (
        <section className="card-raised p-6" aria-label="History">
          <h2 className="text-xl font-semibold">History</h2>
          <ul className="mt-4 space-y-2">
            {(past ?? []).map((a: { id: string; starts_at: string; status: string; doctors: { name: string } | null; patients: { full_name: string } | null }) => (
              <li key={a.id} className="text-sm text-slate-600">
                {new Date(a.starts_at).toLocaleDateString()} · {a.doctors?.name} · {a.patients?.full_name} · {a.status}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
