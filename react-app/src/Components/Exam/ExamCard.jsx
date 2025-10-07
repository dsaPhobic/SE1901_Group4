import React from "react";
import styles from "./ExamCard.module.css";
import coverImg from "../../assets/image.png";

export default function ReadingCard({ exam, onTake }) {
  return (
    <div className={styles.card}>
      <div className={styles.coverWrap}>
        <img className={styles.cover} src={coverImg} alt={exam.examName} />
        <div className={styles.coverBadge}>IELTS</div>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.title}>{exam.examName}</div>
        <div className={styles.metaRow}>
          <span className={styles.metaLabel}>Type:</span>
          <span className={styles.metaValue}>{exam.examType}</span>
        </div>
        <button className={styles.takeBtn} onClick={onTake}>
          Take Test
        </button>
      </div>
    </div>
  );
}
