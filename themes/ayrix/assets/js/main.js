const STORAGE_KEY = "ayrix-theme";

function getPreferredTheme() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(STORAGE_KEY, theme);
}

function initThemeToggle() {
  applyTheme(getPreferredTheme());
  document.querySelectorAll("#theme-toggle, #theme-toggle-mobile").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(next);
    });
  });
}

function markActiveNav() {
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  document.querySelectorAll(".app-nav a, .app-tabbar a").forEach((link) => {
    const href = link.getAttribute("href")?.replace(/\/$/, "") || "/";
    const active = href === path || (href !== "/" && path.startsWith(href));
    link.classList.toggle("is-active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

initThemeToggle();
markActiveNav();
