'use client'

import { useActionState } from 'react'
import { registerAssetAction } from '@/app/asset/[tagId]/actions'

const ASSET_TYPES = [
  'ABC Dry Chemical Extinguisher',
  'CO2 Extinguisher',
  'Wet Chemical Extinguisher',
  'Water Extinguisher',
  'Pull Station',
  'Smoke Detector',
  'CO Detector',
  'Emergency Lighting',
  'Emergency Exit Sign',
  'Kitchen Suppression System',
  'Roof Anchor Point',
  'Fall Arrest Anchor',
  'Confined Space Entry Point',
  'Pressure Vessel',
  'Fire Hose Cabinet',
  'Other',
]

export default function AssetRegistration({ tagId, sites }: {
  tagId: string
  sites: { id: string; name: string; city: string }[]
}) {
  const [state, action, pending] = useActionState(registerAssetAction, undefined)

  return (
    <div className="bg-[#112240] border border-white/5 rounded-xl p-6">
      <div className="mb-6">
        <p className="text-xs font-medium text-teal-300 uppercase tracking-widest mb-1">Unregistered Tag</p>
        <h2 className="text-lg font-semibold tracking-tight">Register this asset</h2>
        <p className="text-sm text-white/35 mt-1 font-mono">{tagId}</p>
      </div>

      <form action={action} className="space-y-4">
        <input type="hidden" name="tagId" value={tagId} />

        <div>
          <label className="block text-xs font-medium text-white/50 uppercase tracking-widest mb-1.5">Asset name</label>
          <input
            name="name"
            type="text"
            required
            placeholder="e.g. ABC Dry Chemical — Lobby"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-teal-400/50 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-white/50 uppercase tracking-widest mb-1.5">Asset type</label>
          <select
            name="assetType"
            required
            className="w-full bg-[#0B1F3A] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-400/50 transition-colors"
          >
            <option value="">Select type…</option>
            {ASSET_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-white/50 uppercase tracking-widest mb-1.5">Location</label>
          <input
            name="location"
            type="text"
            required
            placeholder="e.g. Main lobby, near entrance"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-teal-400/50 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-white/50 uppercase tracking-widest mb-1.5">Site</label>
          {sites.length > 0 ? (
            <select
              name="siteId"
              required
              className="w-full bg-[#0B1F3A] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-400/50 transition-colors"
            >
              <option value="">Select site…</option>
              {sites.map(s => (
                <option key={s.id} value={s.id}>{s.name} — {s.city}</option>
              ))}
            </select>
          ) : (
            <p className="text-sm text-amber-400/80 bg-amber-400/10 border border-amber-400/20 rounded-lg px-4 py-3">
              No sites found. Create a site in the Android app first.
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-white/50 uppercase tracking-widest mb-1.5">Install date</label>
          <input
            name="installDate"
            type="date"
            required
            defaultValue={new Date().toISOString().split('T')[0]}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-400/50 transition-colors"
          />
        </div>

        {state?.error && (
          <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending || sites.length === 0}
          className="w-full bg-teal-400 hover:bg-teal-300 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg px-4 py-3 text-sm transition-colors"
        >
          {pending ? 'Registering…' : 'Register asset'}
        </button>
      </form>
    </div>
  )
}
