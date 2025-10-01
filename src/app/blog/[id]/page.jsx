"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

import { Border } from "@/components/Border";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { FadeIn } from "@/components/FadeIn";

import { formatDate } from "@/lib/formatDate";
import { useAuth } from "@/lib/hooks/use-auth";
import { CommentThread } from "@/components/CommentThread";

export default function BlogDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  // For top-level comment only
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/blog/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(setBlog)
      .catch(() => setError("Blog not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      alert("You must be logged in to like a blog.");
      return;
    }
    setLikeLoading(true);
    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "like", userId: user?._id || user?.id }),
      });
      if (!res.ok) throw new Error("Failed to like");
      const data = await res.json();
      setBlog((prev) => ({ ...prev, likes: Array(data.likes).fill("") }));
    } catch {
      alert("Failed to like blog");
    }
    setLikeLoading(false);
  };

  // Handle top-level comment
  const handleComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("You must be logged in to comment.");
      return;
    }
    if (!comment.trim()) return;
    setCommentLoading(true);
    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "comment",
          userId: user?._id || user?.id,
          author: user.name,
          content: comment,
          parentId: null,
        }),
      });
      if (!res.ok) throw new Error("Failed to comment");
      const comments = await res.json();
      // Ensure all comments and replies have a replies array
      function ensureRepliesArray(comments) {
        return comments.map((c) => ({
          ...c,
          replies: Array.isArray(c.replies) ? ensureRepliesArray(c.replies) : [],
        }));
      }
      setBlog((prev) => ({ ...prev, comments: ensureRepliesArray(comments) }));
      setComment("");
    } catch {
      alert("Failed to post comment");
    }
    setCommentLoading(false);
  };

  // Handle reply to any comment (threaded)
  const handleReply = async (replyContent, parentId) => {
    if (!isAuthenticated) {
      alert("You must be logged in to reply.");
      return;
    }
    if (!replyContent.trim()) return;
    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "comment",
          userId: user?._id || user?.id,
          author: user.name,
          content: replyContent,
          parentId,
        }),
      });
      if (!res.ok) throw new Error("Failed to reply");
      const comments = await res.json();
      function ensureRepliesArray(comments) {
        return comments.map((c) => ({
          ...c,
          replies: Array.isArray(c.replies) ? ensureRepliesArray(c.replies) : [],
        }));
      }
      setBlog((prev) => ({ ...prev, comments: ensureRepliesArray(comments) }));
    } catch {
      alert("Failed to post reply");
    }
  };

  if (loading) {
    return (
      <Container className="mt-24 text-center">
        <FadeIn>
          <div className="flex flex-col items-center justify-center">
            <span className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></span>
            <p className="text-neutral-600">Loading...</p>
          </div>
        </FadeIn>
      </Container>
    );
  }
  if (error || !blog) {
    return (
      <Container className="mt-24 text-center">
        <FadeIn>
          <p className="text-lg text-red-500 mb-4">{error || "Blog not found"}</p>
          <Button href="/blog">Back to Blog</Button>
        </FadeIn>
      </Container>
    );
  }

  return (
    <>
      <Container as="article" className="mt-24 sm:mt-32 lg:mt-40 relative">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="absolute left-0 top-0 ml-2 mt-2 flex items-center gap-1 text-blue-700 hover:text-blue-900 text-sm font-medium px-3 py-1 rounded transition-colors bg-blue-50 hover:bg-blue-100 border border-blue-100 shadow-sm"
          aria-label="Back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back
        </button>
        <FadeIn>
          <Border className="p-0 sm:p-8">
            <header className="mx-auto flex max-w-5xl flex-col text-center">
              <h1 className="mt-6 font-display text-4xl sm:text-5xl font-semibold tracking-tight [text-wrap:balance] text-neutral-950">
                {blog.title}
              </h1>
              <time
                dateTime={blog.publishedAt || blog.createdAt}
                className="order-first text-sm text-neutral-500"
              >
                {formatDate(
                  blog.publishedAt ||
                  (blog.createdAt && !isNaN(new Date(blog.createdAt))
                    ? new Date(blog.createdAt)
                    : new Date())
                )}
              </time>
              <p className="mt-4 text-base font-medium text-neutral-700">
                by <span className="font-semibold text-blue-700">{blog.author}</span>
              </p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {blog.tags && blog.tags.length > 0 &&
                  blog.tags.map((tag, idx) => (
                    <span key={idx} className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      #{tag}
                    </span>
                  ))}
              </div>
            </header>
            {/* Display multiple images if available, else fallback to single image */}
            {Array.isArray(blog.images) && blog.images.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                {blog.images.map((img, idx) => (
                  <Image
                    key={idx}
                    src={img}
                    alt={blog.title + ' image ' + (idx + 1)}
                    width={350}
                    height={220}
                    className="rounded-xl object-cover border border-neutral-200 shadow-sm"
                  />
                ))}
              </div>
            ) : blog.imageUrl ? (
              <div className="flex justify-center mt-8">
                <Image
                  src={blog.imageUrl}
                  alt={blog.title}
                  width={500}
                  height={300}
                  className="rounded-xl object-cover border border-neutral-200 shadow-sm"
                />
              </div>
            ) : null}
            <div className="mt-8 max-w-3xl mx-auto text-lg text-neutral-800 whitespace-pre-line leading-relaxed">
              {blog.content}
            </div>
            <div className="mt-8 flex items-center gap-4 justify-center">
              <Button onClick={handleLike} disabled={likeLoading} type="button" className="flex items-center gap-2 px-5 py-2">
                <span role="img" aria-label="like">👍</span>
                <span>Like</span>
                <span className="ml-1 text-blue-700 font-semibold">{blog.likes ? blog.likes.length : 0}</span>
              </Button>
            </div>
          </Border>
        </FadeIn>
        <FadeIn>
          <section className="mt-16 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-neutral-900">Comments</h2>
            {(() => { console.log('DEBUG: blog.comments', blog.comments); return null; })()}
            {blog.comments && blog.comments.length > 0 ? (
              <CommentThread
                comments={blog.comments}
                onReply={handleReply}
                isAuthenticated={isAuthenticated}
              />
            ) : (
              <p className="text-neutral-400">No comments yet.</p>
            )}
            <form onSubmit={handleComment} className="mt-8 flex gap-2 items-center">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 border border-neutral-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                disabled={!isAuthenticated || commentLoading}
              />
              <Button type="submit" disabled={!isAuthenticated || commentLoading} className="px-4 py-2">
                {commentLoading ? "Posting..." : "Post"}
              </Button>
            </form>
            {!isAuthenticated && (
              <p className="mt-2 text-sm text-red-500">You must be logged in to comment.</p>
            )}
          </section>
        </FadeIn>
        <div className="mt-12 text-center">
          <Button href="/blog" className="px-6 py-2">Back to Blog</Button>
        </div>
      </Container>
    </>
  );
}
