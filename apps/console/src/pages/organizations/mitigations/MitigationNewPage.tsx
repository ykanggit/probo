import { PageTemplateSkeleton } from "@/components/PageTemplate";
import { Suspense } from "react";
import { lazy } from "@probo/react-lazy";
import { useLocation } from "react-router";
import { ErrorBoundaryWithLocation } from "../ErrorBoundary";

const MitigationNewView = lazy(() => import("./MitigationNewView"));

export function MitigationNewViewSkeleton() {
  return (
    <PageTemplateSkeleton
      title="New Mitigation"
      description="Add a new mitigation. You will be able to link it to control and risks"
    >
      <div className="max-w-2xl aspect-square bg-muted rounded-xl animate-pulse" />
    </PageTemplateSkeleton>
  );
}

export function MitigationNewPage() {
  const location = useLocation();

  return (
    <Suspense key={location.pathname} fallback={<MitigationNewViewSkeleton />}>
      <ErrorBoundaryWithLocation>
        <MitigationNewView />
      </ErrorBoundaryWithLocation>
    </Suspense>
  );
}
