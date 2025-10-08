import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LineChart,
  Book,
  Headphones,
  MessageSquare,
  Pencil,
  Settings,
  MessageCircle,
  Library,
  ShoppingBag,
  Cloud,
  Wallet,
} from "lucide-react";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  const location = useLocation();
  
  // danh sách menu
  const menuItems = [
    {
      icon: <LineChart size={20} />,
      label: "Overview",
      active: true,
      path: "/home",
    },
    { icon: <Book size={20} />, label: "Reading", path: "/reading" },
    { icon: <Headphones size={20} />, label: "Listening", path: "/listening" },
    { icon: <MessageSquare size={20} />, label: "Speaking", path: "/speaking" },
    { icon: <Pencil size={20} />, label: "Writing", path: "/writing" },
    { icon: <Settings size={20} />, label: "Settings", path: "/settings" },
    { icon: <MessageCircle size={20} />, label: "General", path: "/forum" },
    { icon: <Library size={20} />, label: "Dictionary", path: "/dictionary" },

    {
      icon: <ShoppingBag size={20} />,
      label: "Transaction",
      path: "/transaction",
    },
  ];

  // Function to check if a menu item should be active
  const isActive = (path) => {
    if (path === "/forum") {
      // General should be active for forum, create-post, edit-post, and post detail pages
      return location.pathname === "/forum" || 
             location.pathname.startsWith("/create-post") || 
             location.pathname.startsWith("/edit-post") || 
             location.pathname.startsWith("/post/");
    }
    return location.pathname === path;
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>☁️</span>
          <span className={styles.logoText}>IELTSPhobic</span>
        </div>
      </div>

      <nav className={styles.sidebarNav}>
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path} // đường dẫn của route
            className={`${styles.navItem} ${isActive(item.path) ? styles.active : ""}`}
          >
            {item.icon}
            <span className={styles.label}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.sidebarFooter}>
        <Cloud size={30} color="#6c757d" />
        <Wallet size={28} color="#28a745" />
        <p className={styles.footerText}>
          Give your money awesome space in cloud
        </p>
      </div>
    </aside>
  );
}
