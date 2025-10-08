import React, { useState, useEffect } from "react";
import CommentItem from "./CommentItem";
import { getComments, createComment } from "../../Services/ForumApi";
import "./CommentSection.css";

export default function CommentSection({ postId, postOwnerId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = () => {
    setLoading(true);
    getComments(postId)
      .then((response) => {
        console.log("Loaded comments:", response.data);
        setComments(response.data);
      })
      .catch((error) => {
        console.error("Error loading comments:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    setSubmitting(true);
    createComment(postId, newComment)
      .then((response) => {
        setComments((prev) => [response.data, ...prev]);
        setNewComment("");
      })
      .catch((error) => {
        console.error("Error creating comment:", error);
        alert("Error creating comment. Please try again.");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const handleCommentCreated = (newComment) => {
    console.log("New comment created:", newComment);
    console.log("Has parentCommentId:", newComment.parentCommentId);
    
    // Xử lý delete comment
    if (newComment.action === 'delete') {
      setComments((prev) => {
        const removeComment = (comments) => {
          return comments.filter(comment => comment.commentId !== newComment.commentId)
            .map(comment => ({
              ...comment,
              replies: comment.replies ? removeComment(comment.replies) : []
            }));
        };
        return removeComment(prev);
      });
      return;
    }
    
    // Nếu là reply, cần cập nhật comment cha (có thể ở bất kỳ tầng nào)
    if (newComment.parentCommentId) {
      setComments((prev) => {
        const updateCommentWithReply = (comments) => {
          return comments.map(comment => {
            if (comment.commentId === newComment.parentCommentId) {
              console.log("Updating parent comment:", comment.commentId);
              return { ...comment, replies: [...comment.replies, newComment] };
            }
            // Recursively update nested comments
            if (comment.replies && comment.replies.length > 0) {
              return { ...comment, replies: updateCommentWithReply(comment.replies) };
            }
            return comment;
          });
        };
        
        const updated = updateCommentWithReply(prev);
        console.log("Updated comments:", updated);
        return updated;
      });
    } else {
      // Nếu là comment gốc, thêm vào đầu danh sách
      setComments((prev) => [newComment, ...prev]);
    }
  };

  if (loading) {
    return (
      <div className="comment-section">
        <div className="loading">Loading comments...</div>
      </div>
    );
  }

  return (
    <div className="comment-section">
      <div className="comment-form">
        <form onSubmit={handleSubmit}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Type here your wise suggestion"
            rows={4}
            required
          />
          <div className="comment-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setNewComment("")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting || !newComment.trim()}
            >
              {submitting ? "Suggesting..." : "Suggest"}
            </button>
          </div>
        </form>
      </div>

      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="no-comments">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          comments
            .filter(comment => !comment.parentCommentId) // Chỉ hiển thị comments gốc
            .map((comment) => (
              <CommentItem
                key={comment.commentId}
                comment={comment}
                onReply={handleCommentCreated}
                level={0}
                postId={postId}
                postOwnerId={postOwnerId}
              />
            ))
        )}
      </div>
    </div>
  );
}
