import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/authServer'

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ success: false, message: 'Não autorizado' }, { status: 401 })

  const id = params.id
  const booking = await prisma.booking.findUnique({ where: { id } })
  if (!booking) return NextResponse.json({ success: false, message: 'Agendamento não encontrado' }, { status: 404 })
  if (booking.userId !== user.id) return NextResponse.json({ success: false, message: 'Ação não permitida' }, { status: 403 })

  await prisma.booking.delete({ where: { id } })
  return NextResponse.json({ success: true, message: 'Agendamento cancelado' })
}
