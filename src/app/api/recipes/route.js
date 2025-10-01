import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import connectDB from '../../../common/db';
import Recipe from '../../../database/models/Recipe';

export async function GET() {
  await connectDB();
  const recipes = await Recipe.find().lean();
  return new Response(JSON.stringify(recipes), { status: 200 });
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  await connectDB();
  const data = await req.json();
  // Always set isSuggestion and status for suggestions
  const isSuggestion = data.isSuggestion !== undefined ? data.isSuggestion : true;
  const status = data.status || (isSuggestion ? "pending" : "accepted");
  const recipe = await Recipe.create({ ...data, isSuggestion, status, createdBy: session.user.id });
  return new Response(JSON.stringify(recipe), { status: 201 });
}