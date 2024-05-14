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
    let status = 500
    if(error?.message.includes('401')) {
      status = 401
    }
    return NextResponse.json({ error }, { status })
  }
}