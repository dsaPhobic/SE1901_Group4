import React, { useState, useEffect } from "react";
import {
  User,
  Eye,
  EyeOff,
  ClipboardList,
  CreditCard,
  LogIn,
} from "lucide-react";
import "./Profile.css";
import useAuth from "../../Hook/UseAuth";
import useExamAttempts from "../../Hook/UseExamAttempts";
import AppLayout from "../../Components/Layout/AppLayout";
import { updateUser } from "../../Services/UserApi";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { attempts, loading: attemptsLoading } = useExamAttempts(user?.userId);
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "",
    gmail: "",
    accountName: "",
    password: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    if (user) {
      const newData = {
        name: (user?.firstname || "") + " " + (user?.lastname || ""),
        gmail: user.email || "",
        accountName: user.username || "",
        password: "",
      };
      setProfileData(newData);
      setOriginalData(newData);
    }
  }, [user]);

  if (loading) {
    return (
      <AppLayout title="Profile">
        <div className="profile-layout">
          <div className="profile-main">Loading...</div>
        </div>
      </AppLayout>
    );
  }
  if (!user) {
    return (
      <AppLayout title="Profile">
        <div className="profile-layout">
          <div className="profile-main">Please login</div>
        </div>
      </AppLayout>
    );
  }

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setProfileData((prev) => ({
      ...prev,
      [e.target.name]: newValue,
    }));

    const hasDataChanged = Object.keys(profileData).some((key) => {
      if (key === e.target.name) {
        return newValue !== originalData[key];
      }
      return profileData[key] !== originalData[key];
    });
    setHasChanges(hasDataChanged || newValue !== originalData[e.target.name]);
  };

  const handleSave = () => {
    setIsSaving(true);

    updateUser(user.userId, {
      firstname: profileData.name.split(" ")[0],
      lastname: profileData.name.split(" ").slice(1).join(" "),
      email: profileData.gmail,
      username: profileData.accountName,
      password: profileData.password || undefined,
    })
      .then(() => {
        setOriginalData({ ...profileData });
        setHasChanges(false);
        alert("Profile updated successfully!");
      })
      .catch((error) => {
        console.error("Error saving profile:", error);
        alert("Failed to update profile. Please try again.");
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="profile-content">
            <h2>Your Profile</h2>
            <div className="profile-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Gmail</label>
                <input
                  type="email"
                  name="gmail"
                  value={profileData.gmail}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Account Name</label>
                <input
                  type="text"
                  name="accountName"
                  value={profileData.accountName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Change Password</label>
                <button
                  className="save-btn has-changes"
                  style={{
                    backgroundColor: "#f44336",
                    cursor: "pointer",
                    opacity: 1,
                    fontSize: "28px",
                    padding: "10px 20px",
                  }}
                  onClick={() => navigate("/?mode=forgot")}
                >
                  Go to Forgot Password
                </button>
              </div>

              {/* Save Button */}
              <div className="form-actions">
                <button
                  className={`save-btn ${hasChanges ? "has-changes" : ""} ${
                    isSaving ? "saving" : ""
                  }`}
                  onClick={handleSave}
                  disabled={!hasChanges || isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        );

      case "test-history":
        if (attemptsLoading) {
          return (
            <div className="profile-content">
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading your test history...</p>
              </div>
            </div>
          );
        }
        if (!attempts || attempts.length === 0) {
          return (
            <div className="profile-content">
              <h2>Test History</h2>
              <div className="empty-test-history">
                <div className="empty-icon">
                  <ClipboardList size={64} />
                </div>
                <h3>No tests taken yet</h3>
                <p>Start your learning journey by taking your first exam!</p>
                <button className="start-test-btn">
                  Start Your First Test
                </button>
              </div>
            </div>
          );
        }
        return (
          <div className="profile-content">
            <div className="test-history-header">
              <h2>Test History</h2>
              <div className="test-stats">
                <div className="stat-item">
                  <span className="stat-number">{attempts.length}</span>
                  <span className="stat-label">Total Tests</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">
                    {attempts.filter((a) => a.submittedAt).length}
                  </span>
                  <span className="stat-label">Completed</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">
                    {attempts.length > 0
                      ? Math.round(
                          attempts.reduce(
                            (sum, a) => sum + (a.totalScore || 0),
                            0
                          ) / attempts.length
                        )
                      : 0}
                  </span>
                  <span className="stat-label">Avg Score</span>
                </div>
              </div>
            </div>
            <div className="test-history-grid">
              {attempts.map((attempt) => (
                <div key={attempt.attemptId} className="test-card">
                  <div className="test-card-header">
                    <div className="test-info">
                      <h3 className="test-name">{attempt.examName}</h3>
                      <span className="test-type">{attempt.examType}</span>
                    </div>
                    <div
                      className={`status-badge ${
                        attempt.submittedAt ? "completed" : "incomplete"
                      }`}
                    >
                      {attempt.submittedAt ? "Completed" : "Incomplete"}
                    </div>
                  </div>

                  <div className="test-card-body">
                    <div className="score-section">
                      <div className="score-display">
                        <span className="score-value">
                          {attempt.totalScore || 0}
                        </span>
                        <span className="score-label">points</span>
                      </div>
                      <div className="score-progress">
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${Math.min(
                                ((attempt.totalScore || 0) / 100) * 100,
                                100
                              )}%`,
                            }}
                          ></div>
                        </div>
                        <span className="progress-text">
                          {Math.min(
                            ((attempt.totalScore || 0) / 100) * 100,
                            100
                          ).toFixed(0)}
                          % Complete
                        </span>
                      </div>
                    </div>

                    <div className="test-details">
                      <div className="detail-item">
                        <span className="detail-label">Started:</span>
                        <span className="detail-value">
                          {new Date(attempt.startedAt).toLocaleDateString()} at{" "}
                          {new Date(attempt.startedAt).toLocaleTimeString()}
                        </span>
                      </div>
                      {attempt.submittedAt && (
                        <div className="detail-item">
                          <span className="detail-label">Submitted:</span>
                          <span className="detail-value">
                            {new Date(attempt.submittedAt).toLocaleDateString()}{" "}
                            at{" "}
                            {new Date(attempt.submittedAt).toLocaleTimeString()}
                          </span>
                        </div>
                      )}
                      <div className="detail-item">
                        <span className="detail-label">Duration:</span>
                        <span className="detail-value">
                          {attempt.submittedAt
                            ? `${Math.round(
                                (new Date(attempt.submittedAt) -
                                  new Date(attempt.startedAt)) /
                                  60000
                              )} minutes`
                            : "In progress..."}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="test-card-footer">
                    <button className="view-details-btn">View Details</button>
                    {!attempt.submittedAt && (
                      <button className="continue-btn">Continue Test</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "payment-history":
        return (
          <div className="profile-content">
            <h2>Payment History</h2>
            <div className="empty-state">
              <p>No payments made yet.</p>
            </div>
          </div>
        );

      case "sign-in-history":
        return (
          <div className="profile-content">
            <h2>Sign In History</h2>
            <div className="empty-state">
              <p>No sign in history available yet.</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AppLayout title="Profile">
      <div className="profile-layout">
        <div className="profile-sidebar">
          <div className="user-info">
            <div className="user-avatar">
              <User size={60} />
            </div>
            <div className="user-details">
              <h3>{profileData.name || "..."}</h3>
              <p>{profileData.gmail || "..."}</p>
            </div>
          </div>

          <div className="navigation-menu">
            <button
              className={`nav-item ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <User size={20} />
              <span>Your Profile</span>
            </button>

            <button
              className={`nav-item ${
                activeTab === "test-history" ? "active" : ""
              }`}
              onClick={() => setActiveTab("test-history")}
            >
              <ClipboardList size={20} />
              <span>Test History</span>
            </button>

            <button
              className={`nav-item ${
                activeTab === "payment-history" ? "active" : ""
              }`}
              onClick={() => setActiveTab("payment-history")}
            >
              <CreditCard size={20} />
              <span>Payment History</span>
            </button>

            <button
              className={`nav-item ${
                activeTab === "sign-in-history" ? "active" : ""
              }`}
              onClick={() => setActiveTab("sign-in-history")}
            >
              <LogIn size={20} />
              <span>Sign In History</span>
            </button>
          </div>
        </div>

        <div className="profile-main">{renderContent()}</div>
      </div>
    </AppLayout>
  );
}
