// Create helpful indexes on collections based on Mongoose models
// This migration is idempotent; createIndex is safe if index exists.

async function ensureIndex(db, collName, keys, options = {}) {
    const coll = db.collection(collName)
    const existing = await coll.listIndexes().toArray().catch(() => [])
    const targetKey = JSON.stringify(keys)
    const found = existing.find((idx) => JSON.stringify(idx.key) === targetKey)
    if (found) return found.name
    return coll.createIndex(keys, options)
}

module.exports.up = async function up(db /*, mongoose */) {
    // Users
    await ensureIndex(db, 'users', { email: 1 }, { unique: true, sparse: true, name: 'uniq_email' })
    await ensureIndex(db, 'users', { username: 1 }, { sparse: true, name: 'idx_username' })
    await ensureIndex(db, 'users', { 'subscription.status': 1 }, { name: 'idx_subscription_status' })

    // Blogs
    await ensureIndex(db, 'blogs', { slug: 1 }, { unique: true, name: 'uniq_slug' })
    await ensureIndex(db, 'blogs', { published: 1, publishedAt: -1 }, { name: 'idx_published_publishedAt' })
    await ensureIndex(db, 'blogs', { tags: 1 }, { name: 'idx_tags' })

    // Recipes
    await ensureIndex(db, 'recipes', { name: 1 }, { name: 'idx_name' })
    await ensureIndex(db, 'recipes', { tags: 1 }, { name: 'idx_recipe_tags' })
    await ensureIndex(db, 'recipes', { difficulty: 1 }, { name: 'idx_difficulty' })
    await ensureIndex(db, 'recipes', { calories: 1 }, { name: 'idx_calories' })

    // Comments
    await ensureIndex(db, 'comments', { recipeId: 1, createdAt: -1 }, { name: 'idx_recipe_createdAt' })
    await ensureIndex(db, 'comments', { userId: 1, createdAt: -1 }, { name: 'idx_user_createdAt' })

    // MealPlans
    await ensureIndex(db, 'mealplans', { userId: 1, date: -1 }, { name: 'idx_user_date' })

    // Subscriptions
    await ensureIndex(db, 'subscriptions', { userId: 1, status: 1 }, { name: 'idx_user_status' })
    await ensureIndex(db, 'subscriptions', { planType: 1, planDuration: 1 }, { name: 'idx_plan_type_duration' })

    // Transactions
    await ensureIndex(db, 'transactions', { userId: 1, createdAt: -1 }, { name: 'idx_user_createdAt' })
    await ensureIndex(db, 'transactions', { status: 1, paymentMethod: 1 }, { name: 'idx_status_method' })

    // Analytics
    await ensureIndex(db, 'analytics', { recipeId: 1 }, { unique: true, name: 'uniq_recipeId' })
}

module.exports.down = async function down(db /*, mongoose */) {
    const dropByKeys = async (collName, keys) => {
        const coll = db.collection(collName)
        const existing = await coll.listIndexes().toArray().catch(() => [])
        const targetKey = JSON.stringify(keys)
        const match = existing.find((idx) => JSON.stringify(idx.key) === targetKey)
        if (match) {
            try { await coll.dropIndex(match.name) } catch (_) { }
        }
    }

    await dropByKeys('users', { email: 1 })
    await dropByKeys('users', { username: 1 })
    await dropByKeys('users', { 'subscription.status': 1 })

    await dropByKeys('blogs', { slug: 1 })
    await dropByKeys('blogs', { published: 1, publishedAt: -1 })
    await dropByKeys('blogs', { tags: 1 })

    await dropByKeys('recipes', { name: 1 })
    await dropByKeys('recipes', { tags: 1 })
    await dropByKeys('recipes', { difficulty: 1 })
    await dropByKeys('recipes', { calories: 1 })

    await dropByKeys('comments', { recipeId: 1, createdAt: -1 })
    await dropByKeys('comments', { userId: 1, createdAt: -1 })

    await dropByKeys('mealplans', { userId: 1, date: -1 })

    await dropByKeys('subscriptions', { userId: 1, status: 1 })
    await dropByKeys('subscriptions', { planType: 1, planDuration: 1 })

    await dropByKeys('transactions', { userId: 1, createdAt: -1 })
    await dropByKeys('transactions', { status: 1, paymentMethod: 1 })

    await dropByKeys('analytics', { recipeId: 1 })
}
