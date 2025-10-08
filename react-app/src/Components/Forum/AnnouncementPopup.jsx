import React from "react";
import { X } from "lucide-react";
import "./AnnouncementPopup.css";

export default function AnnouncementPopup({ isOpen, onClose, announcement }) {
  if (!isOpen || !announcement) return null;

  return (
    <div className="announcement-overlay">
      <div className="announcement-popup">
        <div className="announcement-header">
          <div className="announcement-author">
            <div className="author-avatar">📢</div>
            <div className="author-info">
              <h4>IELTSPhobic</h4>
              <span className="author-role">Official Announcement</span>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="announcement-content">
          <h2 className="announcement-title">{announcement.title}</h2>
          <div className="announcement-body">
            {announcement.content}
          </div>
        </div>
        
        <div className="announcement-footer">
          <button className="btn-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}


