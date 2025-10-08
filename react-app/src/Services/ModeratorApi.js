import axios from "axios";

const API = axios.create({
  baseURL: "/api/moderator",
  withCredentials: true,
});

// Dashboard stats
export function getModeratorStats() {
  return API.get("/stats");
}

// Posts management
export function getPendingPosts(page = 1, limit = 10) {
  return API.get(`/posts/pending?page=${page}&limit=${limit}`);
}

export function getReportedPosts(page = 1, limit = 10) {
  return API.get(`/posts/reported?page=${page}&limit=${limit}`);
}

export function getRejectedPosts(page = 1, limit = 10) {
  return API.get(`/posts/rejected?page=${page}&limit=${limit}`);
}

// Post actions
export function approvePost(postId) {
  return API.post(`/posts/${postId}/approve`);
}

export function rejectPost(postId, reason) {
  return API.post(`/posts/${postId}/reject`, { Reason: reason });
}

export function getPostDetail(postId) {
  return API.get(`/posts/${postId}`);
}

// Users management
export function getUsers(page = 1, limit = 10) {
  return API.get(`/users?page=${page}&limit=${limit}`);
}

export function getUserStats(userId) {
  return API.get(`/users/${userId}/stats`);
}

// Chart data
export function getPostsChartData(month, year) {
  return API.get(`/chart/posts?month=${month}&year=${year}`);
}

// Notifications
export function getNotifications() {
  return API.get("/notifications");
}

export function markNotificationAsRead(notificationId) {
  return API.put(`/notifications/${notificationId}/read`);
}
