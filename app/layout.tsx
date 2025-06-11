import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { ThemeProvider } from "@/contexts/theme-context"
import { ProtectedRoute } from "@/components/protected-route"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FiveM License System",
  description: "Professionelles Lizenzverwaltungssystem für FiveM Server",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <ProtectedRoute>{children}</ProtectedRoute>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
