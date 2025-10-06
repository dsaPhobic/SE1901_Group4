import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AdminNavbar from "../../Components/Admin/AdminNavbar";
import * as WritingApi from "../../Services/WritingApi";
import styles from "./AddWriting.module.css";
import { FileText, CheckCircle, XCircle } from "lucide-react";

const AddWriting = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const exam = location.state?.exam;
  const [form, setForm] = useState({
    examId: exam?.examId ?? "",
    writingQuestion: "",
    writingType: "Task 1",
    displayOrder: 1,
  });
  const [status, setStatus] = useState({ icon: null, message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.examId) {
      setStatus({
        icon: <XCircle color="red" size={18} />,
        message: "Exam ID is missing.",
      });
      return;
    }

    setStatus({ icon: null, message: "Submitting..." });

    WritingApi.add(form)
      .then(() => {
        setStatus({
          icon: <CheckCircle color="green" size={18} />,
          message: "Writing question added successfully!",
        });
        setForm({
          ...form,
          writingQuestion: "",
          displayOrder: form.displayOrder + 1,
        });
      })
      .catch((err) => {
        console.error(err);
        setStatus({
          icon: <XCircle color="red" size={18} />,
          message: "Failed to add writing question.",
        });
      });
  };

  return (
    <div className={styles.container}>
      <AdminNavbar />

      <div className={styles.card}>
        <h2>
          <FileText size={22} style={{ marginRight: 6 }} />
          Add Writing Question
        </h2>

        {exam && (
          <p className={styles.examInfo}>
            <strong>Exam:</strong> {exam.examName} ({exam.examType})
          </p>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
   
          {/* Writing Type */}
          <div className={styles.group}>
            <label>Writing Type</label>
            <select
              name="writingType"
              value={form.writingType}
              onChange={handleChange}
              required
            >
              <option value="Task 1">Task 1</option>
              <option value="Task 2">Task 2</option>
            </select>
          </div>

          {/* Display Order */}
          <div className={styles.group}>
            <label>Display Order</label>
            <input
              type="number"
              name="displayOrder"
              value={form.displayOrder}
              onChange={handleChange}
              min={1}
              required
            />
          </div>

          {/* Writing Question */}
          <div className={styles.group}>
            <label>Question Content</label>
            <textarea
              name="writingQuestion"
              value={form.writingQuestion}
              onChange={handleChange}
              placeholder="Enter question content or task description..."
              rows={8}
              required
            ></textarea>
          </div>

          <button type="submit" className={styles.btnPrimary}>
            Add Writing
          </button>
        </form>

        {status.message && (
          <p className={styles.status}>
            {status.icon}
            <span style={{ marginLeft: 6 }}>{status.message}</span>
          </p>
        )}

        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>
    </div>
  );
};

export default AddWriting;
