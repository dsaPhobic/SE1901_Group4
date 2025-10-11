import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatTimeVietnam } from "../../utils/date";
import * as examService from "../../Services/ExamApi";
import * as readingService from "../../Services/ReadingApi";
import * as listeningService from "../../Services/ListeningApi";
import * as writingService from "../../Services/WritingApi";
import ExamSkillModal from "../../Components/Admin/ExamPopup.jsx";
import Sidebar from "../../Components/Admin/AdminNavbar.jsx";
import styles from "./ExamManagement.module.css";

export default function ExamManagement() {
  const [examName, setExamName] = useState("");
  const [examType, setExamType] = useState("Reading");
  const [exams, setExams] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [status, setStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // ====== Service mapping ======
  const serviceMap = {
    Reading: readingService,
    Listening: listeningService,
    Writing: writingService,
  };

  // ====== Load exams ======
  const fetchExams = async () => {
    try {
      const list = await examService.getAll();
      setExams(list);
    } catch (err) {
      console.error("❌ Failed to fetch exams:", err);
      setExams([]);
    }
  };

  // ====== Load skills for an exam ======
  const fetchSkills = async (examId, type) => {
    const service = serviceMap[type];
    if (!service) return console.error("⚠️ Unknown exam type:", type);

    try {
      const list = await service.getByExam(examId);
      setSkills(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error(`❌ Failed to fetch ${type} skills:`, err);
      setSkills([]);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  // ====== Create exam ======
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Submitting...");

    try {
      const created = await examService.add({ examName, examType });
      setStatus(`✅ Created exam "${created.examName}"`);
      setExamName("");
      fetchExams();
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to create exam");
    }
  };

  // ====== Manage exam ======
  const handleManageClick = (exam) => {
    setSelectedExam(exam);
    setShowModal(true);
    fetchSkills(exam.examId, exam.examType);
  };

  // ====== Determine path ======
  const getExamPath = (type) => {
    const map = {
      Reading: "add-reading",
      Listening: "add-listening",
      Writing: "add-writing",
    };
    return map[type] || "";
  };

  // ====== Add skill ======
  const handleAddSkill = () => {
    if (!selectedExam) return;
    const path = getExamPath(selectedExam.examType);
    if (!path) return alert("⚠️ Unknown exam type");
    navigate(path, { state: { exam: selectedExam } });
  };

  // ====== Edit skill ======
  const handleEditSkill = (skill) => {
    if (!selectedExam) return;
    const path = getExamPath(selectedExam.examType);
    if (!path) return alert("⚠️ Unknown exam type");
    navigate(path, { state: { exam: selectedExam, skill } });
  };

  // ====== Delete skill ======
  const handleDeleteSkill = async (skillId) => {
    if (!window.confirm("Are you sure you want to delete this question?"))
      return;

    const service = serviceMap[selectedExam.examType];
    if (!service) return;

    try {
      await service.remove(skillId);
      fetchSkills(selectedExam.examId, selectedExam.examType);
    } catch (err) {
      console.error("❌ Failed to delete skill:", err);
    }
  };

  return (
    <>
      <Sidebar />
      <main className="admin-main">
        <div className={styles.dashboard}>
          {/* ===== Header ===== */}
          <header className={styles.header}>
            <h2>📚 Exam Management</h2>
            <button className={styles.exportBtn}>⬇️ Export CSV</button>
          </header>

          {/* ===== Create Exam ===== */}
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
                </select>
              </div>

              <button type="submit" className={styles.btnPrimary}>
                + Create Exam
              </button>
            </form>
            {status && <p className={styles.status}>{status}</p>}
          </section>

          {/* ===== Exam List ===== */}
          <section className={styles.card}>
            <h3>Existing Exams</h3>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Created At</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {exams.length ? (
                    exams.map((exam) => (
                      <tr key={exam.examId}>
                        <td>{exam.examId}</td>
                        <td>{exam.examName}</td>
                        <td>{exam.examType}</td>
                        <td>
                          {exam.createdAt
                            ? formatTimeVietnam(exam.createdAt)
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

          {/* ===== Modal ===== */}
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
