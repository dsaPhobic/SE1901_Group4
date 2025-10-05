import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as examService from "../../Services/ExamApi";
import * as readingService from "../../Services/ReadingApi";
import ExamSkillModal from "../../Components/Admin/ExamPopup.jsx";
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
      setStatus(`✅ Created exam "${examName}"`);
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

  const handleEditSkill = (skill) => {
    navigate(`/exam/${selectedExam.examId}/add-reading`, {
      state: { exam: selectedExam, skill },
    });
  };

  const handleDeleteSkill = async (readingId) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      await readingService.remove(readingId);
      fetchSkills(selectedExam.examId);
    } catch (err) {
      console.error("❌ Failed to delete skill:", err);
    }
  };

  const handleAddSkill = () => {
    navigate(`/exam/${selectedExam.examId}/add-reading`, {
      state: { exam: selectedExam },
    });
  };

  return (
    <div className="exam-dashboard">
      <div className="exam-header">
        <h2>Exam Management</h2>
        <button className="export-btn">Export CSV</button>
      </div>

      {/* Create Exam Section */}
      <div className="exam-card">
        <form onSubmit={handleSubmit} className="exam-form">
          <div className="form-group">
            <label>Exam Name</label>
            <input
              type="text"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              placeholder="Enter exam name..."
              required
            />
          </div>

          <div className="form-group">
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

          <button type="submit" className="btn-create">
            + Create Exam
          </button>
        </form>
        {status && <p className="status-text">{status}</p>}
      </div>

      {/* Exam Table */}
      <div className="exam-card">
        <h3>Existing Exams</h3>
        <div className="table-wrapper">
          <table className="exam-table">
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
                    <td>{new Date(exam.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn-manage"
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
      </div>

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
  );
}
