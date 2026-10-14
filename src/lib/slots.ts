import type { Doctor } from '@/types/database'

function tzWall(date: Date, timeZone: string): { isoDow: number; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }).formatToParts(date)
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? ''
  const dowMap: Record<string, number> = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 }
  const isoDow = dowMap[get('weekday')] ?? 1
  const minutes = Number(get('hour')) * 60 + Number(get('minute'))
  return { isoDow, minutes }
}

function toMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + (m || 0)
}

export function isWithinHours(
  doctor: Pick<Doctor, 'work_start' | 'work_end' | 'work_days'>,
  startsAt: Date,
  endsAt: Date,
  timeZone: string
): string | null {
  if (!(endsAt > startsAt)) return 'End time must be after start time.'
  const s = tzWall(startsAt, timeZone)
  const e = tzWall(endsAt, timeZone)
  if (s.isoDow !== e.isoDow) return 'Visits must start and end on the same day.'
  if (!doctor.work_days.includes(s.isoDow)) return 'Doctor does not work that day.'
  const open = toMinutes(doctor.work_start)
  const close = toMinutes(doctor.work_end)
  if (s.minutes < open || e.minutes > close) {
    return `Outside working hours (${doctor.work_start} to ${doctor.work_end}).`
  }
  return null
}

// Generate bookable UTC slot starts for a YYYY-MM-DD day in the business timezone.
export function generateSlots(
  doctor: Pick<Doctor, 'work_start' | 'work_end' | 'work_days' | 'slot_minutes'>,
  dayISO: string,
  timeZone: string,
  busy: { starts_at: string; ends_at: string }[]
): Date[] {
  const [y, m, d] = dayISO.split('-').map(Number)
  if (!y || !m || !d) return []
  // Noon UTC anchor avoids DST edge flips when resolving wall time.
  const anchor = new Date(Date.UTC(y, m - 1, d, 12))
  const { isoDow } = tzWall(anchor, timeZone)
  if (!doctor.work_days.includes(isoDow)) return []

  const step = Math.max(5, doctor.slot_minutes)
  const open = toMinutes(doctor.work_start)
  const close = toMinutes(doctor.work_end)
  const out: Date[] = []

  // Find UTC offset of the timezone at this day via round trip.
  const probe = new Date(Date.UTC(y, m - 1, d, 12, 0))
  const wall = tzWall(probe, timeZone)
  const probeWallMin = 12 * 60
  const offsetMin = wall.minutes - probeWallMin

  for (let t = open; t + step <= close; t += step) {
    const utcMin = t - offsetMin
    const slot = new Date(Date.UTC(y, m - 1, d, 0, 0) + utcMin * 60000)
    const end = new Date(slot.getTime() + step * 60000)
    const clash = busy.some((b) => {
      const bs = new Date(b.starts_at).getTime()
      const be = new Date(b.ends_at).getTime()
      return slot.getTime() < be && bs < end.getTime()
    })
    if (!clash && slot.getTime() > Date.now()) out.push(slot)
  }
  return out
}
