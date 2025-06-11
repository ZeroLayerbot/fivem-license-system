"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Settings, User, Lock, Bell, Palette, Save } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useTheme } from "@/contexts/theme-context"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState({
    username: user?.username || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    notifications: true,
    emailNotifications: true,
  })

  const handleSave = async () => {
    setLoading(true)
    // Simulate save
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="lg:ml-80 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Einstellungen</h1>
              <p className="text-muted-foreground">Verwalten Sie Ihre Konto- und Systemeinstellungen</p>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6">
          {/* Profile Settings */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Profil-Einstellungen</h3>
                  <p className="text-sm text-muted-foreground">Aktualisieren Sie Ihre persönlichen Informationen</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Benutzername</Label>
                  <Input
                    id="username"
                    value={settings.username}
                    onChange={(e) => setSettings({ ...settings, username: e.target.value })}
                    className="bg-white/10 border-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-Mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="bg-white/10 border-white/20"
                  />
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Password Settings */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Passwort ändern</h3>
                  <p className="text-sm text-muted-foreground">Aktualisieren Sie Ihr Passwort für mehr Sicherheit</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Aktuelles Passwort</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={settings.currentPassword}
                    onChange={(e) => setSettings({ ...settings, currentPassword: e.target.value })}
                    className="bg-white/10 border-white/20"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Neues Passwort</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={settings.newPassword}
                      onChange={(e) => setSettings({ ...settings, newPassword: e.target.value })}
                      className="bg-white/10 border-white/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={settings.confirmPassword}
                      onChange={(e) => setSettings({ ...settings, confirmPassword: e.target.value })}
                      className="bg-white/10 border-white/20"
                    />
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Appearance Settings */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Erscheinungsbild</h3>
                  <p className="text-sm text-muted-foreground">Passen Sie das Design an Ihre Vorlieben an</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">Wechseln zwischen hellem und dunklem Design</p>
                </div>
                <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
              </div>
            </GlassCard>
          </motion.div>

          {/* Notification Settings */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Benachrichtigungen</h3>
                  <p className="text-sm text-muted-foreground">Verwalten Sie Ihre Benachrichtigungseinstellungen</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Push-Benachrichtigungen</p>
                    <p className="text-sm text-muted-foreground">
                      Erhalten Sie Benachrichtigungen über wichtige Ereignisse
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications}
                    onCheckedChange={(checked) => setSettings({ ...settings, notifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">E-Mail-Benachrichtigungen</p>
                    <p className="text-sm text-muted-foreground">Erhalten Sie wichtige Updates per E-Mail</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                  />
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Save Button */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={loading}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Speichern...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Einstellungen speichern
                  </div>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
