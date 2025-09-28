import React from "react";

const rows = [
  {
    check: "☑️",
    test: "IELTS Academic 2025",
    type: "Reading",
    date: "13 Dec 2020",
    result: "6.5",
  },
  {
    test: "IELTS Academic 2025",
    type: "Listening",
    date: "14 Dec 2020",
    result: "7.0",
  },
  {
    test: "IELTS Academic 2025",
    type: "Speaking",
    date: "07 Dec 2020",
    result: "8.5",
  },
  {
    test: "IELTS Academic 2025",
    type: "Writing",
    date: "06 Dec 2020",
    result: "6.0",
  },
  {
    test: "IELTS Academic 2024",
    type: "Writing",
    date: "31 Nov 2020",
    result: "6.5",
  },
];

export default function HistoryTable() {
  return (
    <section className="history-section">
      <h3>Practice History</h3>
      <div className="history-table">
        {rows.map((r, i) => (
          <div key={i} className="history-row">
            <div>{r.check || ""}</div>
            <div className="history-test">{r.test}</div>
            <div>{r.type}</div>
            <div>{r.date}</div>
            <div className="history-result">{r.result}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
