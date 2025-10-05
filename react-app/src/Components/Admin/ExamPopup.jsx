// src/Components/Admin/ExamPopup.jsx
import React from "react";
import styles from "./ExamPopup.module.css";

// Normalize a reading/skill to camelCase
const normalizeReading = (r) => ({
  readingId: r.readingId ?? r.ReadingId,
  examId: r.examId ?? r.ExamId,
  readingContent: r.readingContent ?? r.ReadingContent ?? "",
  readingQuestion: r.readingQuestion ?? r.ReadingQuestion ?? "",
  readingType: r.readingType ?? r.ReadingType ?? "",
  displayOrder: r.displayOrder ?? r.DisplayOrder ?? 1,
  correctAnswer: r.correctAnswer ?? r.CorrectAnswer ?? null,
  questionHtml: r.questionHtml ?? r.QuestionHtml ?? null,
});

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

  // normalize everything here so downstream is easy
  const normalizedSkills = Array.isArray(skills)
    ? skills.map(normalizeReading)
    : [];

  const examName = exam?.examName ?? exam?.ExamName ?? "";

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>
          Manage Skills for <span className={styles.examName}>{examName}</span>
        </h3>

        {normalizedSkills.length > 0 ? (
          <div className={styles.skillList}>
            {normalizedSkills.map((s) => (
              <div key={s.readingId} className={styles.skillItem}>
                <div className={styles.skillText}>
                  <strong>
                    {/* short preview of the question text */}
                    {s.readingQuestion?.length > 120
                      ? s.readingQuestion.slice(0, 120) + "…"
                      : s.readingQuestion || "(no question text)"}
                  </strong>
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
