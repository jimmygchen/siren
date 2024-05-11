import { NextResponse } from 'next/server';
import getReqAuthToken from '../../../utilities/getReqAuthToken';
import { broadcastBlsChange } from '../beacon';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const token = getReqAuthToken(req)
    await broadcastBlsChange(data, token)

    return NextResponse.json('done', {status: 200})
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}