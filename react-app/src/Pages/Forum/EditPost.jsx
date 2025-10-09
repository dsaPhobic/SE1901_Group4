import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./CreatePost.css";
import GeneralSidebar from "../../Components/Layout/GeneralSidebar";
import HeaderBar from "../../Components/Layout/HeaderBar";
import RightSidebar from "../../Components/Forum/RightSidebar";
import { getPost, updatePost } from "../../Services/ForumApi";
import { Image, Send, X } from "lucide-react";

export default function EditPost({ onNavigate }) {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tagNames: []
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    loadPost();
  }, [postId]);

  const loadPost = () => {
    getPost(postId, false) // Không tăng view count khi edit
      .then((response) => {
        const post = response.data;
        setFormData({
          title: post.title || "",
          content: post.content || "",
          tagNames: post.tags ? post.tags.map(tag => tag.tagName) : []
        });
      })
      .catch((error) => {
        console.error("Error loading post:", error);
        alert("Error loading post. Please try again.");
        navigate("/forum");
      })
      .finally(() => {
        setInitialLoading(false);
      });
  };

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
    updatePost(postId, formData)
      .then((response) => {
        navigate(`/post/${postId}`);
      })
      .catch((error) => {
        console.error("Error updating post:", error);
        alert("Error updating post. Please try again.");
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

  if (initialLoading) {
    return (
      <div className="create-post-container">
        <GeneralSidebar />
        <main className="main-content">
          <HeaderBar onNavigate={onNavigate} currentPage="editPost" />
          <div className="create-post-content">
            <div className="loading">Loading post...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="create-post-container">
      <GeneralSidebar />
      
      <main className="main-content">
        <HeaderBar onNavigate={onNavigate} currentPage="editPost" />
        
        <div className="create-post-content">
          <div className="create-post-main">
            <div className="create-post-header">
              <h1>Edit Post</h1>
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
                    {loading ? "Updating..." : "Update Post"}
                  </button>
                </div>
                <button 
                  type="button" 
                  className="btn btn-cancel"
                  onClick={() => navigate(`/post/${postId}`)}
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



