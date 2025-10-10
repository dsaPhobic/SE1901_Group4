import imageCompression from "browser-image-compression";
import { uploadImage } from "../Services/UploadApi";

export function compressAndUploadImage(file, options = {}) {
  if (!file) return Promise.reject(new Error("No file selected"));
  if (!file.type.startsWith("image/"))
    return Promise.reject(new Error("File is not an image"));
  if (file.size > 10 * 1024 * 1024)
    return Promise.reject(new Error("File size must be under 10MB"));

  const defaultOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 800,
    useWebWorker: true,
    ...options,
  };

  console.log(" Compressing image...");

  return imageCompression(file, defaultOptions)
    .then((compressedFile) => {
      console.log(
        ` Compressed from ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(
          compressedFile.size /
          1024 /
          1024
        ).toFixed(2)}MB`
      );
      return uploadImage(compressedFile);
    })
    .then((res) => res.url)
    .catch((err) => {
      console.error(" Error compressing/uploading image:", err);
      throw err;
    });
}

export function optimizeCloudinaryUrl(url, width = 800) {
  if (!url || typeof url !== "string" || !url.includes("/upload/")) return url;
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
}
