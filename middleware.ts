import { NextResponse } from 'next/server'
import { fetchBeaconNodeVersion, fetchValidatorVersion } from './app/api/config'

const restrictedEndpoints = [
  '/setup/health-check',
  '/setup/node-sync',
  '/dashboard',
  '/dashboard/logs',
  '/dashboard/settings',
  '/dashboard/validators',
] as any

export async function middleware(request) {
  const { pathname } = request.nextUrl
  if (!restrictedEndpoints.includes(pathname)) {
    return NextResponse.next()
  }

  const responses = await Promise.all([fetchBeaconNodeVersion(), fetchValidatorVersion()])

  if (!responses.length) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  const beaconData = responses[0]?.version
  const validatorData = responses[1]?.version

  if (!beaconData || !validatorData) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}
