// Hook/useExamAttempts.js
import { useState, useEffect } from "react";
import { getExamAttemptsByUser } from "../Services/ExamApi";

export default function useExamAttempts(userId) {
  const [attempts, setAttempts] = useState([]);
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

  return { attempts, loading, error };
}
