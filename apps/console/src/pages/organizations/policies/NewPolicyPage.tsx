import { PageTemplateSkeleton } from "@/components/PageTemplate";
import { Suspense } from "react";
import { useLocation } from "react-router";
import { ErrorBoundaryWithLocation } from "../ErrorBoundary";
import { lazy } from "@probo/react-lazy";

const NewPolicyView = lazy(() => import("./NewPolicyView"));

export function NewPolicyViewSkeleton() {
  return (
    <PageTemplateSkeleton
      title="New Policy"
      description="Add a new policy for your organization"
    >
      <div className="bg-subtle-bg animate-pulse rounded-lg h-[600px]" />
    </PageTemplateSkeleton>
  );
}

export function NewPolicyPage() {
  const location = useLocation();

  return (
    <Suspense key={location.pathname} fallback={<NewPolicyViewSkeleton />}>
      <ErrorBoundaryWithLocation>
        <NewPolicyView />
      </ErrorBoundaryWithLocation>
    </Suspense>
  );
}
