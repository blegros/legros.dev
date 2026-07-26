export const successTestScript = {
  name: "Success Test",
  stages: [
    {
      type: "typing",
      text: "npm run test",
      face: "( ಠ_ʖಠ)",
      reaction: "💬",
      delayAfter: 1000,
    },
    {
      type: "result",
      html: '<span class="terminal-pass">PASS</span> <span class="terminal-success">✓</span> 42 tests passed',
      face: "( ^‿^ )",
      reaction: "✨",
      delayAfter: 5000,
    },
  ],
};

export const fixAndRetryScript = {
  name: "Fix and Retry",
  stages: [
    {
      type: "typing",
      text: "npm run test",
      face: "( ಠ_ʖಠ)",
      reaction: "💬",
      delayAfter: 1000,
    },
    {
      type: "result",
      html: '<span class="terminal-fail">FAIL</span> <span class="terminal-error">✕</span> 3 tests failed, 39 passed',
      face: "( ಠ_ʖಠ)",
      reaction: "💬",
      delayAfter: 3000,
    },
    {
      type: "typing",
      text: "npm run test",
      face: "( ಠ_ʖಠ)",
      reaction: "💬",
      delayAfter: 1000,
    },
    {
      type: "result",
      html: '<span class="terminal-pass">PASS</span> <span class="terminal-success">✓</span> 42 tests passed',
      face: "( ^‿^ )",
      reaction: "✨",
      delayAfter: 5000,
    },
  ],
};

export const scenes = [successTestScript, fixAndRetryScript];
