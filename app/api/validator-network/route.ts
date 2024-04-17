import { NextResponse } from 'next/server'
import { fetchValidatorCountData } from '../beacon';

export async function GET() {
  try {
    const data  = await fetchValidatorCountData();
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch validator data' }, {status: 500})
  }
}
