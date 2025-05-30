import { Suspense } from "react";
import { ErrorBoundaryWithLocation } from "../ErrorBoundary";
import { lazy } from "@probo/react-lazy";
import { PageTemplate } from "@/components/PageTemplate";
import { Skeleton } from "@/components/ui/skeleton";

const NewAssetView = lazy(() => import("./NewAssetView"));

export function NewAssetViewSkeleton() {
  return (
    <PageTemplate
      title="New Asset"
      description="Add a new asset to your organization."
    >
      <div className="space-y-6 max-w-2xl">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-20 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
    </PageTemplate>
  );
}

export function NewAssetPage() {
  return (
    <Suspense fallback={<NewAssetViewSkeleton />}>
      <ErrorBoundaryWithLocation>
        <NewAssetView />
      </ErrorBoundaryWithLocation>
    </Suspense>
  );
}
