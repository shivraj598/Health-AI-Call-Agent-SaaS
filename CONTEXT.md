# CONTEXT.md — Health AI Call Agent SaaS

## Idea
Multi-tenant AI voice receptionist for clinics: handles calls, books appointments, manages patients/doctors, monetized via Stripe subscriptions.

## Facts (looked up, not decided)
- Repo: `shivraj598/Health-AI-Call-Agent-SaaS`, fresh, 1 commit, `main`
- Stack: Next.js 14.2.29, React 18, Supabase (`@supabase/ssr` + `supabase-js`), Stripe, Resend, OpenAI Realtime (`gpt-realtime`), Tailwind, Zustand, React Query, RHF+Zod
- Supabase: project `health-ai-call-agent-saas` (`jrxvsqgfoufrpuutgwqv`), `ap-south-1`, ACTIVE_HEALTHY, `public` schema empty, URL+anon wired in `.env.local`
- `.env.local` plans: Free/Pro/Business + agent/booking limits, website-builder $29. Missing: `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, `RESEND_API_KEY`, `STRIPE_*`
- Starter: all `src/` pages/components are placeholder divs, `supabase/schema.sql` empty, no clients/middleware/auth yet

## Decisions (pending confirmation)
- [x] D1: multi-tenant from day 1 — `businesses` table + RLS from day 1
- [x] D2: widget + telephony — browser Realtime widget + real inbound phone (needs provider + numbers)
- [x] D2a: Twilio for Phase 1 telephony
- [x] D3: doctor hours + no double-book enforced
- [x] D4: enforce Free/Pro/Business limits in Phase 1
- [x] D5: Phase 1 locked — schema + Auth + tenancy + booking rules + plan gates + widget shell + Twilio stub
- [ ] D2: voice path — browser widget only vs + telephony?
- [ ] D3: appointment rules / working hours / conflicts?
- [ ] D4: plans enforcement now vs later?
- [ ] D5: Phase 1 scope lock

## ADRs
- None yet. Record hard-to-reverse choices here as `docs/adr-*.md` once decided.
