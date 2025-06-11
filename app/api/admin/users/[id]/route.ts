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

    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ error: "Admin-Berechtigung erforderlich" }, { status: 403 })
    }

    const userId = Number.parseInt(params.id)
    const updates = await request.json()

    // Build dynamic update query
    const allowedFields = ["username", "email", "role", "is_active"]
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

    updateValues.push(userId)

    await query(`UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`, updateValues)

    return NextResponse.json({ message: "Benutzer erfolgreich aktualisiert" })
  } catch (error) {
    console.error("Update user error:", error)
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

    const userId = Number.parseInt(params.id)

    // Prevent admin from deleting themselves
    if (userId === decoded.id) {
      return NextResponse.json({ error: "Sie können sich nicht selbst löschen" }, { status: 400 })
    }

    // Delete related data first (foreign key constraints)
    await query("DELETE FROM server_status WHERE license_id IN (SELECT id FROM licenses WHERE user_id = ?)", [userId])
    await query("DELETE FROM licenses WHERE user_id = ?", [userId])
    await query("DELETE FROM user_sessions WHERE user_id = ?", [userId])

    // Delete user
    const result = await query("DELETE FROM users WHERE id = ?", [userId])

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ error: "Benutzer nicht gefunden" }, { status: 404 })
    }

    return NextResponse.json({ message: "Benutzer erfolgreich gelöscht" })
  } catch (error) {
    console.error("Delete user error:", error)
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 })
  }
}
