
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
// import { findUserById } from "@/services/user-service"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export function generateToken(userId) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: "30d" })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

// export async function getCurrentUser() {
//   const cookieStore = cookies()
//   const token = cookieStore.get("auth_token")?.value

//   if (!token) {
//     return null
//   }

//   const payload = verifyToken(token)
//   if (!payload) {
//     return null
//   }

//   const user = await findUserById(payload.sub)
//   if (!user) {
//     return null
//   }

//   // Return user without sensitive data
//   return {
//     id: user.id,
//     name: user.name,
//     email: user.email,
//     isVerified: user.isVerified,
//     isAdmin: user.isAdmin,
//   }
// }

export async function requireAuth(request) {
  const cookieStore = cookies()
  const token = cookieStore.get("auth_token")?.value

  if (!token) {
    return null
  }

  const payload = verifyToken(token)
  if (!payload) {
    return null
  }

  const user = await findUserById(payload.sub)
  if (!user || !user.isVerified) {
    return null
  }

  return user
}

export async function requireAdmin(request) {
  const user = await requireAuth(request)

  if (!user || !user.role === "admin") {
    return null
  }

  return user
}

export const authOptions = {}
