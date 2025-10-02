import axios from "axios";

// Tạo instance riêng cho word API
const API = axios.create({
  baseURL: "/api/words",
  withCredentials: true,
});

// GET api/word/5
export function getById(id) {
  return API.get(`/${id}`);
}

// GET api/word/name/{term}
export function getByName(term) {
  return API.get(`/name/${encodeURIComponent(term)}`);
}

// GET api/word/search?keyword=abc
export function search(keyword) {
  return API.get(`/search`, { params: { keyword } });
}

// POST api/word
export function add(data) {
  return API.post("", data);
}

// PUT api/word/5
export function update(id, data) {
  return API.put(`/${id}`, data);
}

// DELETE api/word/5
export function remove(id) {
  return API.delete(`/${id}`);
}
// GET api/word/lookup/{term}
export function lookup(term) {
  return API.get(`/${encodeURIComponent(term)}/lookup`);
}