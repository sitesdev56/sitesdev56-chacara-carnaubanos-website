"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { registerUser, saveUserSession } from "@/lib/auth"
import { Loader2 } from "lucide-react"

export default function CadastroPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validações
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      setError("Preencha todos os campos")
      return
    }

    if (formData.password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem")
      return
    }

    setLoading(true)

    try {
      const result = await registerUser(formData.name, formData.email, formData.phone, formData.password)

      if (result.success && result.user) {
        saveUserSession(result.user)
        router.push("/")
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError("Erro ao criar conta. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-primary">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-foreground">Criar Conta</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Cadastre-se na Chácara Carnaubanos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">
                Nome Completo
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-input border-primary text-foreground"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-input border-primary text-foreground"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-foreground">
                Telefone / WhatsApp
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(00) 00000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-input border-primary text-foreground"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="bg-input border-primary text-foreground"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground">
                Confirmar Senha
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Digite a senha novamente"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="bg-input border-primary text-foreground"
                required
              />
            </div>

            {error && <p className="text-destructive text-sm text-center">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full bg-primary text-black hover:bg-primary/90">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando conta...
                </>
              ) : (
                "Criar Conta"
              )}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Faça login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
