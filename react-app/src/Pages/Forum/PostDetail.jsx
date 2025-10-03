import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./PostDetail.css";
import Sidebar from "../../Components/Layout/Sidebar";
import HeaderBar from "../../Components/Layout/HeaderBar";
import CommentSection from "../../Components/Forum/CommentSection";
import { getPost, votePost, unvotePost, reportPost } from "../../Services/ForumApi";

export default function PostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
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
      <Sidebar />
      <main className="main-content">
        <HeaderBar />
        <div className="post-detail-content">
          <div className="post-detail-main">
            <div className="post-detail-header">
              <button className="back-btn" onClick={() => navigate("/forum")}>
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
                  <button className="post-menu-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="1"/>
                      <circle cx="12" cy="5" r="1"/>
                      <circle cx="12" cy="19" r="1"/>
                    </svg>
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
                <button
                  className={`vote-btn ${isVoted ? "voted" : ""}`}
                  onClick={handleVote}
                >
                  <span>+</span>
                  <span>Vote</span>
                </button>
              </div>
            </div>

            <CommentSection postId={postId} />
          </div>

          <div className="post-detail-sidebar">
            <div className="user-profile-card">
              <img
                src={post.user?.avatar || "/default-avatar.png"}
                alt={post.user?.username}
                className="profile-avatar"
              />
              <h3 className="profile-username">@{post.user?.username}</h3>
              <div className="profile-stats">
                <span className="profile-votes">125 [8]</span>
              </div>
              <div className="profile-actions">
                <button className="profile-action-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </button>
                <button className="profile-action-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21,15 16,10 5,21"/>
                  </svg>
                </button>
                <button className="profile-action-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                    <polyline points="16,6 12,2 8,6"/>
                    <line x1="12" y1="2" x2="12" y2="15"/>
                  </svg>
                </button>
              </div>
            </div>
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
