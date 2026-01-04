import { NextResponse } from 'next/server'

export async function POST() {
  const res = NextResponse.json({ success: true, message: 'Logout' })
  res.cookies.set('carnauba_token', '', { httpOnly: true, path: '/', maxAge: 0 })
  return res
}
