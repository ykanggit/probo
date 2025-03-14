import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { RelayEnvironmentProvider } from "react-relay";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import "./App.css";
import "./styles/policy-content.css";
import ErrorBoundary from "./components/ErrorBoundary";
import ConsoleLayout from "./layouts/ConsoleLayout";
import AuthLayout from "./layouts/AuthLayout";
import { RelayEnvironment } from "./RelayEnvironment";
import VisitorErrorBoundary from "./components/VisitorErrorBoundary";

posthog.init(process.env.POSTHOG_KEY!, {
  api_host: process.env.POSTHOG_HOST,
  session_recording: {
    maskAllInputs: true,
  },
  loaded: (posthog) => {
    if (!process.env.POSTHOG_KEY) posthog.debug();
  },
});

const OrganizationSelectionPage = lazy(
  () => import("./pages/OrganizationSelectionPage")
);
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
const ConfirmEmailPage = lazy(() => import("./pages/ConfirmEmailPage"));
const ConfirmInvitationPage = lazy(
  () => import("./pages/ConfirmInvitationPage")
);
const CreateOrganizationPage = lazy(
  () => import("./pages/CreateOrganizationPage")
);
const CreateFrameworkPage = lazy(() => import("./pages/CreateFrameworkPage"));
const CreateControlPage = lazy(() => import("./pages/CreateControlPage"));
const UpdateFrameworkPage = lazy(() => import("./pages/UpdateFrameworkPage"));
const UpdateControlPage = lazy(() => import("./pages/UpdateControlPage"));
// Policy pages
const PolicyListPage = lazy(() => import("./pages/PolicyListPage"));
const PolicyOverviewPage = lazy(() => import("./pages/PolicyOverviewPage"));
const CreatePolicyPage = lazy(() => import("./pages/CreatePolicyPage"));
const UpdatePolicyPage = lazy(() => import("./pages/UpdatePolicyPage"));

function App() {
  return (
    <StrictMode>
      <PostHogProvider client={posthog}>
        <RelayEnvironmentProvider environment={RelayEnvironment}>
          <HelmetProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/*">
                  <Route
                    index
                    element={
                      <Suspense>
                        <ErrorBoundaryWithLocation>
                          <OrganizationSelectionPage />
                        </ErrorBoundaryWithLocation>
                      </Suspense>
                    }
                  />

                  <Route path="organizations/*" element={<ConsoleLayout />}>
                    <Route
                      path="create"
                      element={
                        <Suspense>
                          <ErrorBoundaryWithLocation>
                            <CreateOrganizationPage />
                          </ErrorBoundaryWithLocation>
                        </Suspense>
                      }
                    />
                    <Route path=":organizationId">
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
                        path="people"
                        element={
                          <Suspense>
                            <ErrorBoundaryWithLocation>
                              <PeopleListPage />
                            </ErrorBoundaryWithLocation>
                          </Suspense>
                        }
                      />
                      <Route
                        path="people/create"
                        element={
                          <Suspense>
                            <ErrorBoundaryWithLocation>
                              <CreatePeoplePage />
                            </ErrorBoundaryWithLocation>
                          </Suspense>
                        }
                      />
                      <Route
                        path="people/:peopleId"
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
                        path="frameworks/create"
                        element={
                          <Suspense>
                            <ErrorBoundaryWithLocation>
                              <CreateFrameworkPage />
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
                        path="frameworks/:frameworkId/update"
                        element={
                          <Suspense>
                            <ErrorBoundaryWithLocation>
                              <UpdateFrameworkPage />
                            </ErrorBoundaryWithLocation>
                          </Suspense>
                        }
                      />
                      <Route
                        path="frameworks/:frameworkId/controls/create"
                        element={
                          <Suspense>
                            <ErrorBoundaryWithLocation>
                              <CreateControlPage />
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
                        path="frameworks/:frameworkId/controls/:controlId/update"
                        element={
                          <Suspense>
                            <ErrorBoundaryWithLocation>
                              <UpdateControlPage />
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
                      {/* Policy Routes */}
                      <Route
                        path="policies"
                        element={
                          <Suspense>
                            <ErrorBoundaryWithLocation>
                              <PolicyListPage />
                            </ErrorBoundaryWithLocation>
                          </Suspense>
                        }
                      />
                      <Route
                        path="policies/create"
                        element={
                          <Suspense>
                            <ErrorBoundaryWithLocation>
                              <CreatePolicyPage />
                            </ErrorBoundaryWithLocation>
                          </Suspense>
                        }
                      />
                      <Route
                        path="policies/:policyId"
                        element={
                          <Suspense>
                            <ErrorBoundaryWithLocation>
                              <PolicyOverviewPage />
                            </ErrorBoundaryWithLocation>
                          </Suspense>
                        }
                      />
                      <Route
                        path="policies/:policyId/update"
                        element={
                          <Suspense>
                            <ErrorBoundaryWithLocation>
                              <UpdatePolicyPage />
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
                    </Route>
                  </Route>

                  {/* Authentication Routes - Accessible without login */}
                  <Route element={<AuthLayout />}>
                    <Route
                      path="login"
                      element={
                        <Suspense>
                          <VisitorErrorBoundaryWithLocation>
                            <LoginPage />
                          </VisitorErrorBoundaryWithLocation>
                        </Suspense>
                      }
                    />
                    <Route
                      path="register"
                      element={
                        <Suspense>
                          <VisitorErrorBoundaryWithLocation>
                            <RegisterPage />
                          </VisitorErrorBoundaryWithLocation>
                        </Suspense>
                      }
                    />
                    <Route
                      path="confirm-email"
                      element={
                        <Suspense>
                          <VisitorErrorBoundaryWithLocation>
                            <ConfirmEmailPage />
                          </VisitorErrorBoundaryWithLocation>
                        </Suspense>
                      }
                    />
                    <Route
                      path="confirm-invitation"
                      element={
                        <Suspense>
                          <VisitorErrorBoundaryWithLocation>
                            <ConfirmInvitationPage />
                          </VisitorErrorBoundaryWithLocation>
                        </Suspense>
                      }
                    />
                  </Route>

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

function VisitorErrorBoundaryWithLocation({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  return (
    <VisitorErrorBoundary key={location.pathname}>
      {children}
    </VisitorErrorBoundary>
  );
}

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<App />);
