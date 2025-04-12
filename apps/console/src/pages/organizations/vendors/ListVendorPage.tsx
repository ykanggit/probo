import { PageTemplateSkeleton } from "@/components/PageTemplate";
import { Suspense } from "react";
import { lazy } from "@probo/react-lazy";
import { useLocation } from "react-router";
import { ErrorBoundaryWithLocation } from "../ErrorBoundary";

const VendorListView = lazy(() => import("./ListVendorView"));

export function ListVendorViewSkeleton() {
  return (
    <PageTemplateSkeleton
      title="Vendors"
      description="Vendors are third-party services that your company uses. Add them to
      keep track of their risk and compliance status."
    >
      <div className="space-y-6">
        <div className="rounded-xl border bg-level-1 p-4 space-y-4">
          <div className="h-5 w-32 subtle-bg animate-pulse rounded" />
          <div className="flex gap-2">
            <div className="h-10 flex-1 subtle-bg animate-pulse rounded" />
            <div className="h-10 w-32 subtle-bg animate-pulse rounded" />
          </div>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[72px] subtle-bg animate-pulse rounded-xl"
            />
          ))}
        </div>
      </div>
    </PageTemplateSkeleton>
  );
}

export function ListVendorPage() {
  const location = useLocation();

  return (
    <Suspense key={location.pathname} fallback={<ListVendorViewSkeleton />}>
      <ErrorBoundaryWithLocation>
        <VendorListView />
      </ErrorBoundaryWithLocation>
    </Suspense>
  );
}
