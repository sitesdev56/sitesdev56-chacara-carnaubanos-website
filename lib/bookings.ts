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
export function getAllBookings(): Booking[] {
  if (typeof window === "undefined") return []
  const bookings = localStorage.getItem("carnaubanos_bookings")
  return bookings ? JSON.parse(bookings) : []
}

// Salvar agendamentos
export function saveBookings(bookings: Booking[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem("carnaubanos_bookings", JSON.stringify(bookings))
}

// Verificar se uma data já está reservada
export function isDateAvailable(date: string): boolean {
  const bookings = getAllBookings()
  return !bookings.some((booking) => booking.date === date)
}

// Obter datas reservadas
export function getBookedDates(): string[] {
  const bookings = getAllBookings()
  return bookings.map((booking) => booking.date)
}

// Criar novo agendamento
export function createBooking(
  user: UserSession,
  date: string,
  eventType: string,
  guestCount: number,
  notes?: string,
): { success: boolean; message: string; booking?: Booking } {
  // Verificar se a data já está reservada
  if (!isDateAvailable(date)) {
    return { success: false, message: "Esta data já está reservada" }
  }

  // Verificar se a data é futura
  const selectedDate = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (selectedDate < today) {
    return { success: false, message: "Não é possível agendar datas passadas" }
  }

  const bookings = getAllBookings()

  const newBooking: Booking = {
    id: Date.now().toString(),
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    userPhone: user.phone,
    date,
    eventType,
    guestCount,
    notes,
    createdAt: new Date().toISOString(),
  }

  bookings.push(newBooking)
  saveBookings(bookings)

  return { success: true, message: "Agendamento realizado com sucesso!", booking: newBooking }
}

// Obter agendamentos de um usuário
export function getUserBookings(userId: string): Booking[] {
  const bookings = getAllBookings()
  return bookings.filter((booking) => booking.userId === userId).sort((a, b) => a.date.localeCompare(b.date))
}

// Cancelar agendamento
export function cancelBooking(bookingId: string, userId: string): { success: boolean; message: string } {
  const bookings = getAllBookings()
  const booking = bookings.find((b) => b.id === bookingId)

  if (!booking) {
    return { success: false, message: "Agendamento não encontrado" }
  }

  if (booking.userId !== userId) {
    return { success: false, message: "Você não tem permissão para cancelar este agendamento" }
  }

  const updatedBookings = bookings.filter((b) => b.id !== bookingId)
  saveBookings(updatedBookings)

  return { success: true, message: "Agendamento cancelado com sucesso" }
}
