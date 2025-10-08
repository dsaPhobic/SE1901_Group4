import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppLayout from "../../Components/Layout/AppLayout";
import styles from "./WritingTestPage.module.css";

export default function WritingTest() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [timeLeft, setTimeLeft] = useState(0);

  if (!state) {
    return (
      <AppLayout title="Writing Test">
        <div className={styles.center}>
          <h2>No exam selected</h2>
          <button onClick={() => navigate(-1)} className={styles.backBtn}>
            ← Back
          </button>
        </div>
      </AppLayout>
    );
  }

  const { exam, tasks, task, mode } = state;

  // Set timer (default 60 minutes for full test, 20/40 for single task)
  useEffect(() => {
    if (mode === "full") setTimeLeft(60 * 60); // 60 min
    else if (task?.writingType === "Task 1") setTimeLeft(20 * 60);
    else setTimeLeft(40 * 60);
  }, [mode, task]);

  // Countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <AppLayout title={`Writing Test - ${exam.examName}`}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>
            {mode === "full" ? "Full Test" : `${task.writingType}`} —{" "}
            {exam.examName}
          </h2>
          <div className={styles.timer}>⏰ {formatTime(timeLeft)}</div>
        </div>

        <div className={styles.questionArea}>
          {mode === "full"
            ? tasks.map((t) => (
                <div key={t.writingId} className={styles.taskBlock}>
                  <h3>{t.writingType}</h3>
                  <p>{t.writingQuestion}</p>
                  {t.imageUrl && (
                    <img
                      src={t.imageUrl}
                      alt="Task"
                      className={styles.taskImage}
                    />
                  )}
                </div>
              ))
            : (
              <div className={styles.taskBlock}>
                <h3>{task.writingType}</h3>
                <p>{task.writingQuestion}</p>
                {task.imageUrl && (
                  <img
                    src={task.imageUrl}
                    alt="Task"
                    className={styles.taskImage}
                  />
                )}
              </div>
            )}
        </div>

        <div className={styles.answerArea}>
          <h4>Your Answer:</h4>
          <textarea
            placeholder="Start writing your essay here..."
            className={styles.textarea}
          />
        </div>

        <div className={styles.actions}>
          <button className={styles.submitBtn}>Submit</button>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
