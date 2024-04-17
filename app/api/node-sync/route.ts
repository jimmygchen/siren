import { NextResponse } from 'next/server'
import { fetchSyncData } from '../beacon';

export async function GET() {
  try {
    const data = await fetchSyncData();
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sync status' }, {status: 500})
  }
}
