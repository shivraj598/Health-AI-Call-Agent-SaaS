import Link from 'next/link'
import {
  PhoneCall,
  PhoneIncoming,
  CalendarCheck,
  ShieldCheck,
  MoonStars,
  AddressBook,
  CheckCircle,
} from '@phosphor-icons/react/dist/ssr'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import Reveal from '@/components/Reveal'
import TaglineReveal from '@/components/TaglineReveal'
import DemoForm from '@/components/DemoForm'

const BENEFITS = [
  {
    icon: CalendarCheck,
    title: 'More visits on the calendar',
    body: 'The agent offers open slots while the patient is still on the line, so intent turns into a booking in about a minute.',
  },
  {
    icon: ShieldCheck,
    title: 'Zero double bookings',
    body: 'The calendar blocks overlaps per doctor, even when two patients call at the same moment.',
  },
  {
    icon: MoonStars,
    title: 'After hours coverage',
    body: 'Nights and weekends get answered with the same booking rules as clinic hours.',
  },
  {
    icon: AddressBook,
    title: 'One record per patient',
    body: 'Every call, transcript, and visit stays under the patient phone number.',
  },
]

const STEPS = [
  {
    n: '1',
    title: 'Add your doctors and hours',
    body: 'List each doctor once with working hours, working days, and slot length.',
  },
  {
    n: '2',
    title: 'Connect your number or widget',
    body: 'Point your Twilio number at HealthCall or embed the booking widget on your site.',
  },
  {
    n: '3',
    title: 'Answer, book, and log',
    body: 'Every call ends with a booked visit plus transcript and summary in the patient record.',
  },
]

