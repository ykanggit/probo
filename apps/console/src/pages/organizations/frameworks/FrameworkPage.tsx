import { Card, CardContent } from "@/components/ui/card";
import { Suspense } from "react";
import { useLocation } from "react-router";
import { lazy } from "@probo/react-lazy";
import ErrorBoundary from "@/components/ErrorBoundary";

const FrameworkView = lazy(() => import("./FrameworkView"));

export function FrameworkViewSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
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
  );
}

export function FrameworkPage() {
  const location = useLocation();

  return (
    <Suspense key={location.pathname} fallback={<FrameworkViewSkeleton />}>
      <ErrorBoundary key={location.pathname}>
        <FrameworkView />
      </ErrorBoundary>
    </Suspense>
  );
}
