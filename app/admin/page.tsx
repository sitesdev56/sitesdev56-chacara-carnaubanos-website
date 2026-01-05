"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { Calendar, Phone, User, AlertCircle } from "lucide-react"

import { getCurrentUser } from "@/lib/auth"
import { getAllBookings, type Booking } from "@/lib/bookings"

type UserType = {
  id: string
  name: string
  email: string
  phone: string
}

export default function AdminPage() {
  const router = useRouter()

  const [user, setUser] = useState<UserType | null>(null)
  const [allBookings, setAllBookings] = useState<Booking[]>([])
  const [message, setMessage] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()

    if (!currentUser) {
      router.push("/login")
      return
    }

    setUser(currentUser)
    loadAllBookings()
  }, [router])

  const loadAllBookings = () => {
    const bookings = getAllBookings()
    setAllBookings(
      bookings.sort((a, b) => a.date.localeCompare(b.date))
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(`${dateString}T00:00:00`)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card border-primary">
          <CardContent className="pt-6">
            <p className="text-center text-foreground mb-4">
              Você precisa estar logado para acessar esta página
            </p>
            <Button
              onClick={() => router.push("/login")}
              className="w-full bg-primary text-black hover:bg-primary/90"
            >
              Fazer Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Administração - Agendamentos
          </h1>
          <div className="w-20 h-1 bg-primary mx-auto mb-4" />
          <p className="text-muted-foreground">
            Visualize todos os agendamentos dos clientes
          </p>
        </div>

        {/* Mensagem */}
        {message && (
          <Alert
            className={
              message.type === "success"
                ? "border-primary bg-primary/10"
                : "border-destructive bg-destructive/10"
            }
          >
            <AlertCircle
              className={`h-4 w-4 ${
                message.type === "success"
                  ? "text-primary"
                  : "text-destructive"
              }`}
            />
            <AlertDescription
              className={
                message.type === "success"
                  ? "text-primary"
                  : "text-destructive"
              }
            >
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        {/* Lista de Agendamentos */}
        <Card className="bg-card border-primary">
          <CardHeader>
            <CardTitle className="text-foreground">
              Todos os Agendamentos
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Total: {allBookings.length} agendamento
              {allBookings.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {allBookings.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nenhum agendamento encontrado
              </p>
            ) : (
              <div className="space-y-3">
                {allBookings.map((booking) => {
                  const isPast =
                    new Date(`${booking.date}T00:00:00`) <
                    new Date()

                  return (
                    <div
                      key={booking.id}
                      className="bg-secondary/50 border border-primary/30 rounded-lg p-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-primary" />
                          <div>
                            <p className="text-primary font-semibold">
                              {booking.userName}
                            </p>
                            <p className="text-muted-foreground text-sm">
                              {booking.userEmail}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-primary" />
                          <p className="text-foreground">
                            {booking.userPhone}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <div>
                            <p className="text-foreground font-medium">
                              {formatDate(booking.date)}
                            </p>
                            <p className="text-muted-foreground text-sm">
                              {booking.eventType} –{" "}
                              {booking.guestCount} convidados
                            </p>
                            {isPast && (
                              <p className="text-muted-foreground text-xs italic">
                                Realizado
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {booking.notes && (
                        <div className="mt-3 pt-3 border-t border-primary/20">
                          <p className="text-muted-foreground text-sm">
                            <span className="font-medium">
                              Observações:
                            </span>{" "}
                            {booking.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Botão Voltar */}
        <div className="text-center">
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-black"
          >
            Voltar ao Início
          </Button>
        </div>
      </div>
    </div>
  )
}
