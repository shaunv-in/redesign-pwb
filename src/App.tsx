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

// Home is eagerly imported and never suspends, so it's kept out of the
// Suspense boundary below — wrapping it anyway broke hydration for the
// prerendered "/" route: renderToString() doesn't emit the boundary
// markers streaming SSR does, so the client tree (with a Suspense
// boundary) didn't match the server tree (without one), even though
// nothing ever actually suspended.
function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/apply/300-centre"}>
        <Suspense fallback={null}>
          <RentalApplication />
        </Suspense>
      </Route>
      <Route path={"/admin"}>
        <Suspense fallback={null}>
          <Admin />
        </Suspense>
      </Route>
      <Route path={"/404"}>
        <Suspense fallback={null}>
          <NotFound />
        </Suspense>
      </Route>
      <Route>
        <Suspense fallback={null}>
          <NotFound />
        </Suspense>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <Router />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
