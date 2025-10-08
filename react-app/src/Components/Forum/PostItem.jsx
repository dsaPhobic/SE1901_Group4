import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { votePost, unvotePost, deletePost, pinPost, unpinPost, hidePost, unhidePost, reportPost } from "../../Services/ForumApi";
import useAuth from "../../Hook/UseAuth";
import { MoreVertical, Trash2, Pin, EyeOff, Flag, Eye, MessageCircle, ThumbsUp, Edit } from "lucide-react";
import { formatTimeVietnam } from "../../utils/date";

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
    return formatTimeVietnam(dateString);
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
    if (window.confirm("Are you sure you want to delete this post?")) {
      deletePost(post.postId)
        .then(() => {
          alert("Post deleted successfully!");
          window.location.reload(); // Reload để cập nhật danh sách
        })
        .catch(error => {
          console.error("Error deleting post:", error);
          alert("Error deleting post. Please try again.");
        });
      setShowMenu(false);
    }
  };

  const handlePinPost = (e) => {
    e.stopPropagation();
    if (window.confirm(isPinned ? "Are you sure you want to unpin this post?" : "Are you sure you want to pin this post to the top?")) {
      const apiCall = isPinned ? unpinPost(post.postId) : pinPost(post.postId);
      apiCall
        .then(() => {
          // Cập nhật state trước khi hiển thị thông báo
          setIsPinned(!isPinned);
          alert(isPinned ? "Post unpinned successfully!" : "Post pinned to top successfully!");
          // Gọi callback để refresh danh sách posts
          if (onPostUpdated) {
            onPostUpdated();
          }
        })
        .catch(error => {
          console.error("Error pinning/unpinning post:", error);
          alert("Error pinning/unpinning post. Please try again.");
        });
      setShowMenu(false);
    }
  };

  const handleHidePost = (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to hide this post?")) {
      hidePost(post.postId)
        .then(() => {
          alert("Post hidden successfully!");
          if (onPostUpdated) {
            onPostUpdated();
          }
        })
        .catch(error => {
          console.error("Error hiding post:", error);
          alert("Error hiding post. Please try again.");
        });
      setShowMenu(false);
    }
  };

  const handleUnhidePost = (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to show this post again?")) {
      unhidePost(post.postId)
        .then(() => {
          alert("Post shown again successfully!");
          if (onPostUpdated) {
            onPostUpdated();
          }
        })
        .catch(error => {
          console.error("Error unhiding post:", error);
          alert("Error showing post. Please try again.");
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
    const reason = prompt("Please enter the reason for reporting:");
    if (reason && reason.trim()) {
      if (window.confirm("Are you sure you want to report this post to moderators?")) {
        reportPost(post.postId, reason.trim())
          .then(() => {
            alert("Report submitted successfully!");
          })
          .catch(error => {
            console.error("Error reporting post:", error);
            alert("Error submitting report. Please try again.");
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
                    Edit Post
                  </button>
                  <button className="menu-item delete" onClick={handleDeletePost}>
                    <Trash2 size={16} />
                    Delete Post
                  </button>
                  <button className="menu-item pin" onClick={handlePinPost}>
                    <Pin size={16} />
                    {isPinned ? "Unpin Post" : "Pin Post"}
                  </button>
                </>
              ) : (
                // Menu for other users
                <>
                  {isInClosedSection ? (
                    <button className="menu-item unhide" onClick={handleUnhidePost}>
                      <Eye size={16} />
                      Show Post
                    </button>
                  ) : (
                    <button className="menu-item hide" onClick={handleHidePost}>
                      <EyeOff size={16} />
                      Hide Post
                    </button>
                  )}
                  <button className="menu-item pin" onClick={handlePinPost}>
                    <Pin size={16} />
                    {isPinned ? "Unpin Post" : "Pin Post"}
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
          <span>{isVoted ? "Liked" : "Like"}</span>
          <span className="vote-count">({voteCount})</span>
        </button>
      </div>
    </div>
  );
}