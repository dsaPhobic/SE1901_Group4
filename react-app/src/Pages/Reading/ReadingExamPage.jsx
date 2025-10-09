import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppLayout from "../../Components/Layout/AppLayout";
import styles from "./ReadingExamPage.module.css";

export default function ReadingExamPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { exam, tasks = [], mode, duration } = state || {};

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration ? duration * 60 : 0);

  // ========== TIMER ==========
  useEffect(() => {
    if (!timeLeft || submitted) return;
    const timer = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  // ========== EVENT HANDLERS ==========
  const handleChange = (taskId, value) => {
    setAnswers((prev) => ({ ...prev, [taskId]: value }));
  };

  const handleSubmit = () => {
    const attempt = {
      examId: exam.examId,
      answerText: JSON.stringify(answers),
      startedAt: new Date().toISOString(),
    };
    console.log("User Reading Attempt:", attempt);
    setSubmitted(true);
  };

  if (!exam) {
    return (
      <AppLayout title="Reading Test">
        <div className={styles.center}>
          <h2>No exam selected</h2>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>
      </AppLayout>
    );
  }

  // ========== RENDER ==========
  return (
    <AppLayout title="Reading Test">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{exam.examName}</h2>
          <div className={styles.timer}>⏱️ {formatTime(timeLeft)}</div>
        </div>

        {!submitted ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            {tasks.map((q, idx) => (
              <div key={idx} className={styles.questionCard}>
                <h3 className={styles.questionTitle}>
                  {q.readingType || "Reading Task"} #{q.displayOrder || idx + 1}
                </h3>

                <div
                  className={styles.readingContent}
                  dangerouslySetInnerHTML={{ __html: q.readingContent || "" }}
                />

                <div
                  className={styles.question}
                  dangerouslySetInnerHTML={{
                    __html: q.questionHtml || q.readingQuestion,
                  }}
                />

                <textarea
                  className={styles.answerBox}
                  placeholder="Type your answer here..."
                  value={answers[q.readingId] || ""}
                  onChange={(e) => handleChange(q.readingId, e.target.value)}
                />
              </div>
            ))}

            <div className={styles.actions}>
              <button type="submit" className={styles.submitBtn}>
                Submit Answers
              </button>
            </div>
          </form>
        ) : (
          <div className={styles.submittedBox}>
            <h3>✅ Reading Test Submitted!</h3>
            <p>Your answers have been recorded successfully.</p>
            <button className={styles.backBtn} onClick={() => navigate("/reading")}>
              ← Back to Reading List
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
