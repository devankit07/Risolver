import { Button, PageShell } from '@resolver/ui'

export default function Contact() {
  return (
    <section className="px-6 py-24">
      <PageShell title="Contact" subtitle="Placeholder contact shell — wiring to email or ticketing can land in your next sprint.">
        <form
          className="mx-auto mt-12 max-w-lg space-y-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-8"
          onSubmit={(e) => e.preventDefault()}
        >
          <label className="block">
            <span className="text-sm font-medium text-[var(--text-primary)]">Name</span>
            <input className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--border-hover)]" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-[var(--text-primary)]">Work email</span>
            <input type="email" className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--border-hover)]" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-[var(--text-primary)]">Message</span>
            <textarea rows={5} className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--border-hover)]" />
          </label>
          <Button variant="primary" type="submit" className="w-full">
            Submit (placeholder)
          </Button>
        </form>
      </PageShell>
    </section>
  )
}
