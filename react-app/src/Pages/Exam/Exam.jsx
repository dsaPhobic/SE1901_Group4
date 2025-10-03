import React, { useState } from "react";
import ExamMarkdownRenderer from "../../Components/Exam/ExamMarkdownRenderer";

export default function Exam() {
  const [markdown, setMarkdown] = useState(`# Sample Exam

This is an introduction paragraph before any question.  
You can still use **Markdown** here, like *italic text*.

---

[!num] What is 2 + 2? Write your answer here: [T*4]

[ ] 3  
[*] 4  
[ ] 5  

---

[!num] Which are fruits?  

[*] Apple  
[ ] Car  
[*] Banana  

---

[!num] Fill in the blank:  
The capital of France is [T*Paris].

---

[!num] Choose the correct dropdown option:  
Select a programming language:  
[D] Python  
[D*] JavaScript  
[D] Banana  

---

[!num] Special markers in text:  
This is a warning [!] Be careful  
This is uncertain [?] Not sure
`);

  return (
    <div>
      <h2>Exam Markdown Editor</h2>
      <textarea
        rows={8}
        cols={60}
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
      />
      <form>
        <ExamMarkdownRenderer markdown={markdown} />
      </form>
      <button type ="submit">Submit Exam</button>
    </div>
  );
}
