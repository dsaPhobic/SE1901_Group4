import axios from "axios";

const API = axios.create({
  baseURL: "api/users",
  withCredentials: true,
});

export function getProfile() {
  return API.get("/profile");
}

export function updateUser(id, data) {
  return API.put(`/${id}`, data);
}

export function deleteUser(id) {
  return API.delete(`/${id}`);
}
