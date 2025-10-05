import React from "react";
import Sidebar from "../../Components/Admin/AdminNavbar.jsx";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  BarChart2,
  Settings,
  MessageCircle,
  DollarSign,
} from "lucide-react";
import "./AdminDashboard.css"; 

export default function AdminDashboard() {
  const adminMenu = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/admin/dashboard" },
    { icon: <Users size={20} />, label: "Users", path: "/admin/users" },
    { icon: <BookOpen size={20} />, label: "Exams", path: "/admin/exams" },
    { icon: <FileText size={20} />, label: "Posts", path: "/admin/posts" },
    { icon: <DollarSign size={20} />, label: "Transactions", path: "/admin/transactions" },
    { icon: <MessageCircle size={20} />, label: "Feedback", path: "/admin/feedback" },
    { icon: <Settings size={20} />, label: "Settings", path: "/admin/settings" },
  ];

  return (
    <div className="admin-container">
      <Sidebar menuItems={adminMenu} />

      <main className="admin-main">
        <h1 className="admin-title">
          <LayoutDashboard size={28} style={{ marginRight: "8px" }} />
          Admin Dashboard
        </h1>
      </main>
    </div>
  );
}
