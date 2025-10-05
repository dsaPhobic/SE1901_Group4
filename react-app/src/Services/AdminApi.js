import axios from "axios";

const API = axios.create({
  baseURL: "/api/admin",
  withCredentials: true,
});

export function registerAdmin(data) {
  return API.post("/register-admin", data);
}

export function grantRole(userId, role) {
  return API.put(`/grant/${userId}?role=${role}`);
}

export function getAllUsers() {
  return API.get("/users");
}

export function getUserById(userId) {
  return API.get(`/user/${userId}`);
}

export function getDashboardStats() {
  return API.get("/dashboard");
}

export function getSalesTrend() {
  return API.get("/dashboard/sales-trend");
}
