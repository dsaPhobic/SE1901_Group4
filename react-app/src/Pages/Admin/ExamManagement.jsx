import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as examService from "../../Services/ExamApi";
import * as readingService from "../../Services/ReadingApi";
import ExamSkillModal from "../../Components/Admin/ExamPopup.jsx";
import styles from "./ExamManagement.module.css";
import Sidebar from "../../Components/Admin/AdminNavbar.jsx";

export default function ExamManagement() {
  const [examName, setExamName] = useState("");
  const [examType, setExamType] = useState("Reading");
  const [exams, setExams] = useState([]);
  const [status, setStatus] = useState("");
  const [selectedExam, setSelectedExam] = useState(null);
  const [skills, setSkills] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // ====== Load exams ======
  const fetchExams = () => {
    examService
      .getAll()
      .then((list) => setExams(list))
      .catch((err) => {
        console.error("❌ Failed to fetch exams:", err);
        setExams([]);
      });
  };

  // ====== Load skills for an exam ======
  const fetchSkills = (examId) => {
    readingService
      .getByExam(examId)
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : [];
        setSkills(list);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch skills:", err);
        setSkills([]);
      });
  };

  useEffect(() => {
    fetchExams();
  }, []);

  // ====== Create exam ======
  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("Submitting...");

    examService
      .add({ examName, examType })
      .then((created) => {
        setStatus(`✅ Created exam "${created.examName}"`);
        setExamName("");
        fetchExams();
      })
      .catch((err) => {
        console.error(err);
        setStatus("❌ Failed to create exam");
      });
  };

  // ====== Manage exam (open modal) ======
  const handleManageClick = (exam) => {
    setSelectedExam(exam);
    setShowModal(true);
    fetchSkills(exam.examId);
  };

  // ====== Determine path by exam type ======
  const getExamPath = (type) => {
    switch (type) {
      case "Reading":
        return "add-reading";
      case "Listening":
        return "add-listening";
      case "Writing":
        return "add-writing";
      case "Speaking":
        return "add-speaking";
      default:
        return "";
    }
  };

  // ====== Add skill ======
  const handleAddSkill = () => {
    if (!selectedExam) return;
    const path = getExamPath(selectedExam.examType);
    if (!path) {
      alert("⚠️ Unknown exam type");
      return;
    }
    navigate(path, { state: { exam: selectedExam } });
  };

  // ====== Edit skill ======
  const handleEditSkill = (skill) => {
    if (!selectedExam) return;
    const path = getExamPath(selectedExam.examType);
    if (!path) {
      alert("⚠️ Unknown exam type");
      return;
    }
    navigate(path, { state: { exam: selectedExam, skill } });
  };

  // ====== Delete skill ======
  const handleDeleteSkill = (readingId) => {
    if (!window.confirm("Are you sure you want to delete this question?"))
      return;

    readingService
      .remove(readingId)
      .then(() => fetchSkills(selectedExam.examId))
      .catch((err) => console.error("❌ Failed to delete skill:", err));
  };

  return (
    <>
      <Sidebar />
      <main className="admin-main">
        <div className={styles.dashboard}>
          {/* Header */}
          <header className={styles.header}>
            <h2>📚 Exam Management</h2>
            <button className={styles.exportBtn}>⬇️ Export CSV</button>
          </header>

          {/* Create Exam Section */}
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

          {/* Exam Table */}
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
                      <td
                        colSpan="5"
                        style={{ textAlign: "center", opacity: 0.6 }}
                      >
                        No exams found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Modal */}
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
      </main>
    </>
  );
}
