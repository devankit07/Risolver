import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Check, X } from 'lucide-react'
import { MarketingPageShell } from '../components/MarketingPageShell.jsx'

/* ── fade-up helper ── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.45, delay },
})

export const Pricing = () => {
  return (
    <MarketingPageShell>
        
        {/* ── HEADER ── */}
        <div className="text-center">
          <motion.span
            className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600"
            {...fadeUp(0)}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Pricing Plans
          </motion.span>
          
          <motion.h1
            className="mt-8 text-[clamp(2.5rem,6vw,4rem)] font-semibold leading-[1.1] tracking-tight text-slate-900 [font-family:Georgia,'Times_New_Roman',serif]"
            {...fadeUp(0.07)}
          >
            Smarter Incident Management
            <br />
            with <span className="italic text-indigo-400">AI Intelligence.</span>
          </motion.h1>
          
          <motion.p
            className="mt-6 mx-auto max-w-2xl text-base leading-relaxed text-slate-500 md:text-lg"
            {...fadeUp(0.13)}
          >
            Experience full AI automation — <span className="font-bold text-indigo-600">completely free</span> for early adopters. 
            No credit card required.
          </motion.p>

          <motion.p
            role="note"
            className="mt-8 mx-auto max-w-3xl rounded-2xl border border-amber-200/80 bg-amber-50/90 px-5 py-4 text-left text-sm leading-relaxed text-amber-950/90 shadow-sm md:text-center"
            {...fadeUp(0.18)}
          >
            <span className="font-semibold text-amber-900">Note:</span>{' '}
            We do not support real payments yet—this pricing is for demonstration only. If needed later, a payment mode can be
            activated in the product. Right now you still have access to premium features.
          </motion.p>
        </div>

        {/* ── PRICING CARDS ── */}
        <div className="mt-20 grid gap-8 md:grid-cols-3">
          
          {/* Free Plan */}
          <PricingCard
            title="Starter"
            price="0"
            description="Perfect for small teams and solo developers trying out the workflow."
            features={[
              'Manual Incident Reporting',
              'Manager Dashboard',
              'Team Responder Workflow',
              'AI Postmortem Summary',
              'Basic Role Access',
            ]}
            buttonLabel="Start for Free"
            delay={0.2}
          />

          {/* Most Popular Plan */}
          <PricingCard
            title="Pro"
            price="29"
            description="AI-powered assistance and deeper insights to speed up resolution."
            features={[
              'All Starter features',
              'AI Incident Analysis',
              'Suggested Solutions & Hints',
              'Advanced Triage Intelligence',
              'Priority Support',
            ]}
            buttonLabel="Get Started with Pro"
            highlighted
            delay={0.25}
          />

          {/* Premium Plan */}
          <PricingCard
            title="Premium"
            price="69"
            description="Full AI automation and GitHub integration for end-to-end management."
            features={[
              'All Pro features',
              'GitHub Code Analysis',
              'AI Auto-Fix suggestions',
              'Automatic Postmortem Publishing',
              'Custom Integrations',
            ]}
            buttonLabel="Go Enterprise"
            delay={0.3}
          />

        </div>

        {/* ── COMPARISON TABLE ── */}
        <motion.div className="mt-32" {...fadeUp(0.4)}>
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Compare features</h2>
            <p className="mt-4 text-slate-500">Find the right fit for your team's operational needs.</p>
          </div>
          
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-8 py-5 font-semibold text-slate-900">Feature</th>
                  <th className="px-8 py-5 font-semibold text-slate-900 text-center">Starter</th>
                  <th className="px-8 py-5 font-semibold text-indigo-600 text-center">Pro</th>
                  <th className="px-8 py-5 font-semibold text-slate-900 text-center">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <ComparisonRow label="AI Incident Analysis" starter={false} pro={true} enterprise={true} />
                <ComparisonRow label="Suggested Solutions" starter={false} pro={true} enterprise={true} />
                <ComparisonRow label="GitHub Integration" starter={false} pro={false} enterprise={true} />
                <ComparisonRow label="AI Auto-Solve" starter={false} pro={false} enterprise={true} />
                <ComparisonRow label="Automated Postmortems" starter="Manual" pro="Manual" enterprise="Automated" />
                <ComparisonRow label="Support" starter="Community" pro="Priority" enterprise="24/7 Dedicated" />
              </tbody>
            </table>
          </div>
        </motion.div>

    </MarketingPageShell>
  )
}

const PricingCard = ({ title, price, description, features, buttonLabel, highlighted = false, delay = 0 }) => (
  <motion.div
    {...fadeUp(delay)}
    className={`relative flex flex-col rounded-[2.5rem] border p-8 md:p-10 ${
      highlighted
        ? 'border-indigo-200 bg-white shadow-[0_32px_64px_rgba(99,102,241,0.12)] ring-1 ring-indigo-500/20'
        : 'border-slate-200 bg-white shadow-lg'
    }`}
  >
    {highlighted && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
        Most Popular
      </div>
    )}
    
    <div className="mb-8">
      <h3 className={`text-xl font-bold ${highlighted ? 'text-indigo-600' : 'text-slate-900'}`}>{title}</h3>
      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-4xl font-bold tracking-tight text-slate-900">${price}</span>
        <span className="text-sm font-medium text-slate-500">/mo</span>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-slate-500">{description}</p>
    </div>

    <ul className="mb-10 space-y-4 flex-grow">
      {features.map((feature) => (
        <li key={feature} className="flex items-center gap-3 text-sm text-slate-600">
          <div className={`flex size-5 shrink-0 items-center justify-center rounded-full ${highlighted ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
            <Check className="size-3" />
          </div>
          {feature}
        </li>
      ))}
    </ul>

    <button
      className={`w-full rounded-2xl py-4 text-sm font-bold transition-all active:scale-[0.98] ${
        highlighted
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-500'
          : 'bg-slate-50 text-slate-900 hover:bg-slate-100'
      }`}
    >
      {buttonLabel}
    </button>
  </motion.div>
)

const ComparisonRow = ({ label, starter, pro, enterprise }) => (
  <tr className="group transition hover:bg-slate-50/50">
    <td className="px-8 py-5 text-sm font-medium text-slate-700">{label}</td>
    <td className="px-8 py-5 text-center text-sm"><Value value={starter} /></td>
    <td className="px-8 py-5 text-center text-sm font-semibold text-indigo-600"><Value value={pro} /></td>
    <td className="px-8 py-5 text-center text-sm"><Value value={enterprise} /></td>
  </tr>
)

const Value = ({ value }) => {
  if (value === true) return <Check className="mx-auto size-5 text-emerald-500" />
  if (value === false) return <X className="mx-auto size-5 text-slate-300" />
  return <span className="text-slate-600">{value}</span>
}

export default Pricing