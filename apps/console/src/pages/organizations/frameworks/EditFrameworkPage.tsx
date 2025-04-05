import { PageTemplateSkeleton } from "@/components/PageTemplate";
import { Suspense } from "react";
import { lazy } from "@probo/react-lazy";
import { useLocation } from "react-router";
import { ErrorBoundaryWithLocation } from "../ErrorBoundary";

const EditFrameworkView = lazy(() => import("./EditFrameworkView"));

export function EditFrameworkViewSkeleton() {
  return (
    <PageTemplateSkeleton
      title="Update Framework"
      description="Update the framework details"
    >
      <div className="max-w-2xl aspect-square bg-subtle-bg rounded-xl animate-pulse" />
    </PageTemplateSkeleton>
  );
}

export function EditFrameworkPage() {
  const location = useLocation();

  return (
    <Suspense key={location.pathname} fallback={<EditFrameworkViewSkeleton />}>
      <ErrorBoundaryWithLocation>
        <EditFrameworkView />
      </ErrorBoundaryWithLocation>
    </Suspense>
  );
}
