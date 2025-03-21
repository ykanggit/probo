import VisitorErrorBoundary from "@/components/VisitorErrorBoundary";
import { useLocation } from "react-router";

export function VisitorErrorBoundaryWithLocation({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  return (
    <VisitorErrorBoundary key={location.pathname}>
      {children}
    </VisitorErrorBoundary>
  );
}
