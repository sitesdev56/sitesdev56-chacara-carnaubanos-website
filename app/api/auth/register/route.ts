import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  const body = await req.json()
  const { name, email, phone, password } = body

  if (!name || !email || !password) {
    return NextResponse.json({ success: false, message: 'Campos obrigatórios faltando' }, { status: 400 })
  }

  // Verificar email existente
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ success: false, message: 'Email já cadastrado' }, { status: 409 })
  }

  const hashed = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({ data: { name, email, phone, password: hashed } })

  // Retornar sessão mínima
  return NextResponse.json({ success: true, message: 'Cadastro efetuado', user: { id: user.id, name: user.name, email: user.email, phone: user.phone } })
}
