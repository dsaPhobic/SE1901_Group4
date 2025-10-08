import axios from "axios";

const API = axios.create({
  baseURL: "/api/notification",
  withCredentials: true,
});

export function getNotifications() {
  return API.get("/");
}

export function markAsRead(notificationId) {
  return API.put(`/${notificationId}/read`);
}

export function deleteNotification(notificationId) {
  return API.delete(`/${notificationId}`);
}


