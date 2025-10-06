import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AdminNavbar from "../../Components/Admin/AdminNavbar";
import * as WritingApi from "../../Services/WritingApi";
import * as UploadApi from "../../Services/UploadApi";
import styles from "./AddWriting.module.css";
import {
    FileText,
    CheckCircle,
    XCircle,
    Upload,
    Image as ImageIcon,
} from "lucide-react";

const AddWriting = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const exam = location.state?.exam;

    const [form, setForm] = useState({
        examId: exam?.examId ?? "",
        writingQuestion: "",
        writingType: "Task 1",
        displayOrder: 1,
        imageUrl: "",
    });

    const [status, setStatus] = useState({ icon: null, message: "" });
    const [uploading, setUploading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setStatus({ icon: null, message: "Uploading image..." });

        UploadApi.uploadImage(file)
            .then((res) => {
                setForm({ ...form, imageUrl: res.url });
                setStatus({
                    icon: <CheckCircle color="green" size={18} />,
                    message: "✅ Image uploaded successfully!",
                });
            })
            .catch((err) => {
                console.error(err);
                setStatus({
                    icon: <XCircle color="red" size={18} />,
                    message: "❌ Failed to upload image.",
                });
            })
            .finally(() => setUploading(false));
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

        WritingApi.create(form)
            .then(() => {
                setStatus({
                    icon: <CheckCircle color="green" size={18} />,
                    message: "✅ Writing question added successfully!",
                });
                setForm({
                    ...form,
                    writingQuestion: "",
                    imageUrl: "",
                    displayOrder: form.displayOrder + 1,
                });
            })
            .catch((err) => {
                console.error(err);
                setStatus({
                    icon: <XCircle color="red" size={18} />,
                    message: "❌ Failed to add writing question.",
                });
            });
    };

    return (

            <div className={styles.splitLayout}>
                <AdminNavbar />
                <div className={styles.leftPanel}>
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

                        {/* Upload Button */}
                        <div className={styles.group}>
                            <label>Attach Image (optional)</label>
                            <div className={styles.uploadBox}>
                                <input
                                    type="file"
                                    id="upload"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                />
                                <label htmlFor="upload" className={styles.uploadLabel}>
                                    <Upload size={18} />
                                    {uploading ? "Uploading..." : "Choose Image"}
                                </label>
                            </div>
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

                {/* Right side: Preview */}
                <div className={styles.rightPanel}>
                    <h3>
                        <ImageIcon size={18} style={{ marginRight: 6 }} />
                        Preview
                    </h3>
                    {form.imageUrl ? (
                        <img
                            src={form.imageUrl}
                            alt="Preview"
                            className={styles.previewImage}
                        />
                    ) : (
                        <p className={styles.placeholder}>No image uploaded yet.</p>
                    )}
                    <div className={styles.previewText}>
                        <h4>Writing Question Preview</h4>
                        <p>{form.writingQuestion || "(Question content will appear here)"}</p>
                    </div>
                </div>
            </div>
    );
};

export default AddWriting;
