import { authOptions } from "../../auth/[...nextauth]/route";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "next-auth";
import { RecipeSchemaString } from "@/utils/schemaStrings";
import Recipe from "@/database/models/Recipe";
import connectDB from "@/common/db";
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const systemPrompt = `...`;

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { weight, height, age, gender, workHabits } = session.user.profile;
    const { ingredients } = body;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const userInfo = { weight, height, age, gender, workHabits };

    const prompt = `
User Info: ${JSON.stringify(userInfo, null, 2)}
Ingredients: ${ingredients}
Recipe schema:  ${RecipeSchemaString}
Please ensure the field "englishName" is always a short, unique, and consistent name for this dish, as it will be used to check for duplicates in the database.
Generate a Recipe JSON match all schema attribute and hit the user's preference and ingredients, no more extra text please!
IMPORTANT: Return only raw JSON. No markdown, no explanation, no wrapping in code blocks. Language: Vietnamese.
If the Ingredients field is not ingredient or food, return an error message in Vietnamese in the Recipe name, others keep but no value.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    let aiMealPlan;
    try {
      const cleanResponse = response.replace(/```json|```/g, "").trim();
      aiMealPlan = JSON.parse(cleanResponse);
    } catch (err) {
      console.error("Gemini response parse error:", response);
      return new Response(
        JSON.stringify({
          error: "Gemini JSON Parsing Failed",
          details: err.message,
          rawResponse: response,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // 🔥 Fetch Unsplash image using recipe name
    const query = `${aiMealPlan.englishName || "food"}`;
    const unsplashImage = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        query
      )}&page=1&per_page=5&content_filter=high&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
    );
    const imgResult = await unsplashImage.json();
    const imgUrl =
      imgResult?.results?.[0]?.urls?.regular ||
      "https://png.pngtree.com/png-vector/20230824/ourmid/pngtree-line-art-food-products-icon-design-vector-png-image_6914965.png";

    // 🧠 Replace imageUrl
    aiMealPlan.image = imgUrl;

    // 🥗 Save to DB
    await connectDB();
    // Create a new recipe in the database
    const existing = await Recipe.findOne({ englishName: aiMealPlan.englishName });
    if (!existing) {
      const newRecipe = await Recipe.create(aiMealPlan);
    }

    return new Response(JSON.stringify(aiMealPlan), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Recipe Generation Error:", error);
    return new Response(
      JSON.stringify({
        error: "Recipe Generation Failed",
        message: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
