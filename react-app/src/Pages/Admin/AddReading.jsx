import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as readingService from "../../Services/ReadingApi";
import ExamMarkdownRenderer, {
  renderMarkdownToHtmlAndAnswers,
} from "../../Components/Exam/ExamMarkdownRenderer.jsx";
import "./AddReading.css";

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
      // Convert markdown into HTML + correct answers
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
    <div className="dictionary-container">
      <h2>
        {skill
          ? `Edit Reading for ${exam?.examName}`
          : `Add Reading for ${exam?.examName}`}
      </h2>

      <div className="reading-grid">
        {/* ===== Left: Input Form ===== */}
        <form onSubmit={handleSubmit} className="exam-form">
          <div className="form-group">
            <label>Passage / Content</label>
            <textarea
              value={readingContent}
              onChange={(e) => setReadingContent(e.target.value)}
              rows={6}
            />
          </div>

          <div className="form-group">
            <label>Question (Markdown)</label>
            <textarea
              value={readingQuestion}
              onChange={(e) => setReadingQuestion(e.target.value)}
              rows={10}
            />
          </div>

          <div className="button-row">
            <button type="submit" className="start-quiz-btn">
              {skill ? "Update Question" : "Add Question"}
            </button>

            <button
              type="button"
              className="start-quiz-btn"
              style={{ backgroundColor: "#6b7280" }}
              onClick={() => navigate(-1)}
            >
              Back
            </button>
          </div>

          {status && <p className="status">{status}</p>}
        </form>

        {/* ===== Right: Live Preview ===== */}
        <div className="preview-panel">
          <div className="preview-header">
            <h3>Preview</h3>
            <button
              onClick={() => setShowAnswers((v) => !v)}
              className="start-quiz-btn"
              style={{
                backgroundColor: showAnswers ? "#f97316" : "#10b981",
                fontSize: "0.9rem",
                padding: "0.5rem 0.8rem",
              }}
            >
              {showAnswers ? "Hide Answers" : "Show Answers"}
            </button>
          </div>

          <div className="preview-box">
            {readingQuestion ? (
              <ExamMarkdownRenderer
                markdown={readingQuestion}
                showAnswers={showAnswers}
              />
            ) : (
              <p style={{ opacity: 0.6 }}>Type question to preview...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
