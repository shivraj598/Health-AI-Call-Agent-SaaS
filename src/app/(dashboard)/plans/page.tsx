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
    <div className="space-y-12">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.08em] text-[#787774]">Billing</p>
        <h1 className="font-serif-d text-4xl md:text-5xl mt-4 text-balance" style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}>Plans</h1>
        <p className="text-base mt-4 text-pretty">Checkout opens in Phase 3. Limits below already apply.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3 items-start">
        {PLANS.map((p) => {
          const current = business.plan === p.id
          const limits = PLAN_LIMITS[p.id]
          return (
            <article key={p.id} className={`p-8 ${current ? 'rounded-xl border-2 border-[#111111] bg-white' : 'card-surface'}`}>
              <p className="text-sm font-semibold capitalize flex items-center gap-2">
                {p.id}
                {current && <span className="badge badge-green">Current</span>}
              </p>
              <p className="font-serif-d text-5xl mt-3">{price(p.id)}<span className="font-sans text-base font-normal text-[#787774]">/mo</span></p>
              <p className="text-sm mt-3 text-pretty">{p.blurb}</p>
              <ul className="mt-6 space-y-2 text-sm border-t divider pt-6 list-none">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} weight="fill" aria-hidden />
                  {limits.agents === 0 ? 'Unlimited agents' : `${limits.agents} agent${limits.agents === 1 ? '' : 's'}`}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} weight="fill" aria-hidden />
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
