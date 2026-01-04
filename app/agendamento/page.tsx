"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getCurrentUser } from "@/lib/auth"
import { createBooking, getUserBookings, cancelBooking, getBookedDates } from "@/lib/bookings"
import type { Booking } from "@/lib/bookings"
import { Calendar, Loader2, Trash2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AgendamentoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<{ id: string; name: string; email: string; phone: string } | null>(null)
  const [userBookings, setUserBookings] = useState<Booking[]>([])
  const [bookedDates, setBookedDates] = useState<string[]>([])
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [formData, setFormData] = useState({
    date: "",
    eventType: "",
    guestCount: "",
    notes: "",
  })

  useEffect(() => {
    ;(async () => {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        router.push('/login')
        return
      }
      setUser(currentUser)
      const bookings = await getUserBookings()
      setUserBookings(bookings)
      const dates = await getBookedDates()
      setBookedDates(dates)
    })()
  }, [router])

  const loadUserBookings = (userId: string) => {
    const bookings = getUserBookings(userId)
    setUserBookings(bookings)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (!user) {
      setMessage({ type: "error", text: "Você precisa estar logado para agendar" })
      return
    }

    if (!formData.date || !formData.eventType || !formData.guestCount) {
      setMessage({ type: "error", text: "Preencha todos os campos obrigatórios" })
      return
    }

    setLoading(true)

    try {
      const result = await createBooking(
        formData.date,
        formData.eventType,
        Number.parseInt(formData.guestCount),
        formData.notes,
      )

      if (result.success) {
        setMessage({ type: 'success', text: result.message })
        setFormData({ date: '', eventType: '', guestCount: '', notes: '' })
        const bookings = await getUserBookings()
        setUserBookings(bookings)
        const dates = await getBookedDates()
        setBookedDates(dates)
      } else {
        setMessage({ type: 'error', text: result.message })
      }
    } catch (err) {
      setMessage({ type: "error", text: "Erro ao realizar agendamento. Tente novamente." })
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = (bookingId: string) => {
    if (!user) return

    const confirmed = window.confirm("Tem certeza que deseja cancelar este agendamento?")
    if (!confirmed) return

    const result = await cancelBooking(bookingId)
    if (result.success) {
      setMessage({ type: 'success', text: result.message })
      const bookings = await getUserBookings()
      setUserBookings(bookings)
      const dates = await getBookedDates()
      setBookedDates(dates)
    } else {
      setMessage({ type: 'error', text: result.message })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + "T00:00:00")
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  const isDateBooked = (date: string) => {
    return bookedDates.includes(date)
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card border-primary">
          <CardContent className="pt-6">
            <p className="text-center text-foreground mb-4">Você precisa estar logado para fazer agendamentos</p>
            <Button onClick={() => router.push("/login")} className="w-full bg-primary text-black hover:bg-primary/90">
              Fazer Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 pb-20">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Agendamento</h1>
          <div className="w-20 h-1 bg-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Reserve a Chácara Carnaubanos para seu evento</p>
        </div>

        {/* Mensagem */}
        {message && (
          <Alert
            className={
              message.type === "success" ? "border-primary bg-primary/10" : "border-destructive bg-destructive/10"
            }
          >
            <AlertCircle className={`h-4 w-4 ${message.type === "success" ? "text-primary" : "text-destructive"}`} />
            <AlertDescription className={message.type === "success" ? "text-primary" : "text-destructive"}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        {/* Formulário de Agendamento */}
        <Card className="bg-card border-primary">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Novo Agendamento
            </CardTitle>
            <CardDescription className="text-muted-foreground">Preencha os dados do seu evento</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-foreground">
                  Data do Evento *
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="bg-input border-primary text-foreground"
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
                {formData.date && isDateBooked(formData.date) && (
                  <p className="text-destructive text-sm">Esta data já está reservada. Escolha outra data.</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventType" className="text-foreground">
                  Tipo de Evento *
                </Label>
                <Select
                  value={formData.eventType}
                  onValueChange={(value) => setFormData({ ...formData, eventType: value })}
                >
                  <SelectTrigger className="bg-input border-primary text-foreground">
                    <SelectValue placeholder="Selecione o tipo de evento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aniversario">Aniversário</SelectItem>
                    <SelectItem value="churrasco">Churrasco</SelectItem>
                    <SelectItem value="confraternizacao">Confraternização</SelectItem>
                    <SelectItem value="casamento">Casamento</SelectItem>
                    <SelectItem value="formatura">Formatura</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="guestCount" className="text-foreground">
                  Número de Convidados *
                </Label>
                <Input
                  id="guestCount"
                  type="number"
                  min="1"
                  placeholder="Ex: 50"
                  value={formData.guestCount}
                  onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                  className="bg-input border-primary text-foreground"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-foreground">
                  Observações
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Informações adicionais sobre seu evento..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="bg-input border-primary text-foreground min-h-24"
                />
              </div>

              <Button
                type="submit"
                disabled={loading || (formData.date && isDateBooked(formData.date))}
                className="w-full bg-primary text-black hover:bg-primary/90"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Agendando...
                  </>
                ) : (
                  "Confirmar Agendamento"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Meus Agendamentos */}
        {userBookings.length > 0 && (
          <Card className="bg-card border-primary">
            <CardHeader>
              <CardTitle className="text-foreground">Meus Agendamentos</CardTitle>
              <CardDescription className="text-muted-foreground">Gerencie seus agendamentos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userBookings.map((booking) => {
                  const isPast = new Date(booking.date) < new Date()
                  return (
                    <div key={booking.id} className="bg-secondary/50 border border-primary/30 rounded-lg p-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <p className="text-primary font-semibold">{formatDate(booking.date)}</p>
                          <p className="text-foreground text-sm mt-1">
                            <span className="font-medium">Evento:</span> {booking.eventType}
                          </p>
                          <p className="text-foreground text-sm">
                            <span className="font-medium">Convidados:</span> {booking.guestCount}
                          </p>
                          {booking.notes && (
                            <p className="text-muted-foreground text-sm mt-2">
                              <span className="font-medium">Obs:</span> {booking.notes}
                            </p>
                          )}
                          {isPast && <p className="text-muted-foreground text-xs mt-2 italic">Evento realizado</p>}
                        </div>
                        {!isPast && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCancelBooking(booking.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
