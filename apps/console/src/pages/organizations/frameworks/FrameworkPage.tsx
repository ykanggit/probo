import { PageTemplateSkeleton } from "@/components/PageTemplate";
import { Card, CardContent } from "@/components/ui/card";
import { lazy, Suspense } from "react";
import { useLocation } from "react-router";
import { ErrorBoundaryWithLocation } from "../ErrorBoundary";

const FrameworkView = lazy(() => import("./FrameworkView"));

export function FrameworkViewSkeleton() {
  return (
    <PageTemplateSkeleton>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
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

export function FrameworkPage() {
  const location = useLocation();

  return (
    <Suspense key={location.pathname} fallback={<FrameworkViewSkeleton />}>
      <ErrorBoundaryWithLocation>
        <FrameworkView />
      </ErrorBoundaryWithLocation>
    </Suspense>
  );
}
