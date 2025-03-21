import ErrorBoundary from "@/components/ErrorBoundary";
import { useLocation } from "react-router";

export function ErrorBoundaryWithLocation({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  return <ErrorBoundary key={location.pathname}>{children}</ErrorBoundary>;
}
