import { PageTemplateSkeleton } from "@/components/PageTemplate";
import { Suspense } from "react";
import { lazy } from "@probo/react-lazy";
import { useLocation } from "react-router";
import { ErrorBoundaryWithLocation } from "../ErrorBoundary";

const MesureListView = lazy(() => import("./MesureListView"));

export function MesureListViewSkeleton() {
  return (
    <PageTemplateSkeleton
      title="Mesures"
      description="Mesures are actions taken to reduce the risk of a risk."
    >
      <div className="space-y-6">
        <div className="h-[72px] bg-subtle-bg animate-pulse rounded-xl" />

        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border bg-level-1 p-4 space-y-4">
              <div className="h-5 w-32 bg-subtle-bg animate-pulse rounded" />
              <div className="flex gap-2">
                <div className="h-10 flex-1 bg-subtle-bg animate-pulse rounded" />
                <div className="h-10 w-32 bg-subtle-bg animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageTemplateSkeleton>
  );
}

export function MesureListPage() {
  const location = useLocation();

  return (
    <Suspense key={location.pathname} fallback={<MesureListViewSkeleton />}>
      <ErrorBoundaryWithLocation>
        <MesureListView />
      </ErrorBoundaryWithLocation>
    </Suspense>
  );
}
