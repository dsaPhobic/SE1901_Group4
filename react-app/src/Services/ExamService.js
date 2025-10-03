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
