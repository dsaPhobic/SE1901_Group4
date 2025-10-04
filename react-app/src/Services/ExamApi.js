// src/services/examService.js
import axios from "axios";

const API = axios.create({
  baseURL: "/api/exams",
  withCredentials: true,
});

// Get exam by id
export function getById(id) {
  return API.get(`/${id}`);
}

// Create new exam
export function add(data) {
  return API.post("", data);
}

// Update exam info
export function update(id, data) {
  return API.put(`/${id}`, data);
}

// Delete exam
export function remove(id) {
  return API.delete(`/${id}`);
}

// Lấy tất cả attempt theo userId
export function getExamAttemptsByUser(userId) {
  return API.get(`/user/${userId}`);
}

// Lấy chi tiết 1 attempt
export function getExamAttemptDetail(attemptId) {
  return API.get(`/${attemptId}`);
}

// Lấy danh sách ngày đã submit (chỉ trả về yyyy-MM-dd)
export function getSubmittedDays(userId) {
  return getExamAttemptsByUser(userId).then((res) =>
    res.data
      .filter((a) => a.submittedAt)
      .map((a) => new Date(a.submittedAt).toISOString().split("T")[0])
  );
}
