#!/usr/bin/env node
// Lightweight MongoDB migration runner using mongoose
// Usage:
//   node src/database/migrate.js up   -> apply all pending migrations
//   node src/database/migrate.js down -> revert the last applied migration

const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')

// Load env from .env.local if available (without adding a dependency)
try {
    const envPath = path.resolve(process.cwd(), '.env.local')
    if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8')
        content.split(/\r?\n/).forEach((line) => {
            const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
            if (m) {
                const key = m[1]
                let val = m[2]
                if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                    val = val.slice(1, -1)
                }
                if (!process.env[key]) process.env[key] = val
            }
        })
    }
} catch (e) {
    // Non-fatal
}

const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI
if (!MONGODB_URI) {
    console.error('Missing MONGODB_URI. Add it to .env.local or environment vars.')
    process.exit(1)
}

const MIGRATIONS_DIR = path.resolve(__dirname, 'migrations')
const COLLECTION = '__migrations'

async function connect() {
    await mongoose.connect(MONGODB_URI, { bufferCommands: false })
    return mongoose.connection
}

async function getAppliedMigrations(db) {
    return db.collection(COLLECTION).find({}).sort({ appliedAt: 1 }).toArray()
}

async function markApplied(db, filename) {
    await db.collection(COLLECTION).insertOne({ filename, appliedAt: new Date() })
}

async function unmarkApplied(db, filename) {
    await db.collection(COLLECTION).deleteOne({ filename })
}

function loadMigrations() {
    if (!fs.existsSync(MIGRATIONS_DIR)) return []
    const files = fs
        .readdirSync(MIGRATIONS_DIR)
        .filter((f) => f.endsWith('.js'))
        .sort()
    return files
}

async function migrateUp() {
    const conn = await connect()
    const db = conn.db
    const files = loadMigrations()
    const applied = await getAppliedMigrations(db)
    const appliedSet = new Set(applied.map((m) => m.filename))

    for (const file of files) {
        if (appliedSet.has(file)) continue
        const mod = require(path.join(MIGRATIONS_DIR, file))
        const up = mod.up || (async () => { })
        console.log(`➡️  Applying migration: ${file}`)
        await up(db, mongoose)
        await markApplied(db, file)
        console.log(`✅ Applied: ${file}`)
    }
    await mongoose.disconnect()
}

async function migrateDown() {
    const conn = await connect()
    const db = conn.db
    const applied = await getAppliedMigrations(db)
    if (applied.length === 0) {
        console.log('No applied migrations to revert.')
        await mongoose.disconnect()
        return
    }
    const last = applied[applied.length - 1]
    const file = last.filename
    const mod = require(path.join(MIGRATIONS_DIR, file))
    const down = mod.down || (async () => { })
    console.log(`↩️  Reverting migration: ${file}`)
    await down(db, mongoose)
    await unmarkApplied(db, file)
    console.log(`✅ Reverted: ${file}`)
    await mongoose.disconnect()
}

async function main() {
    const cmd = process.argv[2] || 'up'
    if (cmd !== 'up' && cmd !== 'down') {
        console.error('Usage: migrate.js [up|down]')
        process.exit(1)
    }
    try {
        if (cmd === 'up') await migrateUp()
        else await migrateDown()
    } catch (err) {
        console.error('Migration error:', err)
        process.exitCode = 1
        try { await mongoose.disconnect() } catch (_) { }
    }
}

main()
