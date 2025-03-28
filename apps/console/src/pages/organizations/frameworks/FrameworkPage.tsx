import { PageTemplateSkeleton } from "@/components/PageTemplate";
import { Card, CardContent } from "@/components/ui/card";
import { Suspense } from "react";
import { useMatch } from "react-router";
import { lazy } from "@probo/react-lazy";
import ErrorBoundary from "@/components/ErrorBoundary";

const FrameworkView = lazy(() => import("./FrameworkView"));

export function FrameworkViewSkeleton() {
  return (
    <PageTemplateSkeleton
      actions={
        <div className="flex gap-4 w-1/3">
          <div className="bg-muted animate-pulse h-9 w-1/2 rounded-lg" />
          <div className="bg-muted animate-pulse h-9 w-1/2 rounded-lg" />
        </div>
      }
    >
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
  const match = useMatch(
    "organizations/:organizationId/frameworks/:frameworkId/*"
  );

  return (
    <Suspense key={match?.pathnameBase} fallback={<FrameworkViewSkeleton />}>
      <ErrorBoundary key={match?.pathnameBase}>
        <FrameworkView />
      </ErrorBoundary>
    </Suspense>
  );
}
