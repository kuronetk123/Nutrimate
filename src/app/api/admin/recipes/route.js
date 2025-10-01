import { NextResponse } from "next/server"
import connectDB from "@/common/db"
import Recipe from "@/database/models/Recipe"
import { image } from "@/lib/cloudinary"

export async function GET(request) {
    try {
        // const user = await requireAdmin(request)
        // if (!user) {
        //   return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 403 })
        // }

        const url = new URL(request.url)
        const page = Number.parseInt(url.searchParams.get("page") || "1")
        const limit = Number.parseInt(url.searchParams.get("limit") || "10")
        const search = url.searchParams.get("search") || undefined
        const category = url.searchParams.get("category") || undefined
        const sortBy = url.searchParams.get("sortBy") || "createdAt"
        const sortOrder = url.searchParams.get("sortOrder") === "asc" ? 1 : -1

        if (isNaN(page) || page < 1) {
            return NextResponse.json({ error: "Trang không hợp lệ" }, { status: 400 })
        }

        if (isNaN(limit) || limit < 1 || limit > 100) {
            return NextResponse.json({ error: "Giới hạn không hợp lệ" }, { status: 400 })
        }

        const db = await connectDB()

        // Build filter
        const filter = {}
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ]
        }
        if (category) {
            filter.category = category
        }

        // Pagination
        const skip = (page - 1) * limit

        // Fetch data
        const recipes = await Recipe
            .find(filter)
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit)

        const totalRecipes = await Recipe.countDocuments(filter)
        // Format result
        const formattedRecipes = recipes.map((recipe) => ({
            id: recipe._id.toString(),
            name: recipe.name,
            category: recipe.category,
            difficulty: recipe.difficulty,
            createdAt: recipe.createdAt?.toISOString?.() || null,
            createdBy: recipe.user?.name || "System",
            isPublished: recipe.isPublished,
            viewCount: recipe.viewCount || 0,
            favoriteCount: recipe.favorites?.length || 0,
            imageUrl: recipe.image || null,
            status: recipe.status || "pending",
        }))

        return NextResponse.json({
            recipes: formattedRecipes,
            total: totalRecipes,
            pages: Math.ceil(totalRecipes / limit),
        })
    } catch (error) {
        console.error("Admin recipes error:", error)
        return NextResponse.json({ error: "Đã xảy ra lỗi khi lấy danh sách công thức" }, { status: 500 })
    }
}
