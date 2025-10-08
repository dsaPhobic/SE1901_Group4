import React, { useState, useEffect } from 'react';
import NotificationBanner from '../Forum/NotificationBanner';
import * as NotificationApi from '../../Services/NotificationApi';

export default function AppWrapper({ children }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await NotificationApi.getNotifications();
      setNotifications(response.data.filter(n => !n.isRead));
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  const handleCloseNotification = async (notificationId) => {
    try {
      await NotificationApi.markAsRead(notificationId);
      setNotifications(prev => prev.filter(n => n.notificationId !== notificationId));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <>
      {children}
      <NotificationBanner 
        notifications={notifications} 
        onClose={handleCloseNotification} 
      />
    </>
  );
}
