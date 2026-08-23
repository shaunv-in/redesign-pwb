import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

// Lazy-loaded: these pull in react-hook-form, zod, pdf-lib, recharts, and
// other heavy dependencies Home never touches. Splitting them into their
// own chunks keeps the initial Home bundle to what it actually needs.
const RentalApplication = lazy(() => import("@/pages/RentalApplication"));
const Admin = lazy(() => import("@/pages/Admin"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function Router() {
  return (
    <Suspense fallback={null}>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/apply/300-centre"} component={RentalApplication} />
        <Route path={"/admin"} component={Admin} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
