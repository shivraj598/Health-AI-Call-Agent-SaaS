import { requireBusiness } from '@/lib/dal'
import { AddDoctorForm, DeleteDoctorButton } from '@/components/DoctorForms'

export default async function DoctorsPage() {
  const { supabase, business } = await requireBusiness()
  const { data: doctors } = await supabase
    .from('doctors')
    .select('*')
    .eq('business_id', business.id)
    .order('created_at')

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold text-balance">Doctors</h1>
      <div className="grid gap-4 md:grid-cols-2 items-start">
        <AddDoctorForm />
        <section className="card-raised p-6" aria-label="Doctor list">
          <h2 className="text-xl font-semibold">Team ({doctors?.length ?? 0})</h2>
          {(doctors ?? []).length === 0 ? (
            <div className="text-center py-8">
              <p className="text-base font-medium">No doctors yet</p>
              <p className="text-sm text-slate-500 mt-1 text-pretty">Add your first doctor to open booking.</p>
            </div>
          ) : (
            <ul className="mt-4 space-y-2">
              {(doctors ?? []).map((d: { id: string; name: string; specialty: string | null; slot_minutes: number; work_start: string; work_end: string }) => (
                <li key={d.id} className="card-surface p-3 flex items-center justify-between gap-3">
                  <span className="text-sm">
                    <strong>{d.name}</strong>
                    <span className="text-slate-500"> · {d.specialty ?? 'General'} · {d.slot_minutes} min · {d.work_start.slice(0, 5)} to {d.work_end.slice(0, 5)}</span>
                  </span>
                  <DeleteDoctorButton id={d.id} name={d.name} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
