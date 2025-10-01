import { NextResponse } from "next/server"
import connectDB from "@/common/db"
import User from "@/database/models/User"

export async function POST(request) {
    try {
        await connectDB()
        const { username, password, role } = await request.json()

        // Check if user already exists
        const existingUser = await User.findOne({ username })
        if (existingUser) {
            return NextResponse.json({ error: "Username already exists" }, { status: 400 })
        }

        // Create new user
        const user = await User.create({
            username,
            password, // Will be hashed by the pre-save hook
            role: role || "student",
        })

        // Don't return the password
        const userResponse = {
            _id: user._id,
            username: user.username,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }

        return NextResponse.json(userResponse, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: "Failed to register user" }, { status: 500 })
    }
}
