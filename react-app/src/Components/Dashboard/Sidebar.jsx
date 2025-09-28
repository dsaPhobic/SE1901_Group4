import React from "react";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">☁️</span>
          <span className="logo-text">IELTSPhobic</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-item active">📊 Overview</div>
        <div className="nav-item">📖 Reading</div>
        <div className="nav-item">🎧 Listening</div>
        <div className="nav-item">💬 Speaking</div>
        <div className="nav-item">✍️ Writing</div>
        <div className="nav-item">⚙️ Settings</div>
      </nav>

      <div className="sidebar-footer">
        <div className="cloud-icon">☁️</div>
        <div className="money-symbols">💰💰💰</div>
        <p className="footer-text">Give your money awesome space in cloud</p>
      </div>
    </aside>
  );
}
