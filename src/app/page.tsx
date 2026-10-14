import Link from 'next/link'
import {
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const BENEFITS = [
  {
    icon: CalendarCheck,
    tag: 'Booking',
    title: 'More visits on the calendar',
    body: 'The agent offers open slots while the patient is still on the line, so intent turns into a booking in about a minute.',
    wide: true,
  },
  {
    icon: ShieldCheck,
    tag: 'Calendar',
    title: 'Zero double bookings',
    body: 'Overlaps stay blocked per doctor, even when two patients call at the same moment.',
    wide: false,
  },
  {
    icon: MoonStars,
    tag: 'Hours',
    title: 'After hours coverage',
    body: 'Nights and weekends get answered with the same booking rules as clinic hours.',
    wide: false,
  },
  {
    icon: AddressBook,
    tag: 'Records',
    title: 'One record per patient',
    body: 'Every call, transcript, and visit stays under the patient phone number.',
    wide: false,
  },
]

const STEPS = [
  {
    n: '01',
    title: 'Add your doctors and hours',
    body: 'List each doctor once with working hours, working days, and slot length.',
  },
  {
    n: '02',
    title: 'Connect your number or widget',
    body: 'Point your Twilio number at HealthCall or embed the booking widget on your site.',
  },
  {
    n: '03',
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
        {/* ── Hero: editorial thesis ─────────────────── */}
        <section className="mx-auto max-w-5xl px-6 pt-24 pb-24 md:pt-32 md:pb-32">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.08em] text-[#787774]">
              For independent clinics
            </p>
            <h1
              className="font-serif-d mt-6 text-balance max-w-[680px]"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1.1, letterSpacing: '-0.03em' }}
            >
              More booked visits
              <br />
              without adding
              <br />
              front desk staff
            </h1>
            <p className="text-base md:text-lg mt-6 max-w-[680px] text-pretty">
              HealthCall is the AI receptionist for independent clinics. It answers every
              call, books visits into your doctors calendar, and keeps one record per patient.
            </p>
            <div className="mt-8 flex items-center gap-6">
              <Link href="#demo" className="btn-primary">
                Book a demo
              </Link>
              <Link href="#how" className="text-base font-medium underline-offset-4 hover:underline">
                See how it works
              </Link>
            </div>
            <p className="font-mono text-xs mt-6 text-[#787774]">
              118 clinics · 38.4% fewer missed calls · Free plan, no credit card
            </p>
          </Reveal>

          {/* Hero visual: faux OS window */}
          <Reveal delay={120} className="mt-16">
            <div className="card-surface overflow-hidden" role="img" aria-label="HealthCall answering a patient call and booking a visit">
              <div className="flex items-center gap-2 px-6 py-4 border-b divider bg-white">
                <span className="w-3 h-3 rounded-full bg-[#EAEAEA]" aria-hidden />
                <span className="w-3 h-3 rounded-full bg-[#EAEAEA]" aria-hidden />
                <span className="w-3 h-3 rounded-full bg-[#EAEAEA]" aria-hidden />
                <span className="font-mono text-xs text-[#787774] ml-3">live call · +977 1 590 2314</span>
              </div>
              <div className="p-6 md:p-10 space-y-3 text-[15px] bg-white">
                <p className="card-surface p-4 text-pretty">Good morning, Boudha Dental Care. Are you calling to book a visit?</p>
                <p className="card-surface p-4 text-pretty">Yes, tomorrow morning with Dr. Sharma if possible.</p>
                <p className="card-surface p-4 text-pretty">Dr. Sharma has 9:30 open. Shall I book it under this number?</p>
                <p className="flex items-center gap-2 p-4 rounded-lg border divider bg-[#F7F6F3] font-medium">
                  <CheckCircle size={20} weight="fill" aria-hidden />
                  Visit booked · Tue 9:30 · Dr. Sharma
                </p>
              </div>
            </div>
          </Reveal>
        </section>

        <div className="ecg-line mx-auto max-w-5xl" aria-hidden />

        {/* ── Tagline reveal ─────────────────────────── */}
        <section className="py-24 md:py-32" aria-label="Tagline">
          <TaglineReveal
            lines={['Every call answered.', 'Every visit booked.', 'Nothing slips through.']}
          />
        </section>

        {/* ── Problem to solution ────────────────────── */}
        <section className="mx-auto max-w-5xl px-6 py-24 md:py-32">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.08em] text-[#787774]">The problem</p>
            <h2 className="font-serif-d text-4xl md:text-5xl mt-4 text-balance" style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Missed calls turn into missed visits
            </h2>
            <p className="text-base mt-6 max-w-2xl text-pretty">
              Clinics miss about 27.3% of inbound calls during busy hours. Evenings and
              weekends go unanswered, and morning staff inherit a voicemail queue instead
              of a booking queue. HealthCall picks up on ring one, offers real open slots,
              and writes each booking straight into the doctor calendar.
            </p>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-3 mt-12">
            {[
              ['27.3%', 'of inbound calls missed at peak hours'],
              ['38.4%', 'fewer missed calls in week one'],
              ['60 sec', 'average time from greeting to booking'],
            ].map(([stat, label], i) => (
              <Reveal key={stat} delay={i * 80}>
                <div className="card-surface p-8">
                  <p className="font-serif-d text-5xl">{stat}</p>
                  <p className="text-sm text-[#787774] mt-3 text-pretty">{label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Benefits bento ─────────────────────────── */}
        <section id="benefits" className="mx-auto max-w-5xl px-6 py-24 md:py-32 scroll-mt-24">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.08em] text-[#787774]">Benefits</p>
            <h2 className="font-serif-d text-4xl md:text-5xl mt-4 text-balance" style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Built for the front desk you already have
            </h2>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-3 mt-12">
            {BENEFITS.map((b, i) => (
              <Reveal
                key={b.title}
                delay={(i % 3) * 80}
                className={b.wide ? 'md:col-span-2' : ''}
              >
                <article className="card-surface p-8 md:p-10 h-full">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-lg bg-[#EFEDE8] grid place-items-center">
                      <b.icon size={22} weight="fill" aria-hidden />
                    </span>
                    <span className="badge badge-bone">{b.tag}</span>
                  </div>
                  <h3 className="text-xl font-semibold mt-6 text-balance">{b.title}</h3>
                  <p className="text-base mt-2 text-pretty">{b.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── How it works: a real sequence ──────────── */}
        <section id="how" className="mx-auto max-w-5xl px-6 py-24 md:py-32 scroll-mt-24">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.08em] text-[#787774]">Setup</p>
            <h2 className="font-serif-d text-4xl md:text-5xl mt-4 text-balance" style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Live in three steps
            </h2>
          </Reveal>
          <ol className="mt-12 list-none border-t divider">
            {STEPS.map((s) => (
              <Reveal key={s.n}>
                <li className="grid md:grid-cols-[80px_1fr_1fr] gap-4 py-8 border-b divider items-baseline">
                  <span className="font-mono text-sm text-[#787774]">{s.n}</span>
                  <h3 className="text-xl font-semibold text-balance">{s.title}</h3>
                  <p className="text-base text-pretty">{s.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* ── Proof ──────────────────────────────────── */}
        <section id="proof" className="mx-auto max-w-5xl px-6 py-24 md:py-32 scroll-mt-24">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.08em] text-[#787774]">Clinics</p>
            <h2 className="font-serif-d text-4xl md:text-5xl mt-4 text-balance" style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Mornings start with full calendars
            </h2>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-2 mt-12">
            <Reveal>
              <figure className="card-surface p-8 md:p-10 h-full">
                <span className="badge badge-green">Dental · Kathmandu</span>
                <blockquote className="font-serif-d text-2xl mt-6 text-pretty" style={{ lineHeight: 1.3 }}>
                  We stopped losing evening calls in the first week. Mornings now start
                  with a full calendar instead of a full voicemail.
                </blockquote>
                <figcaption className="flex items-center gap-3 mt-8">
                  <span className="w-10 h-10 rounded-lg bg-[#EDF3EC] grid place-items-center text-sm font-semibold text-[#346538]" aria-hidden>PS</span>
                  <span>
                    <span className="block text-sm font-semibold">Dr. Priya Sharma</span>
                    <span className="block text-sm text-[#787774]">Boudha Dental Care</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
            <Reveal delay={80}>
              <figure className="card-surface p-8 md:p-10 h-full">
                <span className="badge badge-blue">Family · Kochi</span>
                <blockquote className="font-serif-d text-2xl mt-6 text-pretty" style={{ lineHeight: 1.3 }}>
                  Double bookings dropped to zero. The agent respects each doctor calendar
                  better than our paper diary did.
                </blockquote>
                <figcaption className="flex items-center gap-3 mt-8">
                  <span className="w-10 h-10 rounded-lg bg-[#E1F3FE] grid place-items-center text-sm font-semibold text-[#1F6C9F]" aria-hidden>AM</span>
                  <span>
                    <span className="block text-sm font-semibold">Dr. Anjali Menon</span>
                    <span className="block text-sm text-[#787774]">Kochi Family Clinic</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          </div>
          <Reveal className="mt-8">
            <p className="card-surface p-6 flex items-center gap-3 text-base">
              <PhoneIncoming size={22} weight="fill" aria-hidden />
              <span className="text-pretty">Hear it yourself on a live demo call before you pay anything.</span>
              <Link href="#demo" className="ml-auto font-semibold underline-offset-4 hover:underline shrink-0">Book</Link>
            </p>
          </Reveal>
        </section>

        {/* ── FAQ: shadcn accordion strips ───────────── */}
        <section id="faq" className="mx-auto max-w-4xl px-6 py-24 md:py-32 scroll-mt-24">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.08em] text-[#787774]">FAQ</p>
            <h2 className="font-serif-d text-4xl md:text-5xl mt-4 text-balance" style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Questions clinics ask
            </h2>
          </Reveal>
          <Reveal className="mt-8">
            <Accordion type="single" collapsible>
              {FAQS.map((f, i) => (
                <AccordionItem key={f.q} value={`q${i}`}>
                  <AccordionTrigger className="text-base">
                    <span className="flex gap-4 items-baseline text-left">
                      <span className="font-mono text-xs text-[#787774]">{String(i + 1).padStart(2, '0')}</span>
                      {f.q}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-pretty">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        </section>

        {/* ── Final CTA + demo form ──────────────────── */}
        <section id="demo" className="mx-auto max-w-5xl px-6 py-24 md:py-32 scroll-mt-24">
          <div className="grid gap-12 md:grid-cols-2 items-start">
            <Reveal>
              <span className="badge badge-yellow">Live demo call</span>
              <h2 className="font-serif-d text-4xl md:text-5xl mt-4 text-balance" style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                Watch your calendar fill up on a live call
              </h2>
              <p className="text-base mt-6 text-pretty">
                Share your details and we will call at your preferred hour, then show
                HealthCall booking real visits into a test calendar while you listen.
              </p>
              <ul className="mt-8 space-y-3 text-base border-t divider pt-8 list-none">
                {['Free plan, no credit card', 'Cancel anytime', 'Your data stays in your clinic only'].map((t) => (
                  <li key={t} className="flex items-center gap-3">
                    <CheckCircle size={20} weight="fill" aria-hidden />
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={80}>
              <DemoForm />
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
