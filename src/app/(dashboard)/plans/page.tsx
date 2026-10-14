import { CheckCircle } from '@phosphor-icons/react/dist/ssr'
import { requireBusiness } from '@/lib/dal'
import { PLAN_LIMITS } from '@/lib/plans'
import type { Plan } from '@/types/database'

const PLANS: { id: Plan; blurb: string }[] = [
  { id: 'free', blurb: 'Try the receptionist on real calls.' },
  { id: 'pro', blurb: 'Run the whole clinic week on autopilot.' },
  { id: 'business', blurb: 'Unlimited booking across locations.' },
]

function price(id: Plan): string {
  if (id === 'free') return '$0'
  if (id === 'pro') return `$${process.env.NEXT_PUBLIC_PRO_PLAN_PRICE_USD ?? '49'}`
  return `$${process.env.NEXT_PUBLIC_BUSINESS_PLAN_PRICE_USD ?? '199'}`
}

export default async function PlansPage() {
  const { business } = await requireBusiness()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-balance">Plans</h1>
        <p className="text-base text-slate-600 mt-2 text-pretty">Checkout opens in Phase 3. Limits below already apply.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {PLANS.map((p) => {
          const current = business.plan === p.id
          const limits = PLAN_LIMITS[p.id]
          return (
            <article key={p.id} className={`p-6 rounded-2xl border ${current ? 'border-teal-600 bg-white shadow-card' : 'card-surface'}`}>
              <p className="text-sm font-semibold capitalize flex items-center gap-2">
                {p.id}
                {current && <span className="badge border-teal-600 text-teal-700 bg-teal-50">Current</span>}
              </p>
              <p className="text-4xl font-semibold mt-2">{price(p.id)}<span className="text-base font-normal text-slate-500">/mo</span></p>
              <p className="text-sm text-slate-600 mt-2 text-pretty">{p.blurb}</p>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} weight="duotone" className="text-teal-700" aria-hidden />
                  {limits.agents === 0 ? 'Unlimited agents' : `${limits.agents} agent${limits.agents === 1 ? '' : 's'}`}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} weight="duotone" className="text-teal-700" aria-hidden />
                  {limits.bookings === 0 ? 'Unlimited bookings' : `${limits.bookings} bookings a month`}
                </li>
              </ul>
              <button className="btn-secondary w-full mt-6" disabled title="Stripe checkout opens in Phase 3">
                {current ? 'Staying here' : 'Checkout soon'}
              </button>
            </article>
          )
        })}
      </div>
    </div>
  )
}
