import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { RelayEnvironmentProvider } from "react-relay";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import "App.css";
import ErrorBoundary from "./components/ErrorBoundary";
import ConsoleLayout from "./layouts/ConsoleLayout";
import AuthLayout from "./layouts/AuthLayout";
import { RelayEnvironment } from "./RelayEnvironment";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

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
const PeopleListPage = lazy(() => import("./pages/PeopleListPage"));
const VendorListPage = lazy(() => import("./pages/VendorListPage"));
const FrameworkListPage = lazy(() => import("./pages/FrameworkListPage"));
const VendorOverviewPage = lazy(() => import("./pages/VendorOverviewPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const CreatePeoplePage = lazy(() => import("./pages/CreatePeoplePage"));
const FrameworkOverviewPage = lazy(
  () => import("./pages/FrameworkOverviewPage")
);
const ControlOverviewPage = lazy(() => import("./pages/ControlOverviewPage"));
const PeopleOverviewPage = lazy(() => import("./pages/PeopleOverviewPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));

function App() {
  return (
    <StrictMode>
      <ErrorBoundary key={location.pathname}>
        <PostHogProvider client={posthog}>
          <RelayEnvironmentProvider environment={RelayEnvironment}>
            <HelmetProvider>
              <BrowserRouter>
                <AuthProvider>
                  <Routes>
                    {/* Authentication Routes - Accessible without login */}
                    <Route
                      path="/login"
                      element={
                        <ErrorBoundaryWithLocation>
                          <AuthLayout />
                        </ErrorBoundaryWithLocation>
                      }
                    >
                      <Route
                        index
                        element={
                          <Suspense>
                            <ErrorBoundaryWithLocation>
                              <LoginPage />
                            </ErrorBoundaryWithLocation>
                          </Suspense>
                        }
                      />
                    </Route>

                    <Route
                      path="/register"
                      element={
                        <ErrorBoundaryWithLocation>
                          <AuthLayout />
                        </ErrorBoundaryWithLocation>
                      }
                    >
                      <Route
                        index
                        element={
                          <Suspense>
                            <ErrorBoundaryWithLocation>
                              <RegisterPage />
                            </ErrorBoundaryWithLocation>
                          </Suspense>
                        }
                      />
                    </Route>

                    {/* Protected Routes - Require authentication */}
                    <Route element={<ProtectedRoute />}>
                      <Route
                        path="/*"
                        element={
                          <ErrorBoundaryWithLocation>
                            <ConsoleLayout />
                          </ErrorBoundaryWithLocation>
                        }
                      >
                        <Route
                          index
                          element={
                            <Suspense>
                              <ErrorBoundaryWithLocation>
                                <HomePage />
                              </ErrorBoundaryWithLocation>
                            </Suspense>
                          }
                        />
                        <Route
                          path="peoples"
                          element={
                            <Suspense>
                              <ErrorBoundaryWithLocation>
                                <PeopleListPage />
                              </ErrorBoundaryWithLocation>
                            </Suspense>
                          }
                        />
                        <Route
                          path="peoples/create"
                          element={
                            <Suspense>
                              <ErrorBoundaryWithLocation>
                                <CreatePeoplePage />
                              </ErrorBoundaryWithLocation>
                            </Suspense>
                          }
                        />
                        <Route
                          path="peoples/:peopleId"
                          element={
                            <Suspense>
                              <ErrorBoundaryWithLocation>
                                <PeopleOverviewPage />
                              </ErrorBoundaryWithLocation>
                            </Suspense>
                          }
                        />
                        <Route
                          path="vendors"
                          element={
                            <Suspense>
                              <ErrorBoundaryWithLocation>
                                <VendorListPage />
                              </ErrorBoundaryWithLocation>
                            </Suspense>
                          }
                        />
                        <Route
                          path="frameworks"
                          element={
                            <Suspense>
                              <ErrorBoundaryWithLocation>
                                <FrameworkListPage />
                              </ErrorBoundaryWithLocation>
                            </Suspense>
                          }
                        />
                        <Route
                          path="frameworks/:frameworkId"
                          element={
                            <Suspense>
                              <ErrorBoundaryWithLocation>
                                <FrameworkOverviewPage />
                              </ErrorBoundaryWithLocation>
                            </Suspense>
                          }
                        />
                        <Route
                          path="frameworks/:frameworkId/controls/:controlId"
                          element={
                            <Suspense>
                              <ErrorBoundaryWithLocation>
                                <ControlOverviewPage />
                              </ErrorBoundaryWithLocation>
                            </Suspense>
                          }
                        />
                        <Route
                          path="vendors/:vendorId"
                          element={
                            <Suspense>
                              <ErrorBoundaryWithLocation>
                                <VendorOverviewPage />
                              </ErrorBoundaryWithLocation>
                            </Suspense>
                          }
                        />
                        <Route
                          path="settings"
                          element={
                            <Suspense>
                              <ErrorBoundaryWithLocation>
                                <SettingsPage />
                              </ErrorBoundaryWithLocation>
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
                    </Route>
                  </Routes>
                </AuthProvider>
              </BrowserRouter>
            </HelmetProvider>
          </RelayEnvironmentProvider>
        </PostHogProvider>
      </ErrorBoundary>
    </StrictMode>
  );
}

function ErrorBoundaryWithLocation({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  return <ErrorBoundary key={location.pathname}>{children}</ErrorBoundary>;
}

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<App />);
