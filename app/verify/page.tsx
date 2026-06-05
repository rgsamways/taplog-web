'use client'

import { useActionState, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Logomark from '@/components/Logomark'
import { verifyAction, resendAction } from './actions'

function VerifyForm() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') ?? ''
  const next = searchParams.get('next') ?? '/dashboard'
  const [state, action, pending] = useActionState(verifyAction, undefined)
  const [resent, setResent] = useState(false)

  async function handleResend() {
    await resendAction(email)
    setResent(true)
    setTimeout(() => setResent(false), 5000)
  }

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
        <h1 className="text-2xl font-semibold text-white tracking-tight mb-1">Check your email</h1>
        <p className="text-sm font-light text-white/40 mb-8">
          We sent a 6-digit code to{' '}
          <span className="text-white/70">{email || 'your email'}</span>
        </p>

        <form action={action} className="space-y-4">
          <input type="hidden" name="email" value={email} />
          <input type="hidden" name="next" value={next} />

          <div>
            <label htmlFor="code" className="block text-xs font-medium text-white/50 uppercase tracking-widest mb-1.5">
              Verification code
            </label>
            <input
              id="code"
              name="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              required
              placeholder="000000"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-teal-400/50 transition-colors font-mono tracking-[0.3em] text-center text-lg"
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
            className="w-full bg-teal-400 hover:bg-teal-300 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg px-4 py-3 text-sm transition-colors"
          >
            {pending ? 'Verifying…' : 'Verify email'}
          </button>
        </form>

        <div className="mt-6 text-center">
          {resent ? (
            <p className="text-sm text-teal-300">Code resent — check your email.</p>
          ) : (
            <button
              onClick={handleResend}
              className="text-sm text-white/40 hover:text-white/70 transition-colors"
            >
              Didn&apos;t get it? Resend code
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyForm />
    </Suspense>
  )
}
