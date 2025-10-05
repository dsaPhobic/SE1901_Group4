import React from "react";
import { marked } from "marked";
import "./ExamMarkdownRenderer.module.css";

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
  let qBuffer = [];
  let inQuestion = false;

  const flushBuffer = () => {
    if (buffer.length) {
      blocks.push({ type: "markdown", text: buffer.join("\n") });
      buffer = [];
    }
  };
  const flushQuestion = () => {
    if (qBuffer.length) {
      blocks.push({ type: "question", lines: [...qBuffer] });
      qBuffer = [];
      inQuestion = false;
    }
  };

  for (const line of lines) {
    if (line.includes("[!num]")) {
      flushBuffer();
      if (inQuestion) flushQuestion();
      inQuestion = true;
      qBuffer = [line];
    } else if (inQuestion) {
      qBuffer.push(line);
    } else {
      buffer.push(line);
    }
  }
  if (inQuestion) flushQuestion();
  flushBuffer();
  return blocks;
}

function processQuestionBlock(lines, qIndex, showAnswers) {
  const full = lines.join("\n");
  let text = full;

  // Text input inline
  text = text.replace(/\[T\*([^\]]+)\]/g, (_, ans) =>
    showAnswers
      ? `<input type="text" value="${escapeHtml(
          ans
        )}" readonly class="inline-textbox answer-filled" />`
      : `<input type="text" class="inline-textbox" name="q${qIndex}_text" />`
  );
  text = text.replace(
    /\[T\]/g,
    `<input type="text" class="inline-textbox" name="q${qIndex}_text" />`
  );

  const choiceRegex = /\[([* ])\]\s*([^\n\[]+)/g;
  const dropdownRegex = /\[D\]([\s\S]*?)\[\/D\]/g;

  // Dropdowns inside paragraph
  text = text.replace(dropdownRegex, (_, inner) => {
    const options = [...inner.matchAll(choiceRegex)].map((m) => ({
      correct: m[1] === "*",
      text: m[2].trim(),
    }));
    const longest = Math.min(
      Math.max(...options.map((o) => o.text.length)),
      40
    );
    const html = `<select name="q${qIndex}" class="dropdown-inline" style="--dropdown-min-width:${longest +
      2}ch" ${showAnswers ? "disabled" : ""}>${options
      .map(
        (o) =>
          `<option value="${escapeHtml(o.text)}"${
            showAnswers && o.correct ? " selected" : ""
          }>${escapeHtml(o.text)}</option>`
      )
      .join("")}</select>`;
    return html;
  });

  // Multiple choice
  text = text.replace(choiceRegex, (match, mark, label) => {
    const isMulti = (full.match(/\[\*\]/g) || []).length > 1;
    const inputType = isMulti ? "checkbox" : "radio";
    const checked = showAnswers && mark === "*" ? "checked" : "";
    return `<label><input type="${inputType}" name="q${qIndex}" ${checked} ${
      showAnswers ? "disabled" : ""
    } /> ${escapeHtml(label.trim())}</label>`;
  });

  text = text.replace(/\[!num\]/g, qIndex);
  return marked.parse(text);
}

export default function ExamMarkdownRenderer({ markdown = "", showAnswers = false }) {
  const blocks = splitBlocks(markdown);
  const html = blocks
    .map((b, i) => {
      if (b.type === "markdown") return marked.parse(b.text);
      if (b.type === "question") {
        const qIndex = blocks.slice(0, i + 1).filter((x) => x.type === "question").length;
        return processQuestionBlock(b.lines, qIndex, showAnswers);
      }
      return "";
    })
    .join("\n");
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}


/** ✅ Convert markdown to HTML (student view) + extract answers */
export function renderMarkdownToHtmlAndAnswers(markdown) {
  const blocks = splitBlocks(markdown);
  let htmlOutput = "";
  let allAnswers = [];

  blocks.forEach((b, i) => {
    if (b.type === "markdown") {
      htmlOutput += marked.parse(b.text);
      return;
    }

    const qIndex =
      blocks.slice(0, i + 1).filter((x) => x.type === "question").length;
    const full = b.lines.join("\n");

    // Extract answers
    const textAnswers = [...full.matchAll(/\[T\*([^\]]+)\]/g)].map(
      (m) => m[1].trim()
    );
    const radioAnswers = [...full.matchAll(/\[\*\]\s*([^\n\[]+)/g)].map(
      (m) => m[1].trim()
    );
    const dropdownAnswers = [...full.matchAll(/\[D\]([\s\S]*?)\[\/D\]/g)].flatMap(
      ([, inner]) =>
        [...inner.matchAll(/\[\*\]\s*([^\n\[]+)/g)].map((m) => m[1].trim())
    );

    allAnswers.push(...textAnswers, ...radioAnswers, ...dropdownAnswers);

    htmlOutput += processQuestionBlock(b.lines, qIndex, false);
  });

  return { html: htmlOutput, answers: allAnswers };
}
