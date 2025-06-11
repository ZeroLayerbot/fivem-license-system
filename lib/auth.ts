import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { query } from "./database"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export interface User {
  id: number
  username: string
  email: string
  role: "user" | "admin"
  created_at: string
  last_login?: string
  is_active: boolean
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateToken(user: User): string {
  return jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

export async function getUserById(id: number): Promise<User | null> {
  const results = (await query(
    "SELECT id, username, email, role, created_at, last_login, is_active FROM users WHERE id = ? AND is_active = TRUE",
    [id],
  )) as any[]

  return results.length > 0 ? results[0] : null
}

export async function getUserByUsername(username: string): Promise<any | null> {
  const results = (await query("SELECT * FROM users WHERE username = ? AND is_active = TRUE", [username])) as any[]

  return results.length > 0 ? results[0] : null
}
