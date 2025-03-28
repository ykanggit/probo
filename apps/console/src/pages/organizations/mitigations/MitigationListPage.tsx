import { PageTemplateSkeleton } from "@/components/PageTemplate";
import { Suspense } from "react";
import { lazy } from "@probo/react-lazy";
import { useLocation } from "react-router";
import { ErrorBoundaryWithLocation } from "../ErrorBoundary";

const MitigationListView = lazy(() => import("./MitigationListView"));

export function MitigationListViewSkeleton() {
  return (
    <PageTemplateSkeleton
      title="Mitigations"
      description="Mitigations are actions taken to reduce the risk of a risk."
    >
      <div className="space-y-6">
        <div className="rounded-xl border bg-card p-4 space-y-4">
          <div className="h-5 w-32 bg-muted animate-pulse rounded" />
          <div className="flex gap-2">
            <div className="h-10 flex-1 bg-muted animate-pulse rounded" />
            <div className="h-10 w-32 bg-muted animate-pulse rounded" />
          </div>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[72px] bg-muted animate-pulse rounded-xl"
            />
          ))}
        </div>
      </div>
    </PageTemplateSkeleton>
  );
}

export function MitigationListPage() {
  const location = useLocation();

  return (
    <Suspense key={location.pathname} fallback={<MitigationListViewSkeleton />}>
      <ErrorBoundaryWithLocation>
        <MitigationListView />
      </ErrorBoundaryWithLocation>
    </Suspense>
  );
}
