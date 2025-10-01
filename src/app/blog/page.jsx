"use client";

import { useEffect, useState } from "react";

// Full Recipe Modal with all fields from Recipe.js schema
function RecipeModal({ open, onClose, onSubmit }) {
  const [recipe, setRecipe] = useState({
    name: "",
    description: "",
    image: "",
    prepTime: "",
    cookTime: "",
    totalTime: "",
    servings: "",
    calories: "",
    difficulty: "Dễ",
    tags: "",
    ingredients: [{ name: "", amount: "" }],
    steps: [{ title: "", description: "" }],
    nutrition: {
      calories: "",
      protein: "",
      carbs: "",
      fat: "",
      fiber: "",
      sugar: "",
    },
    tips: [""],
    relatedRecipes: [{ id: "", name: "", image: "" }],
    videoUrl: "",
  });
  const [loading, setLoading] = useState(false);

  // Handle simple fields
  const handleChange = (e) => {
    setRecipe({ ...recipe, [e.target.name]: e.target.value });
  };

  // Handle array fields
  const handleArrayChange = (field, idx, subfield, value) => {
    setRecipe((prev) => {
      const arr = [...prev[field]];
      if (subfield === null || subfield === undefined) {
        // For arrays of strings (e.g., tips)
        arr[idx] = value;
      } else {
        // For arrays of objects
        arr[idx][subfield] = value;
      }
      return { ...prev, [field]: arr };
    });
  };
  const handleArrayAdd = (field, emptyObj) => {
    setRecipe((prev) => ({ ...prev, [field]: [...prev[field], emptyObj] }));
  };
  const handleArrayRemove = (field, idx) => {
    setRecipe((prev) => {
      const arr = [...prev[field]];
      arr.splice(idx, 1);
      return { ...prev, [field]: arr };
    });
  };

  // Handle nutrition
  const handleNutritionChange = (e) => {
    setRecipe({
      ...recipe,
      nutrition: { ...recipe.nutrition, [e.target.name]: e.target.value },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Convert tags to array
    const submitRecipe = {
      ...recipe,
      tags: recipe.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      servings: recipe.servings ? Number(recipe.servings) : undefined,
      calories: recipe.calories ? Number(recipe.calories) : undefined,
      nutrition: Object.fromEntries(
        Object.entries(recipe.nutrition).map(([k, v]) => [
          k,
          v === "" ? undefined : Number(v),
        ])
      ),
      isSuggestion: true,
      status: "pending",
    };
    await onSubmit(submitRecipe);
    setLoading(false);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl relative animate-fadeIn max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-700 text-xl font-bold"
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Submit Recipe for Moderation
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="name"
            value={recipe.name}
            onChange={handleChange}
            placeholder="Recipe Name"
            required
            className="w-full border border-neutral-300 p-2 rounded-lg"
          />
          <input
            name="image"
            value={recipe.image}
            onChange={handleChange}
            placeholder="Image URL"
            className="w-full border border-neutral-300 p-2 rounded-lg"
          />
          <input
            name="prepTime"
            value={recipe.prepTime}
            onChange={handleChange}
            placeholder="Prep Time (e.g. 10 min)"
            className="w-full border border-neutral-300 p-2 rounded-lg"
          />
          <input
            name="cookTime"
            value={recipe.cookTime}
            onChange={handleChange}
            placeholder="Cook Time (e.g. 20 min)"
            className="w-full border border-neutral-300 p-2 rounded-lg"
          />
          <input
            name="totalTime"
            value={recipe.totalTime}
            onChange={handleChange}
            placeholder="Total Time (e.g. 30 min)"
            className="w-full border border-neutral-300 p-2 rounded-lg"
          />
          <input
            name="servings"
            value={recipe.servings}
            onChange={handleChange}
            placeholder="Servings"
            type="number"
            className="w-full border border-neutral-300 p-2 rounded-lg"
          />
          <input
            name="calories"
            value={recipe.calories}
            onChange={handleChange}
            placeholder="Calories"
            type="number"
            className="w-full border border-neutral-300 p-2 rounded-lg"
          />
          <select
            name="difficulty"
            value={recipe.difficulty}
            onChange={handleChange}
            className="w-full border border-neutral-300 p-2 rounded-lg"
          >
            <option value="Dễ">Dễ</option>
            <option value="Trung bình">Trung bình</option>
            <option value="Khó">Khó</option>
          </select>
          <input
            name="tags"
            value={recipe.tags}
            onChange={handleChange}
            placeholder="Tags (comma separated)"
            className="w-full border border-neutral-300 p-2 rounded-lg"
          />
          {/* Ingredients */}
          <div>
            <label className="font-semibold">Ingredients</label>
            {recipe.ingredients.map((ing, idx) => (
              <div key={idx} className="flex gap-2 mb-1">
                <input
                  value={ing.name}
                  onChange={(e) =>
                    handleArrayChange(
                      "ingredients",
                      idx,
                      "name",
                      e.target.value
                    )
                  }
                  placeholder="Name"
                  className="border border-neutral-300 p-1 rounded w-1/2"
                />
                <input
                  value={ing.amount}
                  onChange={(e) =>
                    handleArrayChange(
                      "ingredients",
                      idx,
                      "amount",
                      e.target.value
                    )
                  }
                  placeholder="Amount"
                  className="border border-neutral-300 p-1 rounded w-1/2"
                />
                {recipe.ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleArrayRemove("ingredients", idx)}
                    className="text-red-500"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                handleArrayAdd("ingredients", { name: "", amount: "" })
              }
              className="text-blue-600 text-sm"
            >
              + Add Ingredient
            </button>
          </div>
          {/* Steps */}
          <div>
            <label className="font-semibold">Steps</label>
            {recipe.steps.map((step, idx) => (
              <div key={idx} className="mb-1">
                <input
                  value={step.title}
                  onChange={(e) =>
                    handleArrayChange("steps", idx, "title", e.target.value)
                  }
                  placeholder={`Step ${idx + 1} Title`}
                  className="border border-neutral-300 p-1 rounded w-full mb-1"
                />
                <textarea
                  value={step.description}
                  onChange={(e) =>
                    handleArrayChange(
                      "steps",
                      idx,
                      "description",
                      e.target.value
                    )
                  }
                  placeholder="Description"
                  className="border border-neutral-300 p-1 rounded w-full"
                />
                {recipe.steps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleArrayRemove("steps", idx)}
                    className="text-red-500"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                handleArrayAdd("steps", { title: "", description: "" })
              }
              className="text-blue-600 text-sm"
            >
              + Add Step
            </button>
          </div>
          {/* Nutrition */}
          <div>
            <label className="font-semibold">Nutrition</label>
            <div className="grid grid-cols-3 gap-2">
              <input
                name="calories"
                value={recipe.nutrition.calories}
                onChange={handleNutritionChange}
                placeholder="Calories"
                type="number"
                className="border border-neutral-300 p-1 rounded"
              />
              <input
                name="protein"
                value={recipe.nutrition.protein}
                onChange={handleNutritionChange}
                placeholder="Protein"
                type="number"
                className="border border-neutral-300 p-1 rounded"
              />
              <input
                name="carbs"
                value={recipe.nutrition.carbs}
                onChange={handleNutritionChange}
                placeholder="Carbs"
                type="number"
                className="border border-neutral-300 p-1 rounded"
              />
              <input
                name="fat"
                value={recipe.nutrition.fat}
                onChange={handleNutritionChange}
                placeholder="Fat"
                type="number"
                className="border border-neutral-300 p-1 rounded"
              />
              <input
                name="fiber"
                value={recipe.nutrition.fiber}
                onChange={handleNutritionChange}
                placeholder="Fiber"
                type="number"
                className="border border-neutral-300 p-1 rounded"
              />
              <input
                name="sugar"
                value={recipe.nutrition.sugar}
                onChange={handleNutritionChange}
                placeholder="Sugar"
                type="number"
                className="border border-neutral-300 p-1 rounded"
              />
            </div>
          </div>
          {/* Tips */}
          <div>
            <label className="font-semibold">Tips</label>
            {recipe.tips.map((tip, idx) => (
              <div key={idx} className="flex gap-2 mb-1">
                <input
                  value={tip}
                  onChange={(e) =>
                    handleArrayChange("tips", idx, null, e.target.value)
                  }
                  placeholder="Tip"
                  className="border border-neutral-300 p-1 rounded w-full"
                />
                {recipe.tips.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleArrayRemove("tips", idx)}
                    className="text-red-500"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleArrayAdd("tips", "")}
              className="text-blue-600 text-sm"
            >
              + Add Tip
            </button>
          </div>
          {/* Related Recipes */}
          <div>
            <label className="font-semibold">Related Recipes</label>
            {recipe.relatedRecipes.map((rel, idx) => (
              <div key={idx} className="flex gap-2 mb-1">
                <input
                  value={rel.id}
                  onChange={(e) =>
                    handleArrayChange(
                      "relatedRecipes",
                      idx,
                      "id",
                      e.target.value
                    )
                  }
                  placeholder="ID"
                  className="border border-neutral-300 p-1 rounded w-1/3"
                />
                <input
                  value={rel.name}
                  onChange={(e) =>
                    handleArrayChange(
                      "relatedRecipes",
                      idx,
                      "name",
                      e.target.value
                    )
                  }
                  placeholder="Name"
                  className="border border-neutral-300 p-1 rounded w-1/3"
                />
                <input
                  value={rel.image}
                  onChange={(e) =>
                    handleArrayChange(
                      "relatedRecipes",
                      idx,
                      "image",
                      e.target.value
                    )
                  }
                  placeholder="Image URL"
                  className="border border-neutral-300 p-1 rounded w-1/3"
                />
                {recipe.relatedRecipes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleArrayRemove("relatedRecipes", idx)}
                    className="text-red-500"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                handleArrayAdd("relatedRecipes", {
                  id: "",
                  name: "",
                  image: "",
                })
              }
              className="text-blue-600 text-sm"
            >
              + Add Related Recipe
            </button>
          </div>
          <input
            name="videoUrl"
            value={recipe.videoUrl}
            onChange={handleChange}
            placeholder="Video URL"
            className="w-full border border-neutral-300 p-2 rounded-lg"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full font-semibold hover:bg-blue-700 transition-colors"
          >
            {loading ? "Submitting..." : "Submit Recipe"}
          </button>
        </form>
      </div>
    </div>
  );
}
function BlogModal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-xl relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-700 text-xl font-bold"
          aria-label="Close"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
import Image from "next/image";
import Link from "next/link";

import { Border } from "@/components/Border";
import { Button } from "@/components/Button";
import { ContactSection } from "@/components/ContactSection";
import { Container } from "@/components/Container";
import { FadeIn } from "@/components/FadeIn";
import { PageIntro } from "@/components/PageIntro";
import { formatDate } from "@/lib/formatDate";
import { getAllBlogs, createBlog } from "@/services/blog-service";
import { useAuth } from "@/lib/hooks/use-auth";

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [recipeSuggestions, setRecipeSuggestions] = useState([]);
  const [form, setForm] = useState({
    title: "",
    content: "",
    tags: "",
    imageUrl: "",
    images: [], // Array of image URLs
    isRecipe: false,
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const { user, isAuthenticated, login } = useAuth();

  useEffect(() => {
    // Fetch blogs
    getAllBlogs().then(setBlogs);
    // Fetch recipe suggestions
    fetch("/api/recipes")
      .then((res) => res.json())
      .then((data) => {
        // Only show recipe suggestions (isSuggestion: true)
        setRecipeSuggestions(
          data.filter((r) => r.isSuggestion === true)
        );
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("You must be logged in to post a blog.");
      return;
    }
    // If isRecipe, open recipe modal instead of submitting blog
    if (form.isRecipe) {
      setShowModal(false);
      setShowRecipeModal(true);
      return;
    }
    setLoading(true);
    let imageUrl = form.imageUrl;
    let images = [];
    // Handle multiple image uploads to Cloudinary
    if (imageFiles.length > 0) {
      try {
        for (const file of imageFiles) {
          const data = new FormData();
          data.append("file", file);
          data.append("upload_preset", "profile_images");
          const res = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
              method: "POST",
              body: data,
            }
          );
          const result = await res.json();
          images.push(result.secure_url);
        }
        if (images.length > 0) imageUrl = images[0];
      } catch (err) {
        alert("Image upload failed");
        setLoading(false);
        return;
      }
    }
    try {
      const newBlog = await createBlog({
        ...form,
        author: user?.name || "Anonymous",
        imageUrl,
        images,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      });
      setBlogs([newBlog, ...blogs]);
      setForm({
        title: "",
        content: "",
        tags: "",
        imageUrl: "",
        images: [],
        isRecipe: false,
      });
    } catch (err) {
      alert("Failed to create blog");
    }
    setLoading(false);
  };

  // Handle recipe modal submit
  const handleRecipeSubmit = async (recipe) => {
    // You can expand this to upload images, etc.
    try {
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...recipe,
          isSuggestion: true,
          status: "pending",
          author: user?.name || "Anonymous",
        }),
      });
      if (!res.ok) throw new Error("Failed to submit recipe");
      alert("Recipe submitted for moderation!");
      setShowRecipeModal(false);
      setForm({
        title: "",
        content: "",
        tags: "",
        imageUrl: "",
        images: [],
        isRecipe: false,
      });
    } catch {
      alert("Failed to submit recipe");
    }
  };

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDelete = (blogId) => {
    setDeleteTarget(blogId);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/blog/${deleteTarget}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setBlogs((prev) => prev.filter((b) => b._id !== deleteTarget));
      setDeleteTarget(null);
    } catch {
      alert("Failed to delete blog post.");
    }
    setDeleteLoading(false);
  };

  return (
    <>
      <PageIntro eyebrow="Blog" title="The latest articles and news">
        <p>
          Stay up-to-date with the latest industry news as our marketing teams
          find new ways to re-purpose old CSS tricks articles.
        </p>
      </PageIntro>

      {/* New Blog Post Form */}
      <section className="bg-neutral-50 py-12 border-b border-neutral-200">
        <Container>
          {!isAuthenticated ? (
            <div className="text-center">
              <p className="mb-4">You must be logged in to post a blog.</p>
              <Button onClick={login}>Login with Google</Button>
            </div>
          ) : (
            <div className="text-center">
              <Button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                + New Blog Post
              </Button>
            </div>
          )}
        </Container>
        <BlogModal open={showModal} onClose={() => setShowModal(false)}>
          {/* Recipe Modal (shows if isRecipe is checked) */}
          <RecipeModal
            open={showRecipeModal}
            onClose={() => setShowRecipeModal(false)}
            onSubmit={handleRecipeSubmit}
          />
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Create New Blog Post
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Title"
              required
              className="w-full border border-neutral-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="Tags (comma separated)"
              className="w-full border border-neutral-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full border border-neutral-300 p-2 rounded-lg"
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isRecipe"
                checked={form.isRecipe}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setForm((f) => ({ ...f, isRecipe: checked }));
                  if (checked) {
                    setShowModal(false);
                    setShowRecipeModal(true);
                  } else {
                    setShowRecipeModal(false);
                  }
                }}
              />
              Share as Recipe
            </label>
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="Or paste image URL"
              className="w-full border border-neutral-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Content"
              required
              className="w-full border border-neutral-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100"
              rows={4}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-4 py-2 rounded-lg w-full font-semibold hover:bg-gray-700 transition-colors"
            >
              {loading ? "Posting..." : "Post Blog"}
            </button>
          </form>
        </BlogModal>
      </section>

      <section className="bg-white py-16">
        <Container>
          <div className="space-y-16 lg:space-y-24">
            {[...blogs, ...recipeSuggestions].map((blog) => (
              <FadeIn key={blog._id}>
                <article>
                  <Border className="pt-10 pb-8 px-4 sm:px-8 bg-neutral-50/80 rounded-xl shadow-sm border border-neutral-200">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:gap-8">
                      {blog.imageUrl || blog.image ? (
                        <div className="mb-6 lg:mb-0 flex-shrink-0 flex justify-center">
                          <Image
                            alt={blog.title || blog.name}
                            src={blog.imageUrl || blog.image}
                            width={120}
                            height={120}
                            className="rounded-lg object-cover border border-neutral-200 shadow-sm w-28 h-28"
                          />
                        </div>
                      ) : null}
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {blog.tags &&
                            blog.tags.length > 0 &&
                            blog.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium"
                              >
                                #{tag}
                              </span>
                            ))}
                          {blog.isSuggestion && (
                            <span className="inline-block px-2 py-1 bg-orange-200 text-orange-800 rounded text-xs font-semibold ml-2">
                              Recipe Suggestion
                            </span>
                          )}
                        </div>
                        <h2 className="font-display text-2xl font-semibold text-neutral-950 mb-1">
                          <Link href={blog.isSuggestion ? `/cong-thuc/${blog._id}` : `/blog/${blog._id}`}>{blog.title || blog.name}</Link>
                        </h2>
                        <div className="flex items-center gap-3 text-sm text-neutral-500 mb-2">
                          <time
                            dateTime={blog.publishedAt || blog.createdAt}
                            className=""
                          >
                            {formatDate(blog.publishedAt || blog.createdAt)}
                          </time>
                          <span>·</span>
                          <span className="font-semibold text-blue-700">
                            {blog.author}
                          </span>
                        </div>
                        <p className="max-w-2xl text-base text-neutral-600 mb-2">
                          {(blog.content || blog.description || "").slice(0, 150)}...
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="flex items-center gap-1 text-blue-700 font-medium">
                            <span role="img" aria-label="like">
                              👍
                            </span>
                            {blog.likes ? blog.likes.length : 0} Likes
                          </span>
                          <Button
                            href={blog.isSuggestion ? `/cong-thuc/${blog._id}` : `/blog/${blog._id}`}
                            aria-label={`Read more: ${blog.title || blog.name}`}
                            className="ml-auto px-4 py-1 text-sm"
                          >
                            Read more
                          </Button>
                          {/* Delete button if user is author */}
                          {isAuthenticated &&
                            (user?.name === blog.author ||
                              user?.email === blog.author ||
                              user?._id === blog.author ||
                              user?.id === blog.author) && (
                              <Button
                                type="button"
                                onClick={() => handleDelete(blog._id)}
                                className="px-3 py-1 text-sm bg-red-100 text-red-700 hover:bg-red-200 border border-red-200 ml-2"
                              >
                                Delete
                              </Button>
                            )}
                          {/* Delete Confirmation Modal */}
                          <BlogModal
                            open={!!deleteTarget}
                            onClose={() => setDeleteTarget(null)}
                          >
                            <div className="text-center">
                              <h3 className="text-xl font-semibold mb-4 text-red-700">
                                Delete Blog Post
                              </h3>
                              <p className="mb-6 text-neutral-700">
                                Are you sure you want to delete this blog post?
                                This action cannot be undone.
                              </p>
                              <div className="flex justify-center gap-4">
                                <Button
                                  onClick={confirmDelete}
                                  disabled={deleteLoading}
                                  className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                                >
                                  {deleteLoading
                                    ? "Deleting..."
                                    : "Yes, Delete"}
                                </Button>
                                <Button
                                  onClick={() => setDeleteTarget(null)}
                                  className="bg-neutral-200 text-neutral-700 px-6 py-2 rounded-lg font-semibold hover:bg-neutral-300 transition-colors"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </BlogModal>
                        </div>
                      </div>
                    </div>
                  </Border>
                </article>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
