// Hook/useExamAttempts.js
import { useState, useEffect } from "react";
import { getExamAttemptsByUser } from "../Services/DashBoardApi";

export default function useExamAttempts(userId) {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return; // chưa login thì skip
    setLoading(true);

    getExamAttemptsByUser(userId)
      .then((res) => {
        setAttempts(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch attempts:", err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  return { attempts, loading, error };
}
