import React from "react";
import { NavLink } from "react-router-dom";
import { Cloud, Wallet, GraduationCap } from "lucide-react";
import styles from "./Sidebar.module.css";

export default function Sidebar({ menuItems }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <div className={styles.logo}>
          <GraduationCap
            size={28}
            color="#38bdf8"
            className={styles.logoIcon}
          />
          <span className={styles.logoText}>IELTSPhobic</span>
        </div>
      </div>

      <nav className={styles.sidebarNav}>
        {menuItems.length === 0 ? (
          <p className={styles.emptyMenu}>No menu items available</p>
        ) : (
          menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ""}`
              }
            >
              {item.icon && <span className={styles.icon}>{item.icon}</span>}
              <span className={styles.label}>{item.label}</span>
            </NavLink>
          ))
        )}
      </nav>

      {/* ===== Footer ===== */}
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
