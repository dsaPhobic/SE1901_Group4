import axios from "axios";

const API = axios.create({
  baseURL: "/api/DashBoard",
  withCredentials: true,
});

// Lấy tất cả attempt theo userId
export function getExamAttemptsByUser(userId) {
  return API.get(`/user/${userId}`);
}

// Lấy chi tiết 1 attempt
export function getExamAttemptDetail(attemptId) {
  return API.get(`/${attemptId}`);
}

// Lấy danh sách ngày đã submit (chỉ trả về yyyy-MM-dd)
export function getSubmittedDays(userId) {
  return getExamAttemptsByUser(userId).then((res) =>
    res.data
      .filter((a) => a.submittedAt)
      .map((a) => new Date(a.submittedAt).toISOString().split("T")[0])
  );
}
