# Skill: Add Header Scene

This skill teaches the agent how to add a new scene to the terminal header animation on legros.dev.

## Concepts
From left to right in the header, there are:
1. **Avatar Face**: The developer's facial expression, built with ASCII art (e.g. `( ಠ◡ಠ)` or `( ಠ_ʖಠ)`).
2. **Reaction**: An emoji that adds emotion to the face (e.g. `✨`, `💬`, `⏳`).
3. **Keyboard**: A fixed icon.
4. **Terminal Line**: A single line CLI that can display EITHER:
   - A **Command Prompt** followed by **Typing Text**.
   - A **Result Text**.
   When a result text replaces typing text (or a previous result text), it slides up smoothly like a real terminal.
5. **Terminal Close Button**: Allows the user to permanently close the terminal.

## Architecture
- `assets/js/header/scenes.js`: Contains all the exported scene scripts.
- `assets/css/header.css`: Contains all terminal styling. Any new classes used in result HTML must be added here.

## How to add a scene
When requested to add a scene:
1. **Understand the Script**: A Script is a declarative configuration of stages.
   ```javascript
   export const myNewScript = {
     name: "Description of the scene",
     stages: [
       {
         type: "typing", // Simulates typing a command
         text: "command to type",
         face: "( ಠ_ʖಠ)",
         reaction: "💬",
         delayAfter: 1000 // ms to wait after typing finishes
       },
       {
         type: "result", // Replaces the terminal content by scrolling up
         html: '<span class="some-custom-class">Output text</span>',
         face: "( ^‿^ )",
         reaction: "✨",
         delayAfter: 5000
       }
     ]
   };
   ```
2. **Append to `scenes.js`**:
   - Open `assets/js/header/scenes.js`.
   - Append the new script constant.
   - Add the new script constant to the `scenes` array export at the bottom of the file.
3. **Add CSS (if needed)**:
   - If the `html` of a result stage introduces new classes (like `<span class="terminal-deploy">`), append the styles to `assets/css/header.css`.
