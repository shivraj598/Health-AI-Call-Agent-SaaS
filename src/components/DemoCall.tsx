'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Play, ArrowClockwise, CheckCircle } from '@phosphor-icons/react'

const SCRIPT = [
  { who: 'agent', text: 'Good morning, Boudha Dental Care. Are you calling to book a visit?' },
  { who: 'caller', text: 'Yes, tomorrow morning with Dr. Sharma if possible.' },
  { who: 'agent', text: 'Dr. Sharma has 9:30 open. Shall I book it under this number?' },
  { who: 'caller', text: 'Yes please.' },
]

export default function DemoCall() {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const done = step >= SCRIPT.length

  function play() {
    if (playing) return
    setPlaying(true)
    setStep(0)
    let i = 0
    const tick = () => {
      i += 1
      setStep(i)
      if (i < SCRIPT.length) {
        window.setTimeout(tick, 1400)
      } else {
        setPlaying(false)
      }
    }
    window.setTimeout(tick, 600)
  }

  function replay() {
    setStep(0)
    play()
  }

  return (
    <div className="card-surface overflow-hidden" aria-label="Playable demo of a HealthCall booking">
      <div className="flex items-center gap-2 px-6 py-4 border-b divider bg-white">
        <span className="w-3 h-3 rounded-full bg-[#EAEAEA]" aria-hidden />
        <span className="w-3 h-3 rounded-full bg-[#EAEAEA]" aria-hidden />
        <span className="w-3 h-3 rounded-full bg-[#EAEAEA]" aria-hidden />
        <span className="font-mono text-xs text-[#787774] ml-3">live call · +977 1 590 2314</span>
        <span className="ml-auto flex items-center gap-2">
          <span className="relative flex w-2.5 h-2.5" aria-hidden>
            {playing && (
              <span className="absolute inline-flex w-full h-full rounded-full bg-[#346538] opacity-60 animate-ping" />
            )}
            <span className={`relative inline-flex w-2.5 h-2.5 rounded-full ${playing ? 'bg-[#346538]' : 'bg-[#EAEAEA]'}`} />
          </span>
          <span className="font-mono text-xs text-[#787774]">{playing ? 'on call' : done ? 'booked' : 'ready'}</span>
        </span>
      </div>

      <div className="p-6 md:p-8 space-y-3 text-[15px] bg-white min-h-[280px]">
        {step === 0 && !playing && !done && (
          <p className="text-[#787774] text-pretty">Press play. The agent answers, offers a real open slot, and books it.</p>
        )}
        {SCRIPT.slice(0, step).map((line, i) => (
          <p
            key={i}
            className={`p-4 rounded-lg border divider text-pretty animate-fade-up ${line.who === 'caller' ? 'bg-[#F7F6F3]' : 'bg-white'}`}
          >
            <span className="font-mono text-xs uppercase tracking-[0.08em] text-[#787774] block mb-1">
              {line.who === 'agent' ? 'HealthCall' : 'Caller'}
            </span>
            {line.text}
          </p>
        ))}
        {done && (
          <p className="flex items-center gap-2 p-4 rounded-lg border divider bg-[#F7F6F3] font-medium animate-fade-up">
            <CheckCircle size={20} weight="fill" aria-hidden />
            Visit booked · Tue 9:30 · Dr. Sharma
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 px-6 md:px-8 py-4 border-t divider bg-white">
        {!done ? (
          <button onClick={play} disabled={playing} className="btn-primary">
            <Play size={18} weight="fill" aria-hidden />
            {playing ? 'Playing…' : step > 0 ? 'Resume' : 'Play the call'}
          </button>
        ) : (
          <>
            <button onClick={replay} className="btn-secondary">
              <ArrowClockwise size={18} weight="bold" aria-hidden />
              Replay
            </button>
            <Link href="#demo" className="btn-primary">
              Book a demo
            </Link>
          </>
        )}
        <span className="font-mono text-xs text-[#787774] ml-auto">0:58 · transcript included</span>
      </div>
    </div>
  )
}
