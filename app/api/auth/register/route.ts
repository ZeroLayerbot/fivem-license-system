import { type NextRequest, NextResponse } from "next/server"
import { hashPassword, generateToken } from "@/lib/auth"
import { query } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json()

    if (!username || !email || !password) {
      return NextResponse.json({ error: "Alle Felder sind erforderlich" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Passwort muss mindestens 6 Zeichen lang sein" }, { status: 400 })
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

    const result = (await query("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)", [
      username,
      email,
      passwordHash,
    ])) as any

    const newUser = {
      id: result.insertId,
      username,
      email,
      role: "user" as const,
      created_at: new Date().toISOString(),
      is_active: true,
    }

    const token = generateToken(newUser)

    return NextResponse.json({
      token,
      user: newUser,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 })
  }
}
