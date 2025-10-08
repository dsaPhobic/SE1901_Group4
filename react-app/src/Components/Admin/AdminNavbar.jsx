import React from "react";
import { NavLink } from "react-router-dom";
import { Cloud, Wallet, GraduationCap } from "lucide-react";
import Sidebar from "../Layout/Sidebar.jsx";
import styles from "./AdminNavbar.module.css";
import {
    LayoutDashboard,
    Users,
    BookOpen,
    DollarSign,
    MessageCircle,
} from "lucide-react";

const menuItems = [
  {
    icon: <LayoutDashboard size={20} />,
    label: "Dashboard",
    path: "/admin/dashboard",
  },
  { icon: <Users size={20} />, label: "Users", path: "/admin/users" },
  { icon: <BookOpen size={20} />, label: "Exams", path: "/admin/exam" },
  {
    icon: <DollarSign size={20} />,
    label: "Transactions",
    path: "/admin/transactions",
  },
  {
    icon: <MessageCircle size={20} />,
    label: "Feedback",
    path: "/admin/feedback",
  },
];

export default function AdminNavbar() {
  return (
    <aside className={styles.sidebar}>
      <Sidebar menuItems={menuItems} />
    </aside>
  );
}
