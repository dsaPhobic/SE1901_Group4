import axios from "axios";

const API = axios.create({
  baseURL: "/api/auth",
  withCredentials: true,
});

export function register(data) {
  return API.post("/register", data);
}

export function login(data) {
  return API.post("/login", data);
}

export function logout() {
  return API.post("/logout");
}

export function getMe() {
  return API.get("/me");
}

export function loginWithGoogle() {
  window.location.href = "/api/auth/google/login";
}
