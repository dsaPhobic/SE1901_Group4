import React from "react";
import { marked } from "marked";
import "./ExamMarkdownRenderer.css";

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

marked.setOptions({
  gfm: true,
  breaks: true,
  mangle: false,
  headerIds: false,
});

function processQuestionBlock(lines, qIndex, showAnswers) {
  let text = lines.join("\n");

  // 🟢 Text inputs
  text = text.replace(/\[T\*([^\]]+)\]/g, (_, ans) =>
    showAnswers
      ? `<input type="text" value="${escapeHtml(ans)}" readonly class="inlineTextbox answerFilled" />`
      : `<input type="text" class="inlineTextbox" name="q${qIndex}_text" />`
  );
  text = text.replace(
    /\[T\]/g,
    `<input type="text" class="inlineTextbox" name="q${qIndex}_text" />`
  );

  // 🟢 Dropdowns
  const choiceRegex = /\[([* ])\]\s*([^\n\[]+)/g;
  const dropdownRegex = /\[D\]([\s\S]*?)\[\/D\]/g;
  text = text.replace(dropdownRegex, (_, inner) => {
    const options = [...inner.matchAll(choiceRegex)].map((m) => ({
      correct: m[1] === "*",
      text: m[2].trim(),
    }));
    const longest = Math.min(Math.max(...options.map((o) => o.text.length)) + 2, 30);
    const html =
      `<select name="q${qIndex}" class="dropdownInline" style="width:${longest}ch" ${
        showAnswers ? "disabled" : ""
      }>` +
      options
        .map(
          (o) =>
            `<option value="${escapeHtml(o.text)}"${
              showAnswers && o.correct ? " selected" : ""
            }>${escapeHtml(o.text)}</option>`
        )
        .join("") +
      "</select>";
    return html;
  });
  text = text.replace(choiceRegex, (match, mark, label) => {
    const isMulti = (text.match(/\[\*\]/g) || []).length > 1;
    const type = isMulti ? "checkbox" : "radio";
    const value = escapeHtml(label.trim());
    const checked = showAnswers && mark === "*" ? "checked" : "";
    return `<label class="choiceItem">
      <input type="${type}" name="q${qIndex}" value="${value}" ${checked} ${
      showAnswers ? "disabled" : ""
    }/>
      ${value}
    </label>`;
  });
  text = text.replace(/\[!num\]/g, `<span class="numberIndex">Q${qIndex}.</span>`);

  return marked.parse(text);
}

export default function ExamMarkdownRenderer({ markdown = "", showAnswers = false }) {
  const blocks = splitBlocks(markdown);
  let qCounter = 0;

  const html = blocks
    .map((b) => {
      if (b.type === "markdown") return marked.parse(b.text);
      if (b.type === "question") {
        qCounter++;
        return processQuestionBlock(b.lines, qCounter, showAnswers);
      }
      return "";
    })
    .join("\n");

  return <div className="renderer" dangerouslySetInnerHTML={{ __html: html }} />;
}

// 🟢 Extract correct answers exactly matching rendered values
export function renderMarkdownToHtmlAndAnswers(markdown) {
  const blocks = splitBlocks(markdown);
  let htmlOutput = "";
  let allAnswers = [];
  let qCounter = 0;

  blocks.forEach((b) => {
    if (b.type === "markdown") {
      htmlOutput += marked.parse(b.text);
      return;
    }

    qCounter++;
    const full = b.lines.join("\n");

    // 🟢 1️⃣ Text input answers
    const textAnswers = [...full.matchAll(/\[T\*([^\]]+)\]/g)].map((m) =>
      m[1].trim()
    );

    // 🟢 2️⃣ Dropdown answers (inside [D] ... [/D])
    const dropdownAnswers = [...full.matchAll(/\[D\]([\s\S]*?)\[\/D\]/g)].flatMap(
      ([, inner]) =>
        [...inner.matchAll(/\[\*\]\s*([^\n\[]+)/g)].map((m) => m[1].trim())
    );

    // 🟢 3️⃣ MCQ answers (outside dropdowns only)
    // We strip dropdowns before searching for [*]
    const outsideDropdown = full.replace(/\[D\][\s\S]*?\[\/D\]/g, "");
    const radioAnswers = [...outsideDropdown.matchAll(/\[\*\]\s*([^\n\[]+)/g)].map(
      (m) => m[1].trim()
    );

    // 🟢 4️⃣ Combine all answers
    allAnswers.push(...textAnswers, ...dropdownAnswers, ...radioAnswers);

    // 🟢 5️⃣ Append rendered HTML
    htmlOutput += processQuestionBlock(b.lines, qCounter, false);
  });

  return { html: htmlOutput, answers: allAnswers };
}

