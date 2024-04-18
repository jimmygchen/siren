import { NextResponse } from 'next/server'
import { fetchValidatorAuthKey } from '../config'

const errorMessage = 'Failed to maintain validator heartbeat'

export async function GET() {
  try {
    const data = await fetchValidatorAuthKey()

    if (data?.token_path) {
      return NextResponse.json({ data: 'success' }, { status: 200 })
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  } catch (error) {
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
