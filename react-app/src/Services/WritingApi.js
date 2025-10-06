import axios from "axios";

const API = axios.create({
  baseURL: "/api/writing",
  withCredentials: true,
});


export function getByExam(examId) {
  return API.get(`/exam/${examId}`);
}

export function getById(id) {
  return API.get(`/${id}`);
}

export function add(data) {
  return API.post("/", data);
}

export function update(id, data) {
  return API.put(`/${id}`, data);
}

export function remove(id) {
  return API.delete(`/${id}`);
}
