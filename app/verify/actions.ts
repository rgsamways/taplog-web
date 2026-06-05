'use server'

import { redirect } from 'next/navigation'
import { authApi, ApiError } from '@/lib/api'
import { createSession } from '@/lib/auth'

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

export async function verifyDeviceAction(state: State, formData: FormData): Promise<State> {
  const email = formData.get('email') as string
  const code = (formData.get('code') as string).trim()
  const deviceId = formData.get('device_id') as string
  const next = (formData.get('next') as string) || '/dashboard'

  if (!code || code.length !== 6) {
    return { error: 'Enter the 6-digit code from your email.' }
  }

  try {
    const res = await authApi.registerDevice({ email, code, device_id: deviceId, device_name: 'TapLog Web' })

    await createSession({
      inspectorId: res.inspector_id,
      email: res.email,
      name: res.name,
      roles: res.roles ?? ['INSPECTOR'],
      organisationId: res.organisation_id,
      certNumber: res.cert_number,
      deviceId,
      accessToken: res.access_token,
      refreshToken: res.refresh_token,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    })
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.status === 400 || err.status === 422) return { error: 'Incorrect code. Please try again.' }
      if (err.status === 410) return { error: 'Code has expired. Request a new one.' }
      return { error: err.message }
    }
    return { error: 'Something went wrong. Please try again.' }
  }

  redirect(next)
}

export async function resendAction(email: string): Promise<void> {
  try {
    await authApi.resendCode(email)
  } catch {
    // Silent — UI shows confirmation regardless
  }
}
