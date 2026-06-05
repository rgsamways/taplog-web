'use server'

import { redirect } from 'next/navigation'
import { authApi, ApiError } from '@/lib/api'
import { createSession } from '@/lib/auth'
import { randomUUID } from 'crypto'

type State = { error: string } | undefined

export async function loginAction(state: State, formData: FormData): Promise<State> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const next = (formData.get('next') as string) || '/dashboard'

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  try {
    const deviceId = randomUUID()
    const loginRes = await authApi.login({
      email,
      password,
      device_id: deviceId,
      device_name: 'TapLog Web',
    })

    const accessToken = loginRes.access_token
    const refreshToken = loginRes.refresh_token

    await createSession({
      inspectorId: loginRes.inspector_id,
      email: loginRes.email,
      name: loginRes.name,
      roles: loginRes.roles ?? ['INSPECTOR'],
      organisationId: loginRes.organisation_id,
      deviceId,
      accessToken,
      refreshToken,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    })
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.status === 401) return { error: 'Invalid email or password.' }
      if (err.status === 403) return { error: 'Account not verified. Check your email for the verification code.' }
      return { error: err.message }
    }
    return { error: 'Something went wrong. Please try again.' }
  }

  redirect(next)
}
