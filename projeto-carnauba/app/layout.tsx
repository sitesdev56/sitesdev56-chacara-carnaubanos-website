import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { MobileNav } from "@/components/mobile-nav"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Chácara Carnaubanos - Espaço para Eventos",
  description: "Chácara Carnaubanos oferece espaço completo para eventos e área de banho em ambiente familiar",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans antialiased`}>
        <MobileNav />
        <main className="min-h-screen">{children}</main>
        <Analytics />
      </body>
    </html>
  )
}
