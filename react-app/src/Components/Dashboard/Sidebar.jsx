import React from "react";
import { NavLink } from "react-router-dom";
import {
  LineChart,
  Book,
  Headphones,
  MessageSquare,
  Pencil,
  Settings,
  MessageCircle,
  Library,
  FileQuestion,
  ShoppingBag,
} from "lucide-react";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  // danh sách menu
  const menuItems = [
    {
      icon: <LineChart size={20} />,
      label: "Overview",
      active: true,
      path: "overview",
    },
    { icon: <Book size={20} />, label: "Reading", path: "/reading" },
    { icon: <Headphones size={20} />, label: "Listening", path: "/listening" },
    { icon: <MessageSquare size={20} />, label: "Speaking", path: "/speaking" },
    { icon: <Pencil size={20} />, label: "Writing", path: "/writing" },
    { icon: <Settings size={20} />, label: "Settings", path: "/settings" },
    { icon: <MessageCircle size={20} />, label: "General", path: "/general" },
    { icon: <Library size={20} />, label: "Dictionary", path: "/dictionary" },
    {
      icon: <FileQuestion size={20} />,
      label: "Quiz/FlashCard",
      path: "/quiz",
    },
    {
      icon: <ShoppingBag size={20} />,
      label: "Transaction",
      path: "/transaction",
    },
  ];

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
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ""}`
            }
          >
            {item.icon}
            <span className={styles.label}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.sidebarFooter}>
        <div className={styles.cloudIcon}>☁️</div>
        <div className={styles.moneySymbols}>💰💰💰</div>
        <p className={styles.footerText}>
          Give your money awesome space in cloud
        </p>
      </div>
    </aside>
  );
}