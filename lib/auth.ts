import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET ?? 'taplog-dev-secret-change-in-production'
)

export interface SessionPayload {
  inspectorId: string  // kept for Android JWT compat — same value as userId
  email: string
  name: string
  roles: string[]
  organisationId?: string
  certNumber?: string
  deviceId: string
  accessToken: string
  refreshToken?: string
  expiresAt: number
}

export async function encryptSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)
}

export async function decryptSession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret, { algorithms: ['HS256'] })
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

export async function createSession(payload: SessionPayload): Promise<void> {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const token = await encryptSession({ ...payload, expiresAt: expiresAt.getTime() })
  const store = await cookies()
  store.set('taplog_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies()
  const token = store.get('taplog_session')?.value
  if (!token) return null
  return decryptSession(token)
}

export async function deleteSession(): Promise<void> {
  const store = await cookies()
  store.delete('taplog_session')
}

export async function getOrCreateDeviceId(): Promise<string> {
  const store = await cookies()
  const existing = store.get('taplog_device_id')?.value
  if (existing) return existing

  const { randomUUID } = await import('crypto')
  const id = randomUUID()
  store.set('taplog_device_id', id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 365 * 24 * 60 * 60, // 1 year
    sameSite: 'lax',
    path: '/',
  })
  return id
}
