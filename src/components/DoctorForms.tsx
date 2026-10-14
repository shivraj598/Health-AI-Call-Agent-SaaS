'use client'

import { useState } from 'react'
import { createDoctor, deleteDoctor } from '@/lib/actions/doctors'

const DAYS = [
  [1, 'Mon'], [2, 'Tue'], [3, 'Wed'], [4, 'Thu'], [5, 'Fri'], [6, 'Sat'], [7, 'Sun'],
] as const

export function AddDoctorForm() {
  const [name, setName] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [days, setDays] = useState<number[]>([1, 2, 3, 4, 5])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function toggle(d: number) {
    setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d].sort()))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await createDoctor({ name, specialty, work_days: days })
    setLoading(false)
    if ('error' in res && res.error) return setError(res.error)
    setName('')
    setSpecialty('')
  }

  return (
    <form onSubmit={onSubmit} className="card-raised p-6 space-y-4" aria-label="Add doctor">
      <h2 className="text-xl font-semibold">Add doctor</h2>
      <div>
        <label htmlFor="doc-name" className="text-sm font-semibold">Name</label>
        <input id="doc-name" className="input-field mt-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="Dr. Sharma" />
      </div>
      <div>
        <label htmlFor="doc-spec" className="text-sm font-semibold">Specialty <span className="font-normal text-[#787774]">(optional)</span></label>
        <input id="doc-spec" className="input-field mt-2" value={specialty} onChange={(e) => setSpecialty(e.target.value)} placeholder="Dental" />
      </div>
      <fieldset>
        <legend className="text-sm font-semibold">Working days</legend>
        <div className="flex flex-wrap gap-2 mt-2">
          {DAYS.map(([d, label]) => (
            <button
              key={d}
              type="button"
              onClick={() => toggle(d)}
              aria-pressed={days.includes(d)}
              className={`px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                days.includes(d) ? 'bg-[#111111] text-white border-[#111111]' : 'bg-white text-[#2F3437]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>
      {error && <p className="text-sm text-[#9F2F2D]" role="alert">{error}</p>}
      <button className="btn-primary w-full" disabled={loading}>{loading ? 'Adding…' : 'Add doctor'}</button>
    </form>
  )
}

export function DeleteDoctorButton({ id, name }: { id: string; name: string }) {
  const [loading, setLoading] = useState(false)
  return (
    <button
      className="text-sm font-medium text-[#9F2F2D] hover:underline disabled:opacity-40"
      disabled={loading}
      onClick={async () => {
        if (!confirm(`Remove ${name}? Past visits stay in history.`)) return
        setLoading(true)
        await deleteDoctor(id)
        setLoading(false)
      }}
    >
      Remove
    </button>
  )
}
