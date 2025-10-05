import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./PostDetail.css";
import Sidebar from "../../Components/Layout/Sidebar";
import HeaderBar from "../../Components/Layout/HeaderBar";
import CommentSection from "../../Components/Forum/CommentSection";
import { getPost, votePost, unvotePost, reportPost, deletePost, pinPost, unpinPost, hidePost } from "../../Services/ForumApi";
import useAuth from "../../Hook/UseAuth";
import { MoreVertical, Trash2, Pin, EyeOff, Flag, ArrowLeft, MessageCircle, Image, Share, Download, ThumbsUp, Edit } from "lucide-react";

// Không cần helper functions nữa - để view count tăng mỗi lần vào post

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
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    // Reset ref khi postId thay đổi
    hasLoadedRef.current = false;
    loadPost();
  }, [postId]);

  // Sync state with post data when post changes
  useEffect(() => {
    if (post) {
      setIsVoted(post.isVoted || false);
      setVoteCount(post.voteCount || 0);
      setIsPinned(post.isPinned || false);
    }
  }, [post]);

  const loadPost = () => {
    // Tránh gọi API nhiều lần do React StrictMode
    if (hasLoadedRef.current) {
      console.log(`Post ${postId} already loaded, skipping...`);
      return;
    }
    
    setLoading(true);
    hasLoadedRef.current = true;
    
    console.log(`Loading post ${postId} - view count will increment`);
    
    // Luôn tăng view count mỗi lần vào post
    getPost(postId, true)
      .then(response => {
        setPost(response.data);
        setIsVoted(response.data.isVoted || false);
        setVoteCount(response.data.voteCount || 0);
        setIsPinned(response.data.isPinned || false);
      })
      .catch(error => {
        console.error("Error loading post:", error);
        if (error.response?.status === 404) {
          navigate('/forum');
        }
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

  const handleEditPost = (e) => {
    e.stopPropagation();
    navigate(`/edit-post/${post.postId}`);
    setShowMenu(false);
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
                <ArrowLeft size={16} />
                Back to Forum
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
                      <MoreVertical size={16} />
                    </button>
                    
                    {showMenu && (
                      <div className="post-menu-dropdown">
                        {user && post && (user.userId === post.user.userId || user.role === 'admin') ? (
                          // Menu for post owner or admin
                          <>
                            <button className="menu-item edit" onClick={handleEditPost}>
                              <Edit size={16} />
                              Chỉnh sửa bài viết
                            </button>
                            <button className="menu-item delete" onClick={handleDeletePost}>
                              <Trash2 size={16} />
                              Xóa bài viết
                            </button>
                            <button className="menu-item pin" onClick={handlePinPost}>
                              <Pin size={16} />
                              {isPinned ? "Hủy ghim" : "Ghim bài viết"}
                            </button>
                          </>
                        ) : (
                          // Menu for other users
                          <>
                            <button className="menu-item hide" onClick={handleHidePost}>
                              <EyeOff size={16} />
                              Ẩn bài viết
                            </button>
                            <button className="menu-item pin" onClick={handlePinPost}>
                              <Pin size={16} />
                              {isPinned ? "Hủy ghim" : "Ghim bài viết"}
                            </button>
                            <button className="menu-item report" onClick={handleReportPost}>
                              <Flag size={16} />
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
                      <Pin size={16} />
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
                  <ThumbsUp size={16} />
                  <span>{isVoted ? "Unlike" : "Like"}</span>
                  <span className="vote-count">({voteCount})</span>
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
                  <MessageCircle size={16} />
                </button>
                <button className="profile-action-btn">
                  <Image size={16} />
                </button>
                <button className="profile-action-btn">
                  <Download size={16} />
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
