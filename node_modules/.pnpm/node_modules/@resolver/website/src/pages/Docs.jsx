import { DOC_NAV_SECTIONS } from '@resolver/ui'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
/* ─── callout primitives ─── */
function Tip({ children }) {
  return (
    <aside className="my-6 flex gap-3 rounded-xl border border-indigo-100 bg-indigo-50 px-5 py-4">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white">i</span>
      <div className="text-sm leading-relaxed text-slate-700 [&_strong]:font-semibold [&_strong]:text-slate-900">{children}</div>
    </aside>
  )
}

function Warning({ children }) {
  return (
    <aside className="my-6 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-400 text-[10px] font-bold text-white">!</span>
      <div className="text-sm leading-relaxed text-slate-700 [&_strong]:font-semibold [&_strong]:text-slate-900">{children}</div>
    </aside>
  )
}

function CodeBlock({ code, lang = 'bash' }) {
  const langClass =
    lang === 'json' ? 'language-json' : lang === 'javascript' ? 'language-javascript' : 'language-bash'
  return (
    <pre className="my-5 overflow-x-auto rounded-xl border border-slate-800 bg-[#0f1117] p-4 text-[13px] leading-relaxed text-slate-100 shadow-sm">
      <code className={langClass}>{code.trim()}</code>
    </pre>
  )
}

function StepBadge({ n }) {
  return (
    <span className="mr-2 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-bold text-white">
      {n}
    </span>
  )
}

const flatDocs = DOC_NAV_SECTIONS.flatMap((g) => g.items)

