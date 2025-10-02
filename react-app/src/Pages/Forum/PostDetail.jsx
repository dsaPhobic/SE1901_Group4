import React, { useState, useEffect } from "react";
import "./PostDetail.css";
import Sidebar from "../../Components/Dashboard/Sidebar";
import HeaderBar from "../../Components/Dashboard/HeaderBar";
import CommentSection from "../../Components/Forum/CommentSection";
import { getPost, votePost, unvotePost, reportPost } from "../../Services/ForumApi";

export default function PostDetail({ postId, onNavigate }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVoted, setIsVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(0);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");

  useEffect(() => {
    loadPost();
  }, [postId]);

  const loadPost = () => {
    setLoading(true);
    getPost(postId)
      .then(response => {
        setPost(response.data);
        setIsVoted(response.data.isVoted || false);
        setVoteCount(response.data.voteCount || 0);
      })
      .catch(error => {
        console.error("Error loading post:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleVote = () => {
    if (!post) return;

    if (isVoted) {
      unvotePost(post.postId)
        .then(() => {
          setIsVoted(false);
          setVoteCount(prev => prev - 1);
        })
        .catch(error => {
          console.error("Error unvoting:", error);
        });
    } else {
      votePost(post.postId)
        .then(() => {
          setIsVoted(true);
          setVoteCount(prev => prev + 1);
        })
        .catch(error => {
          console.error("Error voting:", error);
        });
    }
  };

  const handleReport = () => {
    if (!reportReason.trim()) return;

    reportPost(post.postId, reportReason)
      .then(() => {
        setShowReportModal(false);
        setReportReason("");
        alert("Post reported successfully");
      })
      .catch(error => {
        console.error("Error reporting post:", error);
        alert("Error reporting post");
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

  if (loading) {
    return (
      <div className="post-detail-container">
        <Sidebar />
        <main className="main-content">
          <HeaderBar />
          <div className="loading">Loading post...</div>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="post-detail-container">
        <Sidebar />
        <main className="main-content">
          <HeaderBar />
          <div className="error">Post not found</div>
        </main>
      </div>
    );
  }

  return (
    <div className="post-detail-container">
      <Sidebar onNavigate={onNavigate} />
      <main className="main-content">
        <HeaderBar onNavigate={onNavigate} currentPage="postDetail" />
        <div className="post-detail-content">
          <div className="post-detail-main">
            <div className="post-detail-header">
              <button className="back-btn" onClick={() => onNavigate("forum")}>
                ← Back to Forum
              </button>
            </div>

            <div className="post-detail-card">
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
                  <button
                    className="post-action-btn"
                    onClick={() => setShowReportModal(true)}
                  >
                    Report
                  </button>
                </div>
              </div>

              <div className="post-content">
                <h1 className="post-title">{post.title}</h1>
                <div className="post-body">{post.content}</div>
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
                >
                  <span>↑</span>
                  <span>{voteCount}</span>
                </button>
              </div>
            </div>

            <CommentSection postId={postId} />
          </div>
        </div>
      </main>

      {showReportModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Report Post</h3>
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Please explain why you're reporting this post..."
              rows={4}
            />
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowReportModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleReport}
                disabled={!reportReason.trim()}
              >
                Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
