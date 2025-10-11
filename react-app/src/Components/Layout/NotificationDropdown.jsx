import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, CheckCircle, AlertCircle, MessageCircle, ThumbsUp } from 'lucide-react';
import { formatTimeVietnam } from '../../utils/date';
import { getNotifications, markAsRead, deleteNotification } from '../../Services/NotificationApi';
import './NotificationDropdown.css';

export default function NotificationDropdown({ isOpen, onClose, onNotificationRead }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'unread'
  const [showAllModal, setShowAllModal] = useState(false);
  const dropdownRef = useRef(null);
  const modalRef = useRef(null);

  // Load notifications when dropdown opens
  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't close if modal is open
      if (showAllModal) return;
      
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, showAllModal]);


  const loadNotifications = async () => {
    try {
      setLoading(true);
      console.log('Loading notifications...');
      const response = await getNotifications();
      console.log('Notifications loaded:', response.data);
      setNotifications(response.data || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.notificationId === notificationId 
            ? { ...notif, isRead: true }
            : notif
        )
      );
      
      // Check if all notifications are read
      const updatedNotifications = notifications.map(notif => 
        notif.notificationId === notificationId 
          ? { ...notif, isRead: true }
          : notif
      );
      const hasUnread = updatedNotifications.some(notif => !notif.isRead);
      
      if (!hasUnread && onNotificationRead) {
        onNotificationRead();
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
      setNotifications(prev => 
        prev.filter(notif => notif.notificationId !== notificationId)
      );
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'post_approved':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'post_rejected':
        return <AlertCircle size={20} className="text-red-500" />;
      case 'comment':
        return <MessageCircle size={20} className="text-blue-500" />;
      case 'vote':
        return <ThumbsUp size={20} className="text-yellow-500" />;
      default:
        return <Bell size={20} className="text-gray-500" />;
    }
  };

  const filteredNotifications = activeTab === 'unread' 
    ? notifications.filter(notif => !notif.isRead)
    : notifications;

  // Limit to 7 notifications for dropdown display
  const displayNotifications = filteredNotifications.slice(0, 7);

  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  if (!isOpen) return null;

  return (
    <>
      <div className="notification-dropdown" ref={dropdownRef}>
      {/* Header */}
      <div className="notification-header">
        <h3 className="notification-title">Thông báo</h3>
        <button className="notification-close-btn" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      {/* Tabs */}
      <div className="notification-tabs">
        <button 
          className={`notification-tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            setActiveTab('all');
          }}
        >
          Tất cả
        </button>
        <button 
          className={`notification-tab ${activeTab === 'unread' ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            setActiveTab('unread');
          }}
        >
          Chưa đọc {unreadCount > 0 && `(${unreadCount})`}
        </button>
      </div>

      {/* Notifications List */}
      <div className="notification-list">
        {loading ? (
          <div className="notification-loading">Đang tải...</div>
        ) : displayNotifications.length === 0 ? (
          <div className="notification-empty">
            {activeTab === 'unread' ? 'Không có thông báo chưa đọc' : 'Không có thông báo'}
          </div>
        ) : (
          displayNotifications.map((notification) => (
            <div 
              key={notification.notificationId} 
              className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                if (!notification.isRead) {
                  handleMarkAsRead(notification.notificationId);
                }
              }}
            >
              <div className="notification-item-icon">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="notification-item-content">
                <p className="notification-item-text">{notification.content}</p>
                <span className="notification-item-time">
                  {formatTimeVietnam(notification.createdAt)}
                </span>
              </div>
              {!notification.isRead && <div className="notification-dot"></div>}
              <button 
                className="notification-item-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteNotification(notification.notificationId);
                }}
              >
                <X size={14} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="notification-footer">
        <button 
          className="notification-see-all"
          onClick={(e) => {
            e.stopPropagation();
            setShowAllModal(true);
          }}
        >
          Xem tất cả ({filteredNotifications.length})
        </button>
      </div>
      
      </div>

      {/* All Notifications Modal */}
      {showAllModal && (
        <div 
          className="notification-modal-overlay" 
          onClick={() => setShowAllModal(false)}
          ref={modalRef}
        >
          <div 
            className="notification-modal" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="notification-modal-header">
              <h3 className="notification-modal-title">Tất cả thông báo</h3>
              <button 
                className="notification-modal-close"
                onClick={() => setShowAllModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="notification-modal-tabs">
              <button 
                className={`notification-modal-tab ${activeTab === 'all' ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab('all');
                }}
              >
                Tất cả ({notifications.length})
              </button>
              <button 
                className={`notification-modal-tab ${activeTab === 'unread' ? 'active' : ''}`}
                onClick={(e) => {
                  console.log('Chưa đọc tab clicked');
                  e.stopPropagation();
                  setActiveTab('unread');
                }}
              >
                Chưa đọc ({unreadCount})
              </button>
            </div>

            <div className="notification-modal-list">
              {filteredNotifications.map((notification) => (
                <div 
                  key={notification.notificationId} 
                  className={`notification-modal-item ${!notification.isRead ? 'unread' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!notification.isRead) {
                      handleMarkAsRead(notification.notificationId);
                    }
                  }}
                >
                  <div className="notification-modal-item-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-modal-item-content">
                    <p className="notification-modal-item-text">{notification.content}</p>
                    <span className="notification-modal-item-time">
                      {formatTimeVietnam(notification.createdAt)}
                    </span>
                  </div>
                  {!notification.isRead && <div className="notification-modal-dot"></div>}
                  <button 
                    className="notification-modal-item-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNotification(notification.notificationId);
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
