/* ==========================================================================
   NAVBAR — floating pill that frosts in once the page leaves the top.
   "Scrolled" is driven by an IntersectionObserver on a sentinel at the top
   of the page (see Home.tsx), not a scroll listener.
   ========================================================================== */

import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export const navLinks = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById("pf-top-sentinel");
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting));
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  return (
    <header className={`pf-nav${scrolled ? " is-scrolled" : ""}${menuOpen ? " is-open" : ""}`}>
      <div className="container">
        <div className="pf-nav-bar">
          <a href="#hero" className="pf-wordmark" style={{ textDecoration: "none", color: "var(--pf-ink)" }}>
            Shaun Vincent
          </a>

          <nav className="pf-nav-links" aria-label="Primary">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="pf-nav-link">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pf-nav-actions">
            <ThemeToggle />
            <a href="#contact" className="pf-btn pf-btn-sm pf-nav-cta">
              Work With Me
            </a>
            <button
              type="button"
              className="pf-icon-btn pf-nav-menu-btn"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="pf-mobile-menu"
            >
              {menuOpen ? <X size={20} strokeWidth={1.75} /> : <Menu size={20} strokeWidth={1.75} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav id="pf-mobile-menu" className="pf-nav-sheet" aria-label="Mobile">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={close}>
                {link.label}
              </a>
            ))}
            <a href="#contact" className="pf-btn" onClick={close}>
              Work With Me <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" />
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
