import React from "react";
import styles from "./ExamPopup.module.css";
import { X, PlayCircle } from "lucide-react";

export default function ReadingModal({ exam, questions, loading, onClose }) {
  const numQuestions = Array.isArray(questions) ? questions.length : 0;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{exam.examName}</h3>
          <button className={styles.iconBtn} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {loading ? (
          <div className={styles.stateText}>Loading questions...</div>
        ) : (
          <div className={styles.modalContent}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Exam Type:</span>
              <span className={styles.infoValue}>{exam.examType}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Total Questions:</span>
              <span className={styles.infoValue}>{numQuestions}</span>
            </div>

            {questions && questions.length > 0 && (
              <div className={styles.questionPreview}>
                <h4>Preview:</h4>
                <p>
                  {questions[0].readingQuestion
                    ? questions[0].readingQuestion.slice(0, 150)
                    : "No preview available..."}
                </p>
              </div>
            )}
          </div>
        )}

        <div className={styles.modalActions}>
          <button className={styles.secondaryBtn} onClick={onClose}>
            Close
          </button>
          {!loading && (
            <button
              className={styles.primaryBtn}
              onClick={() => alert("Start test not implemented yet")}
            >
              <PlayCircle size={18} style={{ marginRight: 6 }} />
              Start Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
