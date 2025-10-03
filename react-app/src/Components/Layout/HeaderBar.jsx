import React from "react";
import styles from "./HeaderBar.module.css";
import useAuth from "../../Hook/UseAuth";
import { useNavigate } from "react-router-dom";
import { Mail, Bell, User } from "lucide-react";

export default function HeaderBar({ title }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate("/profile");
  };

  const goToLogin = () => {
    navigate("/login");
  };

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

            {/* avatar user */}
            <div className={styles.userAvatar} onClick={goToProfile}>
              <User size={20} />
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
