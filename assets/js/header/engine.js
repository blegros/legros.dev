import { setFace, setReaction } from "./avatar.js";
import { typeText, scrollResult } from "./terminal.js";

export const playScene = async (script, signal) => {
  for (const stage of script.stages) {
    if (signal.aborted) return;

    if (stage.face) setFace(stage.face);
    if (stage.reaction) setReaction(stage.reaction);

    if (stage.type === "typing") {
      await typeText(stage.text, signal);
    } else if (stage.type === "result") {
      await scrollResult(stage.html, signal);
    }

    if (signal.aborted) return;
    if (stage.delayAfter) {
      await new Promise((resolve) => setTimeout(resolve, stage.delayAfter));
    }
  }
};
