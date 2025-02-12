import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { RelayEnvironmentProvider } from "react-relay";
import { BrowserRouter, Route, Routes } from "react-router";
import "App.css";
import ErrorBoundary from "./components/ErrorBoundary";
import { ErrorPage } from "./pages/ErrorPage";
import ConsoleLayout from "./layouts/ConsoleLayout";
import { RelayEnvironment } from "./RelayEnvironment";

posthog.init(process.env.POSTHOG_KEY!, {
  api_host: process.env.POSTHOG_HOST,
  session_recording: {
    maskAllInputs: true,
  },
  loaded: (posthog) => {
    if (!process.env.POSTHOG_KEY) posthog.debug();
  },
});

const HomePage = lazy(() => import("./pages/HomePage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const PeoplesPage = lazy(() => import("./pages/PeoplesPage"));
const VendorList = lazy(() => import("./pages/VendorList"));
const FrameworksPage = lazy(() => import("./pages/FrameworksPage"));
const FrameworkOverviewPage = lazy(() => import("./pages/FrameworkOverviewPage"));

function App() {
  return (
    <StrictMode>
      <ErrorBoundary>
        <PostHogProvider client={posthog}>
          <RelayEnvironmentProvider environment={RelayEnvironment}>
            <HelmetProvider>
              <BrowserRouter>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <ErrorBoundary>
                        <ConsoleLayout />
                      </ErrorBoundary>
                    }
                  >
                    <Route
                      index
                      element={
                        <Suspense>
                          <ErrorBoundary>
                            <HomePage />
                          </ErrorBoundary>
                        </Suspense>
                      }
                    />
                    <Route
                      path="/peoples"
                      element={
                        <Suspense>
                          <ErrorBoundary>
                            <PeoplesPage />
                          </ErrorBoundary>
                        </Suspense>
                      }
                    />
                    <Route
                      path="/vendors"
                      element={
                        <Suspense>
                          <ErrorBoundary>
                            <VendorList />
                          </ErrorBoundary>
                        </Suspense>
                      }
                    />
                    <Route
                      path="/frameworks"
                      element={
                        <Suspense>
                          <ErrorBoundary>
                            <FrameworksPage />
                          </ErrorBoundary>
                        </Suspense>
                      }
                    />
                    <Route
                      path="/frameworks/:frameworkId"
                      element={
                        <Suspense>
                          <ErrorBoundary>
                            <FrameworkOverviewPage />
                          </ErrorBoundary>
                        </Suspense>
                      }
                    />
                    <Route
                      path="*"
                      element={
                        <Suspense>
                          <NotFoundPage />
                        </Suspense>
                      }
                    />
                  </Route>
                </Routes>
              </BrowserRouter>
            </HelmetProvider>
          </RelayEnvironmentProvider>
        </PostHogProvider>
      </ErrorBoundary>
    </StrictMode>
  );
}

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<App />);
