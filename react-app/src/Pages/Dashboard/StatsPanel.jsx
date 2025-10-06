import React from "react";
import StatItem from "../../Components/UI/StatItem";

export default function StatsPanel() {
  return (
    <section className="stats-section">
      <h3>Outcome Statistics</h3>
      <StatItem
        icon="🛒"
        label="Reading"
        score={5.0}
        maxScore={9}
        color="#fd7e14"
      />
      <StatItem
        icon="🚚"
        label="Listening"
        score={2.0}
        maxScore={9}
        color="#28a745"
      />
      <StatItem
        icon="✈️"
        label="Overall"
        score={3.5}
        maxScore={9}
        color="#007bff"
      />
    </section>
  );
}
