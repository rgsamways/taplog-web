import { redirect } from 'next/navigation'

export default async function RegisterPage({
  searchParams,
}: PageProps<'/register'>) {
  const { tag } = await searchParams
  const tagId = Array.isArray(tag) ? tag[0] : tag
  if (tagId) redirect(`/asset/${tagId}`)
  redirect('/dashboard')
}
