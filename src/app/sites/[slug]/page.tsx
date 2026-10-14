import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
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
    <div className="bg-page min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-2xl px-6 py-16">
        <p className="font-mono text-xs uppercase tracking-[0.08em] text-[#787774]">Book a visit</p>
        <h1 className="font-serif-d text-4xl md:text-5xl mt-4 text-balance" style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}>{business.name}</h1>
        {business.phone && <p className="text-sm text-[#787774] mt-2 font-mono">{business.phone}</p>}
        <h2 className="text-xl font-semibold mt-10 mb-4">Doctors</h2>
        <ul className="space-y-2">
          {(doctors ?? []).map((d: { id: string; name: string; specialty: string | null; slot_minutes: number }) => (
            <li key={d.id} className="card-surface p-4 text-sm">
              <strong>{d.name}</strong>
              {d.specialty && <span className="text-[#787774]"> · {d.specialty}</span>}
              <span className="font-mono text-xs text-[#787774] block mt-1">{d.slot_minutes} min slots</span>
            </li>
          ))}
          {(!doctors || doctors.length === 0) && (
            <li className="text-sm text-[#787774]">No doctors listed yet.</li>
          )}
        </ul>
        <div className="mt-8" data-voice-widget={business.id}>
          <VoiceWidget businessId={business.id} clinicName={business.name} />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
