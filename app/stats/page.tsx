"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { BarChart3, Users, Key, Server, Activity, TrendingUp, Clock, Globe } from "lucide-react"
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

interface ServerStatus {
  server_name: string
  server_ip: string
  is_online: boolean
  current_players: number
  last_heartbeat: string
}

interface RecentLicense {
  server_name: string
  created_at: string
  username: string
}

export default function StatsPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [serverStatus, setServerStatus] = useState<ServerStatus[]>([])
  const [recentLicenses, setRecentLicenses] = useState<RecentLicense[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
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
        setServerStatus(data.serverStatus)
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
      description: "Registrierte Benutzer",
    },
    {
      title: "Gesamte Lizenzen",
      value: stats?.totalLicenses || 0,
      icon: Key,
      color: "from-purple-500 to-pink-500",
      description: "Alle erstellten Lizenzen",
    },
    {
      title: "Aktive Lizenzen",
      value: stats?.activeLicenses || 0,
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500",
      description: "Gültige und aktive Lizenzen",
    },
    {
      title: "Online Server",
      value: stats?.onlineServers || 0,
      icon: Server,
      color: "from-orange-500 to-red-500",
      description: "Derzeit online",
    },
    {
      title: "Aktive Spieler",
      value: stats?.totalPlayers || 0,
      icon: Activity,
      color: "from-indigo-500 to-purple-500",
      description: "Spieler auf allen Servern",
    },
    {
      title: "Systemstatus",
      value: "Online",
      icon: Globe,
      color: "from-teal-500 to-cyan-500",
      description: "License System Status",
    },
  ]

  if (loading) {
    return (
      <div className="lg:ml-80 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[...Array(6)].map((_, i) => (
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
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Statistiken</h1>
              <p className="text-muted-foreground">Übersicht über Ihr FiveM License System</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{stat.title}</h3>
                  <p className="text-sm text-muted-foreground">{stat.description}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Server Status */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
                  <Server className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Server Status</h3>
                  <p className="text-sm text-muted-foreground">Live Server-Übersicht</p>
                </div>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {serverStatus.map((server, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-white/5 dark:bg-black/10"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          server.is_online ? "bg-green-500" : "bg-red-500"
                        } animate-pulse`}
                      />
                      <div>
                        <p className="font-medium">{server.server_name}</p>
                        <p className="text-sm text-muted-foreground">{server.server_ip}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{server.current_players} Spieler</p>
                      <p className="text-xs text-muted-foreground">
                        {server.last_heartbeat ? formatDate(server.last_heartbeat) : "Nie"}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {serverStatus.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">Keine Server-Daten verfügbar</p>
                )}
              </div>
            </GlassCard>
          </motion.div>

          {/* Recent Activity */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Neueste Aktivitäten</h3>
                  <p className="text-sm text-muted-foreground">Zuletzt erstellte Lizenzen</p>
                </div>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {recentLicenses.map((license, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-white/5 dark:bg-black/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Key className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{license.server_name}</p>
                        <p className="text-sm text-muted-foreground">von {license.username}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{formatDate(license.created_at)}</p>
                  </motion.div>
                ))}

                {recentLicenses.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">Keine Aktivitäten vorhanden</p>
                )}
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* System Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
          <GlassCard className="p-6 mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">System Information</h3>
                <p className="text-sm text-muted-foreground">FiveM License System Status</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-white/5 dark:bg-black/10">
                <p className="text-sm text-muted-foreground">Server IP</p>
                <p className="font-mono">91.99.61.241</p>
              </div>
              <div className="p-4 rounded-lg bg-white/5 dark:bg-black/10">
                <p className="text-sm text-muted-foreground">Letzte Aktualisierung</p>
                <p className="font-mono">{new Date().toLocaleString("de-DE")}</p>
              </div>
              <div className="p-4 rounded-lg bg-white/5 dark:bg-black/10">
                <p className="text-sm text-muted-foreground">System Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-green-400">Online</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  )
}
