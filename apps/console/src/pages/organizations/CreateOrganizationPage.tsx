import { PageTemplateSkeleton } from "@/components/PageTemplate";
import { Suspense } from "react";
import { lazy } from "@probo/react-lazy";
import { useLocation } from "react-router";
import { ErrorBoundaryWithLocation } from "./ErrorBoundary";

export function CreateOrganizationViewSkeleton() {
  return (
    <PageTemplateSkeleton
      title="Create Organization"
      description="Create a new organization to manage your compliance and security needs."
    >
      <div className="max-w-2xl aspect-square bg-subtle-bg rounded-xl animate-pulse" />
    </PageTemplateSkeleton>
  );
}

const CreateOrganizationView = lazy(() => import("./CreateOrganizationView"));

export function CreateOrganizationPage() {
  const location = useLocation();

  return (
    <Suspense
      key={location.pathname}
      fallback={<CreateOrganizationViewSkeleton />}
    >
      <ErrorBoundaryWithLocation>
        <CreateOrganizationView />
      </ErrorBoundaryWithLocation>
    </Suspense>
  );
}
