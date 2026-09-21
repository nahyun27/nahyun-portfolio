export type Theme = "light" | "dark";

export function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

/** the single place that switches theme: sets the attribute, remembers it, animates the colours */
export function applyTheme(next: Theme) {
  const root = document.documentElement;
  root.classList.add("theme-anim");
  root.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch {
    // storage can be blocked, the switch still works for this visit
  }
  window.setTimeout(() => root.classList.remove("theme-anim"), 450);
}
