import { PageTemplateSkeleton } from "@/components/PageTemplate";
import { Suspense } from "react";
import { useLocation } from "react-router";
import { ErrorBoundaryWithLocation } from "../ErrorBoundary";
import { lazy } from "@probo/react-lazy";

const PeopleListView = lazy(() => import("./PeopleListView"));

export function PeopleListViewSkeleton() {
  return (
    <PageTemplateSkeleton
      title="People"
      description="Keep track of your company's workforce and their progress towards completing tasks assigned to them."
      actions={<div className="bg-muted animate-pulse h-9 w-1/6 rounded-lg" />}
    >
      <div className="space-y-6">
        <div className="rounded-xl border bg-card p-4 space-y-2">
          <div className="h-5 w-32 bg-muted animate-pulse rounded" />
          <div className="h-10 w-full bg-muted animate-pulse rounded" />
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

export function PeopleListPage() {
  const location = useLocation();

  return (
    <Suspense key={location.pathname} fallback={<PeopleListViewSkeleton />}>
      <ErrorBoundaryWithLocation>
        <PeopleListView />
      </ErrorBoundaryWithLocation>
    </Suspense>
  );
}
