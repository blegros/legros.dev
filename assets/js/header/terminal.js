import { startTypingSound, stopTypingSound } from "./audio.js";

export const showPrompt = (visible) => {
  const prompt = document.getElementById("terminal-prompt");
  const box = document.querySelector(".terminal-box");
  if (prompt) prompt.style.display = visible ? "inline" : "none";
  if (box) {
    if (visible) box.classList.add("is-typing");
    else box.classList.remove("is-typing");
  }
};

export const clearTerminal = () => {
  const content = document.getElementById("terminal-content");
  if (content) content.textContent = "";
  showPrompt(true);
};

export const typeText = async (text, signal, speed = 80) => {
  const content = document.getElementById("terminal-content");
  if (!content) return;

  content.textContent = "";
  showPrompt(true);

  //startTypingSound();

  try {
    for (let i = 0; i < text.length; i++) {
      if (signal.aborted) {
        //stopTypingSound();
        return;
      }
      content.textContent += text[i];
      await new Promise((resolve) => setTimeout(resolve, speed));
    }
  } finally {
    //stopTypingSound();
  }
};

const createResultNode = (segments) => {
  const frag = document.createDocumentFragment();
  for (const seg of segments) {
    const span = document.createElement("span");
    span.textContent = seg.text || "";
    if (seg.class) span.className = seg.class;
    frag.appendChild(span);
  }
  return frag;
};

export const scrollResult = async (segments, signal) => {
  const content = document.getElementById("terminal-content");
  if (!content) return;

  showPrompt(false);

  if (!content.hasChildNodes() && !content.textContent) {
    content.appendChild(createResultNode(segments));
    return;
  }

  const container = document.createElement("div");
  container.style.position = "relative";
  container.style.display = "inline-block";
  container.style.verticalAlign = "bottom";

  const oldLine = document.createElement("div");
  while (content.firstChild) {
    oldLine.appendChild(content.firstChild);
  }
  oldLine.style.transition =
    "transform 0.3s ease-in-out, opacity 0.3s ease-in-out";

  const newLine = document.createElement("div");
  newLine.appendChild(createResultNode(segments));
  newLine.style.position = "absolute";
  newLine.style.top = "100%";
  newLine.style.left = "0";
  newLine.style.whiteSpace = "nowrap";
  newLine.style.transition =
    "transform 0.3s ease-in-out, opacity 0.3s ease-in-out";

  container.appendChild(oldLine);
  container.appendChild(newLine);

  content.textContent = "";
  content.appendChild(container);

  void container.offsetWidth; // trigger reflow

  oldLine.style.transform = `translateY(-100%)`;
  oldLine.style.opacity = "0";
  newLine.style.transform = `translateY(-100%)`;

  await new Promise((resolve) => setTimeout(resolve, 300));
  if (signal.aborted) return;

  content.textContent = "";
  content.appendChild(createResultNode(segments));
};
