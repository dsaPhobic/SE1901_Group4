import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as examService from "../../Services/ExamApi";
import * as readingService from "../../Services/ReadingApi";
import ExamSkillModal from "../../Components/Admin/ExamPopup.jsx";
import styles from "./ExamManagement.module.css";

const normalizeExam = (e) => ({
  examId: e.examId ?? e.ExamId,
  examName: e.examName ?? e.ExamName,
  examType: e.examType ?? e.ExamType,
  createdAt: e.createdAt ?? e.CreatedAt,
});

const normalizeReading = (r) => ({
  readingId: r.readingId ?? r.ReadingId,
  examId: r.examId ?? r.ExamId,
  readingContent: r.readingContent ?? r.ReadingContent ?? "",
  readingQuestion: r.readingQuestion ?? r.ReadingQuestion ?? "",
  readingType: r.readingType ?? r.ReadingType ?? "",
  displayOrder: r.displayOrder ?? r.DisplayOrder ?? 1,
  correctAnswer: r.correctAnswer ?? r.CorrectAnswer ?? null,
  questionHtml: r.questionHtml ?? r.QuestionHtml ?? null,
});

export default function ExamManagement() {
  const [examName, setExamName] = useState("");
  const [examType, setExamType] = useState("Reading");
  const [exams, setExams] = useState([]);
  const [status, setStatus] = useState("");
  const [selectedExam, setSelectedExam] = useState(null);
  const [skills, setSkills] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const fetchExams = async () => {
    try {
      const res = await examService.getAll();
      const list = Array.isArray(res.data) ? res.data.map(normalizeExam) : [];
      setExams(list);
    } catch (err) {
      console.error(err);
      setExams([]);
    }
  };

  const fetchSkills = async (examId) => {
    try {
      const res = await readingService.getByExam(examId);
      const list = Array.isArray(res.data)
        ? res.data.map(normalizeReading)
        : [];
      setSkills(list);
    } catch (err) {
      console.error(err);
      setSkills([]);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Submitting...");
    try {
      const res = await examService.add({ examName, examType });
      const created = normalizeExam(res.data ?? {});
      setStatus(`✅ Created exam "${created.examName ?? examName}"`);
      setExamName("");
      await fetchExams();
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to create exam");
    }
  };

  const handleManageClick = async (exam) => {
    const norm = normalizeExam(exam);
    setSelectedExam(norm);
    await fetchSkills(norm.examId);
    setShowModal(true);
  };

  const handleEditSkill = (skillNorm) => {
    navigate(`add-reading`, {
      state: { exam: selectedExam, skill: skillNorm },
    });
  };

  const handleDeleteSkill = async (readingId) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      await readingService.remove(readingId);
      await fetchSkills(selectedExam.examId);
    } catch (err) {
      console.error("❌ Failed to delete skill:", err);
    }
  };

  const handleAddSkill = () => {
    navigate(`add-reading`, {
      state: { exam: selectedExam },
    });
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h2>📚 Exam Management</h2>
        <button className={styles.exportBtn}>⬇️ Export CSV</button>
      </header>

      <section className={styles.card}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.group}>
            <label>Exam Name</label>
            <input
              type="text"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              placeholder="Enter exam name..."
              required
            />
          </div>

          <div className={styles.group}>
            <label>Exam Type</label>
            <select
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              required
            >
              <option value="Reading">Reading</option>
              <option value="Listening">Listening</option>
              <option value="Writing">Writing</option>
              <option value="Speaking">Speaking</option>
            </select>
          </div>

          <button type="submit" className={styles.btnPrimary}>
            + Create Exam
          </button>
        </form>
        {status && <p className={styles.status}>{status}</p>}
      </section>

      <section className={styles.card}>
        <h3>Existing Exams</h3>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Exam Name</th>
                <th>Type</th>
                <th>Date Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {exams.length > 0 ? (
                exams.map((exam) => (
                  <tr key={exam.examId}>
                    <td>{exam.examId}</td>
                    <td>{exam.examName}</td>
                    <td>{exam.examType}</td>
                    <td>
                      {exam.createdAt
                        ? new Date(exam.createdAt).toLocaleDateString()
                        : ""}
                    </td>
                    <td>
                      <button
                        className={styles.btnManage}
                        onClick={() => handleManageClick(exam)}
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", opacity: 0.6 }}>
                    No exams found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <ExamSkillModal
        show={showModal}
        exam={selectedExam}
        skills={skills}
        onClose={() => setShowModal(false)}
        onEdit={handleEditSkill}
        onDelete={handleDeleteSkill}
        onAddSkill={handleAddSkill}
      />
    </div>
  );
}
