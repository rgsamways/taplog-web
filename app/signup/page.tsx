'use client'

import { useActionState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import Logomark from '@/components/Logomark'
import { signupAction } from './actions'

function SignupForm() {
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/dashboard'
  const [state, action, pending] = useActionState(signupAction, undefined)

  return (
    <div className="min-h-screen bg-[#060E1A] flex flex-col items-center justify-center px-5 py-12">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="flex items-center gap-3 mb-10">
          <Logomark size={36} />
          <span className="text-xl tracking-tight">
            <span className="font-bold text-white">Tap</span>
            <span className="font-normal text-teal-400">Log</span>
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-semibold text-white tracking-tight mb-1">Create account</h1>
        <p className="text-sm font-light text-white/40 mb-8">
          Already have one?{' '}
          <Link href={`/login?next=${encodeURIComponent(next)}`} className="text-teal-300 hover:text-teal-200 transition-colors">
            Sign in
          </Link>
        </p>

        <form action={action} className="space-y-4">
          <input type="hidden" name="next" value={next} />

          <div>
            <label htmlFor="name" className="block text-xs font-medium text-white/50 uppercase tracking-widest mb-1.5">
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              placeholder="Robin Samways"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-teal-400/50 transition-colors"
            />
            {state?.errors?.name && <p className="text-xs text-red-400 mt-1">{state.errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-medium text-white/50 uppercase tracking-widest mb-1.5">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-teal-400/50 transition-colors"
            />
            {state?.errors?.email && <p className="text-xs text-red-400 mt-1">{state.errors.email}</p>}
          </div>

          <div>
            <label htmlFor="certNumber" className="block text-xs font-medium text-white/50 uppercase tracking-widest mb-1.5">
              Certificate number <span className="text-white/25 normal-case tracking-normal">(optional)</span>
            </label>
            <input
              id="certNumber"
              name="certNumber"
              type="text"
              placeholder="OFM-1234567"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-teal-400/50 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-medium text-white/50 uppercase tracking-widest mb-1.5">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-teal-400/50 transition-colors"
            />
            {state?.errors?.password && <p className="text-xs text-red-400 mt-1">{state.errors.password}</p>}
          </div>

          {state?.error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-teal-400 hover:bg-teal-300 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg px-4 py-3 text-sm transition-colors mt-2"
          >
            {pending ? 'Creating account…' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  )
}
