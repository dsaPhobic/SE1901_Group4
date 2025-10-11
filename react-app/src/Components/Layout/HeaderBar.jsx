import React, { useState, useRef, useEffect } from "react";
import styles from "./HeaderBar.module.css";
import useAuth from "../../Hook/UseAuth";
import { useNavigate } from "react-router-dom";
import { Mail, Bell, User, LogOut, UserCircle } from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";
import { getNotifications } from "../../Services/NotificationApi";

export default function HeaderBar({ title }) {
  const { user, loading, handleLogout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  const goToProfile = () => {
    navigate("/profile");
    setIsDropdownOpen(false);
  };

  const goToLogin = () => {
    navigate("/");
  };

  const handleLogoutClick = async () => {
    try {
      await handleLogout();
      navigate("/home");
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setIsNotificationOpen(false); // Close notification when opening user dropdown
  };

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setIsDropdownOpen(false); // Close user dropdown when opening notification
  };

  // Check for unread notifications
  useEffect(() => {
    const checkUnreadNotifications = async () => {
      if (user) {
        try {
          console.log("Checking notifications for user:", user.userId);
          const response = await getNotifications();
          console.log("Notifications response:", response.data);
          const notifications = response.data || [];
          const unreadCount = notifications.filter(notif => !notif.isRead).length;
          console.log("Unread count:", unreadCount);
          setHasUnreadNotifications(unreadCount > 0);
        } catch (error) {
          console.error("Error checking unread notifications:", error);
          setHasUnreadNotifications(false);
        }
      }
    };

    checkUnreadNotifications();
    
    // Check every 30 seconds for new notifications
    const interval = setInterval(checkUnreadNotifications, 30000);
    
    return () => clearInterval(interval);
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is on modal overlay or modal content
      const isModalClick = event.target.closest('.notification-modal-overlay') || 
                          event.target.closest('.notification-modal');
      
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      
      // Only close notification if not clicking on modal AND not clicking on notification dropdown
      if (notificationRef.current && 
          !notificationRef.current.contains(event.target) && 
          !isModalClick &&
          !event.target.closest('.notification-dropdown')) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading) {
    return (
      <header className={styles.mainHeader}>
        <h1 className={styles.pageTitle}>{title}</h1>
        <div className={styles.userSection}>
          <div className={styles.userInfo}>Loading...</div>
        </div>
      </header>
    );
  }

  return (
    <header className={styles.mainHeader}>
      <h1 className={styles.pageTitle}>{title}</h1>

      <div className={styles.userSection}>
        {user ? (
          <>
            {/* icon thư */}
            <div className={styles.notificationIcon}>
              <Mail size={20} />
            </div>

            {/* icon chuông */}
            <div 
              className={`${styles.notificationIcon} ${styles.bell}`}
              onClick={toggleNotification}
              ref={notificationRef}
            >
              <Bell size={20} />
              {hasUnreadNotifications && <span className={styles.notificationDot}></span>}
              <NotificationDropdown 
                isOpen={isNotificationOpen} 
                onClose={() => setIsNotificationOpen(false)}
                onNotificationRead={() => setHasUnreadNotifications(false)}
              />
            </div>

            {/* avatar user with dropdown */}
            <div className={styles.userAvatarContainer} ref={dropdownRef}>
              <div className={styles.userAvatar} onClick={toggleDropdown}>
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="User Avatar"
                    className={styles.avatarImage}
                  />
                ) : (
                  <User size={20} />
                )}
              </div>
              
              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <div className={styles.dropdownItem} onClick={goToProfile}>
                    <UserCircle size={18} />
                    <span>My Profile</span>
                  </div>
                  <div className={styles.dropdownDivider}></div>
                  <div className={styles.dropdownItem} onClick={handleLogoutClick}>
                    <LogOut size={18} />
                    <span>Logout</span>
                  </div>
                </div>
              )}
            </div>

            <div className={styles.userInfo}>
              <div className={styles.userName}>{user.username}</div>
              <div className={styles.userRole}>{user.role}</div>
            </div>
          </>
        ) : (
          // Guest → hiện nút Sign In
          <button className={styles.signInBtn} onClick={goToLogin}>
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}
