/* ==========================================================================
   FOOTER — brand + tagline, site nav, and connect links in three columns,
   with a bottom bar for copyright and a back-to-top affordance.
   ========================================================================== */

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

const connectLinks = [
  { label: "Dribbble", href: "https://dribbble.com/shaunvnzt" },
  { label: "Behance", href: "https://www.behance.net/shaunvnzt" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/shaunvnzt/" },
  { label: "Side Lane Studio", href: "https://www.sidelanestudio.com/" },
];

const linkStyle: React.CSSProperties = {
  fontSize: "0.88rem",
  color: "rgba(244, 244, 241, 0.55)",
  textDecoration: "none",
  transition: "color 0.2s",
};

function FooterLink({ label, href }: { label: string; href: string }) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      style={linkStyle}
      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--pf-paper)")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(244, 244, 241, 0.55)")}
    >
      {label}
      {external ? " ↗" : ""}
    </a>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  const backToTop = () => {
    document.getElementById("hero")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <footer style={{ background: "var(--pf-footer)" }}>
      <div className="container">
        <div className="pf-footer-grid" style={{ padding: "5rem 0 3.5rem" }}>
          {/* Brand + CTA */}
          <div>
            <a href="#hero" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
              <span className="pf-wordmark" style={{ color: "var(--pf-paper)" }}>
                Shaun Vincent
              </span>
            </a>
            <p style={{ fontSize: "0.88rem", color: "rgba(244, 244, 241, 0.55)", lineHeight: 1.7, margin: "1rem 0 1.5rem", maxWidth: "300px" }}>
              UI/UX & visual designer based in Winnipeg, currently open to select freelance work.
            </p>
            <a
              href="mailto:shaun@shaunvincent.net"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.95rem", fontWeight: 600, color: "var(--pf-paper)", textDecoration: "none" }}
            >
              Say hello <span style={{ color: "var(--pf-pen)" }}>→</span>
            </a>
          </div>

          {/* Navigate */}
          <div>
            <span className="pf-mono" style={{ display: "block", marginBottom: "1.25rem", fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(244, 244, 241, 0.55)" }}>
              Navigate
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {navLinks.map((link) => (
                <FooterLink key={link.label} {...link} />
              ))}
            </div>
          </div>

          {/* Connect */}
          <div>
            <span className="pf-mono" style={{ display: "block", marginBottom: "1.25rem", fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(244, 244, 241, 0.55)" }}>
              Connect
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {connectLinks.map((link) => (
                <FooterLink key={link.label} {...link} />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(244, 244, 241, 0.12)",
            padding: "1.5rem 0",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <span className="pf-mono" style={{ fontSize: "0.65rem", letterSpacing: "0.08em", color: "rgba(244, 244, 241, 0.55)" }}>
            © {year} Shaun Vincent
          </span>
          <button
            type="button"
            onClick={backToTop}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "none",
              border: "none",
              padding: 0,
              fontSize: "0.78rem",
              color: "rgba(244, 244, 241, 0.5)",
              cursor: "pointer",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--pf-paper)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(244, 244, 241, 0.5)")}
            aria-label="Back to top"
          >
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
