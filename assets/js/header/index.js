import { setFace, setReaction } from "./avatar.js";
import { clearTerminal } from "./terminal.js";
import { playScene } from "./engine.js";
import { scenes } from "./scenes.js";

let currentController = null;
let isUserClosed = false;

const resetToInitialState = () => {
  clearTerminal();
  setFace("( ಠ◡ಠ)");
  setReaction("");
};

const startTerminalCycle = async () => {
  const header = document.querySelector("header");
  if (!header || isUserClosed) return;

  const mql = window.matchMedia("(max-width: 720px)");
  if (mql.matches) return;

  if (currentController) currentController.abort();
  currentController = new AbortController();
  const signal = currentController.signal;

  header.classList.remove("is-temp-hidden", "is-expanded");
  header.classList.add("is-opening");

  await new Promise((resolve) => setTimeout(resolve, 17000));
  if (signal.aborted) return;

  header.classList.remove("is-opening");
  header.classList.add("is-expanded");

  while (!signal.aborted) {
    const scene = scenes[Math.floor(Math.random() * scenes.length)];
    await playScene(scene, signal);

    if (signal.aborted) break;

    resetToInitialState();

    await new Promise((resolve) => setTimeout(resolve, 10000));
  }
};

window.tempReset = () => {
  const header = document.querySelector("header");
  if (!header) return;

  if (currentController) currentController.abort();

  header.classList.remove("is-opening", "is-expanded");
  header.classList.add("is-temp-hidden");
  resetToInitialState();
  void header.offsetWidth;
};

window.permanentClose = () => {
  const header = document.querySelector("header");
  if (!header) return;

  isUserClosed = true;
  if (currentController) currentController.abort();

  header.classList.remove("is-opening", "is-expanded", "is-temp-hidden");
  header.classList.add("is-permanently-closed");
  resetToInitialState();
  void header.offsetWidth;
};

const init = () => {
  const mql = window.matchMedia("(max-width: 720px)");
  mql.addEventListener("change", (e) => {
    if (e.matches) {
      window.tempReset();
    } else {
      startTerminalCycle();
    }
  });

  if (!mql.matches) startTerminalCycle();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
