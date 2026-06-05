'use server'

import { redirect } from 'next/navigation'
import { randomUUID } from 'crypto'
import { getSession } from '@/lib/auth'
import { assetApi, ApiError } from '@/lib/api'

type State = { error: string } | undefined

export async function registerAssetAction(state: State, formData: FormData): Promise<State> {
  const session = await getSession()
  if (!session) redirect('/login')

  const tagId   = formData.get('tagId') as string
  const name     = (formData.get('name') as string).trim()
  const assetType = (formData.get('assetType') as string).trim()
  const location  = (formData.get('location') as string).trim()
  const siteId   = formData.get('siteId') as string
  const installDateStr = formData.get('installDate') as string

  if (!name || !assetType || !location || !siteId || !installDateStr) {
    return { error: 'All fields are required.' }
  }

  const installDate = new Date(installDateStr).getTime()
  if (isNaN(installDate)) return { error: 'Invalid install date.' }

  const now = Date.now()

  try {
    await assetApi.create({
      id: randomUUID(),
      nfc_tag_id: tagId,
      site_id: siteId,
      name,
      asset_type: assetType,
      location,
      install_date: installDate,
      is_active: true,
      created_at: now,
    }, session.accessToken)
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message }
    return { error: 'Something went wrong. Please try again.' }
  }

  redirect(`/asset/${tagId}`)
}
