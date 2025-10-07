import React, { useEffect, useState } from "react";
import AppLayout from "../../Components/Layout/AppLayout";
import * as examService from "../../Services/ExamApi";
import * as readingService from "../../Services/ReadingApi";
import ReadingCard from "../../Components/Exam/ExamCard";
import ReadingModal from "../../Components/Exam/ExamPopup";
import styles from "./ReadingPage.module.css";

export default function ReadingPage() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeExam, setActiveExam] = useState(null);
  const [examReadings, setExamReadings] = useState([]);
  const [loadingDetail, setLoadingDetail] = useState(false);

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

    return () => (mounted = false);
  }, []);

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
      .finally(() => setLoadingDetail(false));
  };

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
              <div className={styles.stateText}>No reading exams available.</div>
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
