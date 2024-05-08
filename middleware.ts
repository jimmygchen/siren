import { NextResponse } from 'next/server'
import { cookies } from 'next/headers';

const restrictedEndpoints = [
  '/setup/health-check',
  '/setup/node-sync',
  '/dashboard',
  '/dashboard/logs',
  '/dashboard/settings',
  '/dashboard/validators',
] as any

export async function middleware(request) {
  try {
    const { pathname } = request.nextUrl
    if (!restrictedEndpoints.includes(pathname)) {
      return NextResponse.next()
    }

    const cookieStore = cookies()
    const token = cookieStore.get('session-token').value

    if(!token) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
  } catch (e) {
    return NextResponse.redirect(new URL('/', request.url))
  }
}
