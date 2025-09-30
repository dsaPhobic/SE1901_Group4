import React from "react";
import "./HeaderBar.css";

export default function HeaderBar({ onNavigate, currentPage }) {
  const getPageTitle = () => {
    if (currentPage === "forum") return "Questions";
    if (currentPage === "createPost") return "New Question";
    if (currentPage === "postDetail") return "Open Question";
    return "Summary of your hard work";
  };

  const showAskButton = () => {
    return currentPage === "forum";
  };

  return (
    <header className="main-header">
      <h1 className="page-title">{getPageTitle()}</h1>
      <div className="user-section">
        {showAskButton() && (
          <button 
            className="ask-question-btn"
            onClick={() => onNavigate('createPost')}
          >
            Ask a question
          </button>
        )}
        <div className="notification-icon">✉️</div>
        <div className="notification-icon bell">
          🔔<span className="notification-dot"></span>
        </div>
        <div className="user-avatar">👤</div>
        <div className="user-info">
          <div className="user-name">Andrew</div>
          <div className="user-role">Admin account</div>
        </div>
      </div>
    </header>
  );
}
