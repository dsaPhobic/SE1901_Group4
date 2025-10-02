import React, { useState } from "react";
import { votePost, unvotePost } from "../../Services/ForumApi";

export default function PostItem({ post, onNavigate }) {
  const [isVoted, setIsVoted] = useState(post.isVoted || false);
  const [voteCount, setVoteCount] = useState(post.voteCount || 0);
  const [loading, setLoading] = useState(false);

  const handleVote = (e) => {
    e.stopPropagation();
    if (loading) return;

    setLoading(true);

    if (isVoted) {
      unvotePost(post.postId)
        .then(() => {
          setIsVoted(false);
          setVoteCount((prev) => prev - 1);
        })
        .catch((error) => {
          console.error("Error unvoting:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      votePost(post.postId)
        .then(() => {
          setIsVoted(true);
          setVoteCount((prev) => prev + 1);
        })
        .catch((error) => {
          console.error("Error voting:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handlePostClick = () => {
    onNavigate("postDetail", post.postId);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;

    return date.toLocaleDateString();
  };

  return (
    <div className="post-item" onClick={handlePostClick}>
      <div className="post-header">
        <img
          src={post.user?.avatar || "/default-avatar.png"}
          alt={post.user?.username}
          className="post-avatar"
        />
        <div className="post-user-info">
          <p className="post-username">@{post.user?.username}</p>
          <p className="post-time">{formatTime(post.createdAt)}</p>
        </div>
        <div className="post-actions">
          <button className="post-action-btn">⋯</button>
        </div>
      </div>

      <div className="post-content">
        <h3 className="post-title">{post.title}</h3>
        <p className="post-description">
          {post.content.length > 200
            ? `${post.content.substring(0, 200)}...`
            : post.content}
        </p>
      </div>

      {post.tags && post.tags.length > 0 && (
        <div className="post-tags">
          {post.tags.map((tag, index) => (
            <span key={index} className="post-tag">
              {tag.tagName}
            </span>
          ))}
        </div>
      )}

      <div className="post-stats">
        <div className="post-stat">
          <span className="post-stat-icon">👁️</span>
          <span>{post.viewCount || 0}</span>
        </div>
        <div className="post-stat">
          <span className="post-stat-icon">💬</span>
          <span>{post.commentCount || 0}</span>
        </div>
        <button
          className={`vote-btn ${isVoted ? "voted" : ""}`}
          onClick={handleVote}
          disabled={loading}
        >
          <span>↑</span>
          <span>{voteCount}</span>
        </button>
      </div>
    </div>
  );
}
