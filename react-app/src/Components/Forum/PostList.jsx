import React from "react";
import PostItem from "./PostItem";

export default function PostList({ posts, loading, onLoadMore, hasMore, onNavigate }) {
  if (loading && posts.length === 0) {
    return (
      <div className="loading">
        <div>Loading posts...</div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="loading">
        <div>No posts found</div>
      </div>
    );
  }

  return (
    <div className="posts-container">
      {posts.map((post) => (
        <PostItem key={post.postId} post={post} onNavigate={onNavigate} />
      ))}
      
      {hasMore && (
        <button 
          className="load-more-btn"
          onClick={onLoadMore}
          disabled={loading}
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
}
