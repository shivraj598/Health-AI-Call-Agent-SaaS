import { requireBusiness, one } from '@/lib/dal'
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
    <div className="space-y-12">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.08em] text-[#787774]">Day sheet</p>
        <h1 className="font-serif-d text-4xl md:text-5xl mt-4 text-balance" style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}>Appointments</h1>
        <p className="text-base mt-4 text-pretty">Book into open slots. Hours and overlaps stay enforced.</p>
      </div>

      <BookingForm doctors={doctors ?? []} patients={patients ?? []} />

      <section className="card-surface p-8" aria-label="Day sheet">
        <h2 className="font-serif-d text-2xl">Day sheet</h2>
        {(upcoming ?? []).length === 0 ? (
          <div className="text-center py-8">
            <p className="text-base font-medium">Sheet is clear</p>
            <p className="text-sm text-[#787774] mt-1 text-pretty">Upcoming booked visits will line up here by time.</p>
          </div>
        ) : (
          <ol className="mt-6 relative border-l divider ml-2 space-y-4">
            {(upcoming ?? []).map((a: { id: string; starts_at: string; doctors: unknown; patients: unknown }) => (
              <li key={a.id} className="ml-6 relative">
                <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-[#111111] ring-4 ring-[#F7F6F3]" aria-hidden />
                <div className="card-surface p-3 !shadow-none flex flex-wrap items-center justify-between gap-3">
                  <span className="text-sm">
                    <strong>
                      {new Date(a.starts_at).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </strong>
                    <span className="text-[#787774]"> · {one<{ name: string }>(a.doctors as { name: string } | { name: string }[] | null)?.name} · {one<{ full_name: string }>(a.patients as { full_name: string } | { full_name: string }[] | null)?.full_name}</span>
                  </span>
                  <AppointmentActions id={a.id} />
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      {(past ?? []).length > 0 && (
        <section className="card-surface p-8" aria-label="History">
          <h2 className="font-serif-d text-2xl">History</h2>
          <table className="tbl mt-4">
            <thead><tr><th>Date</th><th>Doctor</th><th>Patient</th><th>Status</th></tr></thead>
            <tbody>
              {(past ?? []).map((a: { id: string; starts_at: string; status: string; doctors: unknown; patients: unknown }) => (
                <tr key={a.id}>
                  <td>{new Date(a.starts_at).toLocaleDateString()}</td>
                  <td>{one<{ name: string }>(a.doctors as { name: string } | { name: string }[] | null)?.name}</td>
                  <td>{one<{ full_name: string }>(a.patients as { full_name: string } | { full_name: string }[] | null)?.full_name}</td>
                  <td><span className={`badge ${a.status === 'completed' ? 'badge-green' : 'badge-bone'}`}>{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  )
}
