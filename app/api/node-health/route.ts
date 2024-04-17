import { NextResponse } from 'next/server'
import { fetchNodeHealth } from '../beacon';

export async function GET() {
  try {
    const data = await fetchNodeHealth();
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch node health data' }, {status: 500})
  }
}
