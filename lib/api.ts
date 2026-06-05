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
  device_id: string
  device_name: string
}

export interface LoginResponse {
  access_token: string
  refresh_token?: string
  token_type: string
  inspector_id: string
  name: string
  email: string
  cert_number?: string
  roles?: string[]
  organisation_id?: string
}

export interface RegisterDeviceRequest {
  email: string
  code: string
  device_id: string
  device_name: string
}

export interface RegisterDeviceResponse {
  access_token: string
  refresh_token: string
  inspector_id: string
  name: string
  email: string
  cert_number?: string
  organisation_id?: string
  roles?: string[]
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

  resendCode: (email: string, purpose: string = 'verification') =>
    apiFetch<{ message: string }>('/api/v1/auth/resend-code', {
      method: 'POST',
      body: JSON.stringify({ email, purpose }),
    }),

  login: (body: LoginRequest) =>
    apiFetch<LoginResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  registerDevice: (body: RegisterDeviceRequest) =>
    apiFetch<RegisterDeviceResponse>('/api/v1/auth/register-device', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  refresh: (refreshToken: string) =>
    apiFetch<LoginResponse>('/api/v1/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    }),
}

// ── Dashboard ───────────────────────────────────────────────────────────────

export interface DashboardStats {
  activeAssets: number
  dueSoon: number
  openDeficiencies: number
  recentScans: {
    id: string
    assetName: string
    tagId: string
    eventType: string
    scannedAt: number
  }[]
}

export interface Site {
  id: string
  name: string
  address: string
  city: string
  province: string
  isActive: boolean
}

export const dashboardApi = {
  getStats: (token: string) =>
    apiFetch<DashboardStats>('/api/v1/dashboard/stats', {}, token),

  getSites: (token: string) =>
    apiFetch<Site[]>('/api/v1/sites', {}, token),
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
  installDate?: number
  nextInspectionDue?: number
  isRetired: boolean
}

export interface Inspection {
  id: string
  assetId: string
  inspectorName: string
  inspectorCertNumber?: string
  result: 'PASS' | 'DEFICIENCY' | 'FAIL' | 'REQUIRES_ATTENTION'
  timestamp: number
  notes?: string
}

export interface Deficiency {
  id: string
  assetId: string
  description: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  status: 'OPEN' | 'RESOLVED'
  createdAt: number
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
