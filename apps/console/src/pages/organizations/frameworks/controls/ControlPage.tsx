import { PageTemplateSkeleton } from "@/components/PageTemplate";
import { Card, CardContent } from "@/components/ui/card";
import { lazy, Suspense } from "react";
import { useLocation } from "react-router";
import { ErrorBoundaryWithLocation } from "../../ErrorBoundary";

const ControlView = lazy(() => import("./ControlView"));

export function ControlViewSkeleton() {
  return (
    <PageTemplateSkeleton
      actions={
        <div className="flex items-center gap-2 w-1/3">
          <div className="bg-muted animate-pulse h-8 w-1/3 rounded-lg" />
          <div className="bg-muted animate-pulse h-8 w-1/3 rounded-lg" />
          <div className="bg-muted animate-pulse h-8 w-1/3 rounded-full" />
        </div>
      }
    >
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="h-6 w-48 bg-muted animate-pulse rounded mb-2" />
              <div className="h-4 w-full bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    </PageTemplateSkeleton>
  );
}

export function ControlPage() {
  const location = useLocation();

  return (
    <Suspense key={location.pathname} fallback={<ControlViewSkeleton />}>
      <ErrorBoundaryWithLocation>
        <ControlView />
      </ErrorBoundaryWithLocation>
    </Suspense>
  );
}
