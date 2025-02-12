import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { RelayEnvironmentProvider } from "react-relay";
import { BrowserRouter, Route, Routes } from "react-router";
import "App.css";
import ErrorBoundary from "./components/ErrorBoundary";
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
      <ErrorBoundary fallback={<p>Something went wrong</p>}>
        <PostHogProvider client={posthog}>
          <RelayEnvironmentProvider environment={RelayEnvironment}>
            <HelmetProvider>
              <BrowserRouter>
                <Suspense>
                  <Routes>
                    <Route path="/" element={<ConsoleLayout />}>
                      <Route index element={<HomePage />} />
                      <Route path="/peoples" element={<PeoplesPage />} />
                      <Route path="/vendors" element={<VendorList />} />
                      <Route path="/frameworks" element={<FrameworksPage />} />
                      <Route path="/frameworks/:frameworkId" element={<FrameworkOverviewPage />} />
                    </Route>
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Suspense>
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
