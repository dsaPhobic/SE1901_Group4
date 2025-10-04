import React, { useState } from "react";
import { voteComment, unvoteComment, createReply } from "../../Services/ForumApi";

export default function CommentItem({ comment, onReply, level = 0 }) {
  const [isVoted, setIsVoted] = useState(comment.isVoted || false);
  const [voteCount, setVoteCount] = useState(comment.voteCount || 0);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showReplies, setShowReplies] = useState(true); // Mở replies mặc định cho tất cả levels

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
        // Đảm bảo reply có parentCommentId đúng
        const replyData = {
          ...response.data,
          parentCommentId: comment.commentId
        };
        onReply(replyData);
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
  
  // Đếm tất cả nested comments (bao gồm replies của replies)
  const countAllNestedComments = (replies) => {
    if (!replies || replies.length === 0) return 0;
    
    let total = replies.length;
    replies.forEach(reply => {
      total += countAllNestedComments(reply.replies);
    });
    return total;
  };
  
  const replyCount = comment.replies ? countAllNestedComments(comment.replies) : 0;
  
  // Debug log để xem cấu trúc comment
  console.log('Comment data:', {
    commentId: comment.commentId,
    content: comment.content,
    replies: comment.replies,
    replyCount: replyCount,
    hasReplies: hasReplies
  });

  return (
    <div className={`comment-item ${level > 0 ? 'reply-item' : ''}`}>
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
        
        {hasReplies && (
          <button
            className="comment-action-btn toggle-replies-btn"
            onClick={() => setShowReplies(!showReplies)}
          >
            {showReplies ? `Hide replies` : `Show replies (${replyCount})`}
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
            <CommentItem 
              key={reply.commentId} 
              comment={reply} 
              onReply={onReply}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
