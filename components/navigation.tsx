"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Home, Key, BarChart3, Settings, LogOut, Menu, X, Shield } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { ThemeToggle } from "./theme-toggle"
import { GlassCard } from "./glass-card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Lizenzen", href: "/licenses", icon: Key },
  { name: "Statistiken", href: "/stats", icon: BarChart3 },
  { name: "Einstellungen", href: "/settings", icon: Settings },
]

const adminNavigation = [{ name: "Admin Panel", href: "/admin", icon: Shield }]

export function Navigation() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const allNavigation = user?.role === "admin" ? [...navigation, ...adminNavigation] : navigation

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:block fixed left-6 top-6 bottom-6 w-64 z-50">
        <GlassCard className="h-full p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Key className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">FiveM License</h1>
              <p className="text-sm text-muted-foreground">System</p>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            {allNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href}>
                  <motion.div
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors relative",
                      isActive
                        ? "bg-white/20 dark:bg-white/10 text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/10 dark:hover:bg-white/5",
                    )}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                    {isActive && (
                      <motion.div
                        className="absolute right-2 w-2 h-2 rounded-full bg-blue-500"
                        layoutId="activeIndicator"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.div>
                </Link>
              )
            })}
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-3 px-4 py-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
                {user?.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user?.username}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="rounded-full bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 hover:bg-red-500/20"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </GlassCard>
      </nav>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <div className="fixed top-6 left-6 right-6 z-50">
          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Key className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold">FiveM License</span>
              </div>

              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="rounded-full"
                >
                  {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-6 right-6 z-40"
          >
            <GlassCard className="p-4">
              <div className="space-y-2">
                {allNavigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link key={item.name} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                      <div
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                          isActive
                            ? "bg-white/20 dark:bg-white/10 text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-white/10",
                        )}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                      </div>
                    </Link>
                  )
                })}

                <div className="pt-2 border-t border-white/10">
                  <Button
                    variant="ghost"
                    onClick={logout}
                    className="w-full justify-start gap-3 px-4 py-3 h-auto text-muted-foreground hover:text-foreground"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Abmelden</span>
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </>
  )
}
