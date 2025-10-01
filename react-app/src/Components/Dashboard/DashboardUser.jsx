import React, { useState, useEffect } from "react";
import axios from "axios";
import AppLayout from "../Layout/AppLayout";
import styles from "./DashboardUser.module.css";

export default function DashboardUser() {
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

  // ===== Submitted days từ API =====
  const [submittedDays, setSubmittedDays] = useState([]);

  useEffect(() => {
    async function fetchSubmitted() {
      try {
        const res = await axios.get(
          "https://localhost:7264/api/exam/submitted-days",
          { withCredentials: true }
        );
        setSubmittedDays(res.data);
        // ví dụ API trả: ["2025-09-01", "2025-09-05"]
      } catch (err) {
        console.error("Failed to fetch submitted days:", err);
      }
    }
    fetchSubmitted();
  }, []);

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
              <h4>
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
          <div className={styles.goalsSection}>
            <h3 className={styles.sectionTitle}>Goals</h3>
            <div className={styles.goalsCards}>
              <div className={styles.goalCard}>
                <div className={styles.goalScore}>9.0</div>
                <div className={styles.goalLabel}>Reading</div>
              </div>
              <div className={styles.goalCard}>
                <div className={styles.goalScore}>9.0</div>
                <div className={styles.goalLabel}>Listening</div>
              </div>
              <div className={`${styles.goalCard} ${styles.overall}`}>
                <div className={styles.goalScore}>9.0</div>
                <div className={styles.goalLabel}>Overall</div>
              </div>
            </div>
          </div>

          <div className={styles.statsSection}>
            <h3 className={styles.sectionTitle}>Outcome Statistics</h3>
            <div className={styles.statItem}>
              <span>🛒 Reading</span>
              <div className={styles.progressBar}>
                <div style={{ width: "55%", background: "#fd7e14" }}></div>
              </div>
              <span>5.0/9</span>
            </div>
            <div className={styles.statItem}>
              <span>🚚 Listening</span>
              <div className={styles.progressBar}>
                <div style={{ width: "22%", background: "#28a745" }}></div>
              </div>
              <span>2.0/9</span>
            </div>
            <div className={styles.statItem}>
              <span>✈️ Overall</span>
              <div className={styles.progressBar}>
                <div style={{ width: "39%", background: "#007bff" }}></div>
              </div>
              <span>3.5/9</span>
            </div>
          </div>
        </div>

        {/* History */}
        <div className={styles.historySection}>
          <h3 className={styles.sectionTitle}>Practice History</h3>
          <div className={styles.historyTable}>
            {[
              ["☑️", "IELTS Academic 2025", "Reading", "13 Dec 2020", "6.5"],
              ["", "IELTS Academic 2025", "Listening", "14 Dec 2020", "7.0"],
              ["", "IELTS Academic 2025", "Speaking", "07 Dec 2020", "8.5"],
              ["", "IELTS Academic 2025", "Writing", "06 Dec 2020", "6.0"],
              ["", "IELTS Academic 2024", "Writing", "31 Nov 2020", "6.5"],
            ].map((r, i) => (
              <div className={styles.historyRow} key={i}>
                <div>{r[0]}</div>
                <div>{r[1]}</div>
                <div>{r[2]}</div>
                <div>{r[3]}</div>
                <div>{r[4]}</div>
              </div>
            ))}
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
                <button className={styles.transferButton}>
                  Send the transfer
                </button>
              </div>
            </div>
          </div>

          <div className={styles.enjoyCard}>
            <div className={styles.enjoyIcons}>☁️ 💰</div>
            <div className={styles.enjoyText}>Enjoy your learning</div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
