'use server'

import { redirect } from 'next/navigation'
import { authApi, ApiError } from '@/lib/api'

interface FieldErrors { name?: string; email?: string; password?: string }
type State = { error?: string; errors?: FieldErrors } | undefined

export async function signupAction(state: State, formData: FormData): Promise<State> {
  const name = (formData.get('name') as string).trim()
  const email = (formData.get('email') as string).trim()
  const password = formData.get('password') as string
  const certNumber = (formData.get('certNumber') as string).trim() || undefined
  const next = (formData.get('next') as string) || '/dashboard'

  const errors: FieldErrors = {}
  if (!name || name.length < 2) errors.name = 'Name must be at least 2 characters.'
  if (!email || !email.includes('@')) errors.email = 'Enter a valid email address.'
  if (!password || password.length < 8) errors.password = 'Password must be at least 8 characters.'
  if (Object.keys(errors).length > 0) return { errors }

  try {
    await authApi.register({ name, email, password, certNumber })
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.status === 409) return { errors: { email: 'An account with this email already exists.' } }
      return { error: err.message }
    }
    return { error: 'Something went wrong. Please try again.' }
  }

  redirect(`/verify?email=${encodeURIComponent(email)}&next=${encodeURIComponent(next)}`)
}
