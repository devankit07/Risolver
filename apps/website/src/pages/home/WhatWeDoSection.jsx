import { motion } from 'framer-motion'

const pillarCopy = [
  {
    icon: (
      <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.73-.157-1.423-.44-2.048M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.73.157-1.423.44-2.048m9.12 0a5.002 5.002 0 00-9.12 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    title: 'Team management',
    body: 'Organize responders, assign owners, and coordinate roles clearly during high-pressure incidents.',
  },
  {
    icon: (
      <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M9 12h6m-6 4h6M9 8h6m-8 13h10a2 2 0 002-2V7.5a2 2 0 00-.586-1.414l-3.5-3.5A2 2 0 0013.5 2H7a2 2 0 00-2 2v15a2 2 0 002 2z"
        />
      </svg>
    ),
    title: 'Postmortem reports',
    body: 'Generate clean incident timelines, root-cause summaries, and action-item reports for your team.',
  },
  {
    icon: (
      <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M12 9v3m0 4h.01M4.93 19h14.14a2 2 0 001.74-3L13.74 4a2 2 0 00-3.48 0L3.19 16a2 2 0 001.74 3z"
        />
      </svg>
    ),
    title: 'Incident create',
    body: 'Create incidents instantly with severity, impacted services, and owner assignment in one flow.',
  },
  {
    icon: (
      <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M9.75 3h4.5M12 3v3m-6.5 4.5h13A2.5 2.5 0 0121 13v4.5A2.5 2.5 0 0118.5 20h-13A2.5 2.5 0 013 17.5V13a2.5 2.5 0 012.5-2.5zM7.5 15h.01M16.5 15h.01"
        />
      </svg>
    ),
    title: 'AI suggestions',
    body: 'AI analyzes the problem, scans likely code files, and returns practical fix suggestions quickly.',
  },
]

export default function WhatWeDoSection() {
  return (
    <section className="relative flex min-h-screen items-center bg-white px-6 py-24">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600">
            What we do
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            Everything your team needs when things go wrong
          </h2>
          <p className="mt-4 text-base text-slate-600 md:text-lg">
            Resolver combines incident operations, team workflows, and AI help into one reliable SaaS workspace.
          </p>
        </div>
        <motion.ul
          className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          {pillarCopy.map((p) => (
            <motion.li key={p.title} variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}>
              <article className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(15,23,42,0.12)]">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  {p.icon}
                </span>
                <h3 className="mt-5 text-2xl font-semibold tracking-tight text-slate-900">{p.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-slate-600">{p.body}</p>
              </article>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
