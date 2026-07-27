import * as params from "@params";

console.log(
  "%c Welcome to legros.dev! ( ^‿^ ) ",
  "background: #333; color: #fff; font-size: 14px; font-weight: bold; border-radius: 4px; padding: 8px 4px;",
);

console.log(
  "You may have noticed, if you sit on any page long enough, the header wakes up and performs random scenes based on scripts preprogrammed into site.  I wanted to allow others to mess around and perform their own scenes instead of always having to watch mine.  If you like yours enough, share it with me and, if I like it too, I'll add it to the catalogue."
);

console.log(
  "Use %cdev.legros.help()%c to see the available docs for the namespace.",
  "font-weight: bold; color: #4caf50;",
  "color: inherit; font-size: 12px; font-family: monospace;",
);

console.log(
  "%cAlso, while you're here, take a look at how I've organized markup, styles, and scripts and let me know what you think.  Enjoy!",
  "color: inherit; font-size: 12px; font-family: monospace;",
);

window.dev = window.dev || {};
window.dev.legros = window.dev.legros || {};

function validateScene(sceneObj) {
  if (typeof sceneObj !== "object" || sceneObj === null) {
    console.error("Invalid input: runScene expects a JavaScript object.");
    return false;
  }

  if (!Array.isArray(sceneObj.stages)) {
    console.error('Invalid scene: must contain a "stages" array.');
    return false;
  }

  for (let index = 0; index < sceneObj.stages.length; index++) {
    const stage = sceneObj.stages[index];
    if (stage.type !== "typing" && stage.type !== "result") {
      console.error(
        `Invalid scene: stage ${index} must have type "typing" or "result".`,
      );
      return false;
    }
    if (stage.type === "typing" && typeof stage.text !== "string") {
      console.error(
        `Invalid scene: stage ${index} of type "typing" must have a "text" string.`,
      );
      return false;
    }
    if (stage.type === "result" && !Array.isArray(stage.segments)) {
      console.error(
        `Invalid scene: stage ${index} of type "result" must have a "segments" array.`,
      );
      return false;
    }
  }

  return true;
}

window.dev.legros.runScene = function (sceneObj) {
  if (!validateScene(sceneObj)) {
    return;
  }

  console.log("Valid scene data received. Dispatching to engine...");
  const event = new CustomEvent("play-custom-scene", { detail: sceneObj });
  window.dispatchEvent(event);
};

window.dev.legros.shareScene = function (sceneObj) {
  if (!validateScene(sceneObj)) {
    return;
  }

  const subject = `I made a legros.dev scene: ${sceneObj.name || "Untitled Scene"}`;
  const body = `--- LEGROS.DEV SCENE SUBMISSION ---\n\n${JSON.stringify(sceneObj, null, 2)}`;

  const mailtoLink = `mailto:${params.authorEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  console.log(
    "%c Opening your email client to share the scene... ",
    "background: #4caf50; color: #fff; font-size: 12px; font-weight: bold; border-radius: 4px; padding: 2px 4px;",
  );
  window.location.href = mailtoLink;
};

window.dev.legros.help = function () {
  console.log("%c► runScene(sceneObj)", "font-weight: bold; color: #4caf50;");
  console.log("Executes a custom animated scene in the header terminal.");
  console.log("Usage: window.dev.legros.runScene({ ... })");
  console.log(`Expected format:
{
  name: "My Custom Scene",
  stages: [
    {
      type: "typing", 
      text: "npm run test",
      face: "( ಠ_ʖಠ)", // optional
      reaction: "💬", // optional
      delayAfter: 1000
    },
    {
      type: "result", 
      segments: [
        { text: "PASS", class: "terminal-pass" },
        { text: " 42 tests passed" }
      ],
      face: "( ^‿^ )",
      reaction: "✨",
      delayAfter: 5000
    }
  ]
}`);

  console.log(
    "\n%c► shareScene(sceneObj)",
    "font-weight: bold; color: #4caf50;",
  );
  console.log(
    "Generates a mailto: link to share your scene directly with the author.",
  );
  console.log("Usage: window.dev.legros.shareScene({ ... })");
  console.log("Expected format: Exact same sceneObj format as runScene()");

  console.log("\n%c► help()", "font-weight: bold; color: #4caf50;");
  console.log("Displays this help documentation.");
};

Object.freeze(window.dev.legros);
Object.freeze(window.dev);
