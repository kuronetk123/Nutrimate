import connectDB from '../../../../common/db';
import Blog from '../../../../database/models/Blog';


export async function GET(req, context) {
  await connectDB();
  const params = await context.params;
  const blog = await Blog.findById(params.id); // removed .lean()
  if (!blog) return new Response('Not found', { status: 404 });
  // Ensure all comments and replies have a replies array
  function ensureRepliesArray(comments) {
    if (!Array.isArray(comments)) return [];
    return comments.map((c) => ({
      ...c.toObject?.() || c,
      replies: Array.isArray(c.replies) ? ensureRepliesArray(c.replies) : [],
    }));
  }
  const blogObj = blog.toObject();
  if (blogObj.comments) {
    blogObj.comments = ensureRepliesArray(blogObj.comments);
  }
  return new Response(JSON.stringify(blogObj), { status: 200 });
}


export async function POST(req, context) {
  await connectDB();
  const params = await context.params;
  const body = await req.json();
  const { type, userId, id, author, content, parentId } = body;
  const actualUserId = userId || id;
  const blog = await Blog.findById(params.id);
  if (!blog) return new Response('Not found', { status: 404 });

  if (type === 'like') {
    if (!actualUserId) return new Response('Missing userId', { status: 400 });
    const alreadyLiked = blog.likes.includes(actualUserId);
    if (alreadyLiked) {
      blog.likes.pull(actualUserId);
    } else {
      blog.likes.push(actualUserId);
    }
    await blog.save();
    return new Response(JSON.stringify({ likes: blog.likes.length, liked: !alreadyLiked }), { status: 200 });
  }

  if (type === 'comment') {
    if (!actualUserId || !author || !content) return new Response('Missing fields', { status: 400 });

    // Recursively find parent comment at any depth and push reply
    // Rebuild comments tree with new reply and return new array
    function addReplyAndReturnNewTree(comments, parentId, reply) {
      return comments.map(comment => {
        if (String(comment._id) === String(parentId)) {
          const replies = Array.isArray(comment.replies) ? [...comment.replies, reply] : [reply];
          return { ...comment.toObject?.() || comment, replies };
        }
        if (comment.replies && comment.replies.length > 0) {
          return { ...comment.toObject?.() || comment, replies: addReplyAndReturnNewTree(comment.replies, parentId, reply) };
        }
        return comment;
      });
    }

    if (parentId) {
      // Add as a reply to any comment at any depth by rebuilding the tree
      const reply = { userId: actualUserId, author, content, parentId, replies: [] };
      const before = JSON.stringify(blog.comments);
      const newComments = addReplyAndReturnNewTree(blog.comments, parentId, reply);
      const after = JSON.stringify(newComments);
      const added = before !== after;
      console.log('DEBUG: addReplyAndReturnNewTree', { added, before, after });
      if (!added) {
        return new Response('Parent comment not found', { status: 404 });
      }
      // Recursively push each comment and reply into blog.comments using .push()
      // Only use .create() at the top level, assign plain objects for nested replies
      function assignReplies(comment) {
        if (Array.isArray(comment.replies) && comment.replies.length > 0) {
          comment.replies = comment.replies.map(assignReplies);
        } else {
          comment.replies = [];
        }
        return comment;
      }
      blog.comments.splice(0, blog.comments.length);
      newComments.forEach((c) => {
        const topLevel = blog.comments.create({ ...c, replies: (c.replies || []).map(assignReplies) });
        blog.comments.push(topLevel);
      });
      blog.markModified('comments');
    } else {
      // Add as a top-level comment
      blog.comments.push({ userId: actualUserId, author, content, parentId: null, replies: [] });
    }
    await blog.save();
    // Fetch the blog again to see what is actually persisted
    const freshBlog = await Blog.findById(params.id);
    console.log('DEBUG: persisted comments', JSON.stringify(freshBlog.comments));
    // Ensure all comments in the response have replies arrays
    function ensureRepliesArray(comments) {
      for (let c of comments) {
        if (!Array.isArray(c.replies)) c.replies = [];
        if (c.replies.length > 0) ensureRepliesArray(c.replies);
      }
    }
    const comments = freshBlog.comments.toObject ? freshBlog.comments.toObject() : freshBlog.comments;
    ensureRepliesArray(comments);
    return new Response(JSON.stringify(comments), { status: 201 });
  }

  return new Response('Invalid type', { status: 400 });
}