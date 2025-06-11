import { type NextRequest, NextResponse } from "next/server"
import { verifyToken, hashPassword } from "@/lib/auth"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
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

    const users = await query(`
      SELECT id, username, email, role, created_at, last_login, is_active
      FROM users
      ORDER BY created_at DESC
    `)

    return NextResponse.json(users)
  } catch (error) {
    console.error("Get users error:", error)
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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

    const { username, email, password, role } = await request.json()

    if (!username || !email || !password) {
      return NextResponse.json({ error: "Alle Felder sind erforderlich" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = (await query("SELECT id FROM users WHERE username = ? OR email = ?", [
      username,
      email,
    ])) as any[]

    if (existingUser.length > 0) {
      return NextResponse.json({ error: "Benutzername oder E-Mail bereits vergeben" }, { status: 409 })
    }

    const passwordHash = await hashPassword(password)

    await query("INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)", [
      username,
      email,
      passwordHash,
      role || "user",
    ])

    return NextResponse.json({ message: "Benutzer erfolgreich erstellt" })
  } catch (error) {
    console.error("Create user error:", error)
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 })
  }
}
