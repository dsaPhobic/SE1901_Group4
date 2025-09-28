import React from "react";
import styles from "./StatItem.module.css";

function StatItem({ icon, label, score, maxScore, color }) {
  const widthPercent = (score / maxScore) * 100;

  return (
    <div className={styles.statItem}>
      <div className={styles.icon}>{icon}</div>
      <div className={styles.content}>
        <div className={styles.label}>{label}</div>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${widthPercent}%`, backgroundColor: color }}
          ></div>
        </div>
      </div>
      <div className={styles.value}>{score}</div>
    </div>
  );
}

export default StatItem;
