import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as readingService from "../../Services/ReadingApi";
import ExamMarkdownRenderer from "../../Components/Exam/ExamMarkdownRenderer.jsx";
import "./AddReading.css";

export default function AddReading() {
  const location = useLocation();
  const navigate = useNavigate();

  const exam = location.state?.exam;
  const skill = location.state?.skill; // if present → edit mode

  const [readingContent, setReadingContent] = useState("");
  const [readingQuestion, setReadingQuestion] = useState("");
  const [status, setStatus] = useState("");

  // If editing, prefill inputs
  useEffect(() => {
    if (skill) {
      setReadingContent(skill.readingContent || "");
      setReadingQuestion(skill.readingQuestion || "");
    }
  }, [skill]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Submitting...");

    try {
      if (skill) {
        // 🔹 Edit Mode
        const payload = {
          readingContent,
          readingQuestion,
          readingType: "Markdown",
          displayOrder: skill.displayOrder || 1,
          correctAnswer: skill.correctAnswer,
          questionHtml: skill.questionHtml,
        };

        await readingService.update(skill.readingId, payload);
        setStatus("✅ Updated question successfully");
      } else {
        // 🔹 Add Mode
        const payload = {
          examId: exam.examId,
          readingContent,
          readingQuestion,
          readingType: "Markdown",
          displayOrder: 1,
          correctAnswer: null,
          questionHtml: null,
        };

        await readingService.add(payload);
        setStatus("✅ Added question successfully");
      }

      // Return to ExamManagement after save
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
          ? `Edit Question for ${exam?.examName}`
          : `Add Question for ${exam?.examName}`}
      </h2>

      <div className="reading-grid">
        {/* ===== Left: Input Form ===== */}
        <form onSubmit={handleSubmit} className="exam-form">
          <div className="form-group">
            <label>Passage / Content</label>
            <textarea
              value={readingContent}
              onChange={(e) => setReadingContent(e.target.value)}
              placeholder="Enter passage or supporting content here..."
              rows={6}
            />
          </div>

          <div className="form-group">
            <label>Question (Markdown Format)</label>
            <textarea
              value={readingQuestion}
              onChange={(e) => setReadingQuestion(e.target.value)}
              placeholder="Write passage questions here..."
              rows={8}
            />
          </div>

          <button type="submit" className="start-quiz-btn">
            {skill ? "Update Question" : "Add Question"}
          </button>

          <button
            type="button"
            className="start-quiz-btn"
            style={{ backgroundColor: "gray", marginTop: "10px" }}
            onClick={() => navigate(-1)}
          >
            Back
          </button>

          {status && <p className="status">{status}</p>}
        </form>

        {/* ===== Right: Live Preview ===== */}
        <div className="preview-panel">
          <h3>Preview</h3>
          <div className="preview-box">
            {readingQuestion ? (
              <ExamMarkdownRenderer markdown={readingQuestion} />
            ) : (
              <p style={{ opacity: 0.6 }}>Type a question to see preview...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
