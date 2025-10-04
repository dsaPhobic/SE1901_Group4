import axios from "axios";

const API = axios.create({
  baseURL: "/api/reading",
  withCredentials: true,
});

export function add(data) {
  return API.post("", data);
}

export function update(id, data) {
  return API.put(`/${id}`, data);
}

export function getByExam(examId) {
  return API.get(`/exam/${examId}`);
}
