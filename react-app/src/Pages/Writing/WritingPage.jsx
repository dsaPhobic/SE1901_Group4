import React, { useEffect, useState, useRef } from "react";
import AppLayout from "../../Components/Layout/AppLayout";
import * as examService from "../../Services/ExamApi";
import * as writingService from "../../Services/WritingApi";
import styles from "./WritingPage.module.css";
import coverImg from "../../assets/image.png";
import { Edit2 } from "lucide-react";

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
  const [duration, setDuration] = useState(60); // thời gian mặc định
  const [isEditingTime, setIsEditingTime] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsEditingTime(false);
      }
    };
    if (isEditingTime) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditingTime]);
  const handleDurationChange = (e) => {
    setDuration(Number(e.target.value));
    setIsEditingTime(false);
  };
  const totalQuestions = Array.isArray(tasks) ? tasks.length : 0; // writing tasks map 1:1 to questions
  const totalTasks = Array.isArray(tasks) ? tasks.length : 0;
  const taskTypes = Array.isArray(tasks)
    ? Array.from(new Set(tasks.map((t) => t.writingType))).join(", ")
    : "";

  const getTaskDurationMinutes = (task) => {
    const order = Number(task?.displayOrder);
    if (order === 1) return 20;
    if (order === 2) return 40;
    return 30; // sane default if unknown
  };

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
    <div
      className={styles.modalOverlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="writingModalTitle"
    >
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3 id="writingModalTitle" className={styles.modalTitle}>
            {exam.examName}
          </h3>
          <button
            className={styles.iconBtn}
            onClick={onClose}
            aria-label="Close dialog"
            title="Close"
          >
            ×
          </button>
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
                      <div className={styles.timeRow} ref={dropdownRef}>
                        <span>
                          Time: <strong>{duration} minutes</strong>
                        </span>

                        {/* Nút icon bút */}
                        <button
                          type="button"
                          className={styles.inlineEditBtn}
                          onClick={() => setIsEditingTime((prev) => !prev)}
                          title="Edit time"
                        >
                          <Edit2 size={16} />
                        </button>

                        {/* Dropdown custom */}
                        {isEditingTime && (
                          <div className={styles.dropdown}>
                            {[50, 55, 60, 65, 70].map((min) => (
                              <div
                                key={min}
                                className={styles.dropdownItem}
                                onClick={() => {
                                  setDuration(min);
                                  setIsEditingTime(false);
                                }}
                              >
                                {min}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <ul className={styles.list}>
                        <li>Answer all questions</li>
                        <li>
                          You can change questions at any time during the test.
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Test info</span>
                    <div className={styles.infoValue}>
                      There are{" "}
                      <span className={styles.highlightNumber}>
                        {totalQuestions || "N/A"} questions
                      </span>{" "}
                      in the test{taskTypes ? ` (${taskTypes})` : ""}.
                    </div>
                  </div>
                </div>
                <div
                  className={`${styles.blockActions} ${styles.centerActions}`}
                >
                  <button
                    className={`${styles.primaryBtn} ${styles.elevatedBtn}`}
                    onClick={startFullTest}
                  >
                    Start Full Test
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.modalColumn}>
              <div className={styles.blockCard}>
                <div className={styles.blockHeader}>Test individual task</div>
                <div className={styles.blockBody}>
                  <div className={styles.taskList}>
                    {Array.isArray(tasks) && tasks.length > 0 ? (
                      tasks
                        .sort(
                          (a, b) =>
                            (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
                        )
                        .map((t) => (
                          <label
                            key={t.writingId}
                            className={styles.taskOption}
                          >
                            <input
                              type="radio"
                              name="writingTask"
                              value={t.writingId}
                              checked={
                                String(selectedTaskId) === String(t.writingId)
                              }
                              onChange={() => setSelectedTaskId(t.writingId)}
                            />
                            <div className={styles.taskMeta}>
                              <div className={styles.taskTitle}>
                                {t.writingType} — Task {t.displayOrder} (
                                {getTaskDurationMinutes(t)} min)
                              </div>
                            </div>
                          </label>
                        ))
                    ) : (
                      <div className={styles.stateText}>
                        No tasks available.
                      </div>
                    )}
                  </div>
                </div>
                <div
                  className={`${styles.blockActions} ${styles.centerActions}`}
                >
                  <button
                    className={`${styles.primaryBtn} ${styles.elevatedBtn}`}
                    disabled={!selectedTaskId}
                    onClick={startIndividual}
                  >
                    Start Task
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
