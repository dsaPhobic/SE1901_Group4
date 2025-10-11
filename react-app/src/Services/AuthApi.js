import axios from "axios";

const API = axios.create({
  baseURL: "https://localhost:7264/api/auth",
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
  window.location.href = "https://localhost:7264/api/auth/google/login";
}

export function forgotPassword(email) {
  return API.post("/forgot-password", { email });
}

export function verifyOtp(email, otpCode) {
  return API.post("/verify-otp", { email, otpCode });
}

export function resetPassword(email, resetToken, newPassword, confirmPassword) {
  return API.post("/reset-password", { 
    email, 
    resetToken, 
    newPassword, 
    confirmPassword 
  });
}
