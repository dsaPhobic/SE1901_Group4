import React, { useState } from "react";
import "./CreatePost.css";
import Sidebar from "../../Components/Dashboard/Sidebar";
import HeaderBar from "../../Components/Dashboard/HeaderBar";
import RightSidebar from "../../Components/Forum/RightSidebar";
import { createPost } from "../../Services/ForumApi";

export default function CreatePost({ onNavigate }) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    tags: []
  });
  const [loading, setLoading] = useState(false);

  const categories = [
    "Reading",
    "Listening", 
    "Speaking",
    "Writing",
    "General",
    "Vocabulary",
    "Grammar"
  ];

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
        onNavigate("postDetail", response.data.postId);
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

  return (
    <div className="create-post-container">
      <Sidebar onNavigate={onNavigate} />
      
      <main className="main-content">
        <HeaderBar onNavigate={onNavigate} currentPage="createPost" />
        
        <div className="create-post-content">
          <div className="create-post-main">
            <div className="create-post-header">
              <h1>New Question</h1>
            </div>
            
            <form onSubmit={handleSubmit} className="create-post-form">
              <div className="form-group">
                <label htmlFor="category">Choose categories</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="title">Type catching attention title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter a compelling title for your question"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="content">Type your question</label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Describe your question in detail..."
                  rows={10}
                  required
                />
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => onNavigate("forum")}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline"
                  onClick={handleSaveDraft}
                >
                  Save as draft
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Publishing..." : "Publish"}
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
