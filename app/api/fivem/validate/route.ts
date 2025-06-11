import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { license_key } = await request.json()

    if (!license_key) {
      return NextResponse.json({ error: "Lizenzschlüssel erforderlich" }, { status: 400 })
    }

    // Get license with user info
    const license = (await query(
      `
      SELECT l.*, u.username, u.email
      FROM licenses l
      LEFT JOIN users u ON l.user_id = u.id
      WHERE l.license_key = ?
    `,
      [license_key],
    )) as any[]

    if (license.length === 0) {
      return NextResponse.json({
        valid: false,
        error: "Ungültiger Lizenzschlüssel",
      })
    }

    const licenseData = license[0]

    // Check if license is active
    if (!licenseData.is_active) {
      return NextResponse.json({
        valid: false,
        error: "Lizenz ist deaktiviert",
      })
    }

    // Check if license is expired
    if (licenseData.expires_at && new Date(licenseData.expires_at) < new Date()) {
      return NextResponse.json({
        valid: false,
        error: "Lizenz ist abgelaufen",
      })
    }

    return NextResponse.json({
      valid: true,
      license: {
        server_name: licenseData.server_name,
        max_players: licenseData.max_players,
        expires_at: licenseData.expires_at,
        owner: licenseData.username,
      },
      system: {
        server_ip: "91.99.61.241",
        api_version: "1.0.0",
      },
    })
  } catch (error) {
    console.error("License validation error:", error)
    return NextResponse.json({
      valid: false,
      error: "Interner Serverfehler",
    })
  }
}
