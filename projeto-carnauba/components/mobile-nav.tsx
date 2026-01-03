"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const storedUser = localStorage.getItem("carnaubanos_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("carnaubanos_user")
    setUser(null)
    setIsOpen(false)
    window.location.href = "/"
  }

  const menuItems = [
    { href: "/", label: "Início" },
    { href: "/sobre", label: "Sobre-nós" },
    { href: "/galeria", label: "Galeria" },
    { href: "/agendamento", label: "Agendamento" },
  ]

  return (
    <>
      {/* Menu Hambúrguer Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 right-4 z-50 bg-black border-2 border-primary hover:bg-primary hover:text-black"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6 text-primary" /> : <Menu className="h-6 w-6 text-primary" />}
      </Button>

      {/* Menu Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/80 z-40" onClick={() => setIsOpen(false)} />}

      {/* Menu Sidebar */}
      <nav
        className={`fixed top-0 right-0 h-full w-72 bg-black border-l-2 border-primary z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6 pt-20">
          {/* User Info */}
          {user && (
            <div className="mb-8 pb-6 border-b border-primary">
              <p className="text-primary font-semibold">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          )}

          {/* Menu Items */}
          <ul className="space-y-4 flex-1">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block py-3 px-4 rounded-lg transition-colors ${
                    pathname === item.href
                      ? "bg-primary text-black font-semibold"
                      : "text-foreground hover:bg-primary/20 hover:text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Auth Actions */}
          <div className="pt-6 border-t border-primary space-y-3">
            {user ? (
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary hover:text-black bg-transparent"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary hover:text-black bg-transparent"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/cadastro" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-primary text-black hover:bg-primary/90">Criar Conta</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}
