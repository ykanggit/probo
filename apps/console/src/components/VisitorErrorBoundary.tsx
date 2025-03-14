import { Component, ErrorInfo, ReactNode } from "react";
import { ErrorPage } from "@/pages/ErrorPage";
import { UnAuthenticatedError } from "@/RelayEnvironment";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class VisitorErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    if (error instanceof UnAuthenticatedError) {
      return { hasError: false, error: undefined };
    }
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("ErrorBoundary caught an error:", error);
    console.error("Error info:", info.componentStack);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return <ErrorPage error={this.state.error} />;
    }

    return this.props.children;
  }
}

export default VisitorErrorBoundary;
