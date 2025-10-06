import React, { useEffect, useState } from "react";
import AppLayout from "../../Components/Layout/AppLayout";
import * as examService from "../../Services/ExamApi";
import * as readingService from "../../Services/ReadingApi";
import styles from "./ReadingPage.module.css";
import coverImg from "../../assets/image.png";

export default function ReadingPage() {
  const [exams, setExams] = useState([]); // all reading exams
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeExam, setActiveExam] = useState(null); // exam user clicked
  const [examReadings, setExamReadings] = useState([]); // reading questions of that exam
  const [loadingDetail, setLoadingDetail] = useState(false);

  // ========== Load all exams then filter only Reading ==========
  useEffect(() => {
    let mounted = true;

    examService
      .getAll()
      .then((data) => {
        if (mounted) {
          const readingExams = Array.isArray(data)
            ? data.filter((e) => e.examType === "Reading")
            : [];
          setExams(readingExams);
        }
      })
      .catch((err) => {
        console.error(err);
        if (mounted) setError("Failed to load Reading exams.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return function cleanup() {
      mounted = false;
    };
  }, []);

  // ========== Handle click: fetch reading questions for exam ==========
  const handleTakeExam = (exam) => {
    setActiveExam(exam);
    setLoadingDetail(true);
    setExamReadings([]);

    readingService
      .getByExam(exam.examId)
      .then((details) => {
        setExamReadings(Array.isArray(details) ? details : []);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to load reading questions for this exam.");
      })
      .finally(() => {
        setLoadingDetail(false);
      });
  };

  // ========== Render ==========
  return (
    <AppLayout title="Reading">
      <div className={styles.container}>
        <h2 className={styles.pageTitle}>IELTS Reading</h2>

        {loading && <div className={styles.stateText}>Loading…</div>}
        {error && !loading && <div className={styles.errorText}>{error}</div>}

        {!loading && !error && (
          <div className={styles.grid}>
            {exams.map((exam) => (
              <ReadingCard
                key={exam.examId}
                exam={exam}
                onTake={() => handleTakeExam(exam)}
              />
            ))}
            {exams.length === 0 && (
              <div className={styles.stateText}>
                No reading exams available.
              </div>
            )}
          </div>
        )}
      </div>

      {activeExam && (
        <ReadingModal
          exam={activeExam}
          questions={examReadings}
          loading={loadingDetail}
          onClose={() => setActiveExam(null)}
        />
      )}
    </AppLayout>
  );
}

// ================== CARD COMPONENT ==================
function ReadingCard({ exam, onTake }) {
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

// ================== MODAL COMPONENT ==================
function ReadingModal({ exam, questions, loading, onClose }) {
  const numQuestions = Array.isArray(questions) ? questions.length : 0;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{exam.examName}</h3>
          <button className={styles.iconBtn} onClick={onClose}>
            ×
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
              Start Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
