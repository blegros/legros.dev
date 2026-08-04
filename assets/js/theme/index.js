function initThemeToggle() {
  const toggleBtn = document.getElementById("theme-toggle");
  if (!toggleBtn) return;

  toggleBtn.addEventListener("click", () => {
    let currentTheme = document.documentElement.getAttribute("data-theme");
    
    // If not set explicitly, compute from system
    if (!currentTheme) {
      currentTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    const newTheme = currentTheme === "dark" ? "light" : "dark";
    
    document.documentElement.setAttribute("data-theme", newTheme);
    try {
      localStorage.setItem("theme", newTheme);
    } catch (e) {
      // Ignore localStorage errors (e.g., privacy modes)
    }
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initThemeToggle);
} else {
  initThemeToggle();
}
