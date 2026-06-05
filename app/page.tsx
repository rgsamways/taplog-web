import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import Link from 'next/link'
import Logomark from '@/components/Logomark'

export default async function RootPage() {
  const session = await getSession()
  if (session && session.expiresAt > Date.now()) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#060E1A] text-white">

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <Logomark size={32} />
          <span className="text-lg tracking-tight">
            <span className="font-bold">Tap</span>
            <span className="font-normal text-teal-400">Log</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-white/50 hover:text-white transition-colors">Sign in</Link>
          <Link href="/signup" className="text-sm bg-teal-400 hover:bg-teal-300 text-white px-4 py-2 rounded-lg transition-colors font-medium">Get started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 md:px-12 pt-20 pb-24 max-w-4xl">
        <p className="text-xs font-medium text-teal-300 uppercase tracking-widest mb-4">Offline-first NFC inspection</p>
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-tight mb-6">
          Tap. Log. Done.<br />
          <span className="text-white/40">Compliance is one tap away.</span>
        </h1>
        <p className="text-lg font-light text-white/50 max-w-xl mb-10 leading-relaxed">
          TapLog connects physical assets to their inspection records. Tap an NFC tag on a fire extinguisher, fall anchor, or pressure vessel — and the full compliance history is there instantly. For inspectors in the field and building owners who need proof.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/signup" className="inline-flex items-center justify-center bg-teal-400 hover:bg-teal-300 text-white font-medium px-6 py-3 rounded-lg transition-colors text-sm">
            Start free — no credit card
          </Link>
          <Link href="/login" className="inline-flex items-center justify-center border border-white/10 hover:border-white/25 text-white/70 hover:text-white font-medium px-6 py-3 rounded-lg transition-colors text-sm">
            Sign in to your account
          </Link>
        </div>
      </section>

      {/* Feature strip */}
      <section className="border-t border-white/5 px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
          {[
            {
              label: 'Proof of presence',
              body: 'NFC tags are passive — you must physically touch the asset to log an inspection. No remote falsification. No spreadsheet guesswork.',
            },
            {
              label: 'Offline-first',
              body: 'Works in basements, mechanical rooms, and remote sites with zero signal. Records sync automatically when you\'re back online.',
            },
            {
              label: 'Regulatory intelligence',
              body: 'OFC inspection intervals are enforced automatically by asset type. The app calculates next due dates — inspectors can\'t get it wrong.',
            },
          ].map(f => (
            <div key={f.label}>
              <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mb-4" />
              <h3 className="text-sm font-semibold text-white mb-2">{f.label}</h3>
              <p className="text-sm font-light text-white/40 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Verticals */}
      <section className="border-t border-white/5 px-6 md:px-12 py-16">
        <p className="text-xs font-medium text-teal-300 uppercase tracking-widest mb-8">Platform verticals</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl">
          {[
            { name: 'Ember', desc: 'Fire safety', status: 'Live' },
            { name: 'Anchor', desc: 'Fall protection', status: 'Coming soon' },
            { name: 'Hatch', desc: 'Confined space', status: 'Coming soon' },
            { name: 'Newel', desc: 'Home inspection', status: 'Coming soon' },
          ].map(v => (
            <div key={v.name} className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-4">
              <p className="text-sm font-semibold text-white mb-1">{v.name}</p>
              <p className="text-xs text-white/35 mb-3">{v.desc}</p>
              <span className={`text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded ${
                v.status === 'Live'
                  ? 'bg-teal-400/15 text-teal-300'
                  : 'bg-white/5 text-white/25'
              }`}>{v.status}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-white/5 px-6 md:px-12 py-16">
        <p className="text-xs font-medium text-teal-300 uppercase tracking-widest mb-2">Pricing</p>
        <h2 className="text-2xl font-semibold tracking-tight mb-2">Start free. Upgrade when it clicks.</h2>
        <p className="text-sm text-white/35 mb-12 max-w-lg">
          The free tier does the selling. Every tagged building feeds the platform whether the owner pays or not. The upgrade reveals what was always there.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl">
          {[
            {
              name: 'Free',
              price: '$0',
              period: 'forever',
              highlight: false,
              features: ['Up to 5 tagged assets', 'Read-only asset records', 'Inspection history (when certified inspector scans)', 'Leave-behind document'],
            },
            {
              name: 'Connect Basic',
              price: '$25',
              period: 'per year',
              highlight: false,
              features: ['Unlimited assets', 'Proactive notifications', 'Service request button', 'Document vault', 'Share record link'],
            },
            {
              name: 'Connect Plus',
              price: '$75',
              period: 'per year',
              highlight: true,
              features: ['Everything in Basic', 'Historical trend charts', 'Anomaly alerts', 'IoT sensor pairing', 'Priority support'],
            },
            {
              name: 'Connect Pro',
              price: '$199',
              period: 'per year',
              highlight: false,
              features: ['Everything in Plus', 'Multi-inspector org', 'Portfolio heat map', 'Org-wide reporting', 'Team management'],
            },
          ].map(tier => (
            <div key={tier.name} className={`rounded-xl border p-6 flex flex-col ${
              tier.highlight
                ? 'bg-teal-400/10 border-teal-400/30'
                : 'bg-white/[0.03] border-white/[0.06]'
            }`}>
              {tier.highlight && (
                <p className="text-[10px] font-medium text-teal-300 uppercase tracking-widest mb-3">Most popular</p>
              )}
              <p className="text-sm font-semibold text-white mb-1">{tier.name}</p>
              <p className="text-3xl font-light tracking-tight text-white mb-0.5">{tier.price}</p>
              <p className="text-xs text-white/30 mb-6">{tier.period}</p>
              <ul className="space-y-2 flex-1">
                {tier.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-xs text-white/50">
                    <span className="text-teal-400 mt-0.5 flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={`mt-6 text-center text-xs font-medium py-2.5 rounded-lg transition-colors ${
                  tier.highlight
                    ? 'bg-teal-400 hover:bg-teal-300 text-white'
                    : 'border border-white/10 hover:border-white/25 text-white/60 hover:text-white'
                }`}
              >
                {tier.name === 'Free' ? 'Get started free' : 'Get started'}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 md:px-12 py-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logomark size={20} />
          <span className="text-sm tracking-tight text-white/30">
            <span className="font-bold">Tap</span><span className="font-normal">Log</span>
          </span>
        </div>
        <p className="text-xs text-white/20">© 2026 TapLog. taplog.ca</p>
      </footer>

    </div>
  )
}
