import { Check, ComparisonTable, Cross, FaqAccordion } from '@resolver/ui'
import { motion } from 'framer-motion'

const pros = [
  {
    title: 'AI-native from day one',
    body: 'Resolver ships with built-in AI triage, not bolted-on. Every incident gets summarised and suggested fixes in seconds.',
  },
  {
    title: "Free tier that's actually usable",
    body: 'Start resolving real incidents today — no trial expiry, no mandatory credit card, no feature gating on core workflows.',
  },
  {
    title: 'All-in-one platform',
    body: 'Incidents, postmortems, public status, team management, and AI suggestions in one workspace — not seven tabs.',
  },
  {
    title: 'Postmortems auto-drafted',
    body: 'Resolver writes the first draft of the postmortem automatically from the incident timeline so your team can ship faster.',
  },
]

const cons = [
  {
    title: 'Still in early beta',
    body: 'Some enterprise integrations (e.g. ServiceNow, Jira, DataDog) are on the roadmap but not yet shipped.',
  },
  {
    title: 'Ecosystem is growing',
    body: 'Larger incumbents have more third-party connectors. Resolver\'s plugin marketplace is actively expanding.',
  },
  {
    title: 'No mobile app yet',
    body: 'The web experience is mobile-responsive, but a dedicated iOS / Android app is planned for the next major release.',
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.35, delay: i * 0.1 } }),
}

const faqs = [
  {
    q: 'Is Resolver only for large companies?',
    a: 'No. Resolver is designed for both startups and enterprise teams. You can start with a small team and scale roles, workflows, and automation as you grow.',
  },
  {
    q: 'How fast can our team go live?',
    a: 'Most teams can go live in minutes. Create your workspace, invite members, configure severity levels, and start incident handling immediately.',
  },
  {
    q: 'Do testers and non-engineers also use Resolver?',
    a: 'Yes. Testers can report incidents, managers can assign responders, and stakeholders can follow updates without jumping through technical tools.',
  },
  {
    q: 'What makes Resolver different from using multiple separate tools?',
    a: 'Resolver unifies incident reporting, team assignment, AI triage, postmortems, and status communication in one flow. Less context switching, better response quality.',
  },
  {
    q: 'Can we publish public incident updates?',
    a: 'Yes. Managers can publish updates to a public status view, so customers stay informed without needing internal access.',
  },
]

export default function ComparisonSection() {
  return (
    <>
      {/* Comparison table */}
      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <motion.div
            className="mb-14 text-center"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <motion.p
              className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600"
              initial={{ scale: 0.88, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35 }}
            >
              Compare
            </motion.p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
              How Resolver stacks up
            </h2>
            <p className="mt-4 text-base text-slate-600">
              Side-by-side against the most popular incident tools on the market.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45 }}
          >
            <ComparisonTable
              rows={[
                {
                  label: 'Price',
                  resolver: 'Free tier + simple paid plans',
                  pagerduty: 'Enterprise-first, higher cost',
                  opsgenie: 'Premium pricing, no free tier',
                  statuspage: 'Seat-based with add-on costs',
                },
                { label: 'AI triage + suggestions', resolver: <Check />, pagerduty: 'Add-ons', opsgenie: 'Limited', statuspage: <Cross /> },
                { label: 'Postmortem generation', resolver: <Check />, pagerduty: 'Mostly manual', opsgenie: 'Manual', statuspage: 'Template only' },
                { label: 'Public status page', resolver: <Check />, pagerduty: 'Separate module', opsgenie: <Cross />, statuspage: 'Possible via Atlassian stack' },
                { label: 'Incident-native UX', resolver: <Check />, pagerduty: <Check />, opsgenie: <Check />, statuspage: 'Project-management first' },
                { label: 'Real-time collaboration', resolver: <Check />, pagerduty: 'Partial', opsgenie: 'Strong Slack workflow', statuspage: 'Comments + updates' },
              ]}
            />
          </motion.div>
        </div>
      </section>

      {/* Pros / Cons */}
      <section className="bg-slate-50 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <motion.div
            className="mb-14 text-center"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <motion.p
              className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600"
              initial={{ scale: 0.88, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35 }}
            >
              Pros &amp; Cons
            </motion.p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
              Honest breakdown of Resolver
            </h2>
            <p className="mt-4 text-base text-slate-600">
              We believe in transparency. Here's what Resolver does brilliantly — and what we're still building.
            </p>
          </motion.div>

          <div className="grid gap-12 lg:grid-cols-2">
            {/* Pros */}
            <div>
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <h3 className="text-xl font-semibold text-slate-900">What we do well</h3>
              </div>
              <ul className="space-y-4">
                {pros.map((p, i) => (
                  <motion.li
                    key={p.title}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-40px' }}
                  >
                    <div className="flex gap-4 rounded-2xl border border-emerald-100 bg-white p-5 shadow-[0_6px_24px_rgba(16,185,129,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_32px_rgba(16,185,129,0.14)]">
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-semibold text-slate-900">{p.title}</p>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600">{p.body}</p>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Cons */}
            <div>
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-500">
                  <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </span>
                <h3 className="text-xl font-semibold text-slate-900">What we're still building</h3>
              </div>
              <ul className="space-y-4">
                {cons.map((c, i) => (
                  <motion.li
                    key={c.title}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-40px' }}
                  >
                    <div className="flex gap-4 rounded-2xl border border-rose-100 bg-white p-5 shadow-[0_6px_24px_rgba(239,68,68,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_32px_rgba(239,68,68,0.12)]">
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-400 text-xs font-bold text-white">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-semibold text-slate-900">{c.title}</p>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600">{c.body}</p>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
              <motion.div
                className="mt-6 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-white p-5"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white">
                    <svg className="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 3L4 14h7l-1 7 10-12h-7l0-6z" />
                    </svg>
                  </span>
                  <p className="text-sm leading-relaxed text-slate-700">
                    We ship fast, so most of these gaps close quickly. Follow our{' '}
                    <a
                      href="/docs"
                      className="font-semibold text-indigo-600 decoration-indigo-300 underline-offset-4 hover:underline hover:text-indigo-700"
                    >
                      product roadmap
                    </a>{' '}
                    for the latest updates.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FaqAccordion
        badge="FAQ"
        title="Questions teams ask before switching"
        subtitle="Common concerns answered clearly, so your team can move from tool-sprawl to one focused incident workspace."
        items={faqs}
      />
    </>
  )
}
