import { NextResponse } from 'next/server'
import { fetchInclusionRate } from '../beacon';

export async function GET() {
  try {
    const data = await fetchInclusionRate();
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch validator inclusion data' }, {status: 500})
  }
}
