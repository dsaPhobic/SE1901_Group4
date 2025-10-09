import axios from "axios";

export function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  return axios
    .post("/api/upload/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data.url);
}


export function uploadAudio(file) {
  const formData = new FormData();
  formData.append("file", file);

  return axios
    .post("/api/upload/audio", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data.url);
}