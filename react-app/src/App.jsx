import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Authenciation/Login.jsx";
import Home from "./Pages/Home/Home.jsx";
import Dictionary from "./Pages/Dictionary/Dictionary.jsx"
import Forum from "./Pages/Forum/Forum.jsx"
import CreatePost from "./Pages/Forum/CreatePost.jsx"
import PostDetail from "./Pages/Forum/PostDetail.jsx"
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dictionary" element={<Dictionary />} /> 
        <Route path="/forum" element={<Forum />} /> 
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/post/:postId" element={<PostDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
