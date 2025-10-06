// src/Services/ReadingApi.js
import axios from "axios";

// ✅ Normalizer (handles both PascalCase and camelCase from backend)
function normalizeReading(r) {
  return {
    readingId: r.readingId ?? r.ReadingId,
    examId: r.examId ?? r.ExamId,
    readingContent: r.readingContent ?? r.ReadingContent ?? "",
    readingQuestion: r.readingQuestion ?? r.ReadingQuestion ?? "",
    readingType: r.readingType ?? r.ReadingType ?? "",
    displayOrder: r.displayOrder ?? r.DisplayOrder ?? 1,
    createAt: r.createdAt ?? r.CreatedAt ?? null,
    correctAnswer: r.correctAnswer ?? r.CorrectAnswer ?? null,
    questionHtml: r.questionHtml ?? r.QuestionHtml ?? null,
  };
}

// ✅ Base axios instance
const API = axios.create({
  baseURL: "/api/reading",
  withCredentials: true,
});

// ✅ Get all readings
export function getAll() {
  return API.get("").then((res) => {
    const data = res.data;
    return Array.isArray(data) ? data.map(normalizeReading) : [];
  });
}

// ✅ Get all readings for a specific exam
export function getByExam(examId) {
  return API.get(`/exam/${examId}`).then((res) => {
    const data = res.data;
    return Array.isArray(data) ? data.map(normalizeReading) : [];
  });
}

// ✅ Get single reading by ID
export function getById(id) {
  return API.get(`/${id}`).then((res) => normalizeReading(res.data));
}

// ✅ Add a new reading
export function add(data) {
  return API.post("", data).then((res) => normalizeReading(res.data));
}

// ✅ Update a reading
export function update(id, data) {
  return API.put(`/${id}`, data).then((res) => normalizeReading(res.data));
}

// ✅ Delete a reading
export function remove(id) {
  return API.delete(`/${id}`);
}

// ✅ Export the normalizer (optional if other modules want to reuse it)
export { normalizeReading };
