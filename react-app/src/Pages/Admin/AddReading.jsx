import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as readingService from "../../Services/ReadingApi";
import ExamMarkdownRenderer, {
  renderMarkdownToHtmlAndAnswers,
} from "../../Components/Exam/ExamMarkdownRenderer.jsx";
import styles from "./AddReading.module.css";

export default function AddReading() {
  const location = useLocation();
  const navigate = useNavigate();
  const exam = location.state?.exam;
  const skill = location.state?.skill;

  const [readingContent, setReadingContent] = useState("");
  const [readingQuestion, setReadingQuestion] = useState("");
  const [status, setStatus] = useState("");
  const [showAnswers, setShowAnswers] = useState(true);

  useEffect(() => {
    if (skill) {
      setReadingContent(skill.readingContent || "");
      setReadingQuestion(skill.readingQuestion || "");
    }
  }, [skill]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Processing...");

    try {
      const { html, answers } = renderMarkdownToHtmlAndAnswers(readingQuestion);
      const payload = {
        examId: exam.examId,
        readingContent,
        readingQuestion,
        readingType: "Markdown",
        displayOrder: skill?.displayOrder || 1,
        correctAnswer: JSON.stringify(answers),
        questionHtml: html,
      };

      if (skill) {
        await readingService.update(skill.readingId, payload);
        setStatus("✅ Updated successfully!");
      } else {
        await readingService.add(payload);
        setStatus("✅ Added successfully!");
      }

      setTimeout(() => navigate(-1), 1000);
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to save question");
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>
          {skill
            ? `✏️ Edit Reading for ${exam?.examName}`
            : `📝 Add Reading for ${exam?.examName}`}
        </h2>
      </header>

      <div className={styles.grid}>
        {/* ===== Left: Form ===== */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.group}>
            <label>Passage / Content</label>
            <textarea
              value={readingContent}
              onChange={(e) => setReadingContent(e.target.value)}
              rows={6}
              placeholder="Write the reading passage here..."
            />
          </div>

          <div className={styles.group}>
            <label>Question (Markdown)</label>
            <textarea
              value={readingQuestion}
              onChange={(e) => setReadingQuestion(e.target.value)}
              rows={10}
              placeholder="[!num] Question text here..."
            />
          </div>

          <div className={styles.buttons}>
            <button type="submit" className={styles.btnPrimary}>
              {skill ? "Update Question" : "Add Question"}
            </button>
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={() => navigate(-1)}
            >
              Back
            </button>
          </div>

          {status && <p className={styles.status}>{status}</p>}
        </form>

        {/* ===== Right: Preview ===== */}
        <div className={styles.preview}>
          <div className={styles.previewHeader}>
            <h3>Live Preview</h3>
            <button
              onClick={() => setShowAnswers((v) => !v)}
              className={`${styles.btnToggle} ${
                showAnswers ? styles.show : styles.hide
              }`}
            >
              {showAnswers ? "Hide Answers" : "Show Answers"}
            </button>
          </div>

          <div className={styles.previewBox}>
            {readingQuestion ? (
              <ExamMarkdownRenderer
                markdown={readingQuestion}
                showAnswers={showAnswers}
              />
            ) : (
              <p className={styles.placeholder}>
                Type markdown question to preview...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
