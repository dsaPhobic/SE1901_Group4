import React, { useEffect, useMemo, useState } from "react";
import styles from "./QuizPage.module.css";
import {
  CheckCircle,
  XCircle,
  ArrowLeft,
  Trophy,
  RotateCcw,
} from "lucide-react";

export default function QuizPage({ groupWords, onBack }) {
  const initialOrder = useMemo(
    () => groupWords.map((_, i) => i).sort(() => 0.5 - Math.random()),
    [groupWords]
  );

  const [queue, setQueue] = useState(initialOrder);
  const [cursor, setCursor] = useState(0);
  const [mastered, setMastered] = useState(new Set());
  const [failed, setFailed] = useState(new Set());
  const [selected, setSelected] = useState(null);
  const [revealing, setRevealing] = useState(false);
  const [finished, setFinished] = useState(false);

  const total = groupWords.length;
  const currentIndex = queue[cursor];

  const fallbackWrong = [
    "an unrelated action",
    "a small object or device",
    "a kind of vehicle",
    "to move quickly without direction",
    "a piece of music",
    "a type of weather condition",
  ];

  const makeOptions = (idx) => {
    if (idx == null || idx < 0) return { question: "", options: [], answer: "" };
    const word = groupWords[idx];

    let pool = groupWords
      .filter((w, i) => i !== idx && w.meaning && w.meaning.trim().length > 0)
      .map((w) => w.meaning);

    if (pool.length < 3) {
      const need = 3 - pool.length;
      pool = pool.concat(
        fallbackWrong.sort(() => 0.5 - Math.random()).slice(0, need)
      );
    }

    const wrong = Array.from(new Set(pool))
      .filter((m) => m !== word.meaning)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const options = Array.from(new Set([...wrong, word.meaning])).sort(
      () => 0.5 - Math.random()
    );

    return {
      question: `What is the meaning of '${word.term}'?`,
      options,
      answer: word.meaning,
    };
  };

  const { question, options, answer } = useMemo(
    () => makeOptions(currentIndex),
    [currentIndex, groupWords]
  );

  const uniqueCorrect = Array.from(mastered).filter(
    (i) => !failed.has(i)
  ).length;

  const progressPercent =
    total === 0 ? 0 : Math.round((uniqueCorrect / total) * 100);

  useEffect(() => {
    if (finished) return;
    let c = cursor;
    while (c < queue.length && mastered.has(queue[c])) c++;
    if (c !== cursor) setCursor(c);
    if (c >= queue.length && mastered.size === total) setFinished(true);
  }, [cursor, queue, mastered, finished, total]);

  const goNext = (wasCorrect) => {
    if (wasCorrect && !mastered.has(currentIndex)) {
      const next = new Set(mastered);
      next.add(currentIndex);
      setMastered(next);
    }

    if (!wasCorrect) {
      setQueue((q) => [...q, currentIndex]);
      const nextFail = new Set(failed);
      nextFail.add(currentIndex);
      setFailed(nextFail);
    }

    setCursor((c) => c + 1);

    if (
      mastered.size +
        (wasCorrect && !mastered.has(currentIndex) ? 1 : 0) ===
      total
    ) {
      setFinished(true);
    }
  };

  const handleAnswer = (opt) => {
    if (revealing) return;
    const correct = opt === answer;
    setSelected(opt);
    setRevealing(true);

    setTimeout(() => {
      setSelected(null);
      setRevealing(false);
      goNext(correct);
    }, 700);
  };

  // ✅ Hiển thị khi quiz kết thúc
  if (finished || total === 0) {
    return (
      <div className={styles.quizContainer}>
        <Trophy size={48} color="#facc15" />
        <h2>Quiz Finished 🎉</h2>
        <p>
          Your score: <strong>{uniqueCorrect}</strong> / {total}
        </p>

        <div className={styles.progressWrap}>
          <div
            className={styles.progressBarCorrect}
            style={{ width: `${(uniqueCorrect / total) * 100}%` }}
          />
          <div
            className={styles.progressBarWrong}
            style={{ width: `${((total - uniqueCorrect) / total) * 100}%` }}
          />
        </div>

        <button className={styles.backBtn} onClick={onBack}>
          <RotateCcw size={18} /> Back to Dictionary
        </button>
      </div>
    );
  }

  const displayIndex = Math.min(uniqueCorrect + 1, total);

  return (
    <div className={styles.quizContainer}>
      <div className={styles.topRow}>
        <button className={styles.backLink} onClick={onBack}>
          <ArrowLeft size={18} /> Back
        </button>
        <div className={styles.counter}>
          <CheckCircle size={16} color="#4ade80" /> {uniqueCorrect}/{total} mastered
        </div>
      </div>

      <h2 className={styles.question}>{question}</h2>

      <ul className={styles.optionsGrid}>
        {options.map((opt, idx) => {
          const isCorrect = selected && opt === answer;
          const isWrong = selected && opt === selected && opt !== answer;

          return (
            <li key={idx}>
              <button
                className={[
                  styles.optionBtn,
                  isCorrect ? styles.correct : "",
                  isWrong ? styles.wrong : "",
                ].join(" ")}
                onClick={() => handleAnswer(opt)}
                disabled={!!selected}
              >
                {opt}
                {selected &&
                  (isCorrect ? (
                    <CheckCircle className={styles.icon} color="#4ade80" />
                  ) : isWrong ? (
                    <XCircle className={styles.icon} color="#f87171" />
                  ) : null)}
              </button>
            </li>
          );
        })}
      </ul>

      <div className={styles.progressWrap}>
        <div
          className={styles.progressBar}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <p className={styles.meta}>
        Question {displayIndex} of {total}
      </p>
    </div>
  );
}
