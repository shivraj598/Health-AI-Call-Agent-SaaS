# Phase 1 Spec — locked 2026-10-14

## Scope
Supabase schema + Auth + tenancy + booking rules + plan gates + widget shell + Twilio stub.

## Decisions
- D1 multi-tenant now: `businesses` + RLS
- D2/D2a widget + Twilio (Twilio provider)
- D3 hours + no double-book (exclusion constraint)
- D4 enforce Free/Pro/Business limits

## Tickets
- [x] T1 DB schema via MCP (`phase1_core_schema` + `phase1_perf_fixes`)
  - tables: profiles, businesses, doctors, patients, appointments, calls, subscriptions
  - RLS on, owner-based policies with `(select auth.uid())`
  - `no_double_book` exclusion via `btree_gist`, indexes for FKs
- [ ] T2 Supabase clients + middleware + Auth pages (needs `SUPABASE_SERVICE_ROLE_KEY` for server)
- [ ] T3 Plan-gate helper reading `NEXT_PUBLIC_*_LIMIT` + `businesses.plan`
- [ ] T4 Widget shell `/sites/[slug]` + `/widget-demo` reading `businesses.slug`
- [ ] T5 Twilio webhook stub `/api/twilio/voice` -> log to `calls`, needs Twilio creds
- [ ] T6 Smoke test: signup -> create business -> add doctor/patient -> book (blocked on keys)

## Lints
- `auth_rls_initplan` fixed. Remaining: `extension_in_public` (accepted, needed for gist), `unused_index` (empty tables, ignore), unindexed FKs fixed.
