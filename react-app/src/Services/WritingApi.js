import axios from "axios";

const API = axios.create({
  baseURL: "/api/writing",
  withCredentials: true,
});

export function getByExam(examId) {
  return API.get(`/exam/${examId}`).then((res) => res.data);
}

export function getById(id) {
  return API.get(`/${id}`).then((res) => res.data);
}

export function create(data) {
  return API.post("", data).then((res) => res.data);
}

export function update(id, data) {
  return API.put(`/${id}`, data).then((res) => res.data);
}

export function remove(id) {
  return API.delete(`/${id}`);
}

export function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  return axios
    .post("/api/upload/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data.url);
}

export function attachImageToWriting(writingId, file) {
  return uploadImage(file)
    .then((url) => update(writingId, { imageUrl: url }))
    .then((res) => res);
}
