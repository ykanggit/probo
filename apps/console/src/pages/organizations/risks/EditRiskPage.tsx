import { Suspense } from "react";
import { useLocation } from "react-router";
import { ErrorBoundaryWithLocation } from "../ErrorBoundary";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PageTemplate } from "@/components/PageTemplate";
import { EditRiskView } from "./EditRiskView";

// We'll import this once we create it
// import { EditRiskView } from "./EditRiskView";

export function EditRiskViewSkeleton() {
  return (
    <PageTemplate title="Edit Risk">
      <Card className="max-w-2xl">
        <CardHeader>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-24 w-full" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </CardContent>
      </Card>
    </PageTemplate>
  );
}

export function EditRiskPage() {
  const location = useLocation();

  return (
    <Suspense key={location.pathname} fallback={<EditRiskViewSkeleton />}>
      <ErrorBoundaryWithLocation>
        <EditRiskView />
      </ErrorBoundaryWithLocation>
    </Suspense>
  );
}

export default EditRiskPage;
