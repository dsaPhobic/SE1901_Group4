import React, { useState, useEffect } from "react";
import { likeComment, unlikeComment, createComment, updateComment, deleteComment } from "../../Services/ForumApi";
import { ThumbsUp, Edit, Trash2 } from "lucide-react";
import useAuth from "../../Hook/UseAuth";

export default function CommentItem({ comment, onReply, level = 0, postId }) {
  const { user } = useAuth();
  const [isVoted, setIsVoted] = useState(comment.isVoted || false);
  const [voteCount, setVoteCount] = useState(comment.voteCount || 0);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showReplies, setShowReplies] = useState(true); // Mở replies mặc định cho tất cả levels
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);

  // Sync state with props when component mounts or props change
  useEffect(() => {
    setIsVoted(comment.isVoted || false);
    setVoteCount(comment.voteCount || comment.likeNumber || 0);
  }, [comment.isVoted, comment.voteCount, comment.likeNumber]);

  const handleVote = (e) => {
    e.stopPropagation();
    
    if (isVoted) {
      unlikeComment(comment.commentId)
        .then(() => {
          setIsVoted(false);
          setVoteCount(prev => prev - 1);
        })
        .catch(error => {
          console.error("Error unliking comment:", error);
        });
    } else {
      likeComment(comment.commentId)
        .then(() => {
          setIsVoted(true);
          setVoteCount(prev => prev + 1);
        })
        .catch(error => {
          console.error("Error liking comment:", error);
        });
    }
  };

  const handleEditComment = () => {
    setIsEditing(true);
    setEditText(comment.content);
  };

  const handleSaveEdit = () => {
    if (!editText.trim()) return;
    
    setSubmitting(true);
    updateComment(comment.commentId, editText.trim())
      .then(() => {
        comment.content = editText.trim();
        setIsEditing(false);
      })
      .catch(error => {
        console.error("Error updating comment:", error);
        alert("Error updating comment. Please try again.");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditText(comment.content);
  };

  const handleDeleteComment = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa comment này?")) {
      setSubmitting(true);
      deleteComment(comment.commentId)
        .then(() => {
          // Gọi callback để xóa comment khỏi danh sách
          if (onReply) {
            onReply({ action: 'delete', commentId: comment.commentId });
          }
        })
        .catch(error => {
          console.error("Error deleting comment:", error);
          alert("Error deleting comment. Please try again.");
        })
        .finally(() => {
          setSubmitting(false);
        });
    }
  };

  const handleReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || submitting) return;

    setSubmitting(true);
    createComment(postId, replyText, comment.commentId)
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
    isVoted: comment.isVoted,
    voteCount: comment.voteCount,
    likeNumber: comment.likeNumber,
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
        {isEditing ? (
          <div className="edit-comment-form">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="edit-textarea"
              rows={3}
            />
            <div className="edit-actions">
              <button 
                className="btn-save" 
                onClick={handleSaveEdit}
                disabled={submitting}
              >
                Save
              </button>
              <button 
                className="btn-cancel" 
                onClick={handleCancelEdit}
                disabled={submitting}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          comment.content
        )}
      </div>

      <div className="comment-actions">
        <button
          className={`comment-action-btn vote-btn ${isVoted ? "voted" : ""}`}
          onClick={handleVote}
        >
          <ThumbsUp size={16} />
          <span>{isVoted ? "Unlike" : "Like"}</span>
          <span className="vote-count">({voteCount})</span>
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

        {/* Edit và Delete buttons - chỉ hiện cho owner */}
        {user && comment.user && user.userId === comment.user.userId && (
          <>
            <button
              className="comment-action-btn edit-btn"
              onClick={handleEditComment}
              disabled={submitting}
            >
              <Edit size={16} />
              Edit
            </button>
            <button
              className="comment-action-btn delete-btn"
              onClick={handleDeleteComment}
              disabled={submitting}
            >
              <Trash2 size={16} />
              Delete
            </button>
          </>
        )}
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
