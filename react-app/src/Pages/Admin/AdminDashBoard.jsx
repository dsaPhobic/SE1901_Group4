import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/Admin/AdminNavbar.jsx";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  DollarSign,
  MessageCircle,
} from "lucide-react";
import "./AdminDashboard.css";
import { getDashboardStats, getSalesTrend } from "../../Services/AdminApi.js";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalExams: 0,
    totalRevenue: 0,
    totalPoints: 0,
  });

  const [salesData, setSalesData] = useState([]);

  const adminMenu = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/admin/dashboard" },
    { icon: <Users size={20} />, label: "Users", path: "/admin/users" },
    { icon: <BookOpen size={20} />, label: "Exams", path: "/admin/exams" },
    { icon: <DollarSign size={20} />, label: "Transactions", path: "/admin/transactions" },
    { icon: <MessageCircle size={20} />, label: "Feedback", path: "/admin/feedback" },
  ];

  useEffect(() => {
    getDashboardStats()
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Error loading stats:", err));

    getSalesTrend()
      .then((res) => setSalesData(res.data))
      .catch((err) => console.error("Error loading sales trend:", err));
  }, []);

  const chartData = {
    labels: salesData.map((item) => item.label),
    datasets: [
      {
        label: "Sales Trend",
        data: salesData.map((item) => item.value),
        borderColor: "#007bff",
        backgroundColor: "rgba(0, 123, 255, 0.1)",
        tension: 0.3,
        fill: true,
        pointRadius: 3,
      },
    ],
  };

  return (
    <div className="admin-container">
      <Sidebar menuItems={adminMenu} />

        <div>
            
        </div>
      <main className="admin-main">
        <h1 className="admin-title">
          <LayoutDashboard size={28} style={{ marginRight: "8px" }} />
          Admin Dashboard
        </h1>

        <div className="admin-cards">
          <div className="admin-card purple">
            <Users size={26} />
            <div>
              <h3>Total Users</h3>
              <p>{stats.totalUsers}</p>
            </div>
          </div>

          <div className="admin-card yellow">
            <BookOpen size={26} />
            <div>
              <h3>Total Exams</h3>
              <p>{stats.totalExams}</p>
            </div>
          </div>

          <div className="admin-card green">
            <DollarSign size={26} />
            <div>
              <h3>Revenue</h3>
              <p>{stats.totalRevenue}đ</p>
            </div>
          </div>

          <div className="admin-card orange">
            <MessageCircle size={26} />
            <div>
              <h3>Total Points</h3>
              <p>{stats.totalPoints}</p>
            </div>
          </div>
        </div>

        <section className="admin-table-section">
          <h2>Sales Details</h2>
          <div className="chart-container">
            <Line data={chartData} />
          </div>
        </section>
      </main>
    </div>
  );
}
