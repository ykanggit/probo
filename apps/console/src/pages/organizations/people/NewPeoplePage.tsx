import { PageTemplateSkeleton } from "@/components/PageTemplate";
import { Suspense } from "react";
import { lazy } from "@probo/react-lazy";
import { useLocation } from "react-router";
import { ErrorBoundaryWithLocation } from "../ErrorBoundary";

const NewPeopleView = lazy(() => import("./NewPeopleView"));

export function NewPeopleViewSkeleton() {
  return (
    <PageTemplateSkeleton
      title="New Person"
      description="Add a new person interacting with organization"
    >
      <div className="max-w-2xl aspect-square bg-subtle-bg rounded-xl animate-pulse" />
    </PageTemplateSkeleton>
  );
}

export function NewPeoplePage() {
  const location = useLocation();

  return (
    <Suspense key={location.pathname} fallback={<NewPeopleViewSkeleton />}>
      <ErrorBoundaryWithLocation>
        <NewPeopleView />
      </ErrorBoundaryWithLocation>
    </Suspense>
  );
}
