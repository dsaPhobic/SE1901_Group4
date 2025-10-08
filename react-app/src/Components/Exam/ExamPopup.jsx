import React, { useState, useEffect, useRef } from "react";
import { Edit2 } from "lucide-react";
import styles from "./ExamPopup.module.css";

export default function ExamSkillModal({ exam, tasks, loading, onClose }) {
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [duration, setDuration] = useState(60);
  const [isEditingTime, setIsEditingTime] = useState(false);
  const dropdownRef = useRef(null);

  // ======= handle click outside =======
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

  const handleDurationChange = (min) => {
    setDuration(min);
    setIsEditingTime(false);
  };

  // ======= skill-agnostic helpers =======
  const totalTasks = Array.isArray(tasks) ? tasks.length : 0;
  const taskTypes = Array.isArray(tasks)
    ? Array.from(
        new Set(
          tasks.map(
            (t) =>
              t.readingType ||
              t.listeningType ||
              t.writingType ||
              t.speakingType ||
              "Unknown"
          )
        )
      ).join(", ")
    : "";

  const getDisplayOrder = (t) =>
    t.displayOrder ?? t.DisplayOrder ?? 0;

  const getTaskId = (t) =>
    t.readingId || t.listeningId || t.writingId || t.speakingId;

  const getTaskLabel = (t) =>
    t.readingType ||
    t.listeningType ||
    t.writingType ||
    t.speakingType ||
    "Task";

  const getTaskDurationMinutes = (t) => {
    const order = Number(getDisplayOrder(t));
    if (order === 1) return 20;
    if (order === 2) return 40;
    return 30;
  };

  // ======= start test actions =======
  const startFullTest = () => {
    onClose();
    alert(`Start full ${exam.examType} test`);
  };

  const startIndividual = () => {
    const task = Array.isArray(tasks)
      ? tasks.find((t) => String(getTaskId(t)) === String(selectedTaskId))
      : null;
    if (!task) return;
    onClose();
    alert(
      `Start ${getTaskLabel(task)} - Task ${getDisplayOrder(task)} (${exam.examType})`
    );
  };

  // ======= render =======
  return (
    <div
      className={styles.modalOverlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="examSkillModalTitle"
    >
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3 id="examSkillModalTitle" className={styles.modalTitle}>
            {exam.examName} ({exam.examType})
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
            {/* ===== Left column: Full test ===== */}
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
                        <button
                          type="button"
                          className={styles.inlineEditBtn}
                          onClick={() => setIsEditingTime((prev) => !prev)}
                          title="Edit time"
                        >
                          <Edit2 size={16} />
                        </button>

                        {isEditingTime && (
                          <div className={styles.dropdown}>
                            {[50, 55, 60, 65, 70].map((min) => (
                              <div
                                key={min}
                                className={styles.dropdownItem}
                                onClick={() => handleDurationChange(min)}
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
                          You can switch between tasks during the test.
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Test info</span>
                    <div className={styles.infoValue}>
                      There are{" "}
                      <span className={styles.highlightNumber}>
                        {totalTasks || "N/A"} tasks
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

            {/* ===== Right column: Individual task ===== */}
            <div className={styles.modalColumn}>
              <div className={styles.blockCard}>
                <div className={styles.blockHeader}>Test individual task</div>
                <div className={styles.blockBody}>
                  <div className={styles.taskList}>
                    {Array.isArray(tasks) && tasks.length > 0 ? (
                      tasks
                        .sort(
                          (a, b) =>
                            getDisplayOrder(a) - getDisplayOrder(b)
                        )
                        .map((t) => {
                          const id = getTaskId(t);
                          return (
                            <label key={id} className={styles.taskOption}>
                              <input
                                type="radio"
                                name="task"
                                value={id}
                                checked={
                                  String(selectedTaskId) === String(id)
                                }
                                onChange={() => setSelectedTaskId(id)}
                              />
                              <div className={styles.taskMeta}>
                                <div className={styles.taskTitle}>
                                  {getTaskLabel(t)} — Task{" "}
                                  {getDisplayOrder(t)} (
                                  {getTaskDurationMinutes(t)} min)
                                </div>
                              </div>
                            </label>
                          );
                        })
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
