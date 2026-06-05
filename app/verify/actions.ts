'use server'

import { redirect } from 'next/navigation'
import { authApi, ApiError } from '@/lib/api'

type State = { error: string } | undefined

export async function verifyAction(state: State, formData: FormData): Promise<State> {
  const email = formData.get('email') as string
  const code = (formData.get('code') as string).trim()
  const next = (formData.get('next') as string) || '/dashboard'

  if (!code || code.length !== 6) {
    return { error: 'Enter the 6-digit code from your email.' }
  }

  try {
    await authApi.verifyEmail({ email, code })
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.status === 400 || err.status === 422) return { error: 'Incorrect code. Please try again.' }
      if (err.status === 410) return { error: 'Code has expired. Request a new one.' }
      return { error: err.message }
    }
    return { error: 'Something went wrong. Please try again.' }
  }

  redirect(`/login?next=${encodeURIComponent(next)}`)
}

export async function resendAction(email: string): Promise<void> {
  try {
    await authApi.resendCode(email)
  } catch {
    // Silent — UI shows confirmation regardless
  }
}
