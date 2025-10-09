import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Authenciation/Login.jsx";
import ForgotPassword from "./Pages/Authenciation/ForgotPassword.jsx";
import VerifyOtp from "./Pages/Authenciation/VerifyOtp.jsx";
import ResetPassword from "./Pages/Authenciation/ResetPassword.jsx";
import Home from "./Pages/Dashboard/DashboardUser.jsx";
import Dictionary from "./Pages/Dictionary/Dictionary.jsx";
import Forum from "./Pages/Forum/Forum.jsx";
import ReadingPage from "./Pages/Reading/ReadingPage.jsx";
import ListeningPage from "./Pages/Listening/ListeningPage.jsx";
import WritingPage from "./Pages/Writing/WritingPage.jsx";
import CreatePost from "./Pages/Forum/CreatePost.jsx";
import EditPost from "./Pages/Forum/EditPost.jsx";
import PostDetail from "./Pages/Forum/PostDetail.jsx";
import Profile from "./Pages/Profile/Profile.jsx";
import ExamManagement from "./Pages/Admin/ExamManagement.jsx";
import AdminDashboard from "./Pages/Admin/AdminDashBoard.jsx"; // ⚡ import admin dashboard
import AddReading from "./Pages/Admin/AddReading.jsx";
import AddListening from "./Pages/Admin/AddListening.jsx";
import AddWriting from "./Pages/Admin/AddWriting.jsx";
import ModeratorDashboard from "./Pages/Moderator/ModeratorDashboard.jsx"; // ⚡ import moderator dashboard
import AppWrapper from "./Components/Layout/AppWrapper.jsx";
import WritingTestPage from "./Pages/Writing/WritingTestPage.jsx"
import ReadingExamPage from "./Pages/Reading/ReadingExamPage.jsx";
function App() {
  return (
    <BrowserRouter>
      <AppWrapper>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/home" element={<Home />} />
          <Route path="/dictionary" element={<Dictionary />} />
          <Route path="/reading" element={<ReadingPage />} />
          <Route path="/listening" element={<ListeningPage />} />
          <Route path="/writing" element={<WritingPage />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/edit-post/:postId" element={<EditPost />} />
          <Route path="/post/:postId" element={<PostDetail />} />
          <Route path="/profile" element={<Profile />} />

          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/exam" element={<ExamManagement />} />
          <Route path="/admin/exam/add-reading" element={<AddReading />} />
          <Route path="/admin/exam/add-listening" element={<AddListening />} />
          <Route path="/admin/exam/add-writing" element={<AddWriting />} />
          <Route path="/writing/test" element={<WritingTestPage />} />
          <Route path="/reading/test" element={<ReadingExamPage />} />

          <Route path="/moderator/dashboard" element={<ModeratorDashboard />} />
        </Routes>
      </AppWrapper>
    </BrowserRouter>
  );
}

export default App;
