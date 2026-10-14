import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import VoiceWidget from '@/components/VoiceWidget'

export default async function SitePage({ params }: { params: { slug: string } }) {
  const supabase = await createClient()
  const { data: business } = await supabase
    .from('businesses')
    .select('id,name,slug,phone,plan')
    .eq('slug', params.slug)
    .single()

  if (!business) notFound()

  const { data: doctors } = await supabase
    .from('doctors')
    .select('id,name,specialty,slot_minutes')
    .eq('business_id', business.id)

  return (
    <main className="bg-page min-h-screen p-6 flex items-center justify-center">
      <div className="card-raised max-w-lg w-full p-8 animate-fade-up">
        <p className="badge border-[#111111] text-[#111111] bg-[#F7F6F3]">Book a visit · {business.plan}</p>
        <h1 className="text-2xl font-bold mt-2">{business.name}</h1>
        {business.phone && <p className="text-sm text-[#787774] mt-1">{business.phone}</p>}
        <h2 className="font-semibold mt-6 mb-2">Doctors</h2>
        <ul className="space-y-2">
          {(doctors ?? []).map((d) => (
            <li key={d.id} className="card-surface p-3 text-sm">
              <strong>{d.name}</strong>
              {d.specialty && <span className="text-[#787774]"> · {d.specialty}</span>}
            </li>
          ))}
          {(!doctors || doctors.length === 0) && (
            <li className="text-sm text-[#787774]">No doctors listed yet.</li>
          )}
        </ul>
        <div className="mt-6" data-voice-widget={business.id}>
          <VoiceWidget businessId={business.id} clinicName={business.name} />
        </div>
      </div>
    </main>
  )
}
