/* ==========================================================================
   NAVBAR — name, transparent-to-solid on scroll.
   ========================================================================== */

import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Work", href: "#work" },
    { label: "Contact", href: "#contact" },
  ];

  const borderColor = scrolled || menuOpen ? "var(--pf-line)" : "transparent";
  const bg = menuOpen ? "var(--pf-paper)" : scrolled ? "rgba(244, 244, 241, 0.94)" : "transparent";

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: bg,
        borderBottom: `1px solid ${borderColor}`,
        backdropFilter: scrolled ? "blur(10px)" : "none",
        transition: "background 0.35s ease, border-color 0.35s ease",
      }}
    >
      <div className="container">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "72px" }}>
          {/* Name */}
          <a href="#hero" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
            <span className="pf-wordmark" style={{ color: "var(--pf-ink)" }}>
              Shaun Vincent
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="md-flex" style={{ alignItems: "center", gap: "2.25rem" }}>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  fontSize: "0.88rem",
                  fontWeight: 500,
                  color: "var(--pf-ink-soft)",
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--pf-ink)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--pf-ink-soft)")}
              >
                {link.label}
              </a>
            ))}
            <a href="#contact" className="pf-btn" style={{ padding: "0.6rem 1.4rem", fontSize: "0.8rem" }}>
              Work With Me
            </a>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md-hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: "none", border: "none", padding: "0.5rem", display: "flex", flexDirection: "column", gap: "5px" }}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span style={{ display: "block", width: "22px", height: "1.5px", background: "var(--pf-ink)", transition: "all 0.3s", transform: menuOpen ? "rotate(45deg) translate(4px, 4px)" : "none" }} />
            <span style={{ display: "block", width: "22px", height: "1.5px", background: "var(--pf-ink)", transition: "all 0.3s", opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display: "block", width: "22px", height: "1.5px", background: "var(--pf-ink)", transition: "all 0.3s", transform: menuOpen ? "rotate(-45deg) translate(4px, -4px)" : "none" }} />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ borderTop: "1px solid var(--pf-line)", padding: "1.5rem 0", display: "flex", flexDirection: "column", gap: "1.25rem", background: "var(--pf-paper)" }}>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{ fontSize: "1rem", color: "var(--pf-ink)", textDecoration: "none", fontWeight: 500 }}
              >
                {link.label}
              </a>
            ))}
            <a href="#contact" className="pf-btn" style={{ alignSelf: "flex-start" }} onClick={() => setMenuOpen(false)}>
              Work With Me
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
