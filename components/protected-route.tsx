"use client"

import type React from "react"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Navigation } from "./navigation"

const publicRoutes = ["/login", "/register"]

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user && !publicRoutes.includes(pathname)) {
        router.push("/login")
      } else if (user && publicRoutes.includes(pathname)) {
        router.push("/dashboard")
      }
    }
  }, [user, loading, pathname, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-black dark:via-gray-900 dark:to-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  if (!user && !publicRoutes.includes(pathname)) {
    return null
  }

  if (user && !publicRoutes.includes(pathname)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-black dark:via-gray-900 dark:to-black">
        <Navigation />
        <main className="pt-6 lg:pt-0">{children}</main>
      </div>
    )
  }

  return <div className="min-h-screen">{children}</div>
}
