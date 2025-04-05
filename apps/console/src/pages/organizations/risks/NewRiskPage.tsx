import { PageTemplateSkeleton } from "@/components/PageTemplate";
import { Suspense } from "react";
import { lazy } from "@probo/react-lazy";
import { useLocation } from "react-router";
import { ErrorBoundaryWithLocation } from "../ErrorBoundary";

const NewRiskView = lazy(() => import("./NewRiskView"));

export function NewRiskViewSkeleton() {
  return (
    <PageTemplateSkeleton>
      <div className="space-y-2">
        <div className="h-96 bg-subtle-bg animate-pulse rounded-lg" />
      </div>
    </PageTemplateSkeleton>
  );
}

export function NewRiskPage() {
  const location = useLocation();

  return (
    <Suspense key={location.pathname} fallback={<NewRiskViewSkeleton />}>
      <ErrorBoundaryWithLocation>
        <NewRiskView />
      </ErrorBoundaryWithLocation>
    </Suspense>
  );
}
