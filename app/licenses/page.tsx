"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Key,
  Plus,
  Server,
  Copy,
  Code,
  FileText,
  Eye,
  EyeOff,
  CheckCircle,
  Edit,
  Trash2,
  MoreHorizontal,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  username?: string
  is_online?: boolean
  current_players?: number
  last_heartbeat?: string
}

export default function LicensesPage() {
  const { user } = useAuth()
  const [licenses, setLicenses] = useState<License[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState<License | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState<License | null>(null)
  const [showKeys, setShowKeys] = useState<{ [key: number]: boolean }>({})
  const [showCodeDialog, setShowCodeDialog] = useState<License | null>(null)
  const [copySuccess, setCopySuccess] = useState<string | null>(null)
  const [newLicense, setNewLicense] = useState({
    script_name: "",
    server_name: "",
    server_ip: "",
    server_port: 30120,
    max_players: 32,
    expires_at: "",
    user_id: "",
  })
  const [editLicense, setEditLicense] = useState({
    script_name: "",
    server_name: "",
    server_ip: "",
    server_port: 30120,
    max_players: 32,
    expires_at: "",
    is_active: true,
  })

  useEffect(() => {
    fetchLicenses()
  }, [])

  const fetchLicenses = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/licenses", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setLicenses(data)
      }
    } catch (error) {
      console.error("Failed to fetch licenses:", error)
    } finally {
      setLoading(false)
    }
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
        setShowCreateDialog(false)
        setNewLicense({
          script_name: "",
          server_name: "",
          server_ip: "",
          server_port: 30120,
          max_players: 32,
          expires_at: "",
          user_id: "",
        })
        fetchLicenses()
      }
    } catch (error) {
      console.error("Failed to create license:", error)
    }
  }

  const updateLicense = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!showEditDialog) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/licenses/${showEditDialog.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editLicense),
      })

      if (response.ok) {
        setShowEditDialog(null)
        fetchLicenses()
      }
    } catch (error) {
      console.error("Failed to update license:", error)
    }
  }

  const deleteLicense = async () => {
    if (!showDeleteDialog) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/licenses/${showDeleteDialog.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        setShowDeleteDialog(null)
        fetchLicenses()
      }
    } catch (error) {
      console.error("Failed to delete license:", error)
    }
  }

  const toggleLicenseStatus = async (licenseId: number, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/licenses/${licenseId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_active: !currentStatus }),
      })

      if (response.ok) {
        fetchLicenses()
      }
    } catch (error) {
      console.error("Failed to toggle license status:", error)
    }
  }

  const openEditDialog = (license: License) => {
    setEditLicense({
      script_name: license.script_name,
      server_name: license.server_name,
      server_ip: license.server_ip,
      server_port: license.server_port,
      max_players: license.max_players,
      expires_at: license.expires_at ? new Date(license.expires_at).toISOString().slice(0, 16) : "",
      is_active: license.is_active,
    })
    setShowEditDialog(license)
  }

  const toggleKeyVisibility = (licenseId: number) => {
    setShowKeys((prev) => ({
      ...prev,
      [licenseId]: !prev[licenseId],
    }))
  }

  const generateLuaCode = (license: License) => {
    return `-- ${license.script_name} License Check
local licenseKey = "${license.license_key}"
local scriptName = "${license.script_name}"
local licenseServer = "http://91.99.61.241:3000"

-- License validation function
function ValidateScriptLicense()
    PerformHttpRequest(licenseServer .. "/api/fivem/validate-script", function(statusCode, response, headers)
        if statusCode == 200 then
            local data = json.decode(response)
            if data.valid then
                print("^2[" .. scriptName .. "] Script-Lizenz erfolgreich validiert!")
                print("^2[" .. scriptName .. "] Läuft ab am: " .. (data.license.expires_at or "Nie"))
                
                -- Script starten
                StartScript()
            else
                print("^1[" .. scriptName .. "] Script-Lizenz ungültig: " .. data.error)
                print("^1[" .. scriptName .. "] Script wird nicht gestartet!")
                return
            end
        else
            print("^1[" .. scriptName .. "] Lizenz-Validierung fehlgeschlagen: " .. statusCode)
            return
        end
    end, "POST", json.encode({
        license_key = licenseKey,
        script_name = scriptName
    }), {
        ["Content-Type"] = "application/json"
    })
end

-- Script-Hauptfunktion
function StartScript()
    print("^2[" .. scriptName .. "] Script erfolgreich gestartet!")
    
    -- Hier kommt Ihr Script-Code hin
    -- Beispiel:
    RegisterCommand("test", function(source, args, rawCommand)
        TriggerClientEvent('chat:addMessage', source, {
            color = {0, 255, 0},
            multiline = true,
            args = {"System", "Script " .. scriptName .. " läuft!"}
        })
    end, false)
end

-- Lizenz beim Resource-Start validieren
AddEventHandler('onResourceStart', function(resourceName)
    if GetCurrentResourceName() == resourceName then
        ValidateScriptLicense()
    end
end)`
  }

  const generateJavaScriptCode = (license: License) => {
    return `// ${license.script_name} License Check
const licenseKey = "${license.license_key}";
const scriptName = "${license.script_name}";
const licenseServer = "http://91.99.61.241:3000";

// License validation function
async function validateScriptLicense() {
    try {
        const response = await fetch(licenseServer + "/api/fivem/validate-script", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                license_key: licenseKey,
                script_name: scriptName
            })
        });
        
        const data = await response.json();
        
        if (response.ok && data.valid) {
            console.log(\`^2[\${scriptName}] Script-Lizenz erfolgreich validiert!\`);
            console.log(\`^2[\${scriptName}] Läuft ab am: \${data.license.expires_at || "Nie"}\`);
            
            // Script starten
            startScript();
        } else {
            console.log(\`^1[\${scriptName}] Script-Lizenz ungültig: \${data.error}\`);
            console.log(\`^1[\${scriptName}] Script wird nicht gestartet!\`);
            return;
        }
    } catch (error) {
        console.log(\`^1[\${scriptName}] Lizenz-Validierung fehlgeschlagen: \${error.message}\`);
        return;
    }
}

// Script-Hauptfunktion
function startScript() {
    console.log(\`^2[\${scriptName}] Script erfolgreich gestartet!\`);
    
    // Hier kommt Ihr Script-Code hin
    // Beispiel:
    RegisterCommand("test", (source, args, rawCommand) => {
        emitNet('chat:addMessage', source, {
            color: [0, 255, 0],
            multiline: true,
            args: ["System", \`Script \${scriptName} läuft!\`]
        });
    }, false);
}

// Lizenz beim Resource-Start validieren
on('onResourceStart', (resourceName) => {
    if (GetCurrentResourceName() === resourceName) {
        validateScriptLicense();
    }
});`
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      const textArea = document.createElement("textarea")
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)

      setCopySuccess(type)
      setTimeout(() => setCopySuccess(null), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
      try {
        await navigator.clipboard.writeText(text)
        setCopySuccess(type)
        setTimeout(() => setCopySuccess(null), 2000)
      } catch (fallbackError) {
        console.error("Fallback copy failed:", fallbackError)
      }
    }
  }

  const getStatusBadge = (license: License) => {
    if (!license.is_active) {
      return <Badge variant="destructive">Inaktiv</Badge>
    }
    if (license.expires_at && new Date(license.expires_at) < new Date()) {
      return <Badge variant="destructive">Abgelaufen</Badge>
    }
    return <Badge className="bg-green-500 hover:bg-green-600">Aktiv</Badge>
  }

  if (loading) {
    return (
      <div className="lg:ml-80 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-6">
            {[...Array(3)].map((_, i) => (
              <GlassCard key={i} className="p-6">
                <div className="animate-pulse">
                  <div className="h-6 bg-white/20 rounded mb-4"></div>
                  <div className="h-4 bg-white/20 rounded mb-2"></div>
                  <div className="h-4 bg-white/20 rounded"></div>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Script-Lizenzen</h1>
              <p className="text-muted-foreground">Verwalten Sie Ihre FiveM Script-Lizenzen</p>
            </div>

            {(user?.role === "admin" || licenses.length < 10) && (
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Neue Script-Lizenz
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-black/80 backdrop-blur-xl border-white/20 max-w-md">
                  <DialogHeader>
                    <DialogTitle>Neue Script-Lizenz erstellen</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={createLicense} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="script_name">Script-Name</Label>
                      <Input
                        id="script_name"
                        value={newLicense.script_name}
                        onChange={(e) => setNewLicense({ ...newLicense, script_name: e.target.value })}
                        placeholder="esx_banking, vehicle_system, etc."
                        required
                        className="bg-white/10 border-white/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="server_name">Server-Name</Label>
                      <Input
                        id="server_name"
                        value={newLicense.server_name}
                        onChange={(e) => setNewLicense({ ...newLicense, server_name: e.target.value })}
                        placeholder="Mein FiveM Server"
                        required
                        className="bg-white/10 border-white/20"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="server_ip">Server IP</Label>
                        <Input
                          id="server_ip"
                          value={newLicense.server_ip}
                          onChange={(e) => setNewLicense({ ...newLicense, server_ip: e.target.value })}
                          placeholder="127.0.0.1"
                          required
                          className="bg-white/10 border-white/20"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="server_port">Port</Label>
                        <Input
                          id="server_port"
                          type="number"
                          value={newLicense.server_port}
                          onChange={(e) =>
                            setNewLicense({ ...newLicense, server_port: Number.parseInt(e.target.value) })
                          }
                          placeholder="30120"
                          required
                          className="bg-white/10 border-white/20"
                        />
                      </div>
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

                    {user?.role === "admin" && (
                      <div className="space-y-2">
                        <Label htmlFor="user_id">Benutzer ID (Optional)</Label>
                        <Input
                          id="user_id"
                          type="number"
                          value={newLicense.user_id}
                          onChange={(e) => setNewLicense({ ...newLicense, user_id: e.target.value })}
                          placeholder="Leer lassen für eigene Lizenz"
                          className="bg-white/10 border-white/20"
                        />
                      </div>
                    )}

                    <Button type="submit" className="w-full">
                      Script-Lizenz erstellen
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </motion.div>

        <div className="grid gap-6">
          {licenses.map((license, index) => (
            <motion.div
              key={license.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Code className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{license.script_name}</h3>
                        {getStatusBadge(license)}
                      </div>
                      <p className="text-sm text-muted-foreground">{license.server_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {license.server_ip}:{license.server_port}
                      </p>
                      {user?.role === "admin" && license.username && (
                        <p className="text-xs text-muted-foreground">Besitzer: {license.username}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCodeDialog(license)}
                      className="bg-green-500/20 hover:bg-green-500/30 text-green-400"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Code kopieren
                    </Button>

                    {user?.role === "admin" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-black/80 backdrop-blur-xl border-white/20">
                          <DropdownMenuItem onClick={() => openEditDialog(license)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Bearbeiten
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleLicenseStatus(license.id, license.is_active)}>
                            {license.is_active ? "Deaktivieren" : "Aktivieren"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setShowDeleteDialog(license)}
                            className="text-red-400 focus:text-red-300"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Löschen
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Script: {license.script_name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Erstellt: {formatDate(license.created_at)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {license.expires_at ? `Läuft ab: ${formatDate(license.expires_at)}` : "Unbegrenzt"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 dark:bg-black/10">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Lizenzschlüssel:</span>
                    <code className="text-sm font-mono">
                      {showKeys[license.id] ? license.license_key : "••••••••••••••••••••••••"}
                    </code>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleKeyVisibility(license.id)}
                    className="h-8 w-8 p-0"
                  >
                    {showKeys[license.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          ))}

          {licenses.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <GlassCard className="p-12 text-center">
                <Code className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Keine Script-Lizenzen vorhanden</h3>
                <p className="text-muted-foreground mb-6">
                  Erstellen Sie Ihre erste Script-Lizenz, um mit der Verwaltung Ihrer FiveM Scripts zu beginnen.
                </p>
                <Button
                  onClick={() => setShowCreateDialog(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Erste Script-Lizenz erstellen
                </Button>
              </GlassCard>
            </motion.div>
          )}
        </div>

        {/* Edit License Dialog */}
        {showEditDialog && (
          <Dialog open={!!showEditDialog} onOpenChange={() => setShowEditDialog(null)}>
            <DialogContent className="bg-black/80 backdrop-blur-xl border-white/20 max-w-md">
              <DialogHeader>
                <DialogTitle>Lizenz bearbeiten</DialogTitle>
              </DialogHeader>
              <form onSubmit={updateLicense} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_script_name">Script-Name</Label>
                  <Input
                    id="edit_script_name"
                    value={editLicense.script_name}
                    onChange={(e) => setEditLicense({ ...editLicense, script_name: e.target.value })}
                    required
                    className="bg-white/10 border-white/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit_server_name">Server-Name</Label>
                  <Input
                    id="edit_server_name"
                    value={editLicense.server_name}
                    onChange={(e) => setEditLicense({ ...editLicense, server_name: e.target.value })}
                    required
                    className="bg-white/10 border-white/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit_server_ip">Server IP</Label>
                    <Input
                      id="edit_server_ip"
                      value={editLicense.server_ip}
                      onChange={(e) => setEditLicense({ ...editLicense, server_ip: e.target.value })}
                      required
                      className="bg-white/10 border-white/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit_server_port">Port</Label>
                    <Input
                      id="edit_server_port"
                      type="number"
                      value={editLicense.server_port}
                      onChange={(e) => setEditLicense({ ...editLicense, server_port: Number.parseInt(e.target.value) })}
                      required
                      className="bg-white/10 border-white/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit_expires_at">Ablaufdatum (Optional)</Label>
                  <Input
                    id="edit_expires_at"
                    type="datetime-local"
                    value={editLicense.expires_at}
                    onChange={(e) => setEditLicense({ ...editLicense, expires_at: e.target.value })}
                    className="bg-white/10 border-white/20"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit_is_active"
                    checked={editLicense.is_active}
                    onChange={(e) => setEditLicense({ ...editLicense, is_active: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="edit_is_active">Lizenz aktiv</Label>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    Speichern
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => setShowEditDialog(null)} className="flex-1">
                    Abbrechen
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}

        {/* Delete License Dialog */}
        <AlertDialog open={!!showDeleteDialog} onOpenChange={() => setShowDeleteDialog(null)}>
          <AlertDialogContent className="bg-black/80 backdrop-blur-xl border-white/20">
            <AlertDialogHeader>
              <AlertDialogTitle>Lizenz löschen</AlertDialogTitle>
              <AlertDialogDescription>
                Sind Sie sicher, dass Sie die Lizenz für "{showDeleteDialog?.script_name}" löschen möchten? Diese Aktion
                kann nicht rückgängig gemacht werden.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Abbrechen</AlertDialogCancel>
              <AlertDialogAction onClick={deleteLicense} className="bg-red-600 hover:bg-red-700">
                Löschen
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Code Copy Dialog */}
        {showCodeDialog && (
          <Dialog open={!!showCodeDialog} onOpenChange={() => setShowCodeDialog(null)}>
            <DialogContent className="bg-black/90 backdrop-blur-xl border-white/20 max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Code für {showCodeDialog.script_name}
                </DialogTitle>
              </DialogHeader>

              <Tabs defaultValue="lua" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white/10">
                  <TabsTrigger value="lua" className="data-[state=active]:bg-white/20">
                    Lua (server.lua)
                  </TabsTrigger>
                  <TabsTrigger value="javascript" className="data-[state=active]:bg-white/20">
                    JavaScript (server.js)
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="lua" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Kopieren Sie diesen Code in Ihre server.lua Datei:</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(generateLuaCode(showCodeDialog), "lua")}
                      className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400"
                    >
                      {copySuccess === "lua" ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Kopiert!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Lua Code kopieren
                        </>
                      )}
                    </Button>
                  </div>
                  <pre className="bg-black/50 p-4 rounded-lg text-sm overflow-x-auto border border-white/10">
                    <code className="text-green-400">{generateLuaCode(showCodeDialog)}</code>
                  </pre>
                </TabsContent>

                <TabsContent value="javascript" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Kopieren Sie diesen Code in Ihre server.js Datei:</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(generateJavaScriptCode(showCodeDialog), "javascript")}
                      className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400"
                    >
                      {copySuccess === "javascript" ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Kopiert!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          JavaScript Code kopieren
                        </>
                      )}
                    </Button>
                  </div>
                  <pre className="bg-black/50 p-4 rounded-lg text-sm overflow-x-auto border border-white/10">
                    <code className="text-yellow-400">{generateJavaScriptCode(showCodeDialog)}</code>
                  </pre>
                </TabsContent>
              </Tabs>

              <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <h4 className="font-semibold text-blue-400 mb-2">📋 Anleitung:</h4>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Kopieren Sie den gewünschten Code (Lua oder JavaScript)</li>
                  <li>Fügen Sie ihn in Ihre server.lua oder server.js Datei ein</li>
                  <li>Starten Sie Ihr FiveM Resource neu</li>
                  <li>Das Script wird automatisch validiert und gestartet</li>
                </ol>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
