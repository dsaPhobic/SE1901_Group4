import React, { useEffect, useState } from "react";
import AppLayout from "../../Components/Layout/AppLayout";
import * as examService from "../../Services/ExamApi";
import * as writingService from "../../Services/WritingApi";
import ExamCard from "../../Components/Exam/ExamCard";
import ExamSkillModal from "../../Components/Exam/ExamPopup";
import styles from "./WritingPage.module.css";
import NothingFound from "../../Components/Nothing/NothingFound";

export default function WritingPage() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeExam, setActiveExam] = useState(null);
  const [examTasks, setExamTasks] = useState([]);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // ====== Fetch all exams ======
  useEffect(() => {
    let mounted = true;
    examService
      .getAll()
      .then((data) => {
        if (!mounted) return;
        const list = Array.isArray(data)
          ? data.filter((e) => e.examType === "Writing")
          : [];
        setExams(list);
      })
      .catch((err) => {
        console.error(err);
        if (mounted) setError("Failed to load Writing exams.");
      })
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, []);

  // ====== Load tasks for selected exam ======
  const handleTakeExam = (exam) => {
    setActiveExam(exam);
    setLoadingDetail(true);
    setExamTasks([]);

    writingService
      .getByExam(exam.examId)
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setExamTasks(list);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to load writing tasks for this exam.");
      })
      .finally(() => setLoadingDetail(false));
  };

  return (
    <AppLayout title="Writing">
      <div className={styles.container}>
        <h2 className={styles.pageTitle}>IELTS Writing</h2>

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
                  title="No writing exams available"
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
          tasks={examTasks}
          loading={loadingDetail}
          onClose={() => setActiveExam(null)}
        />
      )}
    </AppLayout>
  );
}
