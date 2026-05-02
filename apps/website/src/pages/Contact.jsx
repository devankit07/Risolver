import React from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Mail, MessageSquare, Building2, Phone } from 'lucide-react'

/* ── fade-up helper ── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.45, delay },
})

export const Contact = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white px-6 pb-24 pt-32 md:pt-40">
      
      {/* ── BACKGROUND ELEMENTS ── */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* mesh gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_8%,#eef1ff_0%,#f8f9ff_44%,#ffffff_100%)]" />
        
        {/* grid bg */}
        <div
          className="absolute inset-0 opacity-80"
          style={{
            backgroundImage:
              'linear-gradient(to right,rgba(99,102,241,0.13) 1px,transparent 1px),linear-gradient(to bottom,rgba(99,102,241,0.13) 1px,transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />
        
        {/* soft blobs */}
        <div className="absolute -left-24 top-20 h-80 w-80 rounded-full bg-indigo-100/60 blur-3xl" />
        <div className="absolute -right-16 top-28 h-72 w-72 rounded-full bg-sky-100/60 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">
        
        {/* ── HEADER SECTION ── */}
        <div className="text-center">
          <motion.span
            className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600"
            {...fadeUp(0)}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Contact Resolver
          </motion.span>
          
          <motion.h1
            className="mt-8 text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-[1.1] tracking-tight text-slate-900 [font-family:Georgia,'Times_New_Roman',serif]"
            {...fadeUp(0.07)}
          >
            How can we help your
            <br />
            <span className="italic text-indigo-400 text-[1.1em]">business?</span>
          </motion.h1>
          
          <motion.p
            className="mt-6 mx-auto max-w-xl text-base leading-relaxed text-slate-500 md:text-lg"
            {...fadeUp(0.13)}
          >
            Connect with our advisory team to discuss strategic incident management solutions tailored to your team's goals.
          </motion.p>
        </div>

        {/* ── FORM SECTION ── */}
        <div className="mt-20 grid gap-12 lg:grid-cols-[1fr_380px]">
          
          {/* Contact Form */}
          <motion.div
            className="rounded-[2.5rem] border border-slate-200/80 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] md:p-12"
            {...fadeUp(0.2)}
          >
            <form className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-5 py-4 text-sm outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Work Email</label>
                  <input
                    type="email"
                    placeholder="john@company.com"
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-5 py-4 text-sm outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Organization</label>
                  <input
                    type="text"
                    placeholder="Company Name"
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-5 py-4 text-sm outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Phone (Optional)</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-5 py-4 text-sm outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">How can we help?</label>
                <textarea
                  rows={4}
                  placeholder="Tell us about your incident management needs..."
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-5 py-4 text-sm outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50 resize-none"
                />
              </div>

              <div className="flex items-start gap-3 px-1">
                <input
                  id="consent"
                  type="checkbox"
                  className="mt-1 size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="consent" className="text-xs leading-relaxed text-slate-500">
                  I agree to receive communications from Resolver. You can unsubscribe at any time.
                  See our <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>.
                </label>
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-indigo-600 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-500 hover:shadow-indigo-300 active:scale-[0.98]"
              >
                Send Message
              </button>
            </form>
          </motion.div>

          {/* Info Sidepanel */}
          <div className="space-y-10 lg:pt-8">
            <motion.div {...fadeUp(0.25)}>
              <h3 className="text-lg font-bold text-slate-900">Reach out directly</h3>
              <p className="mt-2 text-sm text-slate-500">
                Our team usually responds within 2 business hours.
              </p>
              
              <div className="mt-8 space-y-6">
                {[
                  { icon: Mail, label: 'Email', value: 'hello@resolver.io' },
                  { icon: MessageSquare, label: 'Support', value: 'support@resolver.io' },
                  { icon: Phone, label: 'Sales', value: '+1 (888) RESOLVE' },
                  { icon: Building2, label: 'Headquarters', value: 'San Francisco, CA' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4 group">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{item.label}</p>
                      <p className="text-sm font-semibold text-slate-700">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="rounded-3xl bg-slate-900 p-8 text-white shadow-xl"
              {...fadeUp(0.3)}
            >
              <h4 className="text-lg font-bold">Trusted by SREs</h4>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Join 500+ engineering teams already using Resolver to manage incidents without the chaos.
              </p>
              <div className="mt-6 flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 w-8 rounded-full border-2 border-slate-900 bg-indigo-500 flex items-center justify-center text-[10px] font-bold">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
                <div className="flex h-8 items-center justify-center rounded-full bg-slate-800 px-3 text-[10px] font-bold ml-4">
                  +500 teams
                </div>
              </div>
            </motion.div>
          </div>

        </div>

      </div>
    </div>
  )
}
