import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { votePost, unvotePost, deletePost, pinPost, unpinPost, hidePost, unhidePost, reportPost } from "../../Services/ForumApi";
import useAuth from "../../Hook/UseAuth";
import { MoreVertical, Trash2, Pin, EyeOff, Flag, Eye, MessageCircle, ThumbsUp, Edit } from "lucide-react";

export default function PostItem({ post, onPostUpdated, isInClosedSection = false }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isVoted, setIsVoted] = useState(post.isVoted || false);
  const [voteCount, setVoteCount] = useState(post.voteCount || 0);
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isPinned, setIsPinned] = useState(post.isPinned || false);
  const menuRef = useRef(null);

  // Sync state with props when component mounts or props change
  useEffect(() => {
    setIsVoted(post.isVoted || false);
    setVoteCount(post.voteCount || 0);
    setIsPinned(post.isPinned || false);
  }, [post.isVoted, post.voteCount, post.isPinned]);

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
          if (onPostUpdated) {
            onPostUpdated();
          }
        })
        .catch(error => {
          console.error("Error hiding post:", error);
          alert("Lỗi khi ẩn bài viết. Vui lòng thử lại.");
        });
      setShowMenu(false);
    }
  };

  const handleUnhidePost = (e) => {
    e.stopPropagation();
    if (window.confirm("Bạn có chắc chắn muốn hiện lại bài viết này?")) {
      unhidePost(post.postId)
        .then(() => {
          alert("Bài viết đã được hiện lại!");
          if (onPostUpdated) {
            onPostUpdated();
          }
        })
        .catch(error => {
          console.error("Error unhiding post:", error);
          alert("Lỗi khi hiện lại bài viết. Vui lòng thử lại.");
        });
      setShowMenu(false);
    }
  };

  const handleEditPost = (e) => {
    e.stopPropagation();
    navigate(`/edit-post/${post.postId}`);
    setShowMenu(false);
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
            <MoreVertical size={16} />
          </button>
          
          {showMenu && (
            <div className="post-menu-dropdown">
              {isOwner ? (
                // Menu for post owner
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
                  {isInClosedSection ? (
                    <button className="menu-item unhide" onClick={handleUnhidePost}>
                      <Eye size={16} />
                      Hiện lại bài viết
                    </button>
                  ) : (
                    <button className="menu-item hide" onClick={handleHidePost}>
                      <EyeOff size={16} />
                      Ẩn bài viết
                    </button>
                  )}
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

      {/* Content Section */}
      <div className="post-content">
        <h3 className="post-title">
          {isPinned && (
            <span className="pinned-indicator" title="Bài viết đã được ghim">
              <Pin size={16} />
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
          <Eye size={16} />
          <span>{post.viewCount || 0}</span>
        </div>
        <div className="post-stat">
          <MessageCircle size={16} />
          <span>{post.commentCount || 0}</span>
        </div>
        <button
          className={`vote-btn ${isVoted ? "voted" : ""}`}
          onClick={handleVote}
          disabled={loading}
        >
          <ThumbsUp size={16} />
          <span>{isVoted ? "Unlike" : "Like"}</span>
          <span className="vote-count">({voteCount})</span>
        </button>
      </div>
    </div>
  );
}