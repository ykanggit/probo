import { Suspense } from "react";
import { Route, Routes } from "react-router";
import ConfirmEmailPage from "./ConfirmEmailPage";
import ConfirmInvitationPage from "./ConfirmInvitationPage";
import ForgotPasswordPage from "./ForgotPasswordPage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import ResetPasswordPage from "./ResetPasswordPage";
import { VisitorErrorBoundaryWithLocation } from "./ErrorBoundary";

export function AuthenticationRoutes() {
  return (
    <Routes>
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
        path="forgot-password"
        element={
          <Suspense>
            <VisitorErrorBoundaryWithLocation>
              <ForgotPasswordPage />
            </VisitorErrorBoundaryWithLocation>
          </Suspense>
        }
      />
      <Route
        path="reset-password"
        element={
          <Suspense>
            <VisitorErrorBoundaryWithLocation>
              <ResetPasswordPage />
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
    </Routes>
  );
}
