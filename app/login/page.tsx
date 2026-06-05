'use client'

import { useActionState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import Logomark from '@/components/Logomark'
import { loginAction } from './actions'

function LoginForm() {
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/dashboard'
  const [state, action, pending] = useActionState(loginAction, undefined)

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
        <h1 className="text-2xl font-semibold text-white tracking-tight mb-1">Sign in</h1>
        <p className="text-sm font-light text-white/40 mb-8">
          Don&apos;t have an account?{' '}
          <Link href={`/signup?next=${encodeURIComponent(next)}`} className="text-teal-300 hover:text-teal-200 transition-colors">
            Sign up
          </Link>
        </p>

        <form action={action} className="space-y-4">
          <input type="hidden" name="next" value={next} />

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
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-teal-400/50 focus:bg-white/8 transition-colors"
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
              autoComplete="current-password"
              required
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-teal-400/50 focus:bg-white/8 transition-colors"
            />
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
            {pending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
