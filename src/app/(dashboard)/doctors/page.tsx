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
      <h1 className="font-serif-d text-4xl md:text-5xl text-balance" style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}>Doctors</h1>
      <div className="grid gap-4 md:grid-cols-2 items-start">
        <AddDoctorForm />
        <section className="card-raised p-6" aria-label="Doctor list">
          <h2 className="text-xl font-semibold">Team ({doctors?.length ?? 0})</h2>
          {(doctors ?? []).length === 0 ? (
            <div className="text-center py-8">
              <p className="text-base font-medium">No doctors yet</p>
              <p className="text-sm text-[#787774] mt-1 text-pretty">Add your first doctor to open booking.</p>
            </div>
          ) : (
            <table className="tbl mt-4">
              <thead><tr><th>Name</th><th>Specialty</th><th>Hours</th><th></th></tr></thead>
              <tbody>
                {(doctors ?? []).map((d: { id: string; name: string; specialty: string | null; slot_minutes: number; work_start: string; work_end: string }) => (
                  <tr key={d.id}>
                    <td className="font-medium">{d.name}</td>
                    <td>{d.specialty ?? 'General'} · {d.slot_minutes} min</td>
                    <td className="font-mono text-xs">{d.work_start.slice(0, 5)} to {d.work_end.slice(0, 5)}</td>
                    <td className="text-right"><DeleteDoctorButton id={d.id} name={d.name} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  )
}
