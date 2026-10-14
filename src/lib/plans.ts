import type { Plan } from '@/types/database'

function num(key: string, fallback: number): number {
  const v = Number(process.env[key])
  return Number.isFinite(v) ? v : fallback
}

export const PLAN_LIMITS: Record<Plan, { agents: number; bookings: number }> = {
  free: {
    agents: num('NEXT_PUBLIC_FREE_AGENT_LIMIT', 1),
    bookings: num('NEXT_PUBLIC_FREE_BOOKING_LIMIT', 5),
  },
  pro: {
    agents: num('NEXT_PUBLIC_PRO_AGENT_LIMIT', 10),
    bookings: num('NEXT_PUBLIC_PRO_BOOKING_LIMIT', 99),
  },
  business: {
    agents: num('NEXT_PUBLIC_BUSINESS_AGENT_LIMIT', 0),
    bookings: num('NEXT_PUBLIC_BUSINESS_BOOKING_LIMIT', 0),
  },
}

// 0 = unlimited (per .env convention for business plan)
export function atLimit(plan: Plan, kind: 'agents' | 'bookings', used: number): boolean {
  const limit = PLAN_LIMITS[plan][kind]
  if (limit === 0) return false
  return used >= limit
}
