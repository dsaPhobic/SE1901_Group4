// src/Components/Exam/ExamSkillModal.jsx
import React from "react";
import styles from "./ExamPopup.module.css";

export default function ExamSkillModal({
  show,
  exam,
  skills = [],
  onClose,
  onEdit,
  onDelete,
  onAddSkill,
}) {
  if (!show) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>Manage Skills for {exam?.examName}</h3>

        {skills.length > 0 ? (
          <div className={styles.skillList}>
            {skills.map((s, i) => (
              <div key={i} className={styles.skillItem}>
                <div className={styles.skillText}>
                  <strong>{s.readingQuestion}</strong>
                </div>
                <div className={styles.actions}>
                  <button
                    className={styles.edit}
                    onClick={() => onEdit(s)}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    className={styles.delete}
                    onClick={() => onDelete(s.readingId)}
                    title="Delete"
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ opacity: 0.7 }}>No skills linked yet.</p>
        )}

        <div className={styles.footer}>
          <button className={styles.addBtn} onClick={onAddSkill}>
            ➕ Add Skill
          </button>
          <button className={styles.closeBtn} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
