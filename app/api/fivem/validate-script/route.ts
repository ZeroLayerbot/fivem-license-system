import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

// Ändere die POST-Funktion, um die Server-IP-Validierung zu entfernen
export async function POST(request: NextRequest) {
  try {
    const { license_key, script_name } = await request.json()

    if (!license_key || !script_name) {
      return NextResponse.json({
        valid: false,
        error: "Lizenzschlüssel und Script-Name sind erforderlich",
      })
    }

    // Get license with script name match only
    const license = (await query(
      `
      SELECT l.*, u.username, u.email
      FROM licenses l
      LEFT JOIN users u ON l.user_id = u.id
      WHERE l.license_key = ? AND l.script_name = ?
    `,
      [license_key, script_name],
    )) as any[]

    if (license.length === 0) {
      return NextResponse.json({
        valid: false,
        error: `Keine gültige Lizenz für Script '${script_name}' gefunden`,
      })
    }

    const licenseData = license[0]

    // Check if license is active
    if (!licenseData.is_active) {
      return NextResponse.json({
        valid: false,
        error: "Script-Lizenz ist deaktiviert",
      })
    }

    // Check if license is expired
    if (licenseData.expires_at && new Date(licenseData.expires_at) < new Date()) {
      return NextResponse.json({
        valid: false,
        error: "Script-Lizenz ist abgelaufen",
      })
    }

    // Update last heartbeat for this script
    await query(
      `
      INSERT INTO server_status (license_id, is_online, current_players, last_heartbeat)
      VALUES (?, TRUE, 0, NOW())
      ON DUPLICATE KEY UPDATE
      is_online = TRUE,
      last_heartbeat = NOW()
    `,
      [licenseData.id],
    )

    return NextResponse.json({
      valid: true,
      license: {
        script_name: licenseData.script_name,
        server_name: licenseData.server_name,
        expires_at: licenseData.expires_at,
        owner: licenseData.username,
        max_players: licenseData.max_players,
      },
      system: {
        server_ip: "91.99.61.241",
        api_version: "1.0.0",
        validation_time: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Script license validation error:", error)
    return NextResponse.json({
      valid: false,
      error: "Interner Serverfehler bei Script-Validierung",
    })
  }
}
