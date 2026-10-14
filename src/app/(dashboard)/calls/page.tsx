import { requireBusiness, one } from '@/lib/dal'

export default async function CallsPage() {
  const { supabase, business } = await requireBusiness()
  const { data: calls } = await supabase
    .from('calls')
    .select('id,channel,direction,transcript,summary,duration_sec,created_at,patients(full_name)')
    .eq('business_id', business.id)
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif-d text-4xl md:text-5xl text-balance" style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}>Calls</h1>
        <p className="text-base text-[#2F3437] mt-2 text-pretty">Every widget and phone call lands here with transcript and summary.</p>
      </div>

      {(calls ?? []).length === 0 ? (
        <div className="card-raised p-6 text-center py-12">
          <p className="text-base font-medium">No calls yet</p>
          <p className="text-sm text-[#787774] mt-1 text-pretty">
            Point your Twilio number at <code>/api/twilio/voice</code> or use the site widget. Transcripts will read like the landing demo.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {(calls ?? []).map((c: {
            id: string; channel: string; direction: string; transcript: string | null;
            summary: string | null; duration_sec: number; created_at: string;
            patients: unknown;
          }) => (
            <article key={c.id} className="card-raised p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge border-[#111111] text-[#111111] bg-white">{c.channel}</span>
                <span className="badge bg-[#F7F6F3] text-[#2F3437]">{c.direction}</span>
                <span className="text-sm text-[#787774] ml-auto">
                  {new Date(c.created_at).toLocaleString()} · {c.duration_sec}s{one<{ full_name: string }>(c.patients as { full_name: string } | { full_name: string }[] | null)?.full_name ? ` · ${one<{ full_name: string }>(c.patients as { full_name: string } | { full_name: string }[] | null)?.full_name}` : ''}
                </span>
              </div>
              {c.summary && <p className="text-base font-medium mt-4 text-pretty">{c.summary}</p>}
              {c.transcript ? (
                <p className="text-sm text-[#2F3437] mt-2 text-pretty whitespace-pre-wrap">{c.transcript}</p>
              ) : (
                <p className="text-sm text-[#787774] mt-2">Transcript pending.</p>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
