import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/authServer'

export async function GET(req: Request) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ success: false, message: 'Não autorizado' }, { status: 401 })

  const bookings = await prisma.booking.findMany({ where: { userId: user.id }, orderBy: { date: 'asc' } })
  return NextResponse.json({ success: true, bookings })
}

export async function POST(req: Request) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ success: false, message: 'Não autorizado' }, { status: 401 })

  const { date, note, eventType, guestCount } = await req.json()
  if (!date || !eventType || !guestCount) return NextResponse.json({ success: false, message: 'Campos obrigatórios faltando' }, { status: 400 })

  // Validar data futura
  const selectedDate = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (selectedDate < today) return NextResponse.json({ success: false, message: 'Não é possível agendar datas passadas' }, { status: 400 })

  // Verificar se data já ocupada
  const exists = await prisma.booking.findFirst({ where: { date: { gte: new Date(date), lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000) } } })
  if (exists) return NextResponse.json({ success: false, message: 'Esta data já está reservada' }, { status: 409 })

  const booking = await prisma.booking.create({ data: { userId: user.id, date: new Date(date), note, eventType, guestCount } })
  return NextResponse.json({ success: true, booking })
}
