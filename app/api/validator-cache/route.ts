import { NextResponse } from 'next/server'
import { fetchValCaches } from '../validator'

export async function GET() {
  try {
    const data = await fetchValCaches()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch validator cache' }, { status: 500 })
  }
}
