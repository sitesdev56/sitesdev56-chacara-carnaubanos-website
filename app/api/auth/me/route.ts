import { NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/authServer'

export async function GET(req: Request) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ success: false, user: null })
  return NextResponse.json({ success: true, user })
}
