import { PageTemplateSkeleton } from "@/components/PageTemplate";
import { Suspense } from "react";
import { lazy } from "@probo/react-lazy";
import { useLocation } from "react-router";
import { ErrorBoundaryWithLocation } from "../../ErrorBoundary";

const UpdateMitigationView = lazy(() => import("./UpdateMitigationView"));

export function UpdateMitigationViewSkeleton() {
  return (
    <PageTemplateSkeleton
      title="Update Mitigation"
      description="Update the mitigation details"
    >
      <div className="max-w-2xl aspect-square bg-muted rounded-xl animate-pulse" />
    </PageTemplateSkeleton>
  );
}

export function UpdateMitigationPage() {
  const location = useLocation();

  return (
    <Suspense
      key={location.pathname}
      fallback={<UpdateMitigationViewSkeleton />}
    >
      <ErrorBoundaryWithLocation>
        <UpdateMitigationView />
      </ErrorBoundaryWithLocation>
    </Suspense>
  );
}
