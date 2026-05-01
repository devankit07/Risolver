import { PageShell } from '@resolver/ui'

export default function Pricing() {
  return (
    <section className="px-6 py-24">
      <PageShell title="Pricing" subtitle="Plans and billing details will ship with beta — this section is a placeholder shell for now.">
        <div className="mt-12 rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-card)] p-10 text-[var(--text-secondary)]">
          <p>This page intentionally keeps scope small for now.</p>
          <p className="mt-4">
            Resolver will expose a hobby tier plus team pricing with SSO and audit-friendly exports aligned to how you operate incidents.
          </p>
        </div>
      </PageShell>
    </section>
  )
}
