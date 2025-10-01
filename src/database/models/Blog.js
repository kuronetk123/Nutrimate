import mongoose from 'mongoose';

// Define comment schema (without replies first)
const CommentSchema = new mongoose.Schema({
  userId: String,
  author: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
  parentId: { type: String, default: null }
}, { _id: true, id: true });

// Add replies as array of CommentSchema (after initial definition)
CommentSchema.add({
  replies: [CommentSchema]
});


const BlogSchema = new mongoose.Schema(
  {
  title: { type: String, required: true },
  content: { type: String, required: true },
    author: { type: String, required: true },
    // Support both single and multiple images for backward compatibility
    imageUrl: { type: String },
    images: [{ type: String }], // Array of image URLs
    published: { type: Boolean, default: false },
    publishedAt: { type: Date },
    tags: [String],
    likes: [{ type: String }],
    comments: [CommentSchema],
    isRecipe: { type: Boolean, default: false }, // Mark as recipe
    recipeStatus: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" } // Admin moderation
  },
  { timestamps: true }
);

// Force recompile model in dev to avoid schema caching issues
delete mongoose.models.Blog;
export default mongoose.model('Blog', BlogSchema);