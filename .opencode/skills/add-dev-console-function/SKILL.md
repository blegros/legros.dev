# add-dev-console-function

This skill provides the workflow and requirements for adding a new function to the `window.dev.legros` Developer Console namespace on legros.dev, and keeping the `help` documentation updated.

## Trigger
Use this skill when the user asks to "add a function to the dev console", "add a command to window.dev.legros", or similar requests related to the `dev.legros` namespace.

## Instructions

1. **Locate the Dev Console Module:** 
   The primary file for the dev console namespace is located at:
   `assets/js/dev/index.js`

2. **Add the Function:**
   Define your new function on the `window.dev.legros` namespace BEFORE the `Object.freeze()` calls at the bottom of the file. 
   ```javascript
   window.dev.legros.myNewFunction = function(arg) {
     // ... implementation ...
   };
   ```

3. **Update the Help Documentation:**
   Locate `window.dev.legros.help` in the same file. You must add documentation for your new function so it appears when users type `window.dev.legros.help()`.
   Follow the existing stylistic convention using styled `console.log`:
   
   ```javascript
   console.log("%c► myNewFunction(arg)", "font-weight: bold; color: #4caf50;");
   console.log("Brief description of what the function does.");
   console.log("Usage: window.dev.legros.myNewFunction('example')");
   ```

4. **Preserve Namespace Freeze:**
   Ensure that these lines remain strictly at the bottom of `assets/js/dev/index.js` after your additions:
   ```javascript
   Object.freeze(window.dev.legros);
   Object.freeze(window.dev);
   ```

5. **Verify Changes:**
   Run `npx prettier --write assets/js/dev/index.js` to ensure the styling matches the project conventions.
   Run `hugo` to confirm there are no syntax or build errors.
