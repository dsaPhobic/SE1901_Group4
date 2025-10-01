import React, { useState, useEffect } from "react";
import "./Forum.css";
import Sidebar from "../../Components/Dashboard/Sidebar";
import HeaderBar from "../../Components/Dashboard/HeaderBar";
import PostList from "../../Components/Forum/PostList";
import RightSidebar from "../../Components/Forum/RightSidebar";
import { getPosts, getPostsByFilter } from "../../Services/ForumApi";

export default function Forum({ onNavigate }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("new");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const filters = [
    { key: "new", label: "New" },
    { key: "top", label: "Top" },
    { key: "hot", label: "Hot" },
    { key: "closed", label: "Closed" }
  ];

  useEffect(() => {
    loadPosts();
  }, [activeFilter]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await getPostsByFilter(activeFilter, 1);
      setPosts(response.data);
      setCurrentPage(1);
      setHasMore(response.data.length === 10);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMorePosts = async () => {
    if (!hasMore || loading) return;
    
    try {
      setLoading(true);
      const response = await getPostsByFilter(activeFilter, currentPage + 1);
      setPosts(prev => [...prev, ...response.data]);
      setCurrentPage(prev => prev + 1);
      setHasMore(response.data.length === 10);
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  return (
    <div className="forum-container">
      <Sidebar onNavigate={onNavigate} />
      
      <main className="main-content">
        <HeaderBar onNavigate={onNavigate} currentPage="forum" />
        
        <div className="forum-content">
          <div className="forum-main">
            <div className="forum-header">
              <h1>Questions</h1>
            </div>
            
            <div className="forum-filters">
              {filters.map(filter => (
                <button
                  key={filter.key}
                  className={`filter-btn ${activeFilter === filter.key ? 'active' : ''}`}
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
              onNavigate={onNavigate}
            />
          </div>
          
          <RightSidebar />
        </div>
      </main>
    </div>
  );
}
