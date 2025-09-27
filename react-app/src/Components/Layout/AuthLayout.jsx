import React from "react";
import styles from "./AuthLayout.module.css";

export default function AuthLayout({ title, children }) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
