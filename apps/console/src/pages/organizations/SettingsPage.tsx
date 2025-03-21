import { PageTemplateSkeleton } from "@/components/PageTemplate";
import { lazy, Suspense } from "react";
import { useLocation } from "react-router";
import { ErrorBoundaryWithLocation } from "./ErrorBoundary";

const SettingsView = lazy(() => import("./SettingsView"));

export function SettingsViewSkeleton() {
  return (
    <PageTemplateSkeleton
      title="Settings"
      description="Manage your details and personal preferences here"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    </PageTemplateSkeleton>
  );
}

export function SettingsPage() {
  const location = useLocation();

  return (
    <Suspense key={location.pathname} fallback={<SettingsViewSkeleton />}>
      <ErrorBoundaryWithLocation>
        <SettingsView />
      </ErrorBoundaryWithLocation>
    </Suspense>
  );
}
