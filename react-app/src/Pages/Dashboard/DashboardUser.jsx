import React, { useState, useEffect, useMemo } from "react";
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
  Pen,
  Mic,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import NothingFound from "../../Components/Nothing/NothingFound";

import * as AuthApi from "../../Services/AuthApi";
import { getSubmittedDays } from "../../Services/ExamApi";
import useExamAttempts from "../../Hook/UseExamAttempts";
import { isDaySubmitted } from "../../utils/date";

/* ================================
   Configs for stats display
================================ */
const STAT_CONFIGS = [
  {
    key: "Reading",
    label: "Reading",
    color: "#fd7e14",
    icon: <Book size={18} color="#fd7e14" />,
    bg: "readingBg",
  },
  {
    key: "Listening",
    label: "Listening",
    color: "#28a745",
    icon: <Headphones size={18} color="#28a745" />,
    bg: "listeningBg",
  },
  {
    key: "Writing",
    label: "Writing",
    color: "#dc3545",
    icon: <Pen size={18} color="#dc3545" />,
    bg: "writingBg",
  },
  {
    key: "Speaking",
    label: "Speaking",
    color: "#6f42c1",
    icon: <Mic size={18} color="#6f42c1" />,
    bg: "speakingBg",
  },
  {
    key: "Overall",
    label: "Overall",
    color: "#007bff",
    icon: <BarChart2 size={18} color="#007bff" />,
    bg: "overallBg",
  },
];

export default function DashboardUser() {
  const navigate = useNavigate();

  // ===== Calendar logic =====
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const monthName = today.toLocaleString("default", { month: "long" });

  const firstDay = new Date(year, month, 1).getDay(); // Sun=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1; // Mon=0

  const weeks = useMemo(() => {
    const days = Array.from({ length: startOffset }, () => null).concat(
      Array.from({ length: daysInMonth }, (_, i) => i + 1)
    );
    const result = [];
    for (let i = 0; i < days.length; i += 7) result.push(days.slice(i, i + 7));
    return result;
  }, [month, year]);

  // ===== State =====
  const [userId, setUserId] = useState(null);
  const [submittedDays, setSubmittedDays] = useState([]);
  const [historyData, setHistoryData] = useState([]);

  // ===== Get current user =====
  useEffect(() => {
    AuthApi.getMe()
      .then((meRes) => setUserId(meRes.data.userId))
      .catch((err) => console.error("Failed to fetch user:", err));
  }, []);

  // ===== Submitted days =====
  useEffect(() => {
    if (!userId) return;
    getSubmittedDays(userId)
      .then((days) => setSubmittedDays(days))
      .catch((err) => console.error("Failed to fetch submitted days:", err));
  }, [userId]);

  // ===== History + Stats =====
  const { attempts, stats } = useExamAttempts(userId);

  useEffect(() => {
    if (!attempts || attempts.length === 0) return;
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
  }, [attempts]);

  return (
    <AppLayout title="Summary of your hard work">
      <div className={styles.dashboardContent}>
        {/* ===== Calendar Section ===== */}
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
                        isDaySubmitted(d, month, year, submittedDays)
                          ? styles.submitted
                          : ""
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

        {/* ===== Goals + Stats ===== */}
        <div className={styles.goalsWrapper}>
          {/* Goals Section */}
          <div className={styles.goalsSection}>
            <h3 className={styles.sectionTitle}>Goals</h3>
            <div className={styles.goalsCards}>
              {["Reading", "Listening", "Writing", "Speaking", "Overall"].map(
                (label) => (
                  <div
                    key={label}
                    className={`${styles.goalCard} ${
                      label === "Overall" ? styles.overall : ""
                    }`}
                  >
                    <div className={styles.goalLabel}>{label}</div>
                    <div className={styles.goalScore}>9.0</div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Stats Section */}
          <div className={styles.statsSection}>
            <h3 className={styles.sectionTitle}>Outcome Statistics</h3>

            {STAT_CONFIGS.map(({ key, label, color, icon, bg }) => (
              <div key={key} className={styles.statItem}>
                <div className={`${styles.iconBox} ${styles[bg]}`}>{icon}</div>
                <span className={styles.statLabel}>{label}</span>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{
                      width: `${(stats[key] / 9) * 100}%`,
                      background: color,
                    }}
                  />
                </div>
                <span className={styles.statValue}>
                  {stats[key]?.toFixed(1) ?? "0.0"}/9
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ===== History Section ===== */}
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
              <NothingFound
                imageSrc="/src/assets/sad_cloud.png"
                title="No practice history"
                message="You have not done any exercises yet! Choose the appropriate form and practice now!"
                actionLabel="Do your homework now!"
                to="/reading"
              />
            )}
          </div>
        </div>

        {/* ===== Balance + Enjoy Section ===== */}
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
                  onClick={() => navigate("/transaction")}
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
