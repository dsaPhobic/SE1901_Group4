// src/Pages/Dashboard/DashboardUser.jsx
import React, { useState, useEffect } from "react";
import AppLayout from "../../Components/Layout/AppLayout";
import styles from "./DashboardUser.module.css";
import {
  Book,
  Headphones,
  BarChart2,
  Cloud,
  Wallet,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import * as AuthApi from "../../Services/AuthApi";
import { getSubmittedDays } from "../../Services/ExamApi";
import useExamAttempts from "../../Hook/UseExamAttempts";

export default function DashboardUser() {
  const navigate = useNavigate();

  // ===== Calendar logic =====
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-based
  const monthName = today.toLocaleString("default", { month: "long" });

  const firstDay = new Date(year, month, 1).getDay(); // Sun=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1; // Mon=0

  const days = Array.from({ length: startOffset }, () => null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

  // ===== State =====
  const [userId, setUserId] = useState(null);
  const [submittedDays, setSubmittedDays] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [stats, setStats] = useState({ Reading: 0, Listening: 0, Overall: 0 });

  // ===== Get current user =====
  useEffect(() => {
    AuthApi.getMe()
      .then((meRes) => {
        setUserId(meRes.data.userId);
      })
      .catch((err) => {
        console.error("Failed to fetch user:", err);
      });
  }, []);

  // ===== Submitted days =====
  useEffect(() => {
    if (!userId) return;
    getSubmittedDays(userId)
      .then((days) => {
        setSubmittedDays(days);
      })
      .catch((err) => {
        console.error("Failed to fetch submitted days:", err);
      });
  }, [userId]);

  // ===== History + Stats (dùng hook useExamAttempts) =====
  const { attempts, loading } = useExamAttempts(userId);

  useEffect(() => {
    if (!attempts || attempts.length === 0) return;

    // History rows
    const rows = attempts.map((a) => [
      a.submittedAt ? (
        <CheckCircle size={18} color="#28a745" />
      ) : (
        <XCircle size={18} color="#dc3545" />
      ),
      a.examName,
      a.examType,
      a.submittedAt
        ? new Date(a.submittedAt).toLocaleDateString("en-GB")
        : "In progress",
      a.totalScore?.toFixed(1) ?? a.score?.toFixed(1) ?? "-",
    ]);

    setHistoryData(rows);

    // Stats từ dữ liệu
    const grouped = attempts.reduce(
      (acc, a) => {
        const score = a.totalScore ?? a.score ?? 0;
        if (a.examType === "Reading") acc.Reading += score;
        if (a.examType === "Listening") acc.Listening += score;
        acc.count++;
        acc.Overall += score;
        return acc;
      },
      { Reading: 0, Listening: 0, Overall: 0, count: 0 }
    );
    const avg = grouped.count > 0 ? grouped.Overall / grouped.count : 0;
    setStats({
      Reading: grouped.Reading,
      Listening: grouped.Listening,
      Overall: avg,
    });
  }, [attempts]);

  // check ngày có trong submittedDays không
  function isSubmitted(day) {
    if (!day) return false;
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    return submittedDays.includes(dateStr);
  }

  return (
    <AppLayout title="Summary of your hard work">
      <div className={styles.dashboardContent}>
        {/* Calendar */}
        <div className={`${styles.card} ${styles.calendarCard}`}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Your dedication for studying</h3>
            <div className={styles.status}>
              <span className={styles.statusDot} />
              <span className={styles.statusText}>Submitted</span>
            </div>
          </div>

          <div className={styles.calendar}>
            <div className={styles.calendarHeader}>
              <h4 className={styles.monthYear}>
                {monthName} {year}
              </h4>
            </div>

            <div className={styles.calendarGrid}>
              <div />
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <div key={d} className={styles.calendarWeekday}>
                  {d}
                </div>
              ))}
              {weeks.map((w, wi) => (
                <React.Fragment key={wi}>
                  <div className={styles.calendarWeekLabel}>Week {wi + 1}</div>
                  {w.map((d, di) => (
                    <div
                      key={di}
                      className={`${styles.calendarDay} ${
                        isSubmitted(d) ? styles.submitted : ""
                      }`}
                    >
                      {d || ""}
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Goals + Stats */}
        <div className={styles.goalsWrapper}>
          {/* Goals */}
          <div className={styles.goalsSection}>
            <h3 className={styles.sectionTitle}>Goals</h3>
            <div className={styles.goalsCards}>
              <div className={styles.goalCard}>
                <div className={styles.goalLabel}>Reading</div>
                <div className={styles.goalScore}>9.0</div>
              </div>
              <div className={styles.goalCard}>
                <div className={styles.goalLabel}>Listening</div>
                <div className={styles.goalScore}>9.0</div>
              </div>
              <div className={`${styles.goalCard} ${styles.overall}`}>
                <div className={styles.goalLabel}>Overall</div>
                <div className={styles.goalScore}>9.0</div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className={styles.statsSection}>
            <h3 className={styles.sectionTitle}>Outcome Statistics</h3>

            <div className={styles.statItem}>
              <div className={`${styles.iconBox} ${styles.readingBg}`}>
                <Book size={18} color="#fd7e14" />
              </div>
              <span className={styles.statLabel}>Reading</span>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{
                    width: `${(stats.Reading / 9) * 100}%`,
                    background: "#fd7e14",
                  }}
                ></div>
              </div>
              <span className={styles.statValue}>
                {stats.Reading.toFixed(1)}/9
              </span>
            </div>

            <div className={styles.statItem}>
              <div className={`${styles.iconBox} ${styles.listeningBg}`}>
                <Headphones size={18} color="#28a745" />
              </div>
              <span className={styles.statLabel}>Listening</span>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{
                    width: `${(stats.Listening / 9) * 100}%`,
                    background: "#28a745",
                  }}
                ></div>
              </div>
              <span className={styles.statValue}>
                {stats.Listening.toFixed(1)}/9
              </span>
            </div>

            <div className={styles.statItem}>
              <div className={`${styles.iconBox} ${styles.overallBg}`}>
                <BarChart2 size={18} color="#007bff" />
              </div>
              <span className={styles.statLabel}>Overall</span>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{
                    width: `${(stats.Overall / 9) * 100}%`,
                    background: "#007bff",
                  }}
                ></div>
              </div>
              <span className={styles.statValue}>
                {stats.Overall.toFixed(1)}/9
              </span>
            </div>
          </div>
        </div>

        {/* History */}
        <div className={styles.historySection}>
          <h3 className={styles.sectionTitle}>Practice History</h3>
          <div className={styles.historyTable}>
            <div className={`${styles.historyRow} ${styles.historyHeader}`}>
              <div>Status</div>
              <div>Exam Name</div>
              <div>Type</div>
              <div>Date</div>
              <div>Score</div>
            </div>

            {historyData.length > 0 ? (
              historyData.map((r, i) => (
                <div className={styles.historyRow} key={i}>
                  <div>{r[0]}</div>
                  <div>{r[1]}</div>
                  <div>{r[2]}</div>
                  <div>{r[3]}</div>
                  <div>{r[4]}</div>
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>
                <img
                  src="../../src/assets/sad_cloud.png"
                  alt="No history"
                  className={styles.emptyImage}
                />
                <p>
                  You have not done any exercises yet! Choose the appropriate
                  form and practice now!
                </p>
                <button
                  className={styles.emptyButton}
                  onClick={() => navigate("/reading")}
                >
                  Do your homework now!
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Balance + Enjoy */}
        <div className={styles.balanceWrapper}>
          <div className={styles.balanceSection}>
            <h3>Account Balance</h3>
            <div className={styles.balanceContent}>
              <div className={styles.userAvatars}>
                {["Ann", "Monica", "John", "Mike", "Mia"].map((n) => (
                  <div className={styles.avatarItem} key={n}>
                    <div className={styles.avatar}>{n[0]}</div>
                    <span>{n}</span>
                  </div>
                ))}
                <div className={styles.avatarItem}>
                  <div className={`${styles.avatar} ${styles.add}`}>+</div>
                  <span>Add New</span>
                </div>
              </div>
              <div className={styles.balanceInputSection}>
                <input className={styles.balanceInput} value="1997" readOnly />
                <button
                  className={styles.transferButton}
                  onClick={() => navigate("/transction")}
                >
                  Send the transfer
                </button>
              </div>
            </div>
          </div>

          <div className={styles.enjoyCard}>
            <div className={styles.enjoyIcons}>
              <Cloud size={20} /> <Wallet size={20} />
            </div>
            <div className={styles.enjoyText}>Enjoy your learning</div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
