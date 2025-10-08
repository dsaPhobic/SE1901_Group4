import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreatePost.css";
import Sidebar from "../../Components/Layout/Sidebar";
import HeaderBar from "../../Components/Layout/HeaderBar";
import RightSidebar from "../../Components/Forum/RightSidebar";
import { createPost } from "../../Services/ForumApi";
import { Image, Send, X } from "lucide-react";

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
        alert("Bài viết đã được tạo thành công và đang chờ duyệt. Bạn sẽ được thông báo khi bài viết được phê duyệt.");
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
                    <Image size={16} />
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
                    <Send size={16} />
                    {loading ? "Publishing..." : "Publish"}
                  </button>
                </div>
                <button 
                  type="button" 
                  className="btn btn-cancel"
                  onClick={() => navigate("/forum")}
                >
                  <X size={16} />
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