import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { votePost, unvotePost, deletePost, pinPost, unpinPost, hidePost, reportPost } from "../../Services/ForumApi";
import useAuth from "../../Hook/UseAuth";

export default function PostItem({ post, onPostUpdated }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isVoted, setIsVoted] = useState(post.isVoted || false);
  const [voteCount, setVoteCount] = useState(post.voteCount || 0);
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isPinned, setIsPinned] = useState(post.isPinned || false);
  const menuRef = useRef(null);

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
    navigate(`/post/${post.postId}`);
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

  // Check if current user is the owner of the post
  const isOwner = user && post.user && user.userId === post.user.userId;

  // Menu handlers
  const handleMenuToggle = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleDeletePost = (e) => {
    e.stopPropagation();
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      deletePost(post.postId)
        .then(() => {
          alert("Bài viết đã được xóa thành công!");
          window.location.reload(); // Reload để cập nhật danh sách
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
          // Cập nhật state trước khi hiển thị thông báo
          setIsPinned(!isPinned);
          alert(isPinned ? "Đã hủy ghim bài viết!" : "Đã ghim bài viết lên đầu trang!");
          // Gọi callback để refresh danh sách posts
          if (onPostUpdated) {
            onPostUpdated();
          }
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
          window.location.reload(); // Reload để cập nhật danh sách
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
    const reason = prompt("Vui lòng nhập lý do tố cáo:");
    if (reason && reason.trim()) {
      if (window.confirm("Bạn có chắc chắn muốn tố cáo bài viết này với quản trị viên?")) {
        reportPost(post.postId, reason.trim())
          .then(() => {
            alert("Đã gửi tố cáo thành công!");
          })
          .catch(error => {
            console.error("Error reporting post:", error);
            alert("Lỗi khi gửi tố cáo. Vui lòng thử lại.");
          });
        setShowMenu(false);
      }
    }
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

  return (
    <div className="post-item" onClick={handlePostClick}>
      {/* Header Section */}
      <div className="post-header">
        <div className="post-user-section">
          <img
            src={post.user?.avatar || "/default-avatar.png"}
            alt={post.user?.username}
            className="post-avatar"
          />
          <div className="post-user-info">
            <p className="post-username">{post.user?.username}</p>
            <p className="post-time">{formatTime(post.createdAt)}</p>
          </div>
        </div>
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
              {isOwner ? (
                // Menu for post owner
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

      {/* Content Section */}
      <div className="post-content">
        <h3 className="post-title">
          {isPinned && (
            <span className="pinned-indicator" title="Bài viết đã được ghim">
              📌 
            </span>
          )}
          {post.title}
        </h3>
        <p className="post-description">
          {post.content.length > 200
            ? `${post.content.substring(0, 200)}...`
            : post.content}
        </p>
      </div>

      {/* Tags Section */}
      {post.tags && post.tags.length > 0 && (
        <div className="post-tags">
          {post.tags.map((tag, index) => (
            <span key={index} className="post-tag">
              {tag.tagName}
            </span>
          ))}
        </div>
      )}

      {/* Stats Section */}
      <div className="post-stats">
        <div className="post-stat">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          <span>{post.viewCount || 0}</span>
        </div>
        <div className="post-stat">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <span>{post.commentCount || 0}</span>
        </div>
        <button
          className={`vote-btn ${isVoted ? "voted" : ""}`}
          onClick={handleVote}
          disabled={loading}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 13l3 3 7-7"/>
            <path d="M7 6l3 3 7-7"/>
          </svg>
          <span>{voteCount}</span>
        </button>
      </div>
    </div>
  );
}