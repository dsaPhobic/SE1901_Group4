import React, { useState, useEffect } from "react";
import "./Forum.css";
import GeneralSidebar from "../../Components/Layout/GeneralSidebar";
import HeaderBar from "../../Components/Layout/HeaderBar";
import PostList from "../../Components/Forum/PostList";
import RightSidebar from "../../Components/Forum/RightSidebar";
import { getPostsByFilter } from "../../Services/ForumApi";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

export default function Forum({ onNavigate }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("new");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const navigate = useNavigate();

  const filters = [
    { key: "new", label: "New" },
    { key: "top", label: "Top" },
    { key: "hot", label: "Hot" },
    { key: "closed", label: "Closed" },
  ];

  useEffect(() => {
    loadPosts();
  }, [activeFilter]);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    setLoading(true);
    getPostsByFilter(activeFilter, 1)
      .then((response) => {
        setPosts(response.data);
        setCurrentPage(1);
        setHasMore(response.data.length === 10);
      })
      .catch((error) => {
        console.error("Error loading posts:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const loadMorePosts = () => {
    if (!hasMore || loading) return;

    setLoading(true);
    getPostsByFilter(activeFilter, currentPage + 1)
      .then((response) => {
        setPosts((prev) => [...prev, ...response.data]);
        setCurrentPage((prev) => prev + 1);
        setHasMore(response.data.length === 10);
      })
      .catch((error) => {
        console.error("Error loading more posts:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handlePostUpdated = () => {
    // Reload posts khi có thay đổi (ghim, ẩn, etc.)
    loadPosts();
  };

  return (
    <div className="forum-container">
      <GeneralSidebar />

      <main className="main-content">
        <HeaderBar onNavigate={onNavigate} currentPage="forum" />

        <div className="forum-content">
          <div className="forum-main">
            <div className="forum-header">
              <h1>FORUM</h1>
              <button
                className="ask-question-btn"
                onClick={() => navigate("/create-post")}
              >
                <Plus size={16} />
                Create a post
              </button>
            </div>

            <div className="forum-filters">
              {filters.map((filter) => (
                <button
                  key={filter.key}
                  className={`filter-btn ${
                    activeFilter === filter.key ? "active" : ""
                  }`}
                  onClick={() => handleFilterChange(filter.key)}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <PostList
              posts={posts}
              loading={loading}
              onLoadMore={loadMorePosts}
              hasMore={hasMore}
              onPostUpdated={handlePostUpdated}
              isInClosedSection={activeFilter === "closed"}
            />
          </div>

          <RightSidebar />
        </div>
      </main>
    </div>
  );
}
