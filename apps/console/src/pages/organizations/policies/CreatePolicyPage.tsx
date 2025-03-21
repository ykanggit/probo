import { PageTemplateSkeleton } from "@/components/PageTemplate";
import { lazy, Suspense } from "react";
import { useLocation } from "react-router";
import { ErrorBoundaryWithLocation } from "../ErrorBoundary";

const CreatePolicyView = lazy(() => import("./CreatePolicyView"));

export function CreatePolicyViewSkeleton() {
  return (
    <PageTemplateSkeleton
      title="Create Policy"
      description="Create a new policy for your organization"
    >
      <div className="bg-muted animate-pulse rounded-lg h-[600px]" />
    </PageTemplateSkeleton>
  );
}

export function CreatePolicyPage() {
  const location = useLocation();

  return (
    <Suspense key={location.pathname} fallback={<CreatePolicyViewSkeleton />}>
      <ErrorBoundaryWithLocation>
        <CreatePolicyView />
      </ErrorBoundaryWithLocation>
    </Suspense>
  );
}
