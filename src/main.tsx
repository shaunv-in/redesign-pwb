import { createRoot } from "react-dom/client";
import App from "./App";
import { loadAnalytics } from "./lib/analytics";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
loadAnalytics();
