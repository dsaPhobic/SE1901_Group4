import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as listeningService from "../../Services/ListeningApi";
import { uploadAudio } from "../../Services/UploadApi"; // your provided function
import ExamMarkdownRenderer, {
  renderMarkdownToHtmlAndAnswers,
} from "../../Components/Exam/ExamMarkdownRenderer.jsx";
import styles from "./AddListening.module.css";
import {
  Music,
  Upload,
  Pencil,
  PlusCircle,
  FileAudio,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react";

export default function AddListening() {
  const location = useLocation();
  const navigate = useNavigate();
  const exam = location.state?.exam;
  const skill = location.state?.skill;

  const [audioUrl, setAudioUrl] = useState(skill?.audioUrl || "");
  const [listeningQuestion, setListeningQuestion] = useState("");
  const [status, setStatus] = useState({ icon: null, message: "" });
  const [showAnswers, setShowAnswers] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Load data if editing
  useEffect(() => {
    if (skill) {
      setAudioUrl(skill.audioUrl || "");
      setListeningQuestion(skill.listeningQuestion || "");
    }
  }, [skill]);

  // ====== Upload Audio ======
  const handleUploadAudio = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setStatus({ icon: <Upload size={16} />, message: "Uploading audio..." });

    try {
      const url = await uploadAudio(file);
      setAudioUrl(url);
      setStatus({
        icon: <CheckCircle color="green" size={16} />,
        message: "Audio uploaded successfully!",
      });
    } catch (err) {
      console.error(err);
      setStatus({
        icon: <XCircle color="red" size={16} />,
        message: "Failed to upload audio.",
      });
    } finally {
      setUploading(false);
    }
  };

  // ====== Submit Listening Question ======
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ icon: <FileAudio size={16} />, message: "Processing..." });

    try {
      const { html, answers } = renderMarkdownToHtmlAndAnswers(listeningQuestion);
      const payload = {
        examId: exam.examId,
        audioUrl,
        listeningQuestion,
        listeningType: "Markdown",
        displayOrder: skill?.displayOrder || 1,
        correctAnswer: JSON.stringify(answers),
        questionHtml: html,
      };

      if (skill) {
        await listeningService.update(skill.listeningId, payload);
        setStatus({
          icon: <CheckCircle color="green" size={16} />,
          message: "Updated successfully!",
        });
      } else {
        await listeningService.add(payload);
        setStatus({
          icon: <CheckCircle color="green" size={16} />,
          message: "Added successfully!",
        });
      }

      setTimeout(() => navigate(-1), 1000);
    } catch (err) {
      console.error(err);
      setStatus({
        icon: <XCircle color="red" size={16} />,
        message: "Failed to save question.",
      });
    }
  };

  return (
    <div className={styles.container}>
      {/* ===== Header ===== */}
      <header className={styles.header}>
        <h2>
          <Music size={22} style={{ marginRight: 6 }} />
          {skill ? (
            <>
              <Pencil size={18} style={{ marginRight: 6 }} /> Edit Listening for{" "}
              {exam?.examName}
            </>
          ) : (
            <>
              <PlusCircle size={18} style={{ marginRight: 6 }} /> Add Listening for{" "}
              {exam?.examName}
            </>
          )}
        </h2>
      </header>

      {/* ===== Grid Layout ===== */}
      <div className={styles.grid}>
        {/* ===== Left: Form ===== */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.group}>
            <label>Upload Audio File</label>
            <label className={styles.uploadBox}>
              <Upload size={24} className={styles.uploadIcon} />
              <span className={styles.uploadText}>
                {uploading
                  ? "Uploading..."
                  : "Click to upload or drag & drop audio file"}
              </span>
              <input
                type="file"
                accept="audio/*"
                onChange={handleUploadAudio}
                disabled={uploading}
              />
            </label>

            {audioUrl && (
              <audio controls src={audioUrl} className={styles.audioPreview} />
            )}
          </div>

          <div className={styles.group}>
            <label>Question (Markdown)</label>
            <textarea
              value={listeningQuestion}
              onChange={(e) => setListeningQuestion(e.target.value)}
              rows={10}
              placeholder="[!num] Question text here..."
            />
          </div>

          <div className={styles.buttons}>
            <button type="submit" className={styles.btnPrimary}>
              {skill ? (
                <>
                  <Pencil size={16} style={{ marginRight: 6 }} /> Update Question
                </>
              ) : (
                <>
                  <PlusCircle size={16} style={{ marginRight: 6 }} /> Add Question
                </>
              )}
            </button>
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={16} style={{ marginRight: 6 }} /> Back
            </button>
          </div>

          {status.message && (
            <p className={styles.status}>
              {status.icon}
              <span style={{ marginLeft: 6 }}>{status.message}</span>
            </p>
          )}
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
              {showAnswers ? (
                <>
                  <EyeOff size={14} style={{ marginRight: 4 }} /> Hide Answers
                </>
              ) : (
                <>
                  <Eye size={14} style={{ marginRight: 4 }} /> Show Answers
                </>
              )}
            </button>
          </div>

          <div className={styles.previewBox}>
            {listeningQuestion ? (
              <ExamMarkdownRenderer
                markdown={listeningQuestion}
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
