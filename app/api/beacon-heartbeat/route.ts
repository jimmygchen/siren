import { NextResponse } from 'next/server'
import { fetchBeaconNodeVersion } from '../config'

const errorMessage = 'Failed to maintain beacon heartbeat'

export async function GET() {
  try {
    const { version } = await fetchBeaconNodeVersion()

    if (version) {
      return NextResponse.json({ data: 'success' }, { status: 200 })
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  } catch (error) {
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
