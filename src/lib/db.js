import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local")
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        }

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            console.log("✅ Connected to MongoDB")
            return mongoose
        })
    }

    try {
        cached.conn = await cached.promise
    } catch (e) {
        cached.promise = null
        console.error("❌ MongoDB connection error:", e)
        throw e
    }

    return cached.conn
}

// Export the connection function as default
export default connectDB

// Export the mongoose connection as db for compatibility
export const db = {
    connect: connectDB,
    mongoose: mongoose,

    // Helper methods for common operations
    async disconnect() {
        if (cached.conn) {
            await mongoose.disconnect()
            cached.conn = null
            cached.promise = null
            console.log("🔌 Disconnected from MongoDB")
        }
    },

    async isConnected() {
        return mongoose.connection.readyState === 1
    },

    getConnection() {
        return mongoose.connection
    },

    // Get database instance
    getDB() {
        if (mongoose.connection.readyState === 1) {
            return mongoose.connection.db
        }
        throw new Error("Database not connected")
    },
}

// Handle connection events
mongoose.connection.on("connected", () => {
    console.log("🟢 Mongoose connected to MongoDB")
})

mongoose.connection.on("error", (err) => {
    console.error("🔴 Mongoose connection error:", err)
})

mongoose.connection.on("disconnected", () => {
    console.log("🟡 Mongoose disconnected from MongoDB")
})

// Handle process termination
process.on("SIGINT", async () => {
    await mongoose.connection.close()
    console.log("🔌 MongoDB connection closed due to app termination")
    process.exit(0)
})
