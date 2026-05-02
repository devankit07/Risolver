import { motion } from 'framer-motion'
import { FaqAccordion, OrbitCta } from '@resolver/ui'

/* ── fade-up helper ── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.45, delay },
})

/* ── team data ── */
const team = [
  {
    initials: 'AK',
    name: 'Ankit',
    role: 'Full-Stack Engineer · Team Lead',
    tag: 'Leader',
    tagColor: 'bg-indigo-600',
    bio: 'Architected the entire Resolver platform end-to-end — from real-time incident timelines to role-based access and AI integration pipelines. Drives every major technical decision.',
    skills: ['System Design', 'Node.js', 'React', 'Socket.IO', 'MongoDB'],
    avatarBg: 'from-indigo-500 to-indigo-700',
  },
  {
    initials: 'AB',
    name: 'Abhishek',
    role: 'Frontend Engineer · UI Pillar',
    tag: 'Frontend',
    tagColor: 'bg-violet-600',
    bio: 'Owns every pixel of the Resolver interface — dashboard UX, incident flows, public status page, and the design system that keeps everything consistent.',
    skills: ['React', 'TailwindCSS', 'Framer Motion', 'Vite', 'Design Systems'],
    avatarBg: 'from-violet-500 to-violet-700',
  },
  {
    initials: 'MB',
    name: 'Mohammad Bilal',
    role: 'Backend Engineer · API Pillar',
    tag: 'Backend',
    tagColor: 'bg-sky-600',
    bio: 'Built the entire backend infrastructure — REST APIs, WebSocket server, MongoDB schemas, JWT auth, and the AI triage pipeline that powers Resolver\'s intelligence.',
    skills: ['Node.js', 'Express', 'MongoDB', 'Socket.IO', 'REST APIs'],
    avatarBg: 'from-sky-500 to-sky-700',
  },
  {
    initials: 'RJ',
    name: 'Rijvan',
    role: 'QA Engineer · Quality Pillar',
    tag: 'QA',
    tagColor: 'bg-emerald-600',
    bio: 'Ensures Resolver never breaks when it matters most. Designs test plans, catches edge cases across incident flows, and validates every release before it reaches users.',
    skills: ['Manual Testing', 'QA Strategy', 'Bug Triage', 'User Flows', 'Documentation'],
    avatarBg: 'from-emerald-500 to-emerald-700',
  },
]

/* ── problems we faced ── */
const problems = [
  {
    icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    title: 'Chaos in the middle of a crisis',
    body: 'When something broke, the team scattered across Slack threads, emails, and spreadsheets. Nobody knew who was doing what — or if it was even being handled.',
  },
  {
    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
    title: 'No shared context for the team',
    body: 'Developers had logs, managers had tickets, testers had bug reports — but none of it was connected. Context was lost between every handoff.',
  },
  {
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    title: 'Postmortems never happened',
    body: 'Writing a postmortem after resolving an incident felt like double the work. So they just never got written — and the same failures kept repeating.',
  },
  {
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    title: 'AI was nowhere to be found',
    body: 'Existing tools had no intelligence. You still had to manually dig through logs, guess root causes, and figure out next steps on your own every single time.',
  },
]

/* ── why us, not others ── */
const whyUs = [
  {
    label: 'Built for the full lifecycle',
    body: 'From "something broke" to published postmortem — Resolver handles every step in one place.',
  },
  {
    label: 'AI is core, not a feature',
    body: 'We didn\'t bolt AI on. Every incident gets immediate triage, code-file analysis, and solution suggestions out of the box.',
  },
  {
    label: 'Roles that match real teams',
    body: 'CEO, Manager, Developer, Tester — each person has the exact view and permissions they need. Nothing more, nothing less.',
  },
  {
    label: 'No tool-sprawl',
    body: 'PagerDuty + Jira + Confluence + Statuspage = four bills, four logins. Resolver replaces all of it.',
  },
]

