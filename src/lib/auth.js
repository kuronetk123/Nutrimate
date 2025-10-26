
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

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
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return { error: "No session or user found" }
  }
  return session.user
}

export async function requireAdmin(request) {
  const user = await requireAuth(request)
  if (user?.error) {
    return { error: user.error }
  }
  if (user.role !== "admin") {
    return { error: "User is not admin" }
  }
  return user
}

// Removed duplicate export of authOptions
