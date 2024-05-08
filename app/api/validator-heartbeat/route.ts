import { NextResponse } from 'next/server'
import getReqAuthToken from '../../../utilities/getReqAuthToken';
import { fetchValidatorAuthKey } from '../config'

const errorMessage = 'Failed to maintain validator heartbeat'

export async function GET(req: Request) {
  try {
    const token = getReqAuthToken(req)
    const data = await fetchValidatorAuthKey(token)

    if (data?.token_path) {
      return NextResponse.json({ data: 'success' }, { status: 200 })
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  } catch (error) {
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
