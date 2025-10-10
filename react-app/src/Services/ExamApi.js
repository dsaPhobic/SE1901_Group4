// src/services/examService.js
import axios from "axios";

const API = axios.create({
  baseURL: "/api/exam",
  withCredentials: true,
});

const normalizeExam = (e) => ({
  examId: e.examId ?? e.ExamId,
  examName: e.examName ?? e.ExamName,
  examType: e.examType ?? e.ExamType,
  createdAt: e.createdAt ?? e.CreatedAt,
});

// ====== EXAMS ======
export function getById(id) {
  return API.get(`/${id}`).then((res) => normalizeExam(res.data));
}

export function getAll() {
  return API.get("").then((res) => {
    const list = Array.isArray(res.data)
      ? res.data.map(normalizeExam)
      : [];
    return list;
  });
}

export function add(data) {
  return API.post("", data).then((res) => normalizeExam(res.data));
}

export function update(id, data) {
  return API.put(`/${id}`, data).then((res) => normalizeExam(res.data));
}

export function remove(id) {
  return API.delete(`/${id}`);
}

// ====== ATTEMPTS ======
export function getExamAttemptsByUser(userId) {
  return API.get(`/user/${userId}`).then((res) => res.data);
}

export function getExamAttemptDetail(attemptId) {
  return API.get(`/attempt/${attemptId}`).then((res) => res.data);
}

export function submitAttempt(attempt) {
  return API.post("/submit", attempt, {
    headers: { "Content-Type": "application/json" },
  });
}

export function getSubmittedDays(userId) {
  return getExamAttemptsByUser(userId).then((attempts) =>
    attempts
      .filter((a) => a.submittedAt)
      .map((a) => new Date(a.submittedAt).toISOString().split("T")[0])
  );
}
