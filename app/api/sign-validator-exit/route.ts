import { NextResponse } from 'next/server';
import getReqAuthToken from '../../../utilities/getReqAuthToken';
import { signVoluntaryExit } from '../validator';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const token = getReqAuthToken(req)
    const res = await signVoluntaryExit(data, token)

    return NextResponse.json(res, {status: 200})
  } catch (error) {
    let status = 500;

    if(error.message.includes('401')) {
      status = 401
    }
    return NextResponse.json({ error }, { status })
  }
}