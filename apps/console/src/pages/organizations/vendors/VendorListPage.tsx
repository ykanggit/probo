import { PageTemplateSkeleton } from "@/components/PageTemplate";
import { lazy, Suspense } from "react";
import { useLocation } from "react-router";
import { ErrorBoundaryWithLocation } from "../ErrorBoundary";

const VendorListView = lazy(() => import("./VendorListView"));

export function VendorListViewSkeleton() {
  return (
    <PageTemplateSkeleton
      title="Vendors"
      description="Vendors are third-party services that your company uses. Add them to
      keep track of their risk and compliance status."
    >
      <div>
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="h-4 w-96 bg-muted animate-pulse rounded mt-1" />
      </div>
      <div className="rounded-xl border bg-card p-4 space-y-4">
        <div className="h-5 w-32 bg-muted animate-pulse rounded" />
        <div className="flex gap-2">
          <div className="h-10 flex-1 bg-muted animate-pulse rounded" />
          <div className="h-10 w-32 bg-muted animate-pulse rounded" />
        </div>
      </div>
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-[72px] bg-muted animate-pulse rounded-xl" />
        ))}
      </div>
    </PageTemplateSkeleton>
  );
}

export function VendorListPage() {
  const location = useLocation();

  return (
    <Suspense key={location.pathname} fallback={<VendorListViewSkeleton />}>
      <ErrorBoundaryWithLocation>
        <VendorListView />
      </ErrorBoundaryWithLocation>
    </Suspense>
  );
}
