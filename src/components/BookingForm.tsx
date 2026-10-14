'use client'

import { useEffect, useState } from 'react'
import { bookAppointment, setAppointmentStatus } from '@/lib/actions/appointments'
import { Calendar } from '@/components/ui/calendar'

function toDayISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function BookingForm({
  doctors,
  patients,
}: {
  doctors: { id: string; name: string }[]
  patients: { id: string; full_name: string }[]
}) {
  const [doctorId, setDoctorId] = useState(doctors[0]?.id ?? '')
  const [patientId, setPatientId] = useState(patients[0]?.id ?? '')
  const [date, setDate] = useState<Date | undefined>(() => {
    const t = new Date()
    t.setDate(t.getDate() + 1)
    return t
  })
  const [slots, setSlots] = useState<string[]>([])
  const [slot, setSlot] = useState('')
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const day = date ? toDayISO(date) : ''

  useEffect(() => {
    if (!doctorId || !day) return
    setLoadingSlots(true)
    setSlot('')
    fetch(`/api/slots?doctor=${doctorId}&day=${day}`)
      .then((r) => r.json())
      .then((b) => setSlots(b.slots ?? []))
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false))
  }, [doctorId, day])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!slot) return setError('Pick an open time first.')
    setSaving(true)
    const res = await bookAppointment({ doctor_id: doctorId, patient_id: patientId, starts_at: slot })
    setSaving(false)
    if ('error' in res && res.error) return setError(res.error)
    setSlot('')
  }

  if (doctors.length === 0 || patients.length === 0) {
    return (
      <div className="card-surface p-8 text-center">
        <p className="text-base font-medium">Booking needs a doctor and a patient</p>
        <p className="text-sm text-[#787774] mt-1 text-pretty">Add both first, then open times appear here.</p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="card-surface p-8 space-y-6" aria-label="Book visit">
      <h2 className="font-serif-d text-3xl text-balance">Book visit</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="book-doc" className="text-sm font-semibold">Doctor</label>
          <select id="book-doc" className="input-field mt-2" value={doctorId} onChange={(e) => setDoctorId(e.target.value)}>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="book-pat" className="text-sm font-semibold">Patient</label>
          <select id="book-pat" className="input-field mt-2" value={patientId} onChange={(e) => setPatientId(e.target.value)}>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>{p.full_name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-[auto_1fr] items-start">
        <div>
          <span className="text-sm font-semibold">Day</span>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
            className="mt-2 card-surface !shadow-none"
          />
        </div>
        <div>
          <span className="text-sm font-semibold">Open times</span>
          {loadingSlots ? (
            <div className="grid grid-cols-3 gap-2 mt-2" aria-label="Loading times">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton h-10" />
              ))}
            </div>
          ) : slots.length === 0 ? (
            <p className="text-sm text-[#787774] mt-2 text-pretty">No open times that day. Try another day.</p>
          ) : (
            <div className="grid grid-cols-3 gap-2 mt-2" role="radiogroup" aria-label="Open times">
              {slots.map((s) => {
                const active = slot === s
                const label = new Date(s).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                return (
                  <button
                    key={s}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setSlot(s)}
                    className={`px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
                      active ? 'bg-[#111111] text-white border-[#111111]' : 'bg-white hover:border-[#111111]'
                    }`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
      {error && <p className="text-sm text-[#9F2F2D]" role="alert">{error}</p>}
      <button className="btn-primary w-full" disabled={saving || !slot}>{saving ? 'Booking…' : 'Book visit'}</button>
    </form>
  )
}

export function AppointmentActions({ id }: { id: string }) {
  const [loading, setLoading] = useState(false)
  return (
    <span className="flex gap-4">
      <button
        className="text-sm font-medium hover:underline disabled:opacity-40"
        disabled={loading}
        onClick={async () => {
          setLoading(true)
          await setAppointmentStatus(id, 'completed')
          setLoading(false)
        }}
      >
        Done
      </button>
      <button
        className="text-sm font-medium text-[#9F2F2D] hover:underline disabled:opacity-40"
        disabled={loading}
        onClick={async () => {
          if (!confirm('Cancel this visit? The slot opens again.')) return
          setLoading(true)
          await setAppointmentStatus(id, 'cancelled')
          setLoading(false)
        }}
      >
        Cancel
      </button>
    </span>
  )
}
