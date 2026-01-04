import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'

export async function POST(req: Request) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ success: false, message: 'Campos obrigatórios faltando' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return NextResponse.json({ success: false, message: 'Email ou senha incorretos' }, { status: 401 })

  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return NextResponse.json({ success: false, message: 'Email ou senha incorretos' }, { status: 401 })

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })

  const res = NextResponse.json({ success: true, message: 'Login efetuado', user: { id: user.id, name: user.name, email: user.email, phone: user.phone } })
  // Set cookie httpOnly
  res.cookies.set('carnauba_token', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 })
  return res
}
