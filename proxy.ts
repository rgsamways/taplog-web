import { NextRequest, NextResponse } from 'next/server'
import { decryptSession } from '@/lib/auth'

const protectedRoutes = ['/dashboard', '/asset', '/admin']
const authRoutes = ['/login', '/signup', '/verify']

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isProtected = protectedRoutes.some(r => pathname.startsWith(r))
  const isAuth = authRoutes.some(r => pathname.startsWith(r))

  const token = req.cookies.get('taplog_session')?.value
  const session = token ? await decryptSession(token) : null
  const isLoggedIn = !!session && session.expiresAt > Date.now()

  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL('/login', req.nextUrl)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuth && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|ico)$).*)'],
}
