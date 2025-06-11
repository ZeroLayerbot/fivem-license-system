"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Shield, Users, Key, Plus, UserCheck, UserX, Edit, Trash2, MoreHorizontal } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { formatDate } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface User {
  id: number
  username: string
  email: string
  role: "user" | "admin"
  created_at: string
  last_login: string | null
  is_active: boolean
}

interface License {
  id: number
  license_key: string
  script_name: string
  server_name: string
  server_ip: string
  server_port: number
  max_players: number
  expires_at: string | null
  is_active: boolean
  created_at: string
  username: string
  user_id: number
}

export default function AdminPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [licenses, setLicenses] = useState<License[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"users" | "licenses">("users")
  const [showCreateUserDialog, setShowCreateUserDialog] = useState(false)
  const [showEditUserDialog, setShowEditUserDialog] = useState<User | null>(null)
  const [showDeleteUserDialog, setShowDeleteUserDialog] = useState<User | null>(null)
  const [showCreateLicenseDialog, setShowCreateLicenseDialog] = useState(false)
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "user" as "user" | "admin",
  })
  const [editUser, setEditUser] = useState({
    username: "",
    email: "",
    role: "user" as "user" | "admin",
    is_active: true,
  })
  const [newLicense, setNewLicense] = useState({
    script_name: "",
    server_name: "",
    server_ip: "",
    server_port: 30120,
    max_players: 32,
    expires_at: "",
    user_id: "",
  })

  useEffect(() => {
    if (user?.role !== "admin") {
      router.push("/dashboard")
      return
    }
    fetchData()
  }, [user, router])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token")

      // Fetch users
      const usersResponse = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (usersResponse.ok) {
        const usersData = await usersResponse.json()
        setUsers(usersData)
      }

      // Fetch all licenses
      const licensesResponse = await fetch("/api/licenses", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (licensesResponse.ok) {
        const licensesData = await licensesResponse.json()
        setLicenses(licensesData)
      }
    } catch (error) {
      console.error("Failed to fetch admin data:", error)
    } finally {
      setLoading(false)
    }
  }

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      })

      if (response.ok) {
        setShowCreateUserDialog(false)
        setNewUser({ username: "", email: "", password: "", role: "user" })
        fetchData()
      }
    } catch (error) {
      console.error("Failed to create user:", error)
    }
  }

  const updateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!showEditUserDialog) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/admin/users/${showEditUserDialog.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editUser),
      })

      if (response.ok) {
        setShowEditUserDialog(null)
        fetchData()
      }
    } catch (error) {
      console.error("Failed to update user:", error)
    }
  }

  const deleteUser = async () => {
    if (!showDeleteUserDialog) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/admin/users/${showDeleteUserDialog.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        setShowDeleteUserDialog(null)
        fetchData()
      }
    } catch (error) {
      console.error("Failed to delete user:", error)
    }
  }

  const toggleUserStatus = async (userId: number, isActive: boolean) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_active: !isActive }),
      })

      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error("Failed to toggle user status:", error)
    }
  }

  const openEditUserDialog = (userData: User) => {
    setEditUser({
      username: userData.username,
      email: userData.email,
      role: userData.role,
      is_active: userData.is_active,
    })
    setShowEditUserDialog(userData)
  }

  const createLicense = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/licenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newLicense),
      })

      if (response.ok) {
        setShowCreateLicenseDialog(false)
        setNewLicense({
          script_name: "",
          server_name: "",
          server_ip: "",
          server_port: 30120,
          max_players: 32,
          expires_at: "",
          user_id: "",
        })
        fetchData()
      }
    } catch (error) {
      console.error("Failed to create license:", error)
    }
  }

  if (user?.role !== "admin") {
    return null
  }

  if (loading) {
    return (
      <div className="lg:ml-80 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-white/20 rounded mb-4"></div>
            <div className="h-64 bg-white/20 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="lg:ml-80 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Admin Panel</h1>
              <p className="text-muted-foreground">Systemverwaltung und Benutzerkontrolle</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={activeTab === "users" ? "default" : "ghost"}
              onClick={() => setActiveTab("users")}
              className={activeTab === "users" ? "bg-gradient-to-r from-blue-500 to-purple-600" : ""}
            >
              <Users className="w-4 h-4 mr-2" />
              Benutzer ({users.length})
            </Button>
            <Button
              variant={activeTab === "licenses" ? "default" : "ghost"}
              onClick={() => setActiveTab("licenses")}
              className={activeTab === "licenses" ? "bg-gradient-to-r from-blue-500 to-purple-600" : ""}
            >
              <Key className="w-4 h-4 mr-2" />
              Lizenzen ({licenses.length})
            </Button>
          </div>
        </motion.div>

        {/* Users Tab */}
        {activeTab === "users" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Benutzerverwaltung</h2>
              <Dialog open={showCreateUserDialog} onOpenChange={setShowCreateUserDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Benutzer erstellen
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-black/80 backdrop-blur-xl border-white/20">
                  <DialogHeader>
                    <DialogTitle>Neuen Benutzer erstellen</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={createUser} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Benutzername</Label>
                      <Input
                        id="username"
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        required
                        className="bg-white/10 border-white/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-Mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        required
                        className="bg-white/10 border-white/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Passwort</Label>
                      <Input
                        id="password"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        required
                        className="bg-white/10 border-white/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Rolle</Label>
                      <Select
                        value={newUser.role}
                        onValueChange={(value: "user" | "admin") => setNewUser({ ...newUser, role: value })}
                      >
                        <SelectTrigger className="bg-white/10 border-white/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">Benutzer</SelectItem>
                          <SelectItem value="admin">Administrator</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full">
                      Benutzer erstellen
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {users.map((userData, index) => (
                <motion.div
                  key={userData.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                          {userData.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{userData.username}</h3>
                            <Badge variant={userData.role === "admin" ? "destructive" : "secondary"}>
                              {userData.role === "admin" ? "Admin" : "Benutzer"}
                            </Badge>
                            <Badge variant={userData.is_active ? "default" : "secondary"}>
                              {userData.is_active ? "Aktiv" : "Inaktiv"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{userData.email}</p>
                          <p className="text-xs text-muted-foreground">
                            Registriert: {formatDate(userData.created_at)}
                            {userData.last_login && ` • Letzter Login: ${formatDate(userData.last_login)}`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-black/80 backdrop-blur-xl border-white/20">
                            <DropdownMenuItem onClick={() => openEditUserDialog(userData)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Bearbeiten
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleUserStatus(userData.id, userData.is_active)}>
                              {userData.is_active ? (
                                <>
                                  <UserX className="w-4 h-4 mr-2" />
                                  Deaktivieren
                                </>
                              ) : (
                                <>
                                  <UserCheck className="w-4 h-4 mr-2" />
                                  Aktivieren
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setShowDeleteUserDialog(userData)}
                              className="text-red-400 focus:text-red-300"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Löschen
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Licenses Tab */}
        {activeTab === "licenses" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Lizenzverwaltung</h2>
              <Dialog open={showCreateLicenseDialog} onOpenChange={setShowCreateLicenseDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Lizenz erstellen
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-black/80 backdrop-blur-xl border-white/20">
                  <DialogHeader>
                    <DialogTitle>Neue Lizenz erstellen</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={createLicense} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="script_name">Script-Name</Label>
                      <Input
                        id="script_name"
                        value={newLicense.script_name}
                        onChange={(e) => setNewLicense({ ...newLicense, script_name: e.target.value })}
                        required
                        className="bg-white/10 border-white/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="server_name">Servername</Label>
                      <Input
                        id="server_name"
                        value={newLicense.server_name}
                        onChange={(e) => setNewLicense({ ...newLicense, server_name: e.target.value })}
                        required
                        className="bg-white/10 border-white/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="server_ip">Server IP:Port</Label>
                      <Input
                        id="server_ip"
                        value={newLicense.server_ip}
                        onChange={(e) => setNewLicense({ ...newLicense, server_ip: e.target.value })}
                        required
                        className="bg-white/10 border-white/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max_players">Max. Spieler</Label>
                      <Input
                        id="max_players"
                        type="number"
                        value={newLicense.max_players}
                        onChange={(e) => setNewLicense({ ...newLicense, max_players: Number.parseInt(e.target.value) })}
                        className="bg-white/10 border-white/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user_id">Benutzer ID</Label>
                      <Select
                        value={newLicense.user_id}
                        onValueChange={(value) => setNewLicense({ ...newLicense, user_id: value })}
                      >
                        <SelectTrigger className="bg-white/10 border-white/20">
                          <SelectValue placeholder="Benutzer auswählen" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map((userData) => (
                            <SelectItem key={userData.id} value={userData.id.toString()}>
                              {userData.username} ({userData.email})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expires_at">Ablaufdatum (Optional)</Label>
                      <Input
                        id="expires_at"
                        type="datetime-local"
                        value={newLicense.expires_at}
                        onChange={(e) => setNewLicense({ ...newLicense, expires_at: e.target.value })}
                        className="bg-white/10 border-white/20"
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Lizenz erstellen
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {licenses.map((license, index) => (
                <motion.div
                  key={license.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
                          <Key className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{license.script_name}</h3>
                            <Badge variant={license.is_active ? "default" : "secondary"}>
                              {license.is_active ? "Aktiv" : "Inaktiv"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{license.server_name}</p>
                          <p className="text-sm text-muted-foreground">Besitzer: {license.username}</p>
                          <p className="text-xs text-muted-foreground">
                            Erstellt: {formatDate(license.created_at)}
                            {license.expires_at && ` • Läuft ab: ${formatDate(license.expires_at)}`}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-mono">{license.license_key}</p>
                        <p className="text-xs text-muted-foreground">Max. {license.max_players} Spieler</p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Edit User Dialog */}
        {showEditUserDialog && (
          <Dialog open={!!showEditUserDialog} onOpenChange={() => setShowEditUserDialog(null)}>
            <DialogContent className="bg-black/80 backdrop-blur-xl border-white/20">
              <DialogHeader>
                <DialogTitle>Benutzer bearbeiten</DialogTitle>
              </DialogHeader>
              <form onSubmit={updateUser} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_username">Benutzername</Label>
                  <Input
                    id="edit_username"
                    value={editUser.username}
                    onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                    required
                    className="bg-white/10 border-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_email">E-Mail</Label>
                  <Input
                    id="edit_email"
                    type="email"
                    value={editUser.email}
                    onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                    required
                    className="bg-white/10 border-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_role">Rolle</Label>
                  <Select
                    value={editUser.role}
                    onValueChange={(value: "user" | "admin") => setEditUser({ ...editUser, role: value })}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Benutzer</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit_is_active"
                    checked={editUser.is_active}
                    onChange={(e) => setEditUser({ ...editUser, is_active: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="edit_is_active">Benutzer aktiv</Label>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    Speichern
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => setShowEditUserDialog(null)} className="flex-1">
                    Abbrechen
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}

        {/* Delete User Dialog */}
        <AlertDialog open={!!showDeleteUserDialog} onOpenChange={() => setShowDeleteUserDialog(null)}>
          <AlertDialogContent className="bg-black/80 backdrop-blur-xl border-white/20">
            <AlertDialogHeader>
              <AlertDialogTitle>Benutzer löschen</AlertDialogTitle>
              <AlertDialogDescription>
                Sind Sie sicher, dass Sie den Benutzer "{showDeleteUserDialog?.username}" löschen möchten? Alle
                zugehörigen Lizenzen werden ebenfalls gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Abbrechen</AlertDialogCancel>
              <AlertDialogAction onClick={deleteUser} className="bg-red-600 hover:bg-red-700">
                Löschen
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
