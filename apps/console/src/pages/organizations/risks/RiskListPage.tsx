import { PageTemplateSkeleton } from "@/components/PageTemplate";
import { Suspense } from "react";
import { lazy } from "@probo/react-lazy";
import { useLocation } from "react-router";
import { ErrorBoundaryWithLocation } from "../ErrorBoundary";

const RiskListView = lazy(() => import("./RiskListView"));

export function RiskViewSkeleton() {
  return (
    <PageTemplateSkeleton>
      <div className="space-y-2">
        {[1, 2].map((i) => (
          <div key={i} className="h-20 bg-level-1 rounded-xl">
            <div className="h10 animate-pulse rounded-lg" />
            <div className="h10 animate-pulse rounded-lg" />
          </div>
        ))}
      </div>
    </PageTemplateSkeleton>
  );
}

export function RiskListPage() {
  const location = useLocation();

  return (
    <Suspense key={location.pathname} fallback={<RiskViewSkeleton />}>
      <ErrorBoundaryWithLocation>
        <RiskListView />
      </ErrorBoundaryWithLocation>
    </Suspense>
  );
}
