'use client'

import { useRef, useState } from 'react'

export type VoiceStatus = 'idle' | 'connecting' | 'live' | 'unavailable' | 'error'

export function useRealtimeVoice(businessId: string) {
  const [status, setStatus] = useState<VoiceStatus>('idle')
  const [lines, setLines] = useState<string[]>([])
  const pcRef = useRef<RTCPeerConnection | null>(null)
  const dcRef = useRef<RTCDataChannel | null>(null)

  function push(line: string) {
    setLines((prev) => [...prev.slice(-7), line])
  }

  async function runTool(name: string, args: Record<string, unknown>, callId: string) {
    const res = await fetch('/api/voice/tools', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessId, tool: name, args }),
    })
    const body = await res.json().catch(() => ({}))
    const output = res.ok ? JSON.stringify(body.result) : `Error: ${body.error || 'tool failed'}`
    dcRef.current?.send(
      JSON.stringify({ type: 'conversation.item.create', item: { type: 'function_call_output', call_id: callId, output } })
    )
    dcRef.current?.send(JSON.stringify({ type: 'response.create' }))
  }

  async function connect() {
    if (process.env.NEXT_PUBLIC_ENABLE_VOICE === 'false') return setStatus('unavailable')
    setStatus('connecting')
    try {
      const mic = await navigator.mediaDevices.getUserMedia({ audio: true })
      const sess = await fetch(`/api/voice/session?businessId=${businessId}`).then((r) => r.json())
      if (!sess.client_secret) {
        setStatus(sess.error ? 'unavailable' : 'error')
        if (sess.error) push(sess.error)
        return
      }
      const pc = new RTCPeerConnection()
      pcRef.current = pc
      mic.getTracks().forEach((t) => pc.addTrack(t, mic))
      const audio = new Audio()
      audio.autoplay = true
      pc.ontrack = (e) => {
        audio.srcObject = e.streams[0]
      }
      const dc = pc.createDataChannel('oai-events')
      dcRef.current = dc
      dc.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data)
          if (msg.type === 'response.function_call_arguments.done') {
            push(`Booking step: ${msg.name}`)
            runTool(msg.name, JSON.parse(msg.arguments || '{}'), msg.call_id)
          }
          if (msg.type === 'conversation.item.input_audio_transcription.completed') {
            push(`You: ${msg.transcript}`)
          }
          if (msg.type === 'response.audio_transcript.done') {
            push(`Agent: ${msg.transcript}`)
          }
        } catch {
          // ignore partial frames
        }
      }
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)
      const sdp = await fetch(`https://api.openai.com/v1/realtime?model=${sess.model}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${sess.client_secret}`, 'Content-Type': 'application/sdp' },
        body: offer.sdp,
      }).then((r) => r.text())
      await pc.setRemoteDescription({ type: 'answer', sdp })
      setStatus('live')
      push('Connected. Speak to book a visit.')
    } catch {
      setStatus('error')
      push('Microphone or connection failed. Check permission and try again.')
    }
  }

  function disconnect() {
    dcRef.current?.close()
    pcRef.current?.close()
    pcRef.current = null
    dcRef.current = null
    setStatus('idle')
  }

  return { status, lines, connect, disconnect }
}
