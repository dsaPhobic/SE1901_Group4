import React, { useEffect, useState } from "react";
import { getSignInHistory } from "../../../Services/UserApi";
import useAuth from "../../../Hook/UseAuth";
import NothingFound from "../../../Components/Nothing/NothingFound";
import "./SignInTab.css";

export default function SignInTab() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.userId) return;
    getSignInHistory(user.userId)
      .then((res) => setHistory(res.data))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading)
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading sign-in history...</p>
      </div>
    );

  if (!history || history.length === 0) {
    return (
      <div className="signin-content">
        <div className="header-section">
          <div className="title-wrapper">
            <div className="icon-wrapper">
              <svg
                className="history-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <path d="M12 7v5l4 2" />
              </svg>
            </div>
            <h2>Sign In History</h2>
          </div>
          <div className="stats-badge">
            <span className="stats-number">0</span>
            <span className="stats-label">Total Sign-ins</span>
          </div>
        </div>
        <NothingFound
          imageSrc="/src/assets/sad_cloud.png"
          title="No sign-ins yet"
          message="Your recent sign-in activity will show up here."
        />
      </div>
    );
  }

  return (
    <div className="signin-content">
      <div className="header-section">
        <div className="title-wrapper">
          <div className="icon-wrapper">
            <svg
              className="history-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M12 7v5l4 2" />
            </svg>
          </div>
          <h2>Sign In History</h2>
        </div>
        <div className="stats-badge">
          <span className="stats-number">{history.length}</span>
          <span className="stats-label">Total Sign-ins</span>
        </div>
      </div>

      <div className="signin-table-wrapper">
        <div className="table-header">
          <div className="table-title">
            <svg
              className="table-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
            <span>Recent Activity</span>
          </div>
          <div className="table-actions">
            <button className="refresh-btn">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M12 7v5l-4 2" />
              </svg>
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="signin-table">
            <thead>
              <tr>
                <th>
                  <div className="th-content">
                    <svg
                      className="th-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                    #
                  </div>
                </th>
                <th>
                  <div className="th-content">
                    <svg
                      className="th-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                    IP Address
                  </div>
                </th>
                <th>
                  <div className="th-content">
                    <svg
                      className="th-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                    Device
                  </div>
                </th>
                <th>
                  <div className="th-content">
                    <svg
                      className="th-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12,6 12,12 16,14" />
                    </svg>
                    Signed In At
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, index) => (
                <tr key={item.id || index} className="table-row">
                  <td>
                    <div className="row-number">
                      <span className="number-badge">{index + 1}</span>
                    </div>
                  </td>
                  <td>
                    <div className="ip-cell">
                      <div className="ip-address">
                        {item.ipAddress === "::1"
                          ? "localhost"
                          : item.ipAddress}
                      </div>
                      <div className="ip-status">
                        <span className="status-dot online"></span>
                        <span className="status-text">Active</span>
                      </div>
                    </div>
                  </td>
                  <td className="device-cell">
                    <div className="device-info">
                      <div className="device-icon">
                        {getDeviceIcon(item.deviceInfo)}
                      </div>
                      <div className="device-details">
                        <div className="device-name">
                          {formatDevice(item.deviceInfo)}
                        </div>
                        <div className="device-type">
                          {getDeviceType(item.deviceInfo)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="time-cell">
                      <div className="time-main">
                        {formatDate(item.signedInAt)}
                      </div>
                      <div className="time-relative">
                        {getRelativeTime(item.signedInAt)}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function formatDate(isoString) {
  const d = new Date(isoString);
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatDevice(agent) {
  if (!agent) return "Unknown";
  if (agent.includes("Windows")) return "Windows";
  if (agent.includes("Mac")) return "macOS";
  if (agent.includes("Android")) return "Android";
  if (agent.includes("iPhone")) return "iPhone";
  return agent.slice(0, 60) + (agent.length > 60 ? "..." : "");
}

function getDeviceIcon(agent) {
  if (!agent)
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    );

  if (agent.includes("Windows"))
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    );

  if (agent.includes("Mac"))
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M18 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z" />
        <path d="M6 3v18" />
      </svg>
    );

  if (agent.includes("Android") || agent.includes("iPhone"))
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    );

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

function getDeviceType(agent) {
  if (!agent) return "Unknown Device";
  if (
    agent.includes("Mobile") ||
    agent.includes("Android") ||
    agent.includes("iPhone")
  )
    return "Mobile";
  if (agent.includes("Tablet")) return "Tablet";
  return "Desktop";
}

function getRelativeTime(isoString) {
  const now = new Date();
  const date = new Date(isoString);
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
}
