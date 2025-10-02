import axios from "axios";

const API = axios.create({
  baseURL: "/api/vocabgroups",
  withCredentials: true,
});

export function getById(id) {
  return API.get(`/${id}`);
}

export function getByUser(userId) {
  return axios.get(`/api/users/${userId}/vocabgroups`, { withCredentials: true });
}

export function getByName(userId, groupName) {
  return axios.get(
    `/api/users/${userId}/vocabgroups?name=${encodeURIComponent(groupName)}`,
    { withCredentials: true }
  );
}

export function countWords(groupId) {
  return API.get(`/${groupId}/words/count`);
}

export function Add(data) {
  return API.post("", data);
}

export function update(id, data) {
  return API.put(`/${id}`, data);
}

export function remove(id) {
  return API.delete(`/${id}`);
}

export function getWordsInGroup(groupId) {
  return API.get(`/${groupId}/words`);
}

export function removeWordFromGroup(groupId, wordId) {
  return API.delete(`/${groupId}/words/${wordId}`);
}

export function addWordToGroup(groupId, wordId) {
  return API.post(`/${groupId}/words/${wordId}`);
}
