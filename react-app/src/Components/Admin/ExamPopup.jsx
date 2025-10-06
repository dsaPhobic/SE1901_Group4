import React, { useState, useEffect } from "react";
import styles from "./ExamPopup.module.css";

import * as readingService from "../../Services/ReadingApi";
import * as listeningService from "../../Services/ListeningApi";
import * as writingService from "../../Services/WritingApi";
import * as speakingService from "../../Services/SpeakingApi";

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

  // Pick correct service
  const getService = (type) => {
    switch (type?.toLowerCase()) {
      case "reading":
        return readingService;
      case "listening":
        return listeningService;
      case "writing":
        return writingService;
      case "speaking":
        return speakingService;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (!show || !exam?.examId) return;

    setLoading(true);
    const service = getService(exam.examType);

    if (!service?.getByExam) {
      console.warn("⚠️ No service found for", exam.examType);
      setSkills([]);
      setLoading(false);
      return;
    }

    service
      .getByExam(exam.examId)
      .then((data) => {
        console.log("✅ Loaded skills:", data);
        setSkills(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error(`❌ Failed to load ${exam.examType}:`, err);
        setSkills([]);
      })
      .finally(() => setLoading(false));
  }, [show, exam]);

  if (!show) return null;

  const examName = exam?.examName ?? exam?.ExamName ?? "";
  const examType = exam?.examType ?? exam?.ExamType ?? "";

  // Correct field mappings for camelCase JSON
  const getSkillId = (s) =>
    s.readingId || s.listeningId || s.writingId || s.speakingId;

  const getQuestionText = (s) =>
    s.readingQuestion ||
    s.listeningQuestion ||
    s.writingQuestion ||
    s.speakingQuestion ||
    "(no question text)";

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3 className={styles.title}>
          Manage Skills for{" "}
          <span className={styles.examName}>
            {examName} ({examType})
          </span>
        </h3>

        {loading ? (
          <p>Loading...</p>
        ) : skills.length > 0 ? (
          <div className={styles.skillList}>
            {skills.map((s, index) => {
              const id = getSkillId(s) ?? index;
              const question = getQuestionText(s);

              return (
                <div key={id} className={styles.skillItem}>
                  <div className={styles.skillText}>
                    <strong className={styles.skillId}>#{id}</strong>{" "}
                    <span>
                      {question.length > 120
                        ? question.slice(0, 120) + "…"
                        : question}
                    </span>
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
                      onClick={() => onDelete(id)}
                      title="Delete this question"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className={styles.empty}>No {examType} skills linked yet.</p>
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
