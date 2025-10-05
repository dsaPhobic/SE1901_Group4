import React, { useState, useEffect } from "react";
import styles from "./ExamPopup.module.css";
import * as readingService from "../../Services/ReadingApi";

export default function ExamSkillModal({
  show,
  exam,
  onClose,
  onEdit,
  onDelete,
  onAddSkill,
}) {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!show || !exam?.examId) return;

    setLoading(true);
    readingService
      .getByExam(exam.examId)
      .then((data) => {
        setSkills(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("❌ Failed to load readings:", err);
        setSkills([]);
      })
      .finally(() => setLoading(false));
  }, [show, exam]);

  if (!show) return null;

  const examName = exam?.examName ?? exam?.ExamName ?? "";

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3 className={styles.title}>
          Manage Skills for <span className={styles.examName}>{examName}</span>
        </h3>

        {loading ? (
          <p>Loading...</p>
        ) : skills.length > 0 ? (
          <div className={styles.skillList}>
            {skills.map((s) => (
              <div key={s.readingId} className={styles.skillItem}>
                <div className={styles.skillText}>
                  <strong>
                    {s.readingQuestion?.length > 120
                      ? s.readingQuestion.slice(0, 120) + "…"
                      : s.readingQuestion || "(no question text)"}
                  </strong>
                </div>
                <div className={styles.actions}>
                  <button
                    className={styles.edit}
                    onClick={() => onEdit(s)}
                    title="Edit this question"
                  >
                    ✏️
                  </button>
                  <button
                    className={styles.delete}
                    onClick={() => onDelete(s.readingId)}
                    title="Delete this question"
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.empty}>No skills linked yet.</p>
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
