export function getMonthGrid(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-based
  const currentDate = date.getDate();
  const monthName = date.toLocaleString("default", { month: "long" });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const startOffset = firstDay === 0 ? 6 : firstDay - 1;

  const days = [
    ...Array.from({ length: startOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return { year, month, monthName, currentDate, weeks };
}

export function formatTimeVietnam(dateInput) {
  if (!dateInput) return "";

  const date = new Date(dateInput);
  const now = new Date();

  const UTC_OFFSET = 7 * 60 * 60 * 1000;
  const vietnamDate = new Date(date.getTime() + UTC_OFFSET);
  const vietnamNow = new Date(now.getTime() + UTC_OFFSET);

  const diffInMinutes = Math.floor((vietnamNow - vietnamDate) / (1000 * 60));

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24)
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7)
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;

  return vietnamDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatFullDateVietnam(dateInput) {
  if (!dateInput) return "";

  const date = new Date(dateInput);
  const UTC_OFFSET = 7 * 60 * 60 * 1000;
  const vietnamDate = new Date(date.getTime() + UTC_OFFSET);

  return vietnamDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function isDaySubmitted(day, month, year, submittedDays = []) {
  if (!day) return false;
  const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
    day
  ).padStart(2, "0")}`;
  return submittedDays.includes(dateStr);
}
