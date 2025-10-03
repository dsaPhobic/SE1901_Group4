import axios from "axios";

const API = axios.create({
  baseURL: "/api/forum",
  withCredentials: true,
});

// Posts API
export function getPosts(page = 1, limit = 10) {
  return API.get(`/posts?page=${page}&limit=${limit}`);
}

export function getPostsByFilter(filter, page = 1, limit = 10) {
  return API.get(`/posts/filter/${filter}?page=${page}&limit=${limit}`);
}

export function getPost(postId) {
  return API.get(`/posts/${postId}`);
}

export function createPost(postData) {
  return API.post("/posts", postData);
}

export function updatePost(postId, postData) {
  return API.put(`/posts/${postId}`, postData);
}

export function deletePost(postId) {
  return API.delete(`/posts/${postId}`);
}

export function votePost(postId) {
  return API.post(`/posts/${postId}/vote`);
}

export function unvotePost(postId) {
  return API.delete(`/posts/${postId}/vote`);
}

export function reportPost(postId, reason) {
  return API.post(`/posts/${postId}/report`, { reason });
}

// Comments API
export function getComments(postId) {
  return API.get(`/posts/${postId}/comments`);
}

export function createComment(postId, content, parentCommentId = null) {
  return API.post(`/posts/${postId}/comments`, {
    content,
    parentCommentId
  });
}

export function updateComment(commentId, content) {
  return API.put(`/comments/${commentId}`, { content });
}

export function deleteComment(commentId) {
  return API.delete(`/comments/${commentId}`);
}

export function likeComment(commentId) {
  return API.post(`/comments/${commentId}/like`);
}

export function unlikeComment(commentId) {
  return API.delete(`/comments/${commentId}/like`);
}

// Tags API
export function getTags() {
  return API.get("/tags");
}

export function createTag(tagName) {
  return API.post("/tags", { tagName });
}
