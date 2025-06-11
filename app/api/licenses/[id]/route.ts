import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { query } from "@/lib/database"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: "Ungültiger Token" }, { status: 401 })
    }

    const licenseId = Number.parseInt(params.id)
    const updates = await request.json()

    // Check if user owns the license or is admin
    const license = (await query("SELECT user_id FROM licenses WHERE id = ?", [licenseId])) as any[]

    if (license.length === 0) {
      return NextResponse.json({ error: "Lizenz nicht gefunden" }, { status: 404 })
    }

    if (decoded.role !== "admin" && license[0].user_id !== decoded.id) {
      return NextResponse.json({ error: "Keine Berechtigung" }, { status: 403 })
    }

    // Build dynamic update query
    const allowedFields = [
      "script_name",
      "server_name",
      "server_ip",
      "server_port",
      "max_players",
      "expires_at",
      "is_active",
    ]
    const updateFields = []
    const updateValues = []

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        updateFields.push(`${key} = ?`)
        updateValues.push(value)
      }
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ error: "Keine gültigen Felder zum Aktualisieren" }, { status: 400 })
    }

    updateValues.push(licenseId)

    await query(`UPDATE licenses SET ${updateFields.join(", ")} WHERE id = ?`, updateValues)

    return NextResponse.json({ message: "Lizenz erfolgreich aktualisiert" })
  } catch (error) {
    console.error("Update license error:", error)
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)

    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ error: "Admin-Berechtigung erforderlich" }, { status: 403 })
    }

    const licenseId = Number.parseInt(params.id)

    // Delete server status first (foreign key constraint)
    await query("DELETE FROM server_status WHERE license_id = ?", [licenseId])

    // Delete license
    const result = await query("DELETE FROM licenses WHERE id = ?", [licenseId])

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ error: "Lizenz nicht gefunden" }, { status: 404 })
    }

    return NextResponse.json({ message: "Lizenz erfolgreich gelöscht" })
  } catch (error) {
    console.error("Delete license error:", error)
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 })
  }
}
