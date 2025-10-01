import { NextResponse } from "next/server"
import connectDB from "@/common/db"
import User from "@/database/models/User"
import jwt from "jsonwebtoken"

if (!process.env.JWT_SECRET) {
    throw new Error("Please add your JWT_SECRET to .env.local")
}

export async function POST(request) {
    try {
        await connectDB()
        const { username, password } = await request.json()

        // Find user
        const user = await User.findOne({ username })
        if (!user) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
        }

        // Check password
        const isMatch = await user.comparePassword(password)
        if (!isMatch) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
        }

        // Create JWT token
        const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        })

        // Don't return the password
        const userResponse = {
            _id: user._id,
            username: user.username,
            role: user.role,
        }

        // Set cookie with the token
        const response = NextResponse.json({ user: userResponse, token })
        response.cookies.set({
            name: "auth_token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        })

        return response
    } catch (error) {
        return NextResponse.json({ error: "Failed to login" }, { status: 500 })
    }
}
