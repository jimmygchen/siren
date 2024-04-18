import { NextResponse } from 'next/server'
import { fetchValMetrics } from '../validator'

export async function GET() {
  try {
    const data = await fetchValMetrics()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch validator metrics' }, { status: 500 })
  }
}
