import { motion } from 'framer-motion'

const workflowSteps = [
  {
    icon: 'building',
    role: 'Admin / CEO',
    title: 'Organization register (Admin / CEO)',
    description: 'Admin or CEO creates the organization, sets base roles, and initializes the incident workspace.',
  },
  {
    icon: 'users',
    role: 'Manager',
    title: 'Manager invites team',
    description: 'Manager invites team members across engineering, QA, DevOps, and product into the organization.',
  },
  {
    icon: 'bug',
    role: 'Tester',
    title: 'Tester reports product/project issue',
    description: 'When a bug or outage appears, tester files the incident with context, severity, and impact details.',
  },
  {
    icon: 'route',
    role: 'Manager',
    title: 'Incident escalates to manager',
    description: 'Manager reviews the report, confirms ownership, and starts a coordinated incident response flow.',
  },
  {
    icon: 'assign',
    role: 'Manager',
    title: 'Manager assigns responders',
    description: 'Manager assigns members from team/dev/devops and sets priorities, timelines, and checkpoints.',
  },
  {
    icon: 'ai',
    role: 'Team / Dev / DevOps + AI',
    title: 'Members solve with AI support',
    description: 'AI generates issue summary, probable solutions, code-file analysis, and re-verification guidance.',
  },
  {
    icon: 'report',
    role: 'Manager + Tester',
    title: 'Postmortem + manager approval + public report',
    description:
      'Resolver drafts postmortem, manager reviews and asks tester to validate fixes, then publishes final public incident announcement.',
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-white px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600">
            Platform Workflow
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            How Resolver Works (End-to-End)
          </h2>
          <p className="mt-4 text-base text-slate-600 md:text-lg">
            From organization setup to final public incident announcement.
          </p>
        </div>
        <div className="relative mx-auto mt-20 max-w-5xl">
          <motion.div
            className="absolute bottom-8 left-6 top-8 w-[3px] origin-top rounded-full bg-gradient-to-b from-indigo-500 via-sky-400 to-cyan-400 md:left-1/2 md:-translate-x-1/2"
            initial={{ scaleY: 0, opacity: 0.3 }}
            whileInView={{ scaleY: 1, opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />

          <ol className="space-y-14">
            {workflowSteps.map((step, idx) => (
              <motion.li
                key={step.title}
                className={[
                  'relative grid items-center gap-6 pl-16 md:grid-cols-[1fr_96px_1fr] md:pl-0',
                  idx % 2 === 0 ? '' : 'md:[&_.workflow-card]:col-start-3 md:[&_.workflow-icon]:col-start-1',
                ].join(' ')}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
              >
                <div className="workflow-card rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-[0_14px_40px_rgba(15,23,42,0.08)] md:col-start-1">
                  <p className="mb-2 inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                    {step.role}
                  </p>
                  <h3 className="text-xl font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.description}</p>
                </div>
                <div className="absolute left-0 top-4 z-10 md:static md:col-start-2 md:row-start-1 md:flex md:justify-center">
                  <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-indigo-600 text-sm font-bold text-white shadow-lg">
                    {idx + 1}
                  </span>
                </div>
                <div className="workflow-icon hidden md:col-start-3 md:row-start-1 md:flex md:items-center md:justify-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-slate-200 bg-slate-50 text-indigo-600 shadow-sm">
                    <WorkflowIcon name={step.icon} />
                  </div>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

function WorkflowIcon({ name }) {
  const common = 'size-11'
  if (name === 'building') {
    return (
      <svg className={common} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M4 21V5a2 2 0 012-2h8a2 2 0 012 2v16M8 7h4M8 11h4M8 15h4M18 9h1a1 1 0 011 1v11" />
      </svg>
    )
  }
  if (name === 'users') {
    return (
      <svg className={common} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M17 20h5v-2a3 3 0 00-5.356-1.857M9 20H4v-2a3 3 0 015.356-1.857M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  }
  if (name === 'bug') {
    return (
      <svg className={common} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M8 8h8m-8 4h8m-7 8h6a4 4 0 004-4v-5a7 7 0 10-14 0v5a4 4 0 004 4zM4 13H2m20 0h-2M6 6L4.5 4.5M18 6l1.5-1.5" />
      </svg>
    )
  }
  if (name === 'route') {
    return (
      <svg className={common} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M6 18h.01M18 6h.01M6 18C6 9 18 15 18 6M6 18a2 2 0 100 4 2 2 0 000-4zM18 2a2 2 0 100 4 2 2 0 000-4z" />
      </svg>
    )
  }
  if (name === 'assign') {
    return (
      <svg className={common} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M9 12l2 2 4-4M7 4h10a2 2 0 012 2v14l-7-3-7 3V6a2 2 0 012-2z" />
      </svg>
    )
  }
  if (name === 'ai') {
    return (
      <svg className={common} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M12 3v3m-5 4h10a3 3 0 013 3v4a3 3 0 01-3 3H7a3 3 0 01-3-3v-4a3 3 0 013-3zm2 5h.01M15 15h.01" />
      </svg>
    )
  }
  return (
    <svg className={common} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M9 12h6m-6 4h6M5 4h14v16H5z" />
    </svg>
  )
}
