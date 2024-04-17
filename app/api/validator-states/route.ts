import { NextResponse } from 'next/server'
import { fetchValStates } from '../validator';

export async function GET() {
  try {
    const data = await fetchValStates();
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch validator state data' }, {status: 500})
  }
}
