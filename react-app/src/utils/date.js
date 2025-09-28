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
