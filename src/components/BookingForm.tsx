'use client'

import { useEffect, useState } from 'react'
import { bookAppointment, setAppointmentStatus } from '@/lib/actions/appointments'

export function BookingForm({
  doctors,
  patients,
}: {
  doctors: { id: string; name: string }[]
  patients: { id: string; full_name: string }[]
}) {
  const [doctorId, setDoctorId] = useState(doctors[0]?.id ?? '')
  const [patientId, setPatientId] = useState(patients[0]?.id ?? '')
  const [day, setDay] = useState(() => {
    const t = new Date(Date.now() + 86400000)
    return t.toISOString().slice(0, 10)
  })
  const [slots, setSlots] = useState<string[]>([])
  const [slot, setSlot] = useState('')
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

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
      <div className="card-raised p-6 text-center py-8">
        <p className="text-base font-medium">Booking needs a doctor and a patient</p>
        <p className="text-sm text-slate-500 mt-1 text-pretty">Add both first, then open times appear here.</p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="card-raised p-6 space-y-4" aria-label="Book visit">
      <h2 className="text-xl font-semibold">Book visit</h2>
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
      <div>
        <label htmlFor="book-day" className="text-sm font-semibold">Day</label>
        <input id="book-day" type="date" className="input-field mt-2" value={day} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setDay(e.target.value)} />
      </div>
      <div>
        <span className="text-sm font-semibold">Open times</span>
        {loadingSlots ? (
          <div className="grid grid-cols-4 gap-2 mt-2" aria-label="Loading times">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton h-10" />
            ))}
          </div>
        ) : slots.length === 0 ? (
          <p className="text-sm text-slate-500 mt-2 text-pretty">No open times that day. Try another day.</p>
        ) : (
          <div className="grid grid-cols-4 gap-2 mt-2" role="radiogroup" aria-label="Open times">
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
                  className={`px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                    active ? 'bg-teal-700 text-white border-teal-700' : 'bg-white text-slate-700 hover:border-teal-500'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
      <button className="btn-primary w-full" disabled={saving || !slot}>{saving ? 'Booking…' : 'Book visit'}</button>
    </form>
  )
}

export function AppointmentActions({ id }: { id: string }) {
  const [loading, setLoading] = useState(false)
  return (
    <span className="flex gap-3">
      <button
        className="text-sm font-medium text-teal-700 hover:underline disabled:opacity-40"
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
        className="text-sm font-medium text-red-600 hover:underline disabled:opacity-40"
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
