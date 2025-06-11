"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Key, Server, Users, Activity, TrendingUp, Clock } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { GlassCard } from "@/components/glass-card"
import { formatDate } from "@/lib/utils"

interface Stats {
  totalUsers: number
  totalLicenses: number
  activeLicenses: number
  onlineServers: number
  totalPlayers: number
}

interface RecentLicense {
  server_name: string
  created_at: string
  username: string
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentLicenses, setRecentLicenses] = useState<RecentLicense[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/stats", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
        setRecentLicenses(data.recentLicenses)
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: "Gesamte Benutzer",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Aktive Lizenzen",
      value: stats?.activeLicenses || 0,
      icon: Key,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Online Server",
      value: stats?.onlineServers || 0,
      icon: Server,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Aktive Spieler",
      value: stats?.totalPlayers || 0,
      icon: Activity,
      color: "from-orange-500 to-red-500",
    },
  ]

  if (loading) {
    return (
      <div className="lg:ml-80 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <GlassCard key={i} className="p-6">
                <div className="animate-pulse">
                  <div className="w-12 h-12 bg-white/20 rounded-xl mb-4"></div>
                  <div className="h-4 bg-white/20 rounded mb-2"></div>
                  <div className="h-8 bg-white/20 rounded"></div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="lg:ml-80 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Willkommen zurück, {user?.username}!</h1>
          <p className="text-muted-foreground">Hier ist eine Übersicht über Ihr FiveM License System</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Neueste Aktivitäten</h3>
                  <p className="text-sm text-muted-foreground">Zuletzt erstellte Lizenzen</p>
                </div>
              </div>

              <div className="space-y-4">
                {recentLicenses.map((license, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 dark:bg-black/10"
                  >
                    <div>
                      <p className="font-medium">{license.server_name}</p>
                      <p className="text-sm text-muted-foreground">von {license.username}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{formatDate(license.created_at)}</p>
                  </motion.div>
                ))}

                {recentLicenses.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">Noch keine Aktivitäten vorhanden</p>
                )}
              </div>
            </GlassCard>
          </motion.div>

          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Schnellzugriff</h3>
                  <p className="text-sm text-muted-foreground">Häufig verwendete Aktionen</p>
                </div>
              </div>

              <div className="space-y-3">
                <motion.a
                  href="/licenses"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="block p-4 rounded-lg bg-white/5 dark:bg-black/10 hover:bg-white/10 dark:hover:bg-black/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Key className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="font-medium">Lizenzen verwalten</p>
                      <p className="text-sm text-muted-foreground">Ihre Lizenzen anzeigen und bearbeiten</p>
                    </div>
                  </div>
                </motion.a>

                <motion.a
                  href="/stats"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="block p-4 rounded-lg bg-white/5 dark:bg-black/10 hover:bg-white/10 dark:hover:bg-black/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="font-medium">Statistiken anzeigen</p>
                      <p className="text-sm text-muted-foreground">Detaillierte Systemstatistiken</p>
                    </div>
                  </div>
                </motion.a>

                {user?.role === "admin" && (
                  <motion.a
                    href="/admin"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="block p-4 rounded-lg bg-white/5 dark:bg-black/10 hover:bg-white/10 dark:hover:bg-black/20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="font-medium">Admin Panel</p>
                        <p className="text-sm text-muted-foreground">Benutzer und System verwalten</p>
                      </div>
                    </div>
                  </motion.a>
                )}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
