import { PageTemplateSkeleton } from "@/components/PageTemplate";
import { lazy, Suspense } from "react";
import { useLocation } from "react-router";
import { ErrorBoundaryWithLocation } from "./ErrorBoundary";

export function CreateOrganizationViewSkeleton() {
  return (
    <PageTemplateSkeleton
      title="Create Organization"
      description="Create a new organization to manage your compliance and security needs."
    >
      <div className="max-w-2xl aspect-square bg-muted rounded-xl animate-pulse" />
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
