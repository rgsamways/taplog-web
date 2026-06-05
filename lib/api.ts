const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://web-production-a9fb1.up.railway.app'

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    const detail = err.detail
    const message = Array.isArray(detail)
      ? detail.map((d: { msg?: string }) => d.msg ?? JSON.stringify(d)).join(', ')
      : typeof detail === 'string'
      ? detail
      : res.statusText
    throw new ApiError(res.status, message)
  }
  return res.json() as Promise<T>
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

// ── Auth ────────────────────────────────────────────────────────────────────

export interface RegisterRequest {
  name: string
  email: string
  password: string
  certNumber?: string
}

export interface RegisterResponse {
  message: string
  inspector_id: string
}

export interface VerifyEmailRequest {
  email: string
  code: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  refresh_token?: string
  token_type: string
  inspector_id: string
  name: string
  email: string
  roles?: string[]
  organisation_id?: string
}

export interface RegisterDeviceRequest {
  device_id: string
  device_name: string
  platform: 'web'
}

export interface RegisterDeviceResponse {
  access_token: string
  refresh_token?: string
}

export const authApi = {
  register: (body: RegisterRequest) =>
    apiFetch<RegisterResponse>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  verifyEmail: (body: VerifyEmailRequest) =>
    apiFetch<{ message: string }>('/api/v1/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  resendCode: (email: string) =>
    apiFetch<{ message: string }>('/api/v1/auth/resend-code', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  login: (body: LoginRequest) =>
    apiFetch<LoginResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  registerDevice: (body: RegisterDeviceRequest, token: string) =>
    apiFetch<RegisterDeviceResponse>('/api/v1/auth/register-device', {
      method: 'POST',
      body: JSON.stringify(body),
    }, token),

  refresh: (refreshToken: string) =>
    apiFetch<LoginResponse>('/api/v1/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    }),
}

// ── Assets ──────────────────────────────────────────────────────────────────

export interface Asset {
  id: string
  nfcTagId: string
  name: string
  assetType: string
  location: string
  siteId: string
  siteName?: string
  organisationId: string
  installDate?: string
  nextInspectionDue?: string
  isRetired: boolean
}

export interface Inspection {
  id: string
  assetId: string
  inspectorId: string
  inspectorName: string
  result: 'PASS' | 'DEFICIENCY' | 'FAIL'
  timestamp: string
  notes?: string
}

export interface Deficiency {
  id: string
  assetId: string
  description: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  status: 'OPEN' | 'RESOLVED'
  createdAt: string
}

export const assetApi = {
  getByTagId: (tagId: string, token: string) =>
    apiFetch<Asset>(`/api/v1/assets/tag/${tagId}`, {}, token),

  getInspections: (tagId: string, token: string) =>
    apiFetch<Inspection[]>(`/api/v1/assets/tag/${tagId}/inspections`, {}, token),

  getDeficiencies: (tagId: string, token: string) =>
    apiFetch<Deficiency[]>(`/api/v1/assets/tag/${tagId}/deficiencies`, {}, token),

  create: (body: Partial<Asset>, token: string) =>
    apiFetch<Asset>('/api/v1/assets', { method: 'POST', body: JSON.stringify(body) }, token),
}
