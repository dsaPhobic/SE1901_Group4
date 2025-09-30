import React from "react";

export default function Sidebar({ onNavigate }) {

  const navItems = [
    { page: "home", icon: "📊", label: "Overview" },
    { page: "forum", icon: "💬", label: "General" },
    { page: "reading", icon: "📖", label: "Reading" },
    { page: "listening", icon: "🎧", label: "Listening" },
    { page: "speaking", icon: "💬", label: "Speaking" },
    { page: "writing", icon: "✍️", label: "Writing" },
    { page: "settings", icon: "⚙️", label: "Settings" }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">☁️</span>
          <span className="logo-text">IELTSPhobic</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <div 
            key={item.page}
            className="nav-item"
            onClick={() => onNavigate(item.page)}
          >
            {item.icon} {item.label}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="cloud-icon">☁️</div>
        <div className="money-symbols">💰💰💰</div>
        <p className="footer-text">Give your money awesome space in cloud</p>
      </div>
    </aside>
  );
}
