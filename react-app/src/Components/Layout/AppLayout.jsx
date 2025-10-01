import React from "react";
import Sidebar from "./SlideBar";
import HeaderBar from "./HeaderBar";
import "./layout.css";

export default function AppLayout({ title, children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        <HeaderBar title={title} />
        {children}
      </main>
    </div>
  );
}
