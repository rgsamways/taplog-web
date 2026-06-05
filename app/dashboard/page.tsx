import { redirect } from 'next/navigation'
import { getSession, deleteSession } from '@/lib/auth'
import Logomark from '@/components/Logomark'

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  return (
    <div className="min-h-screen bg-[#060E1A] text-white">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <Logomark size={28} />
          <span className="text-lg tracking-tight">
            <span className="font-bold">Tap</span>
            <span className="font-normal text-teal-400">Log</span>
          </span>
        </div>
        <form action={async () => { 'use server'; await deleteSession(); redirect('/login') }}>
          <button type="submit" className="text-xs text-white/40 hover:text-white/70 transition-colors uppercase tracking-widest font-medium">
            Sign out
          </button>
        </form>
      </nav>

      <main className="px-8 py-12">
        <p className="text-xs font-medium text-teal-300 uppercase tracking-widest mb-2">Inspector Dashboard</p>
        <h1 className="text-3xl font-semibold tracking-tight mb-1">Good to see you, {session.name.split(' ')[0]}.</h1>
        <p className="text-sm text-white/35 mb-12">Dashboard coming next session.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
          {[
            { label: 'Active Assets', value: '—' },
            { label: 'Due This Month', value: '—' },
            { label: 'Open Deficiencies', value: '—' },
            { label: 'Last Sync', value: '—' },
          ].map(s => (
            <div key={s.label} className="bg-navy-card border border-white/5 rounded-xl p-5">
              <p className="text-[9px] font-medium text-white/35 uppercase tracking-widest mb-3">{s.label}</p>
              <p className="text-3xl font-light tracking-tight">{s.value}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
