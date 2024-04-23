import { NextResponse } from 'next/server'
import { fetchProposerDuties } from '../beacon';

export async function GET() {
  try {
    const data = await fetchProposerDuties()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch proposer data' }, { status: 500 })
  }
}
