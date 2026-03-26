/* ==========================================================================
   NAVBAR — Warm Beige Minimalism
   Transparent on top, solid linen on scroll. No logo mark — name only.
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

  const borderColor = scrolled ? "#DDD5C8" : "transparent";
  const bg = scrolled ? "rgba(245, 240, 232, 0.97)" : "transparent";

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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "68px" }}>

          {/* Logo — name only */}
          <a href="#" style={{ textDecoration: "none" }}>
            <span style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: "1.1rem",
              fontWeight: 500,
              color: "#1C1A17",
              letterSpacing: "0.01em",
            }}>
              Shaun Vincent
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="md-flex" style={{ alignItems: "center", gap: "2.5rem" }}>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontSize: "0.82rem",
                  fontWeight: 400,
                  color: "#6B6055",
                  textDecoration: "none",
                  letterSpacing: "0.02em",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#1C1A17")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6B6055")}
              >
                {link.label}
              </a>
            ))}
            <a href="#contact" className="btn-primary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.78rem" }}>
              Work With Me
            </a>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md-hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: "none", border: "none", padding: "0.5rem", display: "flex", flexDirection: "column", gap: "5px" }}
            aria-label="Toggle menu"
          >
            <span style={{ display: "block", width: "22px", height: "1px", background: "#1C1A17", transition: "all 0.3s", transform: menuOpen ? "rotate(45deg) translate(4px, 4px)" : "none" }} />
            <span style={{ display: "block", width: "22px", height: "1px", background: "#1C1A17", transition: "all 0.3s", opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display: "block", width: "22px", height: "1px", background: "#1C1A17", transition: "all 0.3s", transform: menuOpen ? "rotate(-45deg) translate(4px, -4px)" : "none" }} />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ borderTop: "1px solid #DDD5C8", padding: "1.5rem 0", display: "flex", flexDirection: "column", gap: "1.25rem", background: "rgba(245, 240, 232, 0.98)" }}>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "1rem", color: "#1C1A17", textDecoration: "none" }}
              >
                {link.label}
              </a>
            ))}
            <a href="#contact" className="btn-primary" style={{ alignSelf: "flex-start" }} onClick={() => setMenuOpen(false)}>
              Work With Me
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
