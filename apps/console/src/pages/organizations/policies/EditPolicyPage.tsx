import { PageTemplateSkeleton } from "@/components/PageTemplate";
import { Suspense } from "react";
import { lazy } from "@probo/react-lazy";
import { useLocation } from "react-router";
import { ErrorBoundaryWithLocation } from "../ErrorBoundary";

const EditPolicyView = lazy(() => import("./EditPolicyView"));

export function EditPolicyViewSkeleton() {
  return (
    <PageTemplateSkeleton
      title="Edit Policy"
      description="Edit an existing policy"
    >
      <div className="bg-subtle-bg animate-pulse rounded-lg h-[600px]" />
    </PageTemplateSkeleton>
  );
}

export function EditPolicyPage() {
  const location = useLocation();

  return (
    <Suspense key={location.pathname} fallback={<EditPolicyViewSkeleton />}>
      <ErrorBoundaryWithLocation>
        <EditPolicyView />
      </ErrorBoundaryWithLocation>
    </Suspense>
  );
}
