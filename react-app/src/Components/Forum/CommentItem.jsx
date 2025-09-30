import React, { useState } from "react";
import { createComment } from "../../Services/ForumApi";

export default function CommentItem({ comment, onReply }) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || submitting) return;

    try {
      setSubmitting(true);
      const response = await createComment(comment.postId, replyText, comment.commentId);
      onReply(response.data);
      setReplyText("");
      setShowReplyForm(false);
    } catch (error) {
      console.error("Error creating reply:", error);
      alert("Error creating reply. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="comment-item">
      <div className="comment-header">
        <img 
          src={comment.user?.avatar || "/default-avatar.png"} 
          alt={comment.user?.username}
          className="comment-avatar"
        />
        <div className="comment-user-info">
          <p className="comment-username">@{comment.user?.username}</p>
          <p className="comment-time">{formatTime(comment.createdAt)}</p>
        </div>
      </div>
      
      <div className="comment-content">
        {comment.content}
      </div>
      
      <div className="comment-actions">
        <button 
          className="comment-action-btn"
          onClick={() => setShowReplyForm(!showReplyForm)}
        >
          Reply
        </button>
        <button className="comment-action-btn">
          Like ({comment.likeNumber || 0})
        </button>
      </div>
      
      {showReplyForm && (
        <div className="reply-form">
          <form onSubmit={handleReply}>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your reply..."
              rows={3}
              required
            />
            <div className="reply-actions">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => {
                  setShowReplyForm(false);
                  setReplyText("");
                }}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={submitting || !replyText.trim()}
              >
                {submitting ? "Replying..." : "Reply"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
