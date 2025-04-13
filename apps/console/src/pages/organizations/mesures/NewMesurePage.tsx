import { PageTemplateSkeleton } from "@/components/PageTemplate";
import { Suspense } from "react";
import { lazy } from "@probo/react-lazy";
import { useLocation } from "react-router";
import { ErrorBoundaryWithLocation } from "../ErrorBoundary";

const NewMesureView = lazy(() => import("./NewMesureView"));

export function NewMesureViewSkeleton() {
  return (
    <PageTemplateSkeleton
      title="New Mesure"
      description="Add a new mesure. You will be able to link it to control and risks"
    >
      <div className="max-w-2xl aspect-square bg-subtle-bg rounded-xl animate-pulse" />
    </PageTemplateSkeleton>
  );
}

export function NewMesurePage() {
  const location = useLocation();

  return (
    <Suspense key={location.pathname} fallback={<NewMesureViewSkeleton />}>
      <ErrorBoundaryWithLocation>
        <NewMesureView />
      </ErrorBoundaryWithLocation>
    </Suspense>
  );
}
