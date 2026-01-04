import type { UserSession } from "./auth"

export interface Booking {
  id: string
  userId: string
  userName: string
  userEmail: string
  userPhone: string
  date: string // formato YYYY-MM-DD
  eventType: string
  guestCount: number
  notes?: string
  createdAt: string
}

// Obter todos os agendamentos
export async function getBookedDates(): Promise<string[]> {
  const res = await fetch('/api/bookings')
  const data = await res.json()
  if (!data.success) return []
  return data.bookings.map((b: any) => b.date.split('T')[0])
}

export async function getUserBookings(): Promise<Booking[]> {
  const res = await fetch('/api/bookings')
  const data = await res.json()
  if (!data.success) return []
  return data.bookings.map((b: any) => ({
    id: b.id,
    userId: b.userId,
    userName: '',
    userEmail: '',
    userPhone: '',
    date: b.date,
    eventType: b.eventType,
    guestCount: b.guestCount,
    notes: b.note ?? '',
    createdAt: b.createdAt,
  }))
}

export async function createBooking(date: string, eventType: string, guestCount: number, notes?: string) {
  const res = await fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date, eventType, guestCount, note: notes }),
  })
  return res.json()
}

export async function cancelBooking(bookingId: string) {
  const res = await fetch(`/api/bookings/${bookingId}`, { method: 'DELETE' })
  return res.json()
}
