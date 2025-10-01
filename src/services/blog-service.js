function getApiUrl(path = "") {
  const base =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}` ||
    "http://localhost:3000";
  return `${base}/api/blog${path}`;
}

// Get all blogs
export async function getAllBlogs() {
  const res = await fetch(getApiUrl(), { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

// Get single blog by ID
export async function getBlogById(id) {
  const res = await fetch(getApiUrl(`/${id}`));
  if (!res.ok) return null;
  return res.json();
}

// Create a new blog
export async function createBlog(blog) {
  const res = await fetch(getApiUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(blog),
  });
  if (!res.ok) throw new Error("Failed to create blog");
  return res.json();
}

// Update a blog
export async function updateBlog(id, blog) {
  const res = await fetch(getApiUrl(`/${id}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(blog),
  });
  if (!res.ok) throw new Error("Failed to update blog");
  return res.json();
}

// Delete a blog
export async function deleteBlog(id) {
  const res = await fetch(getApiUrl(`/${id}`), { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete blog");
  return true;
}

export async function toggleLike(blogId, userId) {
  const res = await fetch(getApiUrl(`/${blogId}`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "like", userId }),
  });
  if (!res.ok) throw new Error("Failed to like/unlike blog");
  return res.json();
}

export async function addComment(blogId, userId, author, content) {
  const res = await fetch(getApiUrl(`/${blogId}`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "comment", userId, author, content }),
  });
  if (!res.ok) throw new Error("Failed to add comment");
  return res.json();
}