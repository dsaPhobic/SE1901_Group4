import React, { useState, useRef, useEffect } from "react";
import styles from "./HeaderBar.module.css";
import useAuth from "../../Hook/UseAuth";
import { useNavigate } from "react-router-dom";
import { Mail, Bell, User, LogOut, UserCircle } from "lucide-react";

export default function HeaderBar({ title }) {
  const { user, loading, handleLogout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
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
            <div className={`${styles.notificationIcon} ${styles.bell}`}>
              <Bell size={20} />
              <span className={styles.notificationDot}></span>
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
