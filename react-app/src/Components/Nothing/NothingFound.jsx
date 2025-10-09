import React from "react";
import styles from "./NothingFound.module.css";
import { useNavigate } from "react-router-dom";

export default function NothingFound({
  imageSrc = "/src/assets/sad_cloud.png",
  title = "Nothing here yet",
  message = "There is no data to display.",
  actionLabel,
  onAction,
  to,
  className = "",
  children,
}) {
  const navigate = useNavigate();

  const handleAction = () => {
    if (onAction) {
      onAction();
      return;
    }
    if (to) {
      navigate(to);
    }
  };

  return (
    <div className={`${styles.emptyState} ${className}`}>
      {imageSrc && (
        <img src={imageSrc} alt="Empty" className={styles.emptyImage} />
      )}
      {title && <h4 className={styles.title}>{title}</h4>}
      {message && <p className={styles.message}>{message}</p>}
      {children}
      {actionLabel && (
        <button className={styles.emptyButton} onClick={handleAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}


