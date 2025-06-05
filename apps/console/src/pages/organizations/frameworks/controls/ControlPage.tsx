import { Loader2 } from "lucide-react";
import { lazy, Suspense } from "react";

const ControlView = lazy(() => import("./ControlView"));

export function ControlViewSkeleton() {
  return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="w-8 h-8 animate-spin text-info" />
    </div>
  );
}

export function ControlPage() {
  return (
    <Suspense fallback={<ControlViewSkeleton />}>
      <ControlView />
    </Suspense>
  );
}
