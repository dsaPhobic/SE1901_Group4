import React from "react";
import "./Home.css";

import Sidebar from "../../Components/Dashboard/Sidebar";
import HeaderBar from "../../Components/Dashboard/HeaderBar";
import CalendarCard from "../../Components/Dashboard/CalendarCard";
import Goals from "../../Components/Dashboard/Goals";
import StatsPanel from "../../Components/Dashboard/StatsPanel";
import HistoryTable from "../../Components/Dashboard/HistoryTable";
import BalanceRow from "../../Components/Dashboard/BalanceRow";

export default function Home({ onNavigate }) {
  return (
    <div className="home-container">
      <Sidebar onNavigate={onNavigate} />

      <main className="main-content">
        <HeaderBar onNavigate={onNavigate} currentPage="home" />

        <div className="dashboard-content">
          <CalendarCard />

          {/* cột phải: goals + stats chung 1 khu */}
          <div className="goals-wrapper">
            <Goals />
            <StatsPanel />
          </div>

          <HistoryTable />
          <BalanceRow />
        </div>
      </main>
    </div>
  );
}
