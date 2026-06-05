import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { assetApi, dashboardApi, ApiError } from '@/lib/api'
import Logomark from '@/components/Logomark'
import AssetRegistration from '@/components/AssetRegistration'

function formatDate(ms: number | undefined): string {
  if (!ms) return '—'
  return new Date(ms).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })
}

function urgencyColor(ms: number | undefined): string {
  if (!ms) return 'text-white/30'
  const diff = ms - Date.now()
  if (diff < 0) return 'text-red-400'
  if (diff < 30 * 24 * 60 * 60 * 1000) return 'text-amber-400'
  return 'text-teal-300'
}

function urgencyLabel(ms: number | undefined): string {
  if (!ms) return 'No due date'
  const diff = ms - Date.now()
  if (diff < 0) return 'Overdue'
  if (diff < 30 * 24 * 60 * 60 * 1000) return 'Due soon'
  return 'Current'
}

export default async function AssetPage({ params }: PageProps<'/asset/[tagId]'>) {
  const { tagId } = await params
  const session = await getSession()
  if (!session) redirect(`/login?next=/asset/${tagId}`)

  let asset = null
  let inspections: Awaited<ReturnType<typeof assetApi.getInspections>> = []
  let deficiencies: Awaited<ReturnType<typeof assetApi.getDeficiencies>> = []
  let notFound = false

  try {
    [asset, inspections, deficiencies] = await Promise.all([
      assetApi.getByTagId(tagId, session.accessToken),
      assetApi.getInspections(tagId, session.accessToken),
      assetApi.getDeficiencies(tagId, session.accessToken),
    ])
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound = true
  }

  // Fetch sites for registration form
  let sites: { id: string; name: string; city: string }[] = []
  if (notFound) {
    try {
      const rawSites = await dashboardApi.getSites(session.accessToken)
      sites = rawSites.map(s => ({ id: s.id, name: s.name, city: s.city }))
    } catch { /* non-fatal */ }
  }

  return (
    <div className="min-h-screen bg-[#060E1A] text-white">
      <nav className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <Link href="/dashboard" className="flex items-center gap-3">
          <Logomark size={24} />
          <span className="text-base tracking-tight">
            <span className="font-bold">Tap</span>
            <span className="font-normal text-teal-400">Log</span>
          </span>
        </Link>
        <Link href="/dashboard" className="text-xs text-white/35 hover:text-white/60 transition-colors">
          ← Dashboard
        </Link>
      </nav>

      <main className="px-5 py-8 max-w-lg mx-auto">

        {notFound ? (
          <AssetRegistration tagId={tagId} sites={sites} />
        ) : !asset ? (
          <div className="text-center py-16">
            <p className="text-sm text-white/30">Unable to load asset</p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-2">{tagId}</p>
              <h1 className="text-2xl font-semibold tracking-tight mb-1">{asset.name}</h1>
              <p className="text-sm text-white/40">{asset.assetType} · {asset.location}</p>
              {asset.siteName && <p className="text-sm text-white/25 mt-0.5">{asset.siteName}</p>}
            </div>

            <div className="bg-[#112240] border border-white/5 rounded-xl p-5 mb-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-medium text-white/30 uppercase tracking-widest">Compliance Status</p>
                <span className={`text-xs font-medium ${urgencyColor(asset.nextInspectionDue)}`}>
                  {urgencyLabel(asset.nextInspectionDue)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-white/25 mb-1">Last inspected</p>
                  <p className="text-sm font-medium">{inspections[0] ? formatDate(inspections[0].timestamp) : '—'}</p>
                  {inspections[0] && <p className="text-xs text-white/30">{inspections[0].inspectorName}</p>}
                </div>
                <div>
                  <p className="text-[10px] text-white/25 mb-1">Next due</p>
                  <p className={`text-sm font-medium ${urgencyColor(asset.nextInspectionDue)}`}>
                    {formatDate(asset.nextInspectionDue)}
                  </p>
                </div>
              </div>
              {deficiencies.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/5">
                  <p className="text-xs text-red-400 font-medium">{deficiencies.length} open {deficiencies.length === 1 ? 'deficiency' : 'deficiencies'}</p>
                  <div className="mt-2 space-y-1.5">
                    {deficiencies.slice(0, 3).map(d => (
                      <div key={d.id} className="flex items-start gap-2">
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded flex-shrink-0 ${
                          d.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                          d.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-teal-400/10 text-teal-300'
                        }`}>{d.severity}</span>
                        <p className="text-xs text-white/50">{d.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {inspections.length > 0 ? (
              <div className="bg-[#112240] border border-white/5 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-white/5">
                  <p className="text-[10px] font-medium text-white/30 uppercase tracking-widest">Inspection History</p>
                </div>
                {inspections.map((insp, i) => (
                  <div key={insp.id} className={`px-5 py-4 flex items-center gap-4 ${i < inspections.length - 1 ? 'border-b border-white/[0.04]' : ''}`}>
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      insp.result === 'PASS' ? 'bg-teal-400' :
                      insp.result === 'DEFICIENCY' ? 'bg-amber-400' : 'bg-red-400'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/80">{insp.inspectorName}</p>
                      <p className="text-xs text-white/25">{formatDate(insp.timestamp)}</p>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase ${
                      insp.result === 'PASS' ? 'bg-teal-400/15 text-teal-300' :
                      insp.result === 'DEFICIENCY' ? 'bg-amber-400/15 text-amber-400' :
                      'bg-red-400/15 text-red-400'
                    }`}>{insp.result}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#112240] border border-white/5 rounded-xl px-5 py-10 text-center">
                <p className="text-sm text-white/25">No inspections recorded yet</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
