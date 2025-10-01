import React from "react";
import "./Home.css";

import Sidebar from "../../Components/Dashboard/Sidebar";
import HeaderBar from "../../Components/Dashboard/HeaderBar";
import CalendarCard from "../../Components/Dashboard/CalendarCard";
import Goals from "../../Components/Dashboard/Goals";
import StatsPanel from "../../Components/Dashboard/StatsPanel";
import HistoryTable from "../../Components/Dashboard/HistoryTable";
import BalanceRow from "../../Components/Dashboard/BalanceRow";

export default function Home() {
  return (
    <div className="home-container">
      <Sidebar />

      <main className="main-content">
        <HeaderBar />

        <div className="dashboard-content">
          <CalendarCard />

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
