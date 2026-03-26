/* ==========================================================================
   FOOTER — Warm Beige Minimalism
   Minimal single-row footer with name, links, copyright.
   ========================================================================== */

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: "#1C1A17", padding: "3rem 0" }}>
      <div className="container">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1.5rem",
          }}
        >
          {/* Name */}
          <span style={{
            fontFamily: "'Libre Baskerville', serif",
            fontSize: "1rem",
            fontWeight: 700,
            color: "#F5F0E8",
            letterSpacing: "0.01em",
          }}>
            Shaun Vincent
          </span>

          {/* Links */}
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            {[
              { label: "LinkedIn", href: "https://www.linkedin.com/in/shaunvnzt/" },
              { label: "Dribbble", href: "https://dribbble.com/shaunvnzt" },
              { label: "Behance", href: "https://www.behance.net/shaunvnzt" },
              { label: "Side Lane Studio", href: "https://www.sidelanestudio.com/" },
              { label: "shaun@shaunvincent.net", href: "mailto:shaun@shaunvincent.net" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "0.68rem",
                  letterSpacing: "0.08em",
                  color: "rgba(245, 240, 232, 0.4)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#F5F0E8")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(245, 240, 232, 0.4)")}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "0.65rem",
            letterSpacing: "0.08em",
            color: "rgba(245, 240, 232, 0.25)",
          }}>
            © {year}
          </span>
        </div>
      </div>
    </footer>
  );
}