export default function About() {
  const faqs = [
    {
      q: 'Who should use Resolver?',
      a: 'Resolver is built for engineering teams, QA teams, managers, and founders who need one clear workflow during incidents.',
    },
    {
      q: 'Do we need separate tools for status updates and postmortems?',
      a: 'No. Resolver includes incident flow, responder assignment, AI triage, postmortems, and status communication in one platform.',
    },
    {
      q: 'Can non-technical team members use Resolver?',
      a: 'Yes. Testers and managers can report, track, and review incidents without complex setup or engineering-only workflows.',
    },
    {
      q: 'Is Resolver suitable for small teams?',
      a: 'Yes. Small teams can start lightweight, and as they grow, Resolver scales with role-based access and stronger operational flows.',
    },
  ]

  return (
    <div className="bg-white">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-white px-6 pb-0 pt-24">
        {/* subtle noise grid */}
        <div className="pointer-events-none absolute inset-0 opacity-80"
          style={{
            backgroundImage: 'linear-gradient(to right,rgba(99,102,241,0.13) 1px,transparent 1px),linear-gradient(to bottom,rgba(99,102,241,0.13) 1px,transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />
        {/* glow blobs */}
        <div className="pointer-events-none absolute -left-28 top-12 h-[420px] w-[420px] rounded-full bg-indigo-100/70 blur-[96px]" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-[340px] w-[340px] rounded-full bg-sky-100/60 blur-[80px]" />

        <div className="relative mx-auto max-w-6xl">
          {/* top row: label + tagline */}
          <div className="grid items-end gap-8 pb-16 pt-8 lg:grid-cols-[1fr_420px]">
            <div>
              <motion.span
                className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600"
                {...fadeUp(0)}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                About Resolver
              </motion.span>
              <motion.h1
                className="mt-6 text-[clamp(2.6rem,6vw,5rem)] font-semibold leading-[1.0] tracking-tight text-slate-900 [font-family:Georgia,'Times_New_Roman',serif]"
                {...fadeUp(0.07)}
              >
                We got tired of
                <br />
                the <span className="italic text-indigo-400">chaos.</span>
                <br />
                So we fixed it.
              </motion.h1>
              <motion.p className="mt-6 max-w-lg text-base leading-relaxed text-slate-600" {...fadeUp(0.13)}>
                Four engineers. One mission — build the incident platform we always wished existed. No more Slack threads, no more lost context, no more postmortems that never get written.
              </motion.p>
            </div>

            {/* right: stacked team avatars + stats */}
            <motion.div
              className="flex flex-col gap-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
            >
              {/* avatar cluster */}
              <div className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">The builders</p>
                <div className="space-y-3">
                  {team.map((m) => (
                    <div key={m.name} className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${m.avatarBg} text-xs font-bold text-white`}>
                        {m.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900">{m.name}</p>
                        <p className="truncate text-[11px] text-slate-500">{m.role.split('·')[0].trim()}</p>
                      </div>
                      <span className={`ml-auto shrink-0 rounded-full ${m.tagColor} px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white`}>
                        {m.tag}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3 stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: '4', label: 'Builders' },
                  { value: '1', label: 'Platform' },
                  { value: '0', label: 'Downtime chaos' },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-3 text-center shadow-sm">
                    <p className="text-2xl font-bold text-indigo-400">{s.value}</p>
                    <p className="mt-0.5 text-[10px] text-slate-500">{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* ── PROBLEMS WE FACED ── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <motion.div className="mb-14 text-center" {...fadeUp()}>
            <p className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-rose-600">
              The problem
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
              What we lived through
            </h2>
            <p className="mt-4 text-base text-slate-600">
              Before Resolver existed, every incident looked the same — painful, fragmented, and exhausting.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            {problems.map((p, i) => (
              <motion.div
                key={p.title}
                {...fadeUp(i * 0.08)}
                className="flex gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
                  <svg className="size-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={p.icon} />
                  </svg>
                </span>
                <div>
                  <p className="font-semibold text-slate-900">{p.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION QUOTE ── */}
      <section className="bg-slate-50 px-6 py-24">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:gap-20">
          <motion.blockquote
            className="text-3xl font-semibold leading-snug tracking-tight text-slate-900 [font-family:Georgia,'Times_New_Roman',serif] md:text-4xl"
            {...fadeUp()}
          >
            &ldquo;Every minute of downtime costs money and trust. We built Resolver to give teams the clarity they need when systems fail.&rdquo;
            <footer className="mt-6 text-base font-normal text-slate-500 not-italic" style={{ fontFamily: 'Inter, sans-serif' }}>
              — Ankit, Team Lead
            </footer>
          </motion.blockquote>

          <motion.div {...fadeUp(0.1)} className="flex flex-col justify-center gap-4">
            <p className="text-lg leading-relaxed text-slate-600">
              Incident response tooling often fragments across alerting, ticketing, status pages, and docs. We lived that frustration firsthand.
            </p>
            <p className="text-lg leading-relaxed text-slate-600">
              Resolver unifies timelines, responders, AI context, and postmortems so your team communicates with confidence — not across a dozen tabs — when customers are impacted.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── WHY WE BUILT THIS ── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <motion.div className="mb-14 text-center" {...fadeUp()}>
            <p className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600">
              Why Resolver
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
              Why we built this, not something else
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-base text-slate-600">
              We looked at every existing tool. None of them solved the whole problem. So we did.
            </p>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-2">
            {whyUs.map((w, i) => (
              <motion.div
                key={w.label}
                {...fadeUp(i * 0.07)}
                className="flex gap-4 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6 transition hover:bg-indigo-50"
              >
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold text-slate-900">{w.label}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{w.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="bg-slate-50 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <motion.div className="mb-14 text-center" {...fadeUp()}>
            <p className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">
              The team
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
              The people behind Resolver
            </h2>
            <p className="mt-4 text-base text-slate-600">
              Four builders. One mission. Zero tolerance for downtime chaos.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            {team.map((m, i) => (
              <motion.div
                key={m.name}
                {...fadeUp(i * 0.09)}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.1)]"
              >
                {/* top image placeholder strip */}
                <div className={`relative h-36 bg-gradient-to-br ${m.avatarBg} flex items-center justify-center overflow-hidden`}>
                  {/* placeholder for photo */}
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white/30 bg-white/20 text-3xl font-bold text-white">
                    {m.initials}
                  </div>
                  <span className="absolute bottom-3 right-3 text-[10px] font-medium text-white/60">Photo coming soon</span>
                  <span className={`absolute left-4 top-4 rounded-full ${m.tagColor} px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white`}>
                    {m.tag}
                  </span>
                </div>

                <div className="p-6">
                  <p className="text-xl font-semibold text-slate-900">{m.name}</p>
                  <p className="mt-0.5 text-sm font-medium text-indigo-600">{m.role}</p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{m.bio}</p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {m.skills.map((s) => (
                      <span key={s} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <FaqAccordion
        badge="FAQ"
        title="Frequently asked questions"
        subtitle="Quick answers about how Resolver fits teams, workflows, and incident operations."
        items={faqs}
      />

      {/* ── REUSE CTA (same as home) ── */}
      <OrbitCta
        badge="Get Started"
        title="Ready to transform your incident management?"
        description="From incident reporting to AI-backed resolution and postmortems, Resolver keeps your team aligned end-to-end."
        primaryLabel="Start free"
        primaryTo="/pricing"
      />

    </div>
  )
}
