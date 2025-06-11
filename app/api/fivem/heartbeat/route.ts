import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { license_key, server_info } = await request.json()

    if (!license_key) {
      return NextResponse.json({ error: "Lizenzschlüssel erforderlich" }, { status: 400 })
    }

    // Verify license exists and is active
    const license = (await query("SELECT id, is_active, expires_at FROM licenses WHERE license_key = ?", [
      license_key,
    ])) as any[]

    if (license.length === 0) {
      return NextResponse.json({ error: "Ungültiger Lizenzschlüssel" }, { status: 401 })
    }

    const licenseData = license[0]

    if (!licenseData.is_active) {
      return NextResponse.json({ error: "Lizenz ist deaktiviert" }, { status: 401 })
    }

    if (licenseData.expires_at && new Date(licenseData.expires_at) < new Date()) {
      return NextResponse.json({ error: "Lizenz ist abgelaufen" }, { status: 401 })
    }

    // Update server status
    const currentPlayers = server_info?.players || 0
    const maxPlayers = server_info?.maxPlayers || 32

    await query(
      `
      INSERT INTO server_status (license_id, is_online, current_players, last_heartbeat)
      VALUES (?, TRUE, ?, NOW())
      ON DUPLICATE KEY UPDATE
      is_online = TRUE,
      current_players = VALUES(current_players),
      last_heartbeat = NOW()
    `,
      [licenseData.id, currentPlayers],
    )

    return NextResponse.json({
      status: "success",
      message: "Heartbeat empfangen",
      license_valid: true,
      server_ip: "91.99.61.241",
    })
  } catch (error) {
    console.error("Heartbeat error:", error)
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 })
  }
}
