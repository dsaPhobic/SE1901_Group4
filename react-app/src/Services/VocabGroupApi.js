import axios from "axios";

const API = axios.create({
  baseURL: "/api/vocabgroups",
  withCredentials: true,
});
export function getById(id) {
  return API.get(`/${id}`);
}
export function getByUser(userId) {
  return API.get(`/user/${userId}`);
}
export function getByName(userId, groupName) {
  return API.get(`/user/${userId}/name/${groupName}`);
}
export function countWords(groupId) {
  return API.get(`/${groupId}/count`);
}
export function Add(data) {
  return API.post("", data);
}
export function update(id, data) {
  return API.put(`/${id}`, data);
}

// Xóa group
export function remove(id) {
  return API.delete(`/${id}`);
}
