import React from "react";
import NothingFound from "../../../Components/Nothing/NothingFound";

export default function TestHistoryTab({ attempts, attemptsLoading }) {
  if (attemptsLoading) {
    return (
      <div className="profile-content">
        <p>Loading your test history...</p>
      </div>
    );
  }

  if (!attempts || attempts.length === 0) {
    return (
      <div className="profile-content">
        <h2>Test History</h2>
        <NothingFound
          imageSrc="/src/assets/sad_cloud.png"
          title="No tests taken yet"
          message="Start your learning journey by taking your first exam!"
          actionLabel="Start Your First Test"
          to="/reading"
        />
      </div>
    );
  }

  return (
    <div className="profile-content">
      <h2>Test History</h2>
      <div className="test-history-grid">
        {attempts.map((a) => (
          <div key={a.attemptId} className="test-card">
            <div className="test-card-header">
              <h3>{a.examName}</h3>
              <span>{a.examType}</span>
            </div>
            <p>Score: {a.totalScore || 0}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
