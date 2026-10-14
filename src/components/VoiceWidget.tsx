'use client'

import { PhoneCall, PhoneDisconnect } from '@phosphor-icons/react'
import { useRealtimeVoice } from '@/hooks/useRealtimeVoice'

export default function VoiceWidget({ businessId, clinicName }: { businessId: string; clinicName: string }) {
  const { status, lines, connect, disconnect } = useRealtimeVoice(businessId)

  return (
    <div className="card-raised p-6" aria-label={`Voice booking for ${clinicName}`}>
      <div className="flex items-center gap-3">
        <span className="relative flex w-3 h-3" aria-hidden>
          {status === 'live' && (
            <span className="absolute inline-flex w-full h-full rounded-full bg-teal-500 opacity-60 animate-ping" />
          )}
          <span className={`relative inline-flex w-3 h-3 rounded-full ${status === 'live' ? 'bg-teal-600' : 'bg-slate-300'}`} />
        </span>
        <p className="text-base font-semibold">
          {status === 'live' ? 'Agent on the line' : status === 'connecting' ? 'Dialing…' : 'Talk to book'}
        </p>
      </div>

      {lines.length > 0 && (
        <ul className="mt-4 space-y-2 max-h-56 overflow-y-auto" aria-live="polite">
          {lines.map((l, i) => (
            <li key={i} className="card-surface p-3 text-sm text-pretty">{l}</li>
          ))}
        </ul>
      )}

      {status === 'unavailable' && (
        <p className="text-sm text-slate-500 mt-4 text-pretty">Voice is not configured for this clinic yet. Use the booking form below.</p>
      )}
      {status === 'error' && (
        <p className="text-sm text-red-600 mt-4" role="alert">Connection failed. Check microphone permission and try again.</p>
      )}

      <div className="mt-4">
        {status === 'live' ? (
          <button onClick={disconnect} className="btn-secondary w-full">
            <PhoneDisconnect size={18} weight="duotone" aria-hidden /> End call
          </button>
        ) : (
          <button onClick={connect} disabled={status === 'connecting'} className="btn-primary w-full">
            <PhoneCall size={18} weight="duotone" aria-hidden />
            {status === 'connecting' ? 'Dialing…' : 'Call the clinic agent'}
          </button>
        )}
      </div>
    </div>
  )
}
