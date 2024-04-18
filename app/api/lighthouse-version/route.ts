import { NextResponse } from 'next/server'
import { fetchValidatorVersion } from '../config'

export async function GET() {
  try {
    const { version } = await fetchValidatorVersion()
    return NextResponse.json({ data: version })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch lighthouse version' }, { status: 500 })
  }
}
