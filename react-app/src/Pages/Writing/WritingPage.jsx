import React, { useEffect, useState } from "react";
import AppLayout from "../../Components/Layout/AppLayout";
import * as examService from "../../Services/ExamApi";
import * as writingService from "../../Services/WritingApi";
import styles from "./WritingPage.module.css";
import coverImg from "../../assets/image.png";

export default function WritingPage() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeExam, setActiveExam] = useState(null);
  const [examTasks, setExamTasks] = useState([]);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    let mounted = true;
    examService
      .getAll()
      .then((data) => {
        if (!mounted) return;
        const writingExams = Array.isArray(data)
          ? data.filter((e) => e.examType === "Writing")
          : [];
        setExams(writingExams);
      })
      .catch((err) => {
        console.error(err);
        if (mounted) setError("Failed to load Writing exams.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleTakeExam = (exam) => {
    setActiveExam(exam);
    setLoadingDetail(true);
    setExamTasks([]);
    writingService
      .getByExam(exam.examId)
      .then((res) => {
        const details = res?.data ?? res;
        setExamTasks(Array.isArray(details) ? details : []);
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
        {error && !loading && <div className={styles.errorText}>{error}</div>}

        {!loading && !error && (
          <div className={styles.grid}>
            {exams.map((exam) => (
              <WritingCard
                key={exam.examId}
                exam={exam}
                onTake={() => handleTakeExam(exam)}
              />
            ))}
            {exams.length === 0 && (
              <div className={styles.stateText}>
                No writing exams available.
              </div>
            )}
          </div>
        )}
      </div>

      {activeExam && (
        <WritingModal
          exam={activeExam}
          tasks={examTasks}
          loading={loadingDetail}
          onClose={() => setActiveExam(null)}
        />
      )}
    </AppLayout>
  );
}

function WritingCard({ exam, onTake }) {
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

function WritingModal({ exam, tasks, loading, onClose }) {
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const totalTasks = Array.isArray(tasks) ? tasks.length : 0;
  const taskTypes = Array.isArray(tasks)
    ? Array.from(new Set(tasks.map((t) => t.writingType))).join(", ")
    : "";

  const startFullTest = () => {
    onClose();
    alert("Start full Writing test (Task 1 + Task 2)");
  };

  const startIndividual = () => {
    const task = Array.isArray(tasks)
      ? tasks.find((t) => String(t.writingId) === String(selectedTaskId))
      : null;
    if (!task) return;
    onClose();
    alert(`Start ${task.writingType} - Task ${task.displayOrder}`);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{exam.examName}</h3>
          <button className={styles.iconBtn} onClick={onClose}>×</button>
        </div>

        {loading ? (
          <div className={styles.stateText}>Loading tasks...</div>
        ) : (
          <div className={`${styles.modalContent} ${styles.modalGrid}`}>
            <div className={styles.modalColumn}>
              <div className={styles.blockCard}>
                <div className={styles.blockHeader}>Do the whole test</div>
                <div className={styles.blockBody}>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Instructions</span>
                    <div className={styles.infoValue}>
                      <ul className={styles.list}>
                        <li>Answer all questions</li>
                        <li>You can change the question at any time during the test</li>
                      </ul>
                    </div>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Test info</span>
                    <div className={styles.infoValue}>
                      There are {totalTasks || "N/A"} tasks in the test{taskTypes ? ` (${taskTypes})` : ""}.
                    </div>
                  </div>
                </div>
                <div className={styles.blockActions}>
                  <button className={styles.primaryBtn} onClick={startFullTest}>Start Full Test</button>
                </div>
              </div>
            </div>

            <div className={styles.modalColumn}>
              <div className={styles.blockCard}>
                <div className={styles.blockHeader}>Test individual test</div>
                <div className={styles.blockBody}>
                  <div className={styles.taskList}>
                    {Array.isArray(tasks) && tasks.length > 0 ? (
                      tasks
                        .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
                        .map((t) => (
                          <label key={t.writingId} className={styles.taskOption}>
                            <input
                              type="radio"
                              name="writingTask"
                              value={t.writingId}
                              checked={String(selectedTaskId) === String(t.writingId)}
                              onChange={() => setSelectedTaskId(t.writingId)}
                            />
                            <div className={styles.taskMeta}>
                              <div className={styles.taskTitle}>{t.writingType} — Task {t.displayOrder}</div>
                            </div>
                          </label>
                        ))
                    ) : (
                      <div className={styles.stateText}>No tasks available.</div>
                    )}
                  </div>
                </div>
                <div className={styles.blockActions}>
                  <button className={styles.secondaryBtn} onClick={onClose}>Cancel</button>
                  <button className={styles.primaryBtn} disabled={!selectedTaskId} onClick={startIndividual}>Start Task</button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
