'use client'

import { PhoneCall, PhoneDisconnect } from '@phosphor-icons/react'
import { useRealtimeVoice } from '@/hooks/useRealtimeVoice'

export default function VoiceWidget({ businessId, clinicName }: { businessId: string; clinicName: string }) {
  const { status, lines, connect, disconnect } = useRealtimeVoice(businessId)

  return (
    <div className="card-surface p-8" aria-label={`Voice booking for ${clinicName}`}>
      <div className="flex items-center gap-3">
        <span className="relative flex w-2.5 h-2.5" aria-hidden>
          {status === 'live' && (
            <span className="absolute inline-flex w-full h-full rounded-full bg-[#346538] opacity-60 animate-ping" />
          )}
          <span className={`relative inline-flex w-2.5 h-2.5 rounded-full ${status === 'live' ? 'bg-[#346538]' : 'bg-[#EAEAEA]'}`} />
        </span>
        <p className="text-base font-semibold">
          {status === 'live' ? 'Agent on the line' : status === 'connecting' ? 'Dialing…' : 'Talk to book'}
        </p>
        <span className="font-mono text-xs text-[#787774] ml-auto">live audio</span>
      </div>

      {lines.length > 0 && (
        <ul className="mt-4 space-y-2 max-h-56 overflow-y-auto" aria-live="polite">
          {lines.map((l, i) => (
            <li key={i} className="rounded-lg border divider p-3 text-sm text-pretty bg-white">{l}</li>
          ))}
        </ul>
      )}

      {status === 'unavailable' && (
        <p className="text-sm text-[#787774] mt-4 text-pretty">Voice is not configured for this clinic yet. Use the booking form below.</p>
      )}
      {status === 'error' && (
        <p className="text-sm text-[#9F2F2D] mt-4" role="alert">Connection failed. Check microphone permission and try again.</p>
      )}

      <div className="mt-4">
        {status === 'live' ? (
          <button onClick={disconnect} className="btn-secondary w-full">
            <PhoneDisconnect size={18} weight="fill" aria-hidden /> End call
          </button>
        ) : (
          <button onClick={connect} disabled={status === 'connecting'} className="btn-primary w-full">
            <PhoneCall size={18} weight="fill" aria-hidden />
            {status === 'connecting' ? 'Dialing…' : 'Call the clinic agent'}
          </button>
        )}
      </div>
    </div>
  )
}
