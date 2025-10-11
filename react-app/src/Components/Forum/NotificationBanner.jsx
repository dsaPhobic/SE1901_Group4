import React from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';
import { formatTimeVietnam } from '../../utils/date';
import './NotificationBanner.css';

export default function NotificationBanner({ notifications, onClose }) {
  if (!notifications || notifications.length === 0) return null;

  return (
    <div className="notification-banner">
      {notifications.map((notification, index) => (
        <div key={index} className={`notification-item ${notification.type}`}>
          <div className="notification-icon">
            {notification.type === 'post_rejected' ? (
              <AlertCircle size={20} />
            ) : (
              <CheckCircle size={20} />
            )}
          </div>
          <div className="notification-content">
            <p className="notification-text">{notification.content}</p>
            <span className="notification-time">
              {formatTimeVietnam(notification.createdAt)}
            </span>
          </div>
          <button 
            className="notification-close" 
            onClick={() => onClose(notification.notificationId)}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}


