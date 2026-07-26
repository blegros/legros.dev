export const setFace = (text) => {
  const el = document.getElementById("avatar-face");
  if (el) el.textContent = text;
};

export const setReaction = (emoji) => {
  const el = document.getElementById("avatar-reaction");
  if (el) el.textContent = emoji;
};
