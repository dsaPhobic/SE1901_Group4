import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Authenciation/Login.jsx";
import Home from "./Pages/Home/Home.jsx";
import Dictionary from "./Pages/Dictionary/Dictionary.jsx"
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dictionary" element={<Dictionary />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
