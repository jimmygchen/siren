import { NextResponse } from 'next/server'
import { fetchPeerData } from '../beacon';

export async function GET() {
  try {
    const data  = await fetchPeerData();
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch peer data' }, {status: 500})
  }
}
