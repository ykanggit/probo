import { PageTemplateSkeleton } from "@/components/PageTemplate";
import { Suspense } from "react";
import { lazy } from "@probo/react-lazy";
import { useLocation } from "react-router";
import { ErrorBoundaryWithLocation } from "../ErrorBoundary";

const VendorView = lazy(() => import("./VendorView"));

export function VendorViewSkeleton() {
  return (
    <PageTemplateSkeleton>
      <div className="space-y-2">
        {[1, 2].map((i) => (
          <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    </PageTemplateSkeleton>
  );
}

export function VendorPage() {
  const location = useLocation();

  return (
    <Suspense key={location.pathname} fallback={<VendorViewSkeleton />}>
      <ErrorBoundaryWithLocation>
        <VendorView />
      </ErrorBoundaryWithLocation>
    </Suspense>
  );
}
