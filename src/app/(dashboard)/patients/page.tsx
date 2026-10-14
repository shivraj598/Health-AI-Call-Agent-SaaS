import { requireBusiness } from '@/lib/dal'
import { AddPatientForm, DeletePatientButton } from '@/components/PatientForms'

export default async function PatientsPage() {
  const { supabase, business } = await requireBusiness()
  const { data: patients } = await supabase
    .from('patients')
    .select('*')
    .eq('business_id', business.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <h1 className="font-serif-d text-4xl md:text-5xl text-balance" style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}>Patients</h1>
      <div className="grid gap-4 md:grid-cols-2 items-start">
        <AddPatientForm />
        <section className="card-raised p-6" aria-label="Patient list">
          <h2 className="text-xl font-semibold">Records ({patients?.length ?? 0})</h2>
          {(patients ?? []).length === 0 ? (
            <div className="text-center py-8">
              <p className="text-base font-medium">No patients yet</p>
              <p className="text-sm text-[#787774] mt-1 text-pretty">Add records manually or let the voice agent create them on calls.</p>
            </div>
          ) : (
            <ul className="mt-4 space-y-2">
              {(patients ?? []).map((p: { id: string; full_name: string; phone: string }) => (
                <li key={p.id} className="card-surface p-3 flex items-center justify-between gap-3">
                  <span className="text-sm">
                    <strong>{p.full_name}</strong>
                    <span className="text-[#787774]"> · {p.phone}</span>
                  </span>
                  <DeletePatientButton id={p.id} name={p.full_name} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