export default function Docs() {
  useEffect(() => {
    queueMicrotask(() => {
      if (typeof window !== 'undefined' && window.Prism) window.Prism.highlightAll()
    })
  }, [])

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="pb-0"
    >
      {/* mobile jump nav */}
      <label className="mb-8 block md:hidden">
        <span className="mb-2 block text-xs font-medium text-slate-500">Jump to section</span>
        <select
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 shadow-sm"
          defaultValue=""
          onChange={(e) => {
            const id = e.target.value
            if (!id) return
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            e.target.value = ''
          }}
        >
          <option value="">Select a topic…</option>
          {flatDocs.map(({ id, title }) => (
            <option key={id} value={id}>{title}</option>
          ))}
        </select>
      </label>

      {/* ── page hero ── */}
      <header className="mb-12 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-white px-8 py-10 shadow-sm">
        <motion.p
          className="inline-flex items-center rounded-full border border-indigo-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          Documentation
        </motion.p>
        <h1 id="resolver-docs-intro" className="mt-4 scroll-mt-28 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
          Resolver — Complete Guide
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
          Everything you need to set up your organisation, respond to incidents fast, leverage AI triage, and publish automated postmortems — end to end.
        </p>

        {/* quick jump chips */}
        <div className="mt-6 flex flex-wrap gap-2">
          {DOC_NAV_SECTIONS.map((g) => (
            <a
              key={g.section}
              href={`#${g.items[0].id}`}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
            >
              {g.section}
            </a>
          ))}
        </div>
      </header>

      {/* ── GETTING STARTED ── */}
      <DocSection
        id="what-is-resolver"
        badge="Getting started"
        title="What is Resolver?"
        intro="Resolver is a smart incident response platform — a single pane of glass for timelines, real-time collaboration, automated triage, and post-incident summaries."
      >
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { icon: 'M13 10V3L4 14h7v7l9-11h-7z', title: 'Instant triage', body: 'AI analyses every new incident in seconds — no manual scanning.' },
            { icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', title: 'Team aligned', body: 'Responders, managers, and testers all work in one shared workspace.' },
            { icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', title: 'Auto postmortems', body: 'Incident timelines compile into draft postmortems automatically.' },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                </svg>
              </span>
              <p className="mt-3 text-sm font-semibold text-slate-800">{f.title}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-slate-600">{f.body}</p>
            </div>
          ))}
        </div>
        <Tip>
          <strong>Operational clarity</strong> beats chat scrollback. Resolver centralises chatter, timelines, assignments, and final incident artifacts.
        </Tip>
      </DocSection>

      <DocSection
        id="quick-start"
        title="Quick start"
        intro="Resolver is fully cloud-hosted — no installation required. You're up and resolving incidents in under 5 minutes."
      >
        <ol className="mt-4 space-y-4">
          {[
            { label: 'Sign up', body: 'Create a free account at resolver.io — no credit card needed.' },
            { label: 'Create your organisation', body: 'Name your workspace. Your organisation slug powers your public status URL.' },
            { label: 'Invite your team', body: 'Add managers, responders, and testers via email. Roles are pre-configured.' },
            { label: 'Create your first incident', body: 'Use the dashboard, API, or CLI wrapper. AI triage kicks in automatically.' },
          ].map((s, i) => (
            <li key={s.label} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <StepBadge n={i + 1} />
              <div>
                <p className="text-sm font-semibold text-slate-800">{s.label}</p>
                <p className="mt-0.5 text-[13px] text-slate-600">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <Tip>
          <strong>No DevOps needed.</strong> Resolver handles infrastructure, scaling, and security — your team only needs a browser.
        </Tip>
      </DocSection>

      <DocSection
        id="create-organisation"
        title="Create your organisation"
        intro="Organisations in Resolver encapsulate your team, escalation policies, AI configuration, and public status page — all under one workspace."
      >
        <ol className="mt-4 space-y-4">
          {[
            { label: 'Create account', body: 'Sign up via the Pricing page — free tier is available immediately.' },
            { label: 'Name your workspace', body: 'Your slug powers your public status URL: status.your-org.resolver.dev.' },
            { label: 'Add administrators', body: 'Go to Settings → Members and invite admins via email with pre-scoped roles.' },
            { label: 'Configure escalation policy', body: 'Define who gets paged for each severity level in the On-call settings.' },
          ].map((s, i) => (
            <li key={s.label} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <StepBadge n={i + 1} />
              <div>
                <p className="text-sm font-semibold text-slate-800">{s.label}</p>
                <p className="mt-0.5 text-[13px] text-slate-600">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <Tip>Use separate staging organisations to test escalation policy changes before promoting them to production.</Tip>
      </DocSection>

      {/* ── INCIDENTS ── */}
      <DocSection
        id="creating-an-incident"
        badge="Incidents"
        title="Creating an incident"
        intro="Any team member can raise an incident from the dashboard in seconds — testers, developers, or managers. Resolver structures it automatically."
      >
        <ol className="mt-4 space-y-4">
          {[
            { label: 'Open dashboard', body: 'Click "New Incident" from your workspace home or the Incidents tab.' },
            { label: 'Fill in details', body: 'Set a title, severity (P1–P4), affected service, and a short description.' },
            { label: 'Submit', body: 'Resolver creates the incident, seeds the timeline, and triggers AI triage immediately.' },
            { label: 'Escalate', body: 'The incident appears in the manager\'s queue for assignment and action.' },
          ].map((s, i) => (
            <li key={s.label} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <StepBadge n={i + 1} />
              <div>
                <p className="text-sm font-semibold text-slate-800">{s.label}</p>
                <p className="mt-0.5 text-[13px] text-slate-600">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <Tip>
          <strong>Tester workflow:</strong> Testers report product or project issues directly — the manager is notified immediately and can escalate to the right team.
        </Tip>
      </DocSection>

      <DocSection
        id="managing-incidents"
        title="Managing incidents"
        intro="Commanders shepherd incidents through acknowledging, mitigation, communicating, resolving, then postmortem phases — all tracked on the real-time canvas."
      >
        <ul className="mt-4 space-y-3">
          {[
            'Pin SLA timers and escalate when thresholds lapse.',
            'Attach customer threads, Grafana snapshots, Slack exports for historical playback.',
            'Close incidents only after Resolver validates required fields (timeline links, RCA owner, remediation tasks).',
          ].map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
              {s}
            </li>
          ))}
        </ul>
      </DocSection>

      <DocSection
        id="assigning-responders"
        title="Assigning responders"
        intro="Managers assign responders directly from the incident dashboard. Notifications hit web, email, and mobile simultaneously."
      >
        <ul className="mt-4 space-y-3">
          {[
            'Open the incident and click "Assign" — search by name or team from your member list.',
            'Resolver pings all assigned members in real-time, recording acknowledgement timestamps alongside AI notes.',
            'Swap the primary commander at any time — the full assignment history is immutably preserved in the audit log.',
            'Set on-call rotations in Settings so Resolver auto-assigns the right person by shift.',
          ].map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
              {s}
            </li>
          ))}
        </ul>
      </DocSection>

      <DocSection
        id="live-updates"
        title="Live updates"
        intro="Every action in an incident — messages, assignments, AI suggestions, status changes — is pushed to all participants in real time. No refreshing."
      >
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            { title: 'Real-time timeline', body: 'Every event appears instantly for all team members watching the incident.' },
            { title: 'Presence indicators', body: 'See who is actively viewing and responding to the incident right now.' },
            { title: 'AI suggestion push', body: 'AI triage results stream in as they complete — no polling needed.' },
            { title: 'Status broadcasts', body: 'Status page updates propagate to subscribers the moment a manager publishes.' },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-800">{f.title}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-slate-600">{f.body}</p>
            </div>
          ))}
        </div>
        <Tip>
          Live updates work entirely in your browser — no plugins, extensions, or configuration required.
        </Tip>
      </DocSection>

      {/* ── AI FEATURES ── */}
      <DocSection
        id="incident-triage"
        badge="AI features"
        title="Incident triage"
        intro="During triage, Resolver AI merges structured logs plus plain-language operator notes — highlighting hotspots, cascading dependencies, mitigation candidates."
      >
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            { title: 'Root-cause hints', body: 'Surfaces the most probable cause ranked by historical fingerprint similarity.' },
            { title: 'One-click approve', body: 'Accept or discard AI-derived hypotheses to train future summaries.' },
            { title: 'Timeline pinning', body: 'Accepted suggestions are pinned back into the timeline for auditors.' },
            { title: 'Tenant isolation', body: 'All inference runs inside your tenant boundary — no cross-org data leakage.' },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-800">{f.title}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-slate-600">{f.body}</p>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection
        id="ai-suggestions"
        title="AI suggestions"
        intro="Suggestions pull from embeddings of past incidents plus live telemetry — prioritising fixes already proven successful for similar fingerprints."
      >
        <Tip>Tag suggestions Resolver applied successfully — they fuel reinforcement signals for customised models locked to each tenant boundary.</Tip>
      </DocSection>

      <DocSection
        id="postmortem-generation"
        title="Postmortem generation"
        intro="When stabilisation concludes, Resolver stitches timelines, hypotheses, and corrective actions into draft postmortems ready for Markdown or PDF export."
      >
        <ol className="mt-4 space-y-3">
          {[
            'Prompt Resolver for a five-whys scaffolding based on annotated timeline entries.',
            'Assign owners for follow-ups with SLA timers mirrored from project trackers.',
            'Manager reviews the draft and publishes to the public status page with one click.',
          ].map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
              <StepBadge n={i + 1} />
              <span>{s}</span>
            </li>
          ))}
        </ol>
      </DocSection>

      {/* ── ROLES ── */}
      <DocSection
        id="roles-permissions"
        badge="Roles & permissions"
        title="Roles & permissions"
        intro="Resolver ships opinionated primitives — OWNER, ADMIN, RESPONDER, VIEWER — with optional granular overrides layered through policy JSON."
      >
        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[480px] text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                {['Role', 'Create incident', 'Assign members', 'Approve postmortem', 'Publish status'].map((h) => (
                  <th key={h} className="px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { role: 'Owner', perms: [true, true, true, true] },
                { role: 'Admin', perms: [true, true, true, true] },
                { role: 'Responder', perms: [true, true, false, false] },
                { role: 'Viewer', perms: [false, false, false, false] },
              ].map((r) => (
                <tr key={r.role} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{r.role}</td>
                  {r.perms.map((p, i) => (
                    <td key={i} className="px-4 py-3">
                      {p
                        ? <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Yes</span>
                        : <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400"><span className="h-1.5 w-1.5 rounded-full bg-slate-300" />No</span>
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Tip>Integrate SSO group mapping so HR-driven role changes cascade automatically nightly.</Tip>
      </DocSection>

      {/* ── PUBLIC STATUS ── */}
      <DocSection
        id="public-status-page"
        badge="Public status page"
        title="Public status page"
        intro="Incident visibility extends to authenticated-free status surfaces — customers see curated updates without Resolver accounts."
      >
        <ul className="mt-4 space-y-3">
          {[
            'Expose component health dashboards mirroring Prometheus or vendor probes.',
            'Subscribe visitors to Resolver-hosted email alerts when states flip.',
            'Manager publishes final incident resolution with a public announce report.',
          ].map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
              {s}
            </li>
          ))}
        </ul>
      </DocSection>

    </motion.article>
  )
}

/* ─── Section wrapper ─── */
function DocSection({ id, badge, title, intro, children }) {
  return (
    <section id={id} className="scroll-mt-24 py-10 [&+section]:border-t [&+section]:border-slate-100">
      {badge && (
        <span className="mb-3 inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-600">
          {badge}
        </span>
      )}
      <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">{title}</h2>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-slate-600">{intro}</p>
      {children && <div className="mt-6">{children}</div>}
    </section>
  )
}
