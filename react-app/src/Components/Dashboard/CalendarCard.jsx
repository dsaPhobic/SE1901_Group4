import React from "react";
import { getMonthGrid } from "../../utils/date";

export default function CalendarCard() {
  const { year, monthName, currentDate, weeks } = getMonthGrid(new Date());

  return (
    <div className="card calendar-card">
      <div className="card-header" style={{ justifyContent: "space-between" }}>
        <h3>Your dedication for studying</h3>
        <div className="status">
          <span className="status-dot" />
          <span className="status-text">Submitted</span>
        </div>
      </div>

      <div className="calendar">
        <div className="calendar-header">
          <h4>
            {monthName} {year}
          </h4>
        </div>

        <div className="calendar-grid">
          {/* cột trống đầu để label Week */}
          <div></div>
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d} className="calendar-weekday">
              {d}
            </div>
          ))}

          {weeks.map((week, wi) => (
            <React.Fragment key={wi}>
              <div className="calendar-week-label">Week {wi + 1}</div>
              {week.map((day, di) => (
                <div
                  key={di}
                  className={`calendar-day ${
                    day === currentDate ? "selected" : ""
                  }`}
                >
                  {day || ""}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
