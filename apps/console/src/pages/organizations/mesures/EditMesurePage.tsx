import { PageTemplateSkeleton } from "@/components/PageTemplate";
import { Suspense } from "react";
import { lazy } from "@probo/react-lazy";
import { useLocation } from "react-router";
import { ErrorBoundaryWithLocation } from "../ErrorBoundary";

const EditMesureView = lazy(() => import("./EditMesureView"));

export function EditMesureViewSkeleton() {
  return (
    <PageTemplateSkeleton
      title="Edit Mesure"
      description="Edit a Mesure. You will be able to link it to control and risks"
    >
      <div className="max-w-2xl aspect-square bg-subtle-bg rounded-xl animate-pulse" />
    </PageTemplateSkeleton>
  );
}

export function EditMesurePage() {
  const location = useLocation();

  return (
    <Suspense key={location.pathname} fallback={<EditMesureViewSkeleton />}>
      <ErrorBoundaryWithLocation>
        <EditMesureView />
      </ErrorBoundaryWithLocation>
    </Suspense>
  );
}
