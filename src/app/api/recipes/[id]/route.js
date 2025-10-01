import connectDB from '../../../../common/db';
import Recipe from '../../../../database/models/Recipe';
import { NextResponse } from 'next/server';
export async function GET(req, { params }) {
  await connectDB();
  const recipe = await Recipe.findById(params.id).lean();
  if (!recipe) return new Response('Recipe not found', { status: 404 });
  return new Response(JSON.stringify(recipe), { status: 200 });
}


// UPDATE a recipe
export async function PUT(request, { params }) {
  try {
    // const user = await requireAdmin(request)
    // if (!user) {
    //   return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 403 })
    // }

    const { id } = params
    const data = await request.json()
    const db = await connectDB()

    // Validate required fields
    if (!data.name) {
      return NextResponse.json({ error: "Tên công thức là bắt buộc" }, { status: 400 })
    }

    // Find the recipe first to make sure it exists
    const existingRecipe = await Recipe.findById(id)
    if (!existingRecipe) {
      return NextResponse.json({ error: "Không tìm thấy công thức" }, { status: 404 })
    }

    // Update the recipe
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      id,
      {
        name: data.name,
        description: data.description,
        image: data.image,
        prepTime: data.prepTime,
        cookTime: data.cookTime,
        totalTime: data.totalTime,
        servings: data.servings,
        calories: data.calories,
        difficulty: data.difficulty,
        tags: data.tags || [],
        ingredients: data.ingredients || [],
        steps: data.steps || [],
        nutrition: data.nutrition,
        tips: data.tips || [],
        relatedRecipes: data.relatedRecipes || [],
        isPublished: data.isPublished || false,
        videoUrl: data.videoUrl || '',
      },
      { new: true }, // Return the updated document
    )

    return NextResponse.json({
      id: updatedRecipe._id.toString(),
      name: updatedRecipe.name,
      description: updatedRecipe.description,
      image: updatedRecipe.image,
      prepTime: updatedRecipe.prepTime,
      cookTime: updatedRecipe.cookTime,
      totalTime: updatedRecipe.totalTime,
      servings: updatedRecipe.servings,
      calories: updatedRecipe.calories,
      difficulty: updatedRecipe.difficulty,
      tags: updatedRecipe.tags,
      ingredients: updatedRecipe.ingredients,
      steps: updatedRecipe.steps,
      nutrition: updatedRecipe.nutrition,
      tips: updatedRecipe.tips,
      relatedRecipes: updatedRecipe.relatedRecipes,
      isPublished: updatedRecipe.isPublished || false,
      updatedAt: updatedRecipe.updatedAt?.toISOString() || null,
    })
  } catch (error) {
    console.error("Update recipe error:", error)
    return NextResponse.json({ error: "Đã xảy ra lỗi khi cập nhật công thức" }, { status: 500 })
  }
}


// DELETE a recipe
export async function DELETE(request, { params }) {
  try {

    const { id } = params
    const db = await connectDB()

    const recipe = await Recipe.findById(id)
    if (!recipe) {
      return NextResponse.json({ error: "Không tìm thấy công thức" }, { status: 404 })
    }

    await Recipe.findByIdAndDelete(id)

    return NextResponse.json({ message: "Đã xóa công thức thành công" })
  } catch (error) {
    console.error("Delete recipe error:", error)
    return NextResponse.json({ error: "Đã xảy ra lỗi khi xóa công thức" }, { status: 500 })
  }
}
