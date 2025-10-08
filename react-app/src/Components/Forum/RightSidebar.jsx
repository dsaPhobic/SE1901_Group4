import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPostsByFilter } from "../../Services/ForumApi";
import { Pin, Star, ThumbsUp } from "lucide-react";
import AnnouncementPopup from "./AnnouncementPopup";
import "./RightSidebar.css";

export default function RightSidebar() {
  const navigate = useNavigate();
  const [ieltsPhobicPosts, setIeltsPhobicPosts] = useState([]);
  const [mustReadPosts, setMustReadPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    setLoading(true);
    
    // Load IELTSPhobic's posts (pinned posts) - sử dụng postId thực từ database
    // Tìm posts có title chứa "Vision" hoặc "Rules" hoặc có tag đặc biệt
    getPostsByFilter("new", 1, 10) // Lấy posts để tìm pinned posts
      .then((response) => {
        const allPosts = response.data;
        
        // Tìm posts có title chứa keywords đặc biệt
        const visionPost = allPosts.find(post => 
          post.title.toLowerCase().includes('vision') || 
          post.title.toLowerCase().includes('direction') ||
          post.title.toLowerCase().includes('ieltsphobic')
        );
        
        const rulesPost = allPosts.find(post => 
          post.title.toLowerCase().includes('rules') || 
          post.title.toLowerCase().includes('guidelines') ||
          post.title.toLowerCase().includes('community')
        );
        
        // Luôn sử dụng fallback data để đảm bảo consistency
        const ieltsPhobicPostsData = [
          {
            postId: 'vision-fallback',
            title: "Our Vision — The Direction of IELTSPhobic",
            content: "Our vision is to provide the best IELTS learning experience for students worldwide. We are committed to creating an innovative platform that combines cutting-edge technology with proven teaching methods to help students achieve their IELTS goals.\n\nKey principles:\n• Student-centered learning\n• Evidence-based teaching methods\n• Continuous innovation\n• Global accessibility\n\nWe believe that every student deserves access to high-quality IELTS preparation resources, regardless of their background or location.",
            user: { username: "IELTSPhobic" },
            createdAt: new Date().toISOString(),
            isPinned: true
          },
          {
            postId: 'rules-fallback',
            title: "Community Rules — IELTSPhobic Forum Guidelines",
            content: "Please read our community guidelines before participating in the IELTSPhobic forum:\n\n1. Be respectful and constructive in all interactions\n2. Stay on topic and contribute meaningfully to discussions\n3. No spam, self-promotion, or irrelevant content\n4. Use appropriate language and maintain professionalism\n5. Help others learn and share knowledge generously\n6. Follow academic integrity and cite sources when necessary\n\nViolations may result in warnings or temporary restrictions. We're committed to maintaining a positive learning environment for all members.",
            user: { username: "IELTSPhobic" },
            createdAt: new Date().toISOString(),
            isPinned: true
          }
        ];
        
        setIeltsPhobicPosts(ieltsPhobicPostsData);
      })
      .catch((error) => {
        console.error("Error loading IELTSPhobic posts:", error);
        // Fallback data nếu API fail
        const ieltsPhobicPostsData = [
          { 
            postId: 'vision-fallback',
            title: "Our Vision — The Direction of IELTSPhobic",
            content: "Our vision is to provide the best IELTS learning experience for students worldwide. We are committed to creating an innovative platform that combines cutting-edge technology with proven teaching methods to help students achieve their IELTS goals.\n\nKey principles:\n• Student-centered learning\n• Evidence-based teaching methods\n• Continuous innovation\n• Global accessibility\n\nWe believe that every student deserves access to high-quality IELTS preparation resources, regardless of their background or location.",
            user: { username: "IELTSPhobic" },
            createdAt: new Date().toISOString(),
            isPinned: true
          },
          { 
            postId: 'rules-fallback',
            title: "Community Rules — IELTSPhobic Forum Guidelines",
            content: "Please read our community guidelines before participating in the IELTSPhobic forum:\n\n1. Be respectful and constructive in all interactions\n2. Stay on topic and contribute meaningfully to discussions\n3. No spam, self-promotion, or irrelevant content\n4. Use appropriate language and maintain professionalism\n5. Help others learn and share knowledge generously\n6. Follow academic integrity and cite sources when necessary\n\nViolations may result in warnings or temporary restrictions. We're committed to maintaining a positive learning environment for all members.",
            user: { username: "IELTSPhobic" },
            createdAt: new Date().toISOString(),
            isPinned: true
          }
        ];
        setIeltsPhobicPosts(ieltsPhobicPostsData);
      });
    
    // Load Must-read posts (top voted posts)
    getPostsByFilter("top", 1, 3) // Lấy 3 posts có vote cao nhất
      .then((response) => {
        setMustReadPosts(response.data);
      })
      .catch((error) => {
        console.error("Error loading must-read posts:", error);
        // Fallback data nếu API fail
        setMustReadPosts([
          { postId: 3, title: "IELTS Reading Tips and Tricks", voteCount: 25 },
          { postId: 4, title: "How to Improve Listening Skills", voteCount: 18 },
          { postId: 5, title: "Writing Task 2 Strategies", voteCount: 15 }
        ]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handlePostClick = (postId) => {
    console.log("Clicked post ID:", postId);
    console.log("IELTSPhobic posts:", ieltsPhobicPosts);
    
    // Nếu là fallback post, hiển thị popup thay vì navigate
    if (postId === 'vision-fallback' || postId === 'rules-fallback') {
      const announcement = ieltsPhobicPosts.find(post => post.postId === postId);
      if (announcement) {
        setSelectedAnnouncement(announcement);
        setShowAnnouncement(true);
      }
      return;
    }
    
    // Navigate đến post thực
    navigate(`/post/${postId}`);
  };

  const handleCloseAnnouncement = () => {
    setShowAnnouncement(false);
    setSelectedAnnouncement(null);
  };

  return (
    <div className="right-sidebar">
      {/* IELTSPhobic's Announcements Section */}
      <div className="sidebar-section">
        <div className="sidebar-header">
          <Pin size={20} className="sidebar-icon" />
          <h3>IELTSPhobic's Announcements</h3>
        </div>
        <ul className="sidebar-list">
          {ieltsPhobicPosts.map((post, index) => (
            <li 
              key={post.postId || index} 
              className="sidebar-item clickable pinned"
              onClick={() => handlePostClick(post.postId)}
            >
              <Pin size={16} className="pin-icon" />
              {post.title}
            </li>
          ))}
        </ul>
      </div>

      {/* Most-voted Posts Section */}
      <div className="sidebar-section">
        <div className="sidebar-header">
          <Star size={20} className="sidebar-icon" />
          <h3>Most-voted posts</h3>
        </div>
        <ul className="sidebar-list">
          {loading ? (
            <li className="sidebar-item">Loading...</li>
          ) : (
            mustReadPosts.map((post, index) => (
              <li 
                key={post.postId || index} 
                className="sidebar-item clickable"
                onClick={() => handlePostClick(post.postId)}
              >
                <div className="post-title">{post.title}</div>
                <div className="post-votes">
                  <ThumbsUp size={14} />
                  {post.voteCount || 0}
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Announcement Popup */}
      <AnnouncementPopup
        isOpen={showAnnouncement}
        onClose={handleCloseAnnouncement}
        announcement={selectedAnnouncement}
      />
    </div>
  );
}
