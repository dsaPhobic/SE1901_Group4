import React from "react";
import "./RightSidebar.css";

export default function RightSidebar() {
  const mustReadPosts = [
    "Please read rules before you start working on a platform",
    "Vision & Strategy of IELTSPhobic"
  ];

  const featuredLinks = [
    "IELTSPhobic source-code on GitHub",
    "IELTS best-practices",
    "IELTSPhobic.School dashboard"
  ];

  return (
    <div className="right-sidebar">
      <div className="sidebar-section">
        <div className="sidebar-header">
          <span className="sidebar-icon">⭐</span>
          <h3>Must-read posts</h3>
        </div>
        <ul className="sidebar-list">
          {mustReadPosts.map((post, index) => (
            <li key={index} className="sidebar-item">
              {post}
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-header">
          <span className="sidebar-icon">🔗</span>
          <h3>Featured links</h3>
        </div>
        <ul className="sidebar-list">
          {featuredLinks.map((link, index) => (
            <li key={index} className="sidebar-item">
              {link}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
