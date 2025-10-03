import React from "react";
import { marked } from "marked";

marked.setOptions({ breaks: true });

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function splitBlocks(md) {
  const lines = md.split(/\r?\n/);
  const blocks = [];
  let buffer = [];
  let inQuestion = false;
  let qLines = [];

  function flushBuffer() {
    if (buffer.length) {
      blocks.push({ type: "markdown", text: buffer.join("\n") });
      buffer = [];
    }
  }

  function flushQuestion() {
    if (qLines.length) {
      blocks.push({ type: "question", lines: qLines.slice() });
      qLines = [];
      inQuestion = false;
    }
  }

  for (const rawLine of lines) {
    if (rawLine.includes("[!num]")) {
      flushBuffer();
      if (inQuestion) flushQuestion();
      inQuestion = true;
      qLines = [rawLine];
    } else if (inQuestion) {
      qLines.push(rawLine);
    } else {
      buffer.push(rawLine);
    }
  }
  if (inQuestion) flushQuestion();
  flushBuffer();

  return blocks;
}

function processQuestionBlock(lines, qIndex) {
  const full = lines.join("\n");

  let text = full.replace(
    /\[T\*([^\]]+)\]/g,
    (_, ans) =>
      `<input type="text" name="q${qIndex}_text" data-answer="${escapeHtml(
        ans
      )}" />`
  );
  text = text.replace(/\[T\]/g, `<input type="text" name="q${qIndex}_text" />`);

  const choiceRegex = /\[([* ])\]\s*([^\n\[]+)/g;
  const choices = [];
  let m;
  while ((m = choiceRegex.exec(full)) !== null) {
    choices.push({ correct: m[1] === "*", text: m[2].trim() });
  }

  text = text.replace(choiceRegex, "").trim();

  const ddRegex = /\[D\*?\]\s*([^\n\[]+)/g;
  const dropdowns = [];
  while ((m = ddRegex.exec(full)) !== null) {
    const isStar = full[m.index].includes("D*");
    dropdowns.push({ correct: isStar, text: m[1].trim() });
  }
  text = text.replace(ddRegex, "").trim();

  text = text.replace(/\[!num\]/g, String(qIndex));

  let extras = "";

  if (choices.length > 0) {
    const multi = choices.filter((c) => c.correct).length > 1;
    extras += "\n";
    choices.forEach((c, i) => {
      const typ = multi ? "checkbox" : "radio";
      extras += `<label><input type="${typ}" name="q${qIndex}" value="${i}"> ${escapeHtml(
        c.text
      )}</label><br/>`;
    });
  }

  if (dropdowns.length > 0) {
    extras += '\n<select name="q' + qIndex + '">';
    dropdowns.forEach((d) => {
      extras += `<option value="${escapeHtml(d.text)}">${escapeHtml(
        d.text
      )}</option>`;
    });
    extras += "</select>";
  }

  const renderedText = marked.parse(text || `[!num] question ${qIndex}`);

  return renderedText + extras;
}

export default function ExamMarkdownRenderer({ markdown = "" }) {
  const blocks = splitBlocks(markdown);

  const html = blocks
    .map((b, i) => {
      if (b.type === "markdown") {
        return marked.parse(b.text);
      }
      if (b.type === "question") {
        // qIndex is 1-based number of question blocks encountered so far
        const qIndex = blocks
          .slice(0, i + 1)
          .filter((x) => x.type === "question").length;
        return processQuestionBlock(b.lines, qIndex);
      }
      return "";
    })
    .join("\n");

  return (
    <>
      <p>{html}</p>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
