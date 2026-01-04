import jwt from 'jsonwebtoken'
import { prisma } from './prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'

export async function getUserFromRequest(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || ''
    const match = cookieHeader.match(/carnauba_token=([^;]+)/)
    if (!match) return null
    const token = match[1]
    const payload = jwt.verify(token, JWT_SECRET) as any
    const user = await prisma.user.findUnique({ where: { id: payload.userId } })
    if (!user) return null
    return { id: user.id, name: user.name, email: user.email, phone: user.phone }
  } catch (e) {
    return null
  }
}
