import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppLayout from "../../Components/Layout/AppLayout";
import styles from "./WritingTestPage.module.css";

export default function WritingTestPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { exam, tasks = [], task, mode, duration } = state || {};

  const [timeLeft, setTimeLeft] = useState(duration ? duration * 60 : 0);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // ===== Timer =====
  useEffect(() => {
    if (timeLeft <= 0 || submitted) return;
    const timer = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleSubmit = () => {
    const attempt = {
      examId: exam.examId,
      answerText: answer,
      startedAt: new Date().toISOString(),
    };
    console.log("Writing attempt:", attempt);
    setSubmitted(true);
  };

  if (!exam) {
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

  return (
    <AppLayout title={`Writing Test - ${exam.examName}`}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>
            {mode === "full"
              ? "Full Writing Test"
              : `Writing ${task?.writingType || "Task"}`}{" "}
            — {exam.examName}
          </h2>
          <div className={styles.timer}>⏰ {formatTime(timeLeft)}</div>
        </div>

        {!submitted ? (
          <>
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
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Start writing your essay here..."
                className={styles.textarea}
              />
            </div>

            <div className={styles.actions}>
              <button onClick={handleSubmit} className={styles.submitBtn}>
                Submit
              </button>
              <button className={styles.backBtn} onClick={() => navigate(-1)}>
                ← Back
              </button>
            </div>
          </>
        ) : (
          <div className={styles.submittedBox}>
            <h3>✅ Writing Submitted Successfully!</h3>
            <p>Your writing attempt has been recorded.</p>
            <button
              onClick={() => navigate("/writing")}
              className={styles.backBtn}
            >
              ← Back to Writing List
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
