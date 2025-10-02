// src/Components/Common/Popup.jsx
import React from "react";
import styles from "./Popup.module.css"; // dùng module.css

export default function Popup({ title, onClose, children, actions }) {
  return (
    <div className={styles.popup} onClick={onClose}>
      <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
        {/* Nút close mặc định */}
        <button className={styles.closeBtn} onClick={onClose}>✕</button>

        {title && <h3 className={styles.title}>{title}</h3>}
        <div className={styles.body}>{children}</div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </div>
  );
}
