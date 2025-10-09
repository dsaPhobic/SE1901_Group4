import { useState, useEffect } from "react";
import { getExamAttemptsByUser } from "../Services/ExamApi";

export default function useExamAttempts(userId) {
  const [attempts, setAttempts] = useState([]);
  const [stats, setStats] = useState({
    Reading: 0,
    Listening: 0,
    Writing: 0,
    Speaking: 0,
    Overall: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;
    let isMounted = true;
    setLoading(true);
    setError(null);

    getExamAttemptsByUser(userId)
      .then((res) => {
        let data = res.data;

        if (typeof data === "string") {
          try {
            data = JSON.parse(data);
          } catch (parseErr) {
            console.error("Failed to parse response:", parseErr);
            data = [];
          }
        }

        if (isMounted) {
          console.log("Attempts from API:", data);
          setAttempts(data);
        }
      })
      .catch((err) => {
        if (isMounted) setError(err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [userId]);

  // ====== Auto compute stats whenever attempts change ======
  useEffect(() => {
    if (!attempts || attempts.length === 0) return;

    // Gom nhóm theo kỹ năng
    const grouped = { Reading: [], Listening: [], Writing: [], Speaking: [] };
    attempts.forEach((a) => {
      const score = a.totalScore ?? a.score ?? 0;
      if (grouped[a.examType]) grouped[a.examType].push(score);
    });

    // Tính trung bình
    const avg = (arr) =>
      arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

    // Làm tròn theo quy tắc IELTS
    const roundIELTS = (score) => {
      const floor = Math.floor(score);
      const decimal = score - floor;
      if (decimal < 0.25) return floor;
      if (decimal < 0.75) return floor + 0.5;
      return floor + 1;
    };

    const reading = avg(grouped.Reading);
    const listening = avg(grouped.Listening);
    const writing = avg(grouped.Writing);
    const speaking = avg(grouped.Speaking);
    const overallRaw = (reading + listening + writing + speaking) / 4;

    setStats({
      Reading: reading,
      Listening: listening,
      Writing: writing,
      Speaking: speaking,
      Overall: roundIELTS(overallRaw),
    });
  }, [attempts]);

  return { attempts, stats, loading, error };
}
