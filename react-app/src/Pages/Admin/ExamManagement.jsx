import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as examService from "../../Services/ExamApi";
import * as readingService from "../../Services/ReadingApi";
import "./AddReading.css";
import "./ExamManagement.css";

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
      setExams(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSkills = async (examId) => {
    try {
      const res = await readingService.getByExam(examId);
      setSkills(res.data);
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
      setStatus(`✅ Created exam with id ${res.data.examId}`);
      setExamName("");
      fetchExams();
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to create exam");
    }
  };

  const handleManageClick = async (exam) => {
    setSelectedExam(exam);
    await fetchSkills(exam.examId);
    setShowModal(true);
  };

  // 🔹 Add Skill: navigate to AddReading page
  const handleAddSkill = (exam) => {
    navigate("add-reading", { state: { exam } });
  };

  // 🔹 Edit Skill
  const handleEditSkill = (skill) => {
    navigate("add-reading", { state: { exam: selectedExam, skill } });
  };

  // 🔹 Delete Skill
  const handleDeleteSkill = async (skillId) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;
    try {
      await readingService.remove(skillId);
      await fetchSkills(selectedExam.examId); // refresh list
    } catch (err) {
      console.error("Failed to delete skill:", err);
      alert("❌ Failed to delete skill");
    }
  };

  return (
    <div className="dictionary-container">
      <h2>Exam Management</h2>

      <form onSubmit={handleSubmit} className="exam-form">
        <label>Exam Name</label>
        <input
          type="text"
          value={examName}
          onChange={(e) => setExamName(e.target.value)}
          placeholder="Enter exam name..."
          required
        />

        <label>Exam Type</label>
        <select value={examType} onChange={(e) => setExamType(e.target.value)}>
          <option value="Reading">Reading</option>
          <option value="Listening">Listening</option>
          <option value="Writing">Writing</option>
          <option value="Speaking">Speaking</option>
        </select>

        <button type="submit" className="start-quiz-btn">
          Create Exam
        </button>
        {status && <p className="status">{status}</p>}
      </form>

      <h3 style={{ marginTop: "30px" }}>Existing Exams</h3>
      <table className="dictionary-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Exam Name</th>
            <th>Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {exams.map((exam) => (
            <tr key={exam.examId}>
              <td>{exam.examId}</td>
              <td>{exam.examName}</td>
              <td>{exam.examType}</td>
              <td>
                <button
                  className="start-quiz-btn"
                  onClick={() => handleManageClick(exam)}
                >
                  Manage
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ===== Modal ===== */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Manage Skills for {selectedExam?.examName}</h3>

            {skills.length > 0 ? (
              skills.map((s, i) => (
                <div key={s.readingId} className="skill-item">
                  <p>{s.readingQuestion}</p>
                  <div className="modal-buttons">
                    <button className="edit" onClick={() => handleEditSkill(s)}>
                      ✏️ Edit
                    </button>
                    <button
                      className="delete"
                      onClick={() => handleDeleteSkill(s.readingId)}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ opacity: 0.7 }}>No skills linked yet.</p>
            )}

            <button
              className="add-skill-btn"
              onClick={() => handleAddSkill(selectedExam)}
            >
              ➕ Add Skill
            </button>

            <button className="close-btn" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
