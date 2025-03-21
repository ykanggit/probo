import { PageTemplateSkeleton } from "@/components/PageTemplate";
import { lazy, Suspense } from "react";
import { useLocation } from "react-router";
import { ErrorBoundaryWithLocation } from "../../ErrorBoundary";

const UpdateControlView = lazy(() => import("./UpdateControlView"));

export function UpdateControlViewSkeleton() {
  return (
    <PageTemplateSkeleton
      title="Update Control"
      description="Update the control details"
    >
      <div className="max-w-2xl aspect-square bg-muted rounded-xl animate-pulse" />
    </PageTemplateSkeleton>
  );
}

export function UpdateControlPage() {
  const location = useLocation();

  return (
    <Suspense key={location.pathname} fallback={<UpdateControlViewSkeleton />}>
      <ErrorBoundaryWithLocation>
        <UpdateControlView />
      </ErrorBoundaryWithLocation>
    </Suspense>
  );
}
