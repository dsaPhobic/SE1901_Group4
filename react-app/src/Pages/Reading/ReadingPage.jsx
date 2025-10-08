import React, { useEffect, useState } from "react";
import AppLayout from "../../Components/Layout/AppLayout";
import * as examService from "../../Services/ExamApi";
import * as readingService from "../../Services/ReadingApi";
import ExamCard from "../../Components/Exam/ExamCard";
import ExamSkillModal from "../../Components/Exam/ExamPopup";
import styles from "./ReadingPage.module.css";
import NothingFound from "../../Components/Nothing/NothingFound";

export default function ReadingPage() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeExam, setActiveExam] = useState(null);
  const [examQuestions, setExamQuestions] = useState([]);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // ====== Fetch all exams and filter Reading ======
  useEffect(() => {
    let mounted = true;
    examService
      .getAll()
      .then((data) => {
        if (!mounted) return;
        const list = Array.isArray(data)
          ? data.filter((e) => e.examType === "Reading")
          : [];
        setExams(list);
      })
      .catch((err) => {
        console.error(err);
        if (mounted) setError("Failed to load Reading exams.");
      })
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, []);

  // ====== Load questions for selected exam ======
  const handleTakeExam = (exam) => {
    setActiveExam(exam);
    setLoadingDetail(true);
    setExamQuestions([]);

    readingService
      .getByExam(exam.examId)
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setExamQuestions(list);
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
        {!loading && error && <div className={styles.errorText}>{error}</div>}

        {!loading && !error && (
          <div className={styles.grid}>
            {exams.length > 0 ? (
              exams.map((exam) => (
                <ExamCard
                  key={exam.examId}
                  exam={exam}
                  onTake={() => handleTakeExam(exam)}
                />
              ))
            ) : (
              <div className={styles.centerWrapper}>
                <NothingFound
                  imageSrc="/src/assets/sad_cloud.png"
                  title="No reading exams available"
                  message="Please check back later or try another skill."
                />
              </div>
            )}
          </div>
        )}
      </div>

      {activeExam && (
        <ExamSkillModal
          exam={activeExam}
          tasks={examQuestions}
          loading={loadingDetail}
          onClose={() => setActiveExam(null)}
        />
      )}
    </AppLayout>
  );
}
