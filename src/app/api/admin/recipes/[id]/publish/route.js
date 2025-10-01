import { NextResponse } from "next/server"
import connectDB from "@/common/db"
import Recipe from "@/database/models/Recipe"

export async function PUT(request, context) {
    try {
        const { params } = await context;
        const { id } = params;
        const db = await connectDB();
        const body = await request.json();
        const { status } = body;
        if (!id || !status) {
            return NextResponse.json({ error: "Thiếu thông tin cập nhật trạng thái" }, { status: 400 });
        }
        const recipe = await Recipe.findById(id);
        if (!recipe) {
            return NextResponse.json({ error: "Không tìm thấy công thức" }, { status: 404 });
        }
        recipe.status = status;
        await recipe.save();
        return NextResponse.json({ success: true, status: recipe.status });
    } catch (error) {
        console.error("Update recipe status error:", error);
        return NextResponse.json({ error: "Đã xảy ra lỗi khi cập nhật trạng thái công thức" }, { status: 500 });
    }
}
