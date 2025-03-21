import { PageTemplateSkeleton } from "@/components/PageTemplate";
import { lazy, Suspense } from "react";
import { useLocation } from "react-router";
import { ErrorBoundaryWithLocation } from "../ErrorBoundary";

const CreateFrameworkView = lazy(() => import("./CreateFrameworkView"));

export function CreateFrameworkViewSkeleton() {
  return (
    <PageTemplateSkeleton
      title="Create Framework"
      description="Create a new framework to organize your controls"
    >
      <div className="max-w-2xl aspect-square bg-muted rounded-xl animate-pulse" />
    </PageTemplateSkeleton>
  );
}

export function CreateFrameworkPage() {
  const location = useLocation();

  return (
    <Suspense
      key={location.pathname}
      fallback={<CreateFrameworkViewSkeleton />}
    >
      <ErrorBoundaryWithLocation>
        <CreateFrameworkView />
      </ErrorBoundaryWithLocation>
    </Suspense>
  );
}
