import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./PostDetail.css";
import Sidebar from "../../Components/Layout/Sidebar";
import HeaderBar from "../../Components/Layout/HeaderBar";
import CommentSection from "../../Components/Forum/CommentSection";
import { getPost, votePost, unvotePost, reportPost, deletePost, pinPost, unpinPost, hidePost } from "../../Services/ForumApi";
import useAuth from "../../Hook/UseAuth";

export default function PostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVoted, setIsVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(0);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const menuRef = useRef(null);

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
        setIsPinned(response.data.isPinned || false);
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

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleDeletePost = (e) => {
    e.stopPropagation();
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      deletePost(post.postId)
        .then(() => {
          alert("Bài viết đã được xóa!");
          navigate('/forum');
        })
        .catch(error => {
          console.error("Error deleting post:", error);
          alert("Lỗi khi xóa bài viết. Vui lòng thử lại.");
        });
      setShowMenu(false);
    }
  };

  const handlePinPost = (e) => {
    e.stopPropagation();
    if (window.confirm(isPinned ? "Bạn có chắc chắn muốn hủy ghim bài viết này?" : "Bạn có chắc chắn muốn ghim bài viết này lên đầu trang?")) {
      const apiCall = isPinned ? unpinPost(post.postId) : pinPost(post.postId);
      apiCall
        .then(() => {
          setIsPinned(!isPinned);
          alert(isPinned ? "Đã hủy ghim bài viết!" : "Đã ghim bài viết lên đầu trang!");
          // Reload post để cập nhật data
          loadPost();
        })
        .catch(error => {
          console.error("Error pinning/unpinning post:", error);
          alert("Lỗi khi ghim/hủy ghim bài viết. Vui lòng thử lại.");
        });
      setShowMenu(false);
    }
  };

  const handleHidePost = (e) => {
    e.stopPropagation();
    if (window.confirm("Bạn có chắc chắn muốn ẩn bài viết này?")) {
      hidePost(post.postId)
        .then(() => {
          alert("Bài viết đã được ẩn!");
          navigate('/forum');
        })
        .catch(error => {
          console.error("Error hiding post:", error);
          alert("Lỗi khi ẩn bài viết. Vui lòng thử lại.");
        });
      setShowMenu(false);
    }
  };

  const handleReportPost = (e) => {
    e.stopPropagation();
    setShowReportModal(true);
    setShowMenu(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

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
                  <div className="post-menu-container" ref={menuRef}>
                    <button className="post-menu-btn" onClick={handleMenuToggle}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="1"/>
                        <circle cx="12" cy="5" r="1"/>
                        <circle cx="12" cy="19" r="1"/>
                      </svg>
                    </button>
                    
                    {showMenu && (
                      <div className="post-menu-dropdown">
                        {user && post && (user.userId === post.user.userId || user.role === 'admin') ? (
                          // Menu for post owner or admin
                          <>
                            <button className="menu-item delete" onClick={handleDeletePost}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3,6 5,6 21,6"/>
                                <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                              </svg>
                              Xóa bài viết
                            </button>
                            <button className="menu-item pin" onClick={handlePinPost}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                              </svg>
                              {isPinned ? "Hủy ghim" : "Ghim bài viết"}
                            </button>
                          </>
                        ) : (
                          // Menu for other users
                          <>
                            <button className="menu-item hide" onClick={handleHidePost}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                <line x1="1" y1="1" x2="23" y2="23"/>
                              </svg>
                              Ẩn bài viết
                            </button>
                            <button className="menu-item pin" onClick={handlePinPost}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                              </svg>
                              {isPinned ? "Hủy ghim" : "Ghim bài viết"}
                            </button>
                            <button className="menu-item report" onClick={handleReportPost}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
                                <line x1="4" y1="22" x2="4" y2="15"/>
                              </svg>
                              Tố cáo bài viết
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="post-content">
                <h1 className="post-title">
                  {isPinned && (
                    <span className="pinned-indicator" title="Bài viết đã được ghim">
                      📌 
                    </span>
                  )}
                  {post.title}
                </h1>
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
