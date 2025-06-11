import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { query } from "@/lib/database"

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

    // Get basic stats
    const [totalUsers] = (await query("SELECT COUNT(*) as count FROM users WHERE is_active = TRUE")) as any[]
    const [totalLicenses] = (await query("SELECT COUNT(*) as count FROM licenses WHERE is_active = TRUE")) as any[]
    const [activeLicenses] = (await query(
      "SELECT COUNT(*) as count FROM licenses WHERE is_active = TRUE AND (expires_at IS NULL OR expires_at > NOW())",
    )) as any[]
    const [onlineServers] = (await query("SELECT COUNT(*) as count FROM server_status WHERE is_online = TRUE")) as any[]
    const [totalPlayers] = (await query(
      "SELECT COALESCE(SUM(current_players), 0) as count FROM server_status WHERE is_online = TRUE",
    )) as any[]

    // Get recent activity
    const recentLicenses = await query(`
      SELECT l.server_name, l.created_at, u.username
      FROM licenses l
      LEFT JOIN users u ON l.user_id = u.id
      ORDER BY l.created_at DESC
      LIMIT 5
    `)

    // Get server status overview
    const serverStatus = await query(`
      SELECT l.server_name, l.server_ip, s.is_online, s.current_players, s.last_heartbeat
      FROM licenses l
      LEFT JOIN server_status s ON l.id = s.license_id
      WHERE l.is_active = TRUE
      ORDER BY s.is_online DESC, s.current_players DESC
      LIMIT 10
    `)

    return NextResponse.json({
      stats: {
        totalUsers: totalUsers.count,
        totalLicenses: totalLicenses.count,
        activeLicenses: activeLicenses.count,
        onlineServers: onlineServers.count,
        totalPlayers: totalPlayers.count,
      },
      recentLicenses,
      serverStatus,
    })
  } catch (error) {
    console.error("Get stats error:", error)
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 })
  }
}
