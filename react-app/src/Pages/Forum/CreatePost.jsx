import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreatePost.css";
import Sidebar from "../../Components/Layout/Sidebar";
import HeaderBar from "../../Components/Layout/HeaderBar";
import RightSidebar from "../../Components/Forum/RightSidebar";
import { createPost } from "../../Services/ForumApi";

export default function CreatePost({ onNavigate }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tagNames: []
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);
    createPost(formData)
      .then((response) => {
        navigate("/forum");
      })
      .catch((error) => {
        console.error("Error creating post:", error);
        alert("Error creating post. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSaveDraft = () => {
    // TODO: Implement save as draft functionality
    console.log("Save as draft:", formData);
  };

  const handleAddImage = () => {
    // TODO: Implement add image functionality
    console.log("Add image clicked");
  };

  return (
    <div className="create-post-container">
      <Sidebar onNavigate={onNavigate} />
      
      <main className="main-content">
        <HeaderBar onNavigate={onNavigate} currentPage="createPost" />
        
        <div className="create-post-content">
          <div className="create-post-main">
            <div className="create-post-header">
              <h1>New Post</h1>
            </div>
            
            <form onSubmit={handleSubmit} className="create-post-form">
              <div className="form-group">
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Type catching attention title"
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Type whatever you want to describe"
                  rows={12}
                  required
                  className="form-textarea"
                />
              </div>

              <div className="form-actions">
                <div className="form-actions-left">
                  <button 
                    type="button" 
                    className="btn btn-image"
                    onClick={handleAddImage}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21,15 16,10 5,21"/>
                    </svg>
                    Add Image
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-draft"
                    onClick={handleSaveDraft}
                  >
                    Save as draft
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-publish"
                    disabled={loading}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13"/>
                      <polygon points="22,2 15,22 11,13 2,9 22,2"/>
                    </svg>
                    {loading ? "Publishing..." : "Publish"}
                  </button>
                </div>
                <button 
                  type="button" 
                  className="btn btn-cancel"
                  onClick={() => navigate("/forum")}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                  Cancel
                </button>
              </div>
            </form>
          </div>
          
          <RightSidebar />
        </div>
      </main>
    </div>
  );
}