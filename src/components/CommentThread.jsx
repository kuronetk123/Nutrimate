import { useState } from "react";
import { Button } from "@/components/Button";

// Recursive comment tree component
export function CommentThread({ comments, onReply, isAuthenticated }) {
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentNode
          key={comment._id}
          comment={comment}
          onReply={onReply}
          isAuthenticated={isAuthenticated}
        />
      ))}
    </div>
  );
}

function CommentNode({ comment, onReply, isAuthenticated }) {
  const [showReply, setShowReply] = useState(false);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    if (!reply.trim()) return;
    setLoading(true);
    await onReply(reply, comment._id);
    setReply("");
    setShowReply(false);
    setLoading(false);
  };

  return (
    <div className="border border-neutral-200 rounded-lg p-4 bg-neutral-50 flex flex-col gap-1 shadow-sm ml-0">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-blue-700">{comment.author}</span>
        <span className="text-xs text-neutral-400">{comment.createdAt ? new Date(comment.createdAt).toLocaleString() : ""}</span>
      </div>
      <div className="text-sm text-neutral-700 mt-1">{comment.content}</div>
      <div className="flex gap-2 mt-2">
        {isAuthenticated && (
          <Button type="button" className="px-2 py-1 text-xs" onClick={() => setShowReply((v) => !v)}>
            {showReply ? "Cancel" : "Reply"}
          </Button>
        )}
      </div>
      {showReply && (
        <form onSubmit={handleReply} className="flex gap-2 mt-2">
          <input
            type="text"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Write a reply..."
            className="flex-1 border border-neutral-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white text-xs"
            disabled={loading}
          />
          <Button type="submit" disabled={loading} className="px-3 py-1 text-xs">
            {loading ? "Posting..." : "Post"}
          </Button>
        </form>
      )}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-6 mt-2">
          <CommentThread comments={comment.replies} onReply={onReply} isAuthenticated={isAuthenticated} />
        </div>
      )}
    </div>
  );
}