const FAQS = [
  {
    q: 'What happens when two patients call at the same time?',
    a: 'Each call gets its own agent session. Both see live availability, and the calendar allows only one booking per slot, so the second caller is offered the next open time.',
  },
  {
    q: 'Does HealthCall replace our receptionist?',
    a: 'No. It handles routine booking and basic questions. Your staff keeps the exceptions, the walk ins, and the personal touch.',
  },
  {
    q: 'How does it learn our clinic hours?',
    a: 'You set working hours, working days, and slot length per doctor. The agent only offers times inside those windows.',
  },
  {
    q: 'What happens on cancellation?',
    a: 'The visit is marked cancelled and the slot opens again for the next caller.',
  },
  {
    q: 'How do patients reach the agent?',
    a: 'Through your Twilio clinic number or the booking widget embedded on your site.',
  },
  {
    q: 'What is included in the Free plan?',
    a: '1 agent and 5 bookings per month. Pro raises that to 10 agents and 99 bookings.',
  },
  {
    q: 'Is patient data kept separate?',
    a: 'Yes. Every clinic reads only its own rows, enforced in the database for patients, visits, calls, and billing.',
  },
  {
    q: 'Can we cancel anytime?',
    a: 'Yes. Cancel in one click from the dashboard. Read access stays until the billing period ends.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

export default function Home() {
  return (
    <div className="bg-page min-h-screen">
      <SiteNav />

      <main id="main">
        {/* ── Hero ─────────────────────────────────── */}
        <section className="mx-auto max-w-5xl px-6 pt-16 pb-12 md:pt-24 md:pb-16">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div>
              <p className="badge border-teal-600 text-teal-700 bg-white">For independent clinics</p>
              <h1 className="text-5xl md:text-6xl font-semibold mt-4 text-gradient-hero text-balance max-w-[680px]">
                More booked visits
                <br />
                without adding
                <br />
                front desk staff
              </h1>
              <p className="text-base md:text-lg text-slate-600 mt-4 max-w-[680px] text-pretty">
                HealthCall is the AI receptionist for independent clinics. It answers every
                call, books visits into your doctors calendar, and keeps one record per patient.
              </p>
              <div className="mt-8 flex items-center gap-4">
                <Link href="#demo" className="btn-primary">
                  Book a demo
                </Link>
                <Link href="#how" className="text-base font-medium text-teal-700 underline-offset-4 hover:underline">
                  See how it works
                </Link>
              </div>
              <p className="text-sm text-slate-500 mt-4 text-pretty">
                Now booking for 118 clinics across Nepal and India. Free plan, no credit card, cancel anytime.
              </p>
            </div>

            {/* Hero visual: live call mock */}
            <div className="card-raised p-6 animate-float" role="img" aria-label="HealthCall answering a patient call and booking a visit">
              <div className="flex items-center gap-3">
                <span className="relative flex w-3 h-3">
                  <span className="absolute inline-flex w-full h-full rounded-full bg-teal-500 opacity-60 animate-ping" />
                  <span className="relative inline-flex w-3 h-3 rounded-full bg-teal-600" />
                </span>
                <p className="text-sm font-semibold flex items-center gap-2">
                  <PhoneIncoming size={18} weight="duotone" aria-hidden />
                  Incoming call · +977 1 590 2314
                </p>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <p className="card-surface p-3 text-pretty">Good morning, Boudha Dental Care. Are you calling to book a visit?</p>
                <p className="card-surface p-3 text-pretty">Yes, tomorrow morning with Dr. Sharma if possible.</p>
                <p className="card-surface p-3 text-pretty">Dr. Sharma has 9:30 open. Shall I book it under this number?</p>
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-teal-600 bg-teal-50 p-3">
                <CheckCircle size={20} weight="duotone" className="text-teal-700" aria-hidden />
                <p className="text-sm font-semibold">Visit booked · Tue 9:30 · Dr. Sharma</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Tagline reveal (mandatory) ─────────────── */}
        <section className="py-16 md:py-24" aria-label="Tagline">
          <TaglineReveal
            lines={['Every call answered.', 'Every visit booked.', 'Nothing slips through.']}
          />
        </section>

        {/* ── Problem to solution ────────────────────── */}
        <section className="mx-auto max-w-5xl px-6 py-12">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-semibold text-balance">Missed calls turn into missed visits</h2>
            <p className="text-base text-slate-600 mt-4 max-w-2xl text-pretty">
              Clinics miss about 27.3% of inbound calls during busy hours. Evenings and
              weekends go unanswered, and morning staff inherit a voicemail queue instead
              of a booking queue. HealthCall picks up on ring one, offers real open slots,
              and writes each booking straight into the doctor calendar.
            </p>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-3 mt-8">
            {[
              ['27.3%', 'of inbound calls missed at peak hours'],
              ['38.4%', 'fewer missed calls in week one'],
              ['60 sec', 'average time from greeting to booking'],
            ].map(([stat, label], i) => (
              <Reveal key={stat} delay={i * 100}>
                <div className="stat-card p-6">
                  <p className="text-4xl font-semibold">{stat}</p>
                  <p className="text-sm text-slate-500 mt-2 text-pretty">{label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Benefits ───────────────────────────────── */}
        <section id="benefits" className="mx-auto max-w-5xl px-6 py-12 scroll-mt-24">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-semibold text-balance">Built for the front desk you already have</h2>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-2 mt-8">
            {BENEFITS.map((b, i) => (
              <Reveal key={b.title} delay={(i % 2) * 100}>
                <article className="card-surface p-6 h-full">
                  <b.icon size={28} weight="duotone" className="text-teal-700" aria-hidden />
                  <h3 className="text-xl font-semibold mt-4 text-balance">{b.title}</h3>
                  <p className="text-base text-slate-600 mt-2 text-pretty">{b.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── How it works ───────────────────────────── */}
        <section id="how" className="mx-auto max-w-5xl px-6 py-12 scroll-mt-24">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-semibold text-balance">Live in three steps</h2>
          </Reveal>
          <ol className="grid gap-4 md:grid-cols-3 mt-8 list-none">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 100}>
                <li className="card-raised p-6 h-full">
                  <p className="text-5xl font-semibold text-teal-200" aria-hidden>{s.n}</p>
                  <h3 className="text-xl font-semibold mt-4 text-balance">{s.title}</h3>
                  <p className="text-base text-slate-600 mt-2 text-pretty">{s.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* ── Proof ──────────────────────────────────── */}
        <section id="proof" className="mx-auto max-w-5xl px-6 py-12 scroll-mt-24">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-semibold text-balance">Clinics start mornings with full calendars</h2>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-2 mt-8">
            <Reveal>
              <figure className="card-surface p-6 h-full">
                <blockquote className="text-base text-slate-700 text-pretty">
                  We stopped losing evening calls in the first week. Mornings now start
                  with a full calendar instead of a full voicemail.
                </blockquote>
                <figcaption className="flex items-center gap-3 mt-4">
                  <span className="w-10 h-10 rounded-full bg-teal-700 text-white grid place-items-center text-sm font-semibold" aria-hidden>PS</span>
                  <span>
                    <span className="block text-sm font-semibold">Dr. Priya Sharma</span>
                    <span className="block text-sm text-slate-500">Boudha Dental Care, Kathmandu</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
            <Reveal delay={100}>
              <figure className="card-surface p-6 h-full">
                <blockquote className="text-base text-slate-700 text-pretty">
                  Double bookings dropped to zero. The agent respects each doctor calendar
                  better than our paper diary did.
                </blockquote>
                <figcaption className="flex items-center gap-3 mt-4">
                  <span className="w-10 h-10 rounded-full bg-emerald-700 text-white grid place-items-center text-sm font-semibold" aria-hidden>AM</span>
                  <span>
                    <span className="block text-sm font-semibold">Dr. Anjali Menon</span>
                    <span className="block text-sm text-slate-500">Kochi Family Clinic</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </section>

        {/* ── FAQ ────────────────────────────────────── */}
        <section id="faq" className="mx-auto max-w-3xl px-6 py-12 scroll-mt-24">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-semibold text-balance">Questions clinics ask</h2>
          </Reveal>
          <div className="mt-8 space-y-3">
            {FAQS.map((f) => (
              <details key={f.q} className="card-surface px-6 py-4 group">
                <summary className="text-base font-semibold cursor-pointer list-none flex justify-between items-center gap-4">
                  {f.q}
                  <span className="text-teal-700 text-xl leading-none group-open:rotate-45 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]" aria-hidden>+</span>
                </summary>
                <p className="text-base text-slate-600 mt-3 text-pretty">{f.a}</p>
              </details>
            ))}
          </div>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        </section>

        {/* ── Final CTA + demo form ──────────────────── */}
        <section id="demo" className="mx-auto max-w-5xl px-6 py-12 scroll-mt-24">
          <div className="grid gap-8 md:grid-cols-2 items-start">
            <Reveal>
              <p className="badge border-teal-600 text-teal-700 bg-white">
                <PhoneCall size={14} weight="duotone" aria-hidden /> Live demo call
              </p>
              <h2 className="text-3xl md:text-4xl font-semibold mt-4 text-balance">Watch your calendar fill up on a live call</h2>
              <p className="text-base text-slate-600 mt-4 text-pretty">
                Share your details and we will call at your preferred hour, then show
                HealthCall booking real visits into a test calendar while you listen.
              </p>
              <ul className="mt-6 space-y-2 text-base">
                {['Free plan, no credit card', 'Cancel anytime', 'Your data stays in your clinic only'].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <CheckCircle size={18} weight="duotone" className="text-teal-700" aria-hidden />
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={100}>
              <DemoForm />
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
