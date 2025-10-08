import React from "react";
import PostItem from "./PostItem";
import NothingFound from "../Nothing/NothingFound";

export default function PostList({ posts, loading, onLoadMore, hasMore, onPostUpdated, isInClosedSection = false }) {
  if (loading && posts.length === 0) {
    return (
      <div className="loading">
        <div>Loading posts...</div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <NothingFound
        imageSrc="/src/assets/sad_cloud.png"
        title="No posts found"
        message="Be the first to start a discussion."
        actionLabel="Create a post"
        to="/create-post"
      />
    );
  }

  return (
    <div className="posts-container">
      {posts.map((post) => (
        <PostItem key={post.postId} post={post} onPostUpdated={onPostUpdated} isInClosedSection={isInClosedSection} />
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
