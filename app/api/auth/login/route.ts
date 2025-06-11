import { type NextRequest, NextResponse } from "next/server"
import { getUserByUsername, verifyPassword, generateToken } from "@/lib/auth"
import { query } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Benutzername und Passwort sind erforderlich" }, { status: 400 })
    }

    const user = await getUserByUsername(username)
    if (!user) {
      return NextResponse.json({ error: "Ungültige Anmeldedaten" }, { status: 401 })
    }

    const isValidPassword = await verifyPassword(password, user.password_hash)
    if (!isValidPassword) {
      return NextResponse.json({ error: "Ungültige Anmeldedaten" }, { status: 401 })
    }

    // Update last login
    await query("UPDATE users SET last_login = NOW() WHERE id = ?", [user.id])

    const token = generateToken(user)
    const { password_hash, ...userWithoutPassword } = user

    return NextResponse.json({
      token,
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 })
  }
}
