import { PageTemplateSkeleton } from "@/components/PageTemplate";
import { ErrorBoundaryWithLocation } from "../../ErrorBoundary";
import { Suspense } from "react";
import { useLocation } from "react-router";
import { lazy } from "@probo/react-lazy";

const CreateControlView = lazy(() => import("./CreateControlView"));

export function CreateControlViewSkeleton() {
  return (
    <PageTemplateSkeleton
      title="Create Control"
      description="Create a new control for your framework"
    >
      <div className="max-w-2xl aspect-square bg-muted rounded-xl animate-pulse" />
    </PageTemplateSkeleton>
  );
}

export function CreateControlPage() {
  const location = useLocation();

  return (
    <Suspense key={location.pathname} fallback={<CreateControlViewSkeleton />}>
      <ErrorBoundaryWithLocation>
        <CreateControlView />
      </ErrorBoundaryWithLocation>
    </Suspense>
  );
}
