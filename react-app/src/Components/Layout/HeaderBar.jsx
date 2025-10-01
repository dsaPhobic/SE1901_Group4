import React from "react";
import styles from "./HeaderBar.module.css";
import { useAuth } from "../../context/AuthContext";

// import icon từ lucide-react
import { Mail, Bell, User } from "lucide-react";

export default function HeaderBar({ title }) {
  const { user } = useAuth();

  return (
    <header className={styles.mainHeader}>
      <h1 className={styles.pageTitle}>{title}</h1>

      <div className={styles.userSection}>
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
        <div className={styles.userAvatar}>
          <User size={20} />
        </div>

        <div className={styles.userInfo}>
          <div className={styles.userName}>{user?.username || "Guest"}</div>
          <div className={styles.userRole}>{user?.role || "Guest"}</div>
        </div>
      </div>
    </header>
  );
}
