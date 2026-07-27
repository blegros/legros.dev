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
      segments: [
        { text: "PASS", class: "terminal-pass" },
        { text: " ✓ ", class: "terminal-success" },
        { text: "42 tests passed" },
      ],
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
      segments: [
        { text: "FAIL", class: "terminal-fail" },
        { text: " ✕ ", class: "terminal-error" },
        { text: "3 tests failed, 39 passed" },
      ],
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
      segments: [
        { text: "PASS", class: "terminal-pass" },
        { text: " ✓ ", class: "terminal-success" },
        { text: "42 tests passed" },
      ],
      face: "( ^‿^ )",
      reaction: "✨",
      delayAfter: 5000,
    },
  ],
};

export const scenes = [successTestScript, fixAndRetryScript];
