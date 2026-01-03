import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <div className="mb-6">
        <div className="w-40 h-40 rounded-full bg-primary flex items-center justify-center border-4 border-primary shadow-lg shadow-primary/50">
          <span className="text-6xl font-bold text-black">C</span>
        </div>
      </div>

      {/* Nome */}
      <h1 className="text-4xl font-bold text-foreground mb-12 text-center">Carnaubanos</h1>

      {/* Botão Agendar */}
      <Link href="/agendamento" className="w-full max-w-xs">
        <Button
          size="lg"
          className="w-full bg-primary text-black hover:bg-primary/90 text-xl py-6 font-semibold shadow-lg shadow-primary/30"
        >
          Agendar
        </Button>
      </Link>
    </div>
  )
}
