import React from "react";
import { marked } from "marked";

marked.setOptions({ breaks: true });

/** Escape HTML entities for safe rendering */
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Split markdown into plain blocks and question blocks */
function splitBlocks(md) {
  const lines = md.split(/\r?\n/);
  const blocks = [];
  let buffer = [];
  let questionBuffer = [];
  let inQuestion = false;

  const flushBuffer = () => {
    if (buffer.length) {
      blocks.push({ type: "markdown", text: buffer.join("\n") });
      buffer = [];
    }
  };

  const flushQuestion = () => {
    if (questionBuffer.length) {
      blocks.push({ type: "question", lines: [...questionBuffer] });
      questionBuffer = [];
      inQuestion = false;
    }
  };

  for (const line of lines) {
    if (line.includes("[!num]")) {
      flushBuffer();
      if (inQuestion) flushQuestion();
      inQuestion = true;
      questionBuffer = [line];
    } else if (inQuestion) {
      questionBuffer.push(line);
    } else {
      buffer.push(line);
    }
  }

  if (inQuestion) flushQuestion();
  flushBuffer();

  return blocks;
}

/** Parse a question block into HTML form elements */
function processQuestionBlock(lines, qIndex) {
  const full = lines.join("\n");
  let text = full;

  // Handle text inputs with answers
  text = text.replace(
    /\[T\*([^\]]+)\]/g,
    (_, ans) =>
      `<input type="text" name="q${qIndex}_text" data-answer="${escapeHtml(ans)}" />`
  );

  // Handle plain text inputs
  text = text.replace(/\[T\]/g, `<input type="text" name="q${qIndex}_text" />`);

  // Handle multiple-choice options
  const choiceRegex = /\[([* ])\]\s*([^\n\[]+)/g;
  const choices = [];
  let m;
  while ((m = choiceRegex.exec(full)) !== null) {
    choices.push({ correct: m[1] === "*", text: m[2].trim() });
  }
  text = text.replace(choiceRegex, "").trim();

  // Handle dropdowns
  const ddRegex = /\[D\*?\]\s*([^\n\[]+)/g;
  const dropdowns = [];
  while ((m = ddRegex.exec(full)) !== null) {
    const isCorrect = full[m.index].startsWith("[D*]");
    dropdowns.push({ correct: isCorrect, text: m[1].trim() });
  }
  text = text.replace(ddRegex, "").trim();

  // Replace [!num] with actual question number
  text = text.replace(/\[!num\]/g, String(qIndex));

  // Build extra HTML for choices/dropdowns
  let extras = "";

  if (choices.length > 0) {
    const multi = choices.filter((c) => c.correct).length > 1;
    extras += choices
      .map(
        (c, i) =>
          `<label><input type="${multi ? "checkbox" : "radio"}" name="q${qIndex}" value="${i}"> ${escapeHtml(
            c.text
          )}</label><br/>`
      )
      .join("");
  }

  if (dropdowns.length > 0) {
    extras += `<select name="q${qIndex}">`;
    extras += dropdowns
      .map(
        (d) =>
          `<option value="${escapeHtml(d.text)}">${escapeHtml(d.text)}</option>`
      )
      .join("");
    extras += "</select>";
  }

  return marked.parse(text || `[!num] question ${qIndex}`) + extras;
}

export default function ExamMarkdownRenderer({ markdown = "" }) {
  const blocks = splitBlocks(markdown);

  const html = blocks
    .map((block, i) => {
      if (block.type === "markdown") {
        return marked.parse(block.text);
      }
      if (block.type === "question") {
        const qIndex =
          blocks.slice(0, i + 1).filter((x) => x.type === "question").length;
        return processQuestionBlock(block.lines, qIndex);
      }
      return "";
    })
    .join("\n");

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
