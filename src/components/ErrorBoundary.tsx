import { AlertTriangle, RotateCcw } from "lucide-react";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      // Inline styles on purpose: this fallback must render even though the
      // home page doesn't load the Tailwind stylesheet (see portfolio.css).
      return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "2rem", background: "#F4F4F1", color: "#17140F", fontFamily: "system-ui, sans-serif" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: "42rem", padding: "2rem" }}>
            <AlertTriangle size={48} color="#C43D1E" style={{ marginBottom: "1.5rem", flexShrink: 0 }} />

            <h2 style={{ fontSize: "1.25rem", margin: "0 0 1rem" }}>An unexpected error occurred.</h2>

            <div style={{ padding: "1rem", width: "100%", borderRadius: 6, background: "#E9E9E4", overflow: "auto", marginBottom: "1.5rem" }}>
              <pre style={{ fontSize: "0.875rem", color: "#5F584A", whiteSpace: "break-spaces", margin: 0 }}>
                {this.state.error?.stack}
              </pre>
            </div>

            <button
              onClick={() => window.location.reload()}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", borderRadius: 999, border: "none", background: "#17140F", color: "#F4F4F1", font: "inherit", cursor: "pointer" }}
            >
              <RotateCcw size={16} />
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
