/* ==========================================================================
   THEME TOGGLE — flips <html data-theme> between light and dark and saves
   the choice. The initial value is set before paint by the inline script in
   index.html (saved choice, else OS preference). Until the visitor makes a
   choice, OS theme changes are followed live.

   Both icons are always rendered and CSS shows the right one, so the
   prerendered markup is identical regardless of theme (no hydration
   mismatch, no icon flash).
   ========================================================================== */

import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";

const KEY = "pf-theme";

function readSaved(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export default function ThemeToggle() {
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      if (readSaved()) return;
      document.documentElement.setAttribute("data-theme", e.matches ? "dark" : "light");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggle = () => {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* private mode: the choice just won't persist */
    }
  };

  return (
    <button type="button" className="pf-icon-btn pf-theme-toggle" onClick={toggle} aria-label="Switch between light and dark theme">
      <Moon className="pf-icon-moon" size={18} strokeWidth={1.75} aria-hidden="true" />
      <Sun className="pf-icon-sun" size={18} strokeWidth={1.75} aria-hidden="true" />
    </button>
  );
}
