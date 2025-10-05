import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Authenciation/Login.jsx";
import Home from "./Pages/Home/Home.jsx";
import Dictionary from "./Pages/Dictionary/Dictionary.jsx";
import Forum from "./Pages/Forum/Forum.jsx";
import CreatePost from "./Pages/Forum/CreatePost.jsx";
import EditPost from "./Pages/Forum/EditPost.jsx";
import PostDetail from "./Pages/Forum/PostDetail.jsx";
import Profile from "./Pages/Profile/Profile.jsx";
import ExamManagement from "./Pages/Admin/ExamManagement.jsx";
import AddReading from "./Pages/Admin/AddReading.jsx";
import AdminDashboard from "./Pages/Admin/AdminDashBoard.jsx"; // ⚡ import admin dashboard

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/home" element={<Home />} />
        <Route path="/dictionary" element={<Dictionary />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/edit-post/:postId" element={<EditPost />} />
        <Route path="/post/:postId" element={<PostDetail />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/exam" element={<ExamManagement />} />
        <Route path="/admin/exam/add-reading" element={<AddReading />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
