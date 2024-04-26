import { NextResponse } from 'next/server'
import { fetchValMetrics } from '../validator';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const index = url.searchParams.get('index')

    const data = await fetchValMetrics(index)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch validator metrics' }, { status: 500 })
  }
}
