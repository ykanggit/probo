import { PageTemplateSkeleton } from "@/components/PageTemplate";
import { lazy, Suspense } from "react";
import { useLocation } from "react-router";
import { ErrorBoundaryWithLocation } from "../ErrorBoundary";

const UpdatePolicyView = lazy(() => import("./UpdatePolicyView"));

export function UpdatePolicyViewSkeleton() {
  return (
    <PageTemplateSkeleton
      title="Update Policy"
      description="Update an existing policy"
    >
      <div className="bg-muted animate-pulse rounded-lg h-[600px]" />
    </PageTemplateSkeleton>
  );
}

export function UpdatePolicyPage() {
  const location = useLocation();

  return (
    <Suspense key={location.pathname} fallback={<UpdatePolicyViewSkeleton />}>
      <ErrorBoundaryWithLocation>
        <UpdatePolicyView />
      </ErrorBoundaryWithLocation>
    </Suspense>
  );
}
