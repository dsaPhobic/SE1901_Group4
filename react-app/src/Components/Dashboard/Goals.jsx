import React from "react";

function GoalCard({ value, label, highlight }) {
  return (
    <div className={`goal-card ${highlight ? "overall" : ""}`}>
      <div className="goal-score">{value}</div>
      <div className="goal-label">{label}</div>
    </div>
  );
}

export default function Goals({ reading = 9, listening = 9, overall = 9 }) {
  return (
    <section className="goals-section">
      <h3>Goals</h3>
      <div className="goals-cards">
        <GoalCard value={reading.toFixed(1)} label="Reading" />
        <GoalCard value={listening.toFixed(1)} label="Listening" />
        <GoalCard value={overall.toFixed(1)} label="Overall" highlight />
      </div>
    </section>
  );
}
