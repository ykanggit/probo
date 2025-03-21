import { lazy, Suspense } from "react";
import { ErrorBoundaryWithLocation } from "../ErrorBoundary";
import { useLocation } from "react-router";
import { PageTemplateSkeleton } from "@/components/PageTemplate";
import { Card, CardContent } from "@/components/ui/card";

const FrameworkListView = lazy(() => import("./FrameworkListView"));

export function FrameworkListSkeleton() {
  return (
    <PageTemplateSkeleton
      title="Frameworks"
      description="Manage your compliance frameworks"
      actions={
        <div className="flex gap-4 w-1/3">
          <div className="bg-muted animate-pulse h-9 w-1/2 rounded-lg" />
          <div className="bg-muted animate-pulse h-9 w-1/2 rounded-lg" />
        </div>
      }
    >
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i} className="bg-card/50">
            <CardContent className="p-6">
              <div className="relative mb-6">
                <div className="bg-muted w-24 h-24 rounded-full animate-pulse mb-4" />
                <div className="h-6 w-48 bg-muted animate-pulse rounded mb-2" />
                <div className="h-20 w-full bg-muted animate-pulse rounded" />
              </div>
              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
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
    <Suspense key={location.pathname} fallback={<FrameworkListSkeleton />}>
      <ErrorBoundaryWithLocation>
        <FrameworkListView />
      </ErrorBoundaryWithLocation>
    </Suspense>
  );
}
