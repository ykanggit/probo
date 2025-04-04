import { PageTemplateSkeleton } from "@/components/PageTemplate";
import { Suspense } from "react";
import { lazy } from "@probo/react-lazy";
import { useLocation } from "react-router";
import { ErrorBoundaryWithLocation } from "../ErrorBoundary";

const EditMitigationView = lazy(() => import("./EditMitigationView"));

export function EditMitigationViewSkeleton() {
  return (
    <PageTemplateSkeleton
      title="Edit Mitigation"
      description="Edit a mitigation. You will be able to link it to control and risks"
    >
      <div className="max-w-2xl aspect-square bg-muted rounded-xl animate-pulse" />
    </PageTemplateSkeleton>
  );
}

export function EditMitigationPage() {
  const location = useLocation();

  return (
    <Suspense key={location.pathname} fallback={<EditMitigationViewSkeleton />}>
      <ErrorBoundaryWithLocation>
        <EditMitigationView />
      </ErrorBoundaryWithLocation>
    </Suspense>
  );
}
