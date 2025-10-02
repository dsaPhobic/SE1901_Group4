import React, { useState, useEffect } from "react";
import CommentItem from "./CommentItem";
import { getComments, createComment } from "../../Services/ForumApi";
import "./CommentSection.css";

export default function CommentSection({ postId }) {
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
    setComments((prev) => [newComment, ...prev]);
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
        <h3>Suggestions</h3>
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
            No suggestions yet. Be the first to suggest!
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.commentId}
              comment={comment}
              onReply={handleCommentCreated}
            />
          ))
        )}
      </div>
    </div>
  );
}
