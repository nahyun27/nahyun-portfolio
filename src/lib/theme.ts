export type Theme = "light" | "dark";

export function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function setTheme(next: Theme, animateColours: boolean) {
  const root = document.documentElement;
  if (animateColours) root.classList.add("theme-anim");
  root.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch {
    // storage can be blocked, the switch still works for this visit
  }
  if (animateColours) window.setTimeout(() => root.classList.remove("theme-anim"), 450);
}

let switching = false;

/**
 * The single place that switches theme. Day and night are two different rooms, so the switch is a
 * short scene: banks of light go off (or on) across the screen, the room changes behind them, and
 * the veil lifts. Reduced motion gets the plain colour fade.
 */
export function applyTheme(next: Theme) {
  if (switching) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !document.body) {
    setTheme(next, true);
    return;
  }

  switching = true;
  const veil = document.createElement("div");
  veil.className = "lights";
  veil.dataset.to = next;
  veil.setAttribute("aria-hidden", "true");
  const banks = 5;
  for (let i = 0; i < banks; i++) {
    const bank = document.createElement("span");
    // night falls left to right, morning comes back right to left
    bank.style.setProperty("--i", String(next === "dark" ? i : banks - 1 - i));
    veil.appendChild(bank);
  }
  const caption = document.createElement("b");
  caption.textContent = next === "dark" ? "Lights off." : "Good morning.";
  veil.appendChild(caption);
  document.body.appendChild(veil);

  // let the veil paint transparent once, then fade the banks in
  requestAnimationFrame(() => requestAnimationFrame(() => veil.classList.add("is-in")));

  const covered = 0.34 * 1000 + (banks - 1) * 80 + 260;
  window.setTimeout(() => {
    setTheme(next, false);
    veil.classList.add("is-out");
    window.setTimeout(() => {
      veil.remove();
      switching = false;
    }, 750);
  }, covered);
}
