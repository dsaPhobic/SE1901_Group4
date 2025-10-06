import axios from "axios";

const API = axios.create({
  baseURL: "/api/upload",
  withCredentials: true,
});

export function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  return API.post("/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then((res) => res.data);
}

export function uploadAudio(file) {
  const formData = new FormData();
  formData.append("file", file);

  return API.post("/audio", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then((res) => res.data);
}
