import React, { useState } from "react";
import { voteComment, unvoteComment, createReply } from "../../Services/ForumApi";

export default function CommentItem({ comment, onReply }) {
  const [isVoted, setIsVoted] = useState(comment.isVoted || false);
  const [voteCount, setVoteCount] = useState(comment.voteCount || 0);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const handleVote = (e) => {
    e.stopPropagation();
    
    if (isVoted) {
      unvoteComment(comment.commentId)
        .then(() => {
          setIsVoted(false);
          setVoteCount(prev => prev - 1);
        })
        .catch(error => {
          console.error("Error unvoting comment:", error);
        });
    } else {
      voteComment(comment.commentId)
        .then(() => {
          setIsVoted(true);
          setVoteCount(prev => prev + 1);
        })
        .catch(error => {
          console.error("Error voting comment:", error);
        });
    }
  };

  const handleReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || submitting) return;

    setSubmitting(true);
    createReply(comment.commentId, replyText)
      .then((response) => {
        onReply(response.data);
        setReplyText("");
        setShowReplyForm(false);
      })
      .catch(error => {
        console.error("Error creating reply:", error);
        alert("Error creating reply. Please try again.");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const hasReplies = comment.replies && comment.replies.length > 0;
  const replyCount = comment.replyCount || 0;

  // Debug log to see what comment data we're getting
  console.log('Comment data:', comment);

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
          className={`comment-action-btn vote-btn ${isVoted ? "voted" : ""}`}
          onClick={handleVote}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
          </svg>
          <span>{voteCount}</span>
        </button>
        <button
          className={`comment-action-btn vote-btn`}
          onClick={handleVote}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/>
          </svg>
          <span>{Math.max(0, voteCount - 1)}</span>
        </button>
        {hasReplies && (
          <button
            className="comment-action-btn"
            onClick={() => setShowReplies(!showReplies)}
          >
            {showReplies ? `Hide All Replies (${replyCount})` : `Show All Replies (${replyCount})`}
          </button>
        )}
        <button
          className="comment-action-btn"
          onClick={() => setShowReplyForm(!showReplyForm)}
        >
          Reply
        </button>
      </div>

      {showReplyForm && (
        <form className="reply-form" onSubmit={handleReply}>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Type your reply..."
            rows={3}
            required
          />
          <div className="reply-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowReplyForm(false)}
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
      )}

      {showReplies && hasReplies && (
        <div className="replies">
          {comment.replies.map((reply) => (
            <div key={reply.commentId} className="reply-item">
              <div className="reply-content">
                <span className="reply-mention">@{comment.user?.username}, </span>
                {reply.content}
                <span className="reply-author"> by @{reply.user?.username}</span>
              </div>
              <div className="reply-actions">
                <button className="comment-action-btn">Reply</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
