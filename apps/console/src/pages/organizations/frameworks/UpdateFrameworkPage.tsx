import { PageTemplateSkeleton } from "@/components/PageTemplate";
import { lazy, Suspense } from "react";
import { useLocation } from "react-router";
import { ErrorBoundaryWithLocation } from "../ErrorBoundary";

const UpdateFrameworkView = lazy(() => import("./UpdateFrameworkView"));

export function UpdateFrameworkViewSkeleton() {
  return (
    <PageTemplateSkeleton
      title="Update Framework"
      description="Update the framework details"
    >
      <div className="max-w-2xl aspect-square bg-muted rounded-xl animate-pulse" />
    </PageTemplateSkeleton>
  );
}

export function UpdateFrameworkPage() {
  const location = useLocation();

  return (
    <Suspense
      key={location.pathname}
      fallback={<UpdateFrameworkViewSkeleton />}
    >
      <ErrorBoundaryWithLocation>
        <UpdateFrameworkView />
      </ErrorBoundaryWithLocation>
    </Suspense>
  );
}
