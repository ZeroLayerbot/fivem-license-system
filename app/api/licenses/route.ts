import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { query } from "@/lib/database"
import { generateLicenseKey } from "@/lib/utils"

export async function GET(request: NextRequest) {
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

    let licenses
    if (decoded.role === "admin") {
      licenses = await query(`
        SELECT l.*, u.username, s.is_online, s.current_players, s.last_heartbeat
        FROM licenses l
        LEFT JOIN users u ON l.user_id = u.id
        LEFT JOIN server_status s ON l.id = s.license_id
        ORDER BY l.created_at DESC
      `)
    } else {
      licenses = await query(
        `
        SELECT l.*, s.is_online, s.current_players, s.last_heartbeat
        FROM licenses l
        LEFT JOIN server_status s ON l.id = s.license_id
        WHERE l.user_id = ?
        ORDER BY l.created_at DESC
      `,
        [decoded.id],
      )
    }

    return NextResponse.json(licenses)
  } catch (error) {
    console.error("Get licenses error:", error)
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

    if (!decoded) {
      return NextResponse.json({ error: "Ungültiger Token" }, { status: 401 })
    }

    const { script_name, server_name, server_ip, server_port, max_players, expires_at, user_id } = await request.json()

    if (!script_name || !server_name || !server_ip) {
      return NextResponse.json({ error: "Script-Name, Servername und IP sind erforderlich" }, { status: 400 })
    }

    // Only admins can create licenses for other users
    const targetUserId = decoded.role === "admin" && user_id ? user_id : decoded.id

    const licenseKey = generateLicenseKey()

    const result = await query(
      `
  INSERT INTO licenses (license_key, script_name, user_id, server_name, server_ip, server_port, max_players, expires_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`,
      [
        licenseKey,
        script_name,
        targetUserId,
        server_name,
        server_ip,
        server_port || 30120,
        max_players || 32,
        expires_at,
      ],
    )

    // Initialize server status
    await query(
      `
      INSERT INTO server_status (license_id, is_online, current_players)
      VALUES (?, FALSE, 0)
    `,
      [(result as any).insertId],
    )

    return NextResponse.json({
      id: (result as any).insertId,
      license_key: licenseKey,
      message: "Lizenz erfolgreich erstellt",
    })
  } catch (error) {
    console.error("Create license error:", error)
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 })
  }
}
