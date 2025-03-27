import { PageTemplateSkeleton } from "@/components/PageTemplate";
import { ErrorBoundaryWithLocation } from "../../ErrorBoundary";
import { Suspense } from "react";
import { useLocation } from "react-router";
import { lazy } from "@probo/react-lazy";

const CreateMitigationView = lazy(() => import("./CreateMitigationView"));

export function CreateMitigationViewSkeleton() {
  return (
    <PageTemplateSkeleton
      title="Create Mitigation"
      description="Create a new mitigation for your framework"
    >
      <div className="max-w-2xl aspect-square bg-muted rounded-xl animate-pulse" />
    </PageTemplateSkeleton>
  );
}

export function CreateMitigationPage() {
  const location = useLocation();

  return (
    <Suspense
      key={location.pathname}
      fallback={<CreateMitigationViewSkeleton />}
    >
      <ErrorBoundaryWithLocation>
        <CreateMitigationView />
      </ErrorBoundaryWithLocation>
    </Suspense>
  );
}
