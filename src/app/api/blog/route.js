import connectDB from '../../../common/db';
import Blog from '../../../database/models/Blog';

export async function GET(req) {
  await connectDB();
  const blogs = await Blog.find().sort({ createdAt: -1 }).lean();
  return new Response(JSON.stringify(blogs), { status: 200 });
}

export async function POST(req) {
  await connectDB();
  const data = await req.json();

  // Sanitize and set defaults for new fields
  const blogData = {
    ...data,
    images: Array.isArray(data.images) ? data.images : [],
    isRecipe: !!data.isRecipe,
    // Only set recipeStatus if isRecipe is true
    recipeStatus: data.isRecipe ? 'pending' : undefined,
  };
  // Remove undefined fields (like recipeStatus if not a recipe)
  Object.keys(blogData).forEach(key => blogData[key] === undefined && delete blogData[key]);

  const blog = await Blog.create(blogData);
  return new Response(JSON.stringify(blog), { status: 201 });
}