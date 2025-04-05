import { PageTemplateSkeleton } from "@/components/PageTemplate";
import { Suspense } from "react";
import { lazy } from "@probo/react-lazy";
import { ErrorBoundaryWithLocation } from "../ErrorBoundary";
import { useLocation } from "react-router";
import { Card, CardContent } from "@/components/ui/card";

const FrameworkListView = lazy(() => import("./FrameworkListView"));

export function FrameworkListViewSkeleton() {
  return (
    <PageTemplateSkeleton
      title="Frameworks"
      description="Manage your compliance frameworks"
      actions={
        <div className="flex gap-4 w-1/3">
          <div className="bg-subtle-bg animate-pulse h-9 w-1/2 rounded-lg" />
          <div className="bg-subtle-bg animate-pulse h-9 w-1/2 rounded-lg" />
        </div>
      }
    >
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="relative mb-6">
                <div className="bg-subtle-bg w-24 h-24 rounded-full animate-pulse mb-4" />
                <div className="h-6 w-48 bg-subtle-bg animate-pulse rounded mb-2" />
                <div className="h-20 w-full bg-subtle-bg animate-pulse rounded" />
              </div>
              <div className="h-4 w-32 bg-subtle-bg animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    </PageTemplateSkeleton>
  );
}

export function FrameworkListPage() {
  const location = useLocation();

  return (
    <Suspense key={location.pathname} fallback={<FrameworkListViewSkeleton />}>
      <ErrorBoundaryWithLocation>
        <FrameworkListView />
      </ErrorBoundaryWithLocation>
    </Suspense>
  );
}
