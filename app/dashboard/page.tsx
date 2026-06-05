import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession, deleteSession } from '@/lib/auth'
import { dashboardApi } from '@/lib/api'
import Logomark from '@/components/Logomark'

function timeAgo(ms: number): string {
  const diff = Date.now() - ms
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  let stats = null
  let statsError = false
  try {
    stats = await dashboardApi.getStats(session.accessToken)
  } catch {
    statsError = true
  }

  return (
    <div className="min-h-screen bg-[#060E1A] text-white">

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-10 py-4 border-b border-white/5 sticky top-0 bg-[#060E1A]/95 backdrop-blur z-10">
        <div className="flex items-center gap-3">
          <Logomark size={28} />
          <span className="text-lg tracking-tight">
            <span className="font-bold">Tap</span>
            <span className="font-normal text-teal-400">Log</span>
          </span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-xs text-white/30 hidden md:block font-mono">{session.email}</span>
          <form action={async () => { 'use server'; await deleteSession(); redirect('/login') }}>
            <button type="submit" className="text-xs text-white/35 hover:text-white/70 transition-colors uppercase tracking-widest font-medium">
              Sign out
            </button>
          </form>
        </div>
      </nav>

      <main className="px-6 md:px-10 py-10 max-w-6xl">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-medium text-teal-300 uppercase tracking-widest mb-1">Inspector Dashboard</p>
          <h1 className="text-3xl font-semibold tracking-tight">Good to see you, {session.name.split(' ')[0]}.</h1>
          {session.certNumber && (
            <p className="text-sm text-white/30 mt-1 font-mono">{session.certNumber}</p>
          )}
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Active Assets', value: stats?.activeAssets ?? '—', delta: null },
            { label: 'Due This Month', value: stats?.dueSoon ?? '—', delta: stats?.dueSoon ? `${stats.dueSoon} upcoming` : null, warn: (stats?.dueSoon ?? 0) > 0 },
            { label: 'Open Deficiencies', value: stats?.openDeficiencies ?? '—', delta: null, alert: (stats?.openDeficiencies ?? 0) > 0 },
            { label: 'Backend', value: statsError ? 'Error' : 'Live', delta: statsError ? 'Check Railway' : null, alert: statsError },
          ].map(s => (
            <div key={s.label} className="bg-[#112240] border border-white/5 rounded-xl p-5 relative overflow-hidden group hover:border-white/10 transition-colors">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-teal-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="text-[9px] font-medium text-white/30 uppercase tracking-widest mb-3">{s.label}</p>
              <p className={`text-3xl font-light tracking-tight mb-1 ${s.alert ? 'text-red-400' : ''}`}>{s.value}</p>
              {s.delta && (
                <p className={`text-xs ${s.alert ? 'text-red-400' : s.warn ? 'text-amber-400' : 'text-teal-300'}`}>{s.delta}</p>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Recent scans */}
          <div className="md:col-span-2">
            <div className="bg-[#112240] border border-white/5 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">Recent Scans</p>
              </div>
              {stats?.recentScans && stats.recentScans.length > 0 ? (
                <div>
                  {stats.recentScans.map((scan, i) => (
                    <div key={scan.id} className={`flex items-center gap-4 px-5 py-3.5 ${i < stats.recentScans.length - 1 ? 'border-b border-white/[0.04]' : ''}`}>
                      <div className="flex flex-col items-center gap-1 flex-shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                        {i < stats.recentScans.length - 1 && <div className="w-px h-5 bg-teal-400/20" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white/85 truncate">{scan.assetName}</p>
                        <p className="text-xs text-white/30 font-mono">{scan.tagId}</p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase tracking-wider ${
                          scan.eventType === 'INSPECTION' ? 'bg-teal-400/15 text-teal-300' : 'bg-white/5 text-white/30'
                        }`}>{scan.eventType}</span>
                        <p className="text-[10px] text-white/20 mt-1">{timeAgo(scan.scannedAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-5 py-10 text-center">
                  <p className="text-sm text-white/25">No recent scans</p>
                  <p className="text-xs text-white/15 mt-1">Scan a tag from the Android app to see activity here</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">

            {/* Identity card */}
            <div className="bg-[#112240] border border-white/5 rounded-xl p-5">
              <p className="text-[10px] font-medium text-white/30 uppercase tracking-widest mb-4">Inspector</p>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600 to-teal-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {session.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{session.name}</p>
                  {session.certNumber && (
                    <p className="text-xs text-teal-300 font-mono">{session.certNumber}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(session.roles ?? ['INSPECTOR']).map(role => (
                  <span key={role} className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-teal-400/10 text-teal-300 border border-teal-400/20">
                    {role}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="bg-[#112240] border border-white/5 rounded-xl p-5">
              <p className="text-[10px] font-medium text-white/30 uppercase tracking-widest mb-4">Quick Actions</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'View Asset', href: '/asset/TL-000001', icon: '🏷️' },
                  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
                ].map(a => (
                  <Link key={a.label} href={a.href} className="flex flex-col items-center gap-1 p-3 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:bg-teal-400/8 hover:border-teal-400/20 transition-colors">
                    <span className="text-lg">{a.icon}</span>
                    <span className="text-[10px] text-white/50 text-center leading-tight">{a.label}</span>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
