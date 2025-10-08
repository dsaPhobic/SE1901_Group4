// build ma trận ngày theo tháng hiện tại (Mon-first) + info hiển thị
export function getMonthGrid(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-based
  const currentDate = date.getDate();
  const monthName = date.toLocaleString("default", { month: "long" });

  const firstDay = new Date(year, month, 1).getDay(); // Sun=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const startOffset = firstDay === 0 ? 6 : firstDay - 1; // Mon=0
  const days = Array.from({ length: startOffset }, () => null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

  return { year, monthName, currentDate, weeks };
}

// Format time for Vietnam timezone
export function formatTimeVietnam(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  
  // Convert to Vietnam timezone (UTC+7)
  const vietnamDate = new Date(date.getTime() + (7 * 60 * 60 * 1000));
  const vietnamNow = new Date(now.getTime() + (7 * 60 * 60 * 1000));
  
  const diffInMinutes = Math.floor((vietnamNow - vietnamDate) / (1000 * 60));

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;

  // For older dates, show full date in English
  return vietnamDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Format full date for Vietnam timezone
export function formatFullDateVietnam(dateString) {
  const date = new Date(dateString);
  const vietnamDate = new Date(date.getTime() + (7 * 60 * 60 * 1000));
  
  return vietnamDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}