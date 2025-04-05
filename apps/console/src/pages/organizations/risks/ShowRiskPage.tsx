import { PageTemplateSkeleton } from "@/components/PageTemplate";
import { Suspense } from "react";
import { lazy } from "@probo/react-lazy";
import { useLocation } from "react-router";
import { ErrorBoundaryWithLocation } from "../ErrorBoundary";

const ShowRiskView = lazy(() => import("./ShowRiskView"));

export function ShowRiskViewSkeleton() {
  return (
    <PageTemplateSkeleton>
      <div className="space-y-2">
        <div className="h-96 subtle-bg animate-pulse rounded-lg" />
      </div>
    </PageTemplateSkeleton>
  );
}

export function NewRiskPage() {
  const location = useLocation();

  return (
    <Suspense key={location.pathname} fallback={<ShowRiskViewSkeleton />}>
      <ErrorBoundaryWithLocation>
        <ShowRiskView />
      </ErrorBoundaryWithLocation>
    </Suspense>
  );
}
