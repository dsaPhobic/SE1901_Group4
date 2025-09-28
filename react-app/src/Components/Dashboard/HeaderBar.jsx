import React from "react";

export default function HeaderBar() {
  return (
    <header className="main-header">
      <h1 className="page-title">Summary of your hard work</h1>
      <div className="user-section">
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
