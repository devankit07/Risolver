/** Shared hero background + container for Contact, Pricing, and similar pages */
export function MarketingPageBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_8%,#eef1ff_0%,#f8f9ff_44%,#ffffff_100%)]" />
      <div
        className="absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            'linear-gradient(to right,rgba(99,102,241,0.13) 1px,transparent 1px),linear-gradient(to bottom,rgba(99,102,241,0.13) 1px,transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />
      <div className="absolute -left-24 top-20 h-80 w-80 rounded-full bg-indigo-100/60 blur-3xl" />
      <div className="absolute -right-16 top-28 h-72 w-72 rounded-full bg-sky-100/60 blur-3xl" />
    </div>
  )
}

export function MarketingPageShell({ children, maxWidthClass = 'max-w-7xl' }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white px-6 pb-24 pt-32 md:pt-40">
      <MarketingPageBackground />
      <div className={`relative z-10 mx-auto ${maxWidthClass}`}>{children}</div>
    </div>
  )
}
