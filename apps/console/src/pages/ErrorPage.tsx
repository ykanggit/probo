import { AlertCircle } from "lucide-react";
import { Link } from "react-router";

export interface ErrorPageProps {
  error?: Error;
  title?: string;
  description?: string;
}

export function ErrorPage({
  error,
  title = "Something went wrong",
  description = "An unexpected error occurred. Please try again later.",
}: ErrorPageProps) {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center p-8 text-center">
      <div className="mb-4 rounded-full bg-destructive/10 p-3 text-destructive">
        <AlertCircle className="size-6" />
      </div>
      <h1 className="mb-2 text-2xl font-semibold">{title}</h1>
      <p className="mb-6 max-w-md text-muted-foreground">{description}</p>
      {error?.message && (
        <pre className="mb-8 max-w-2xl overflow-auto rounded-lg bg-muted/50 p-4 text-sm">
          {error.message}
        </pre>
      )}
      <Link
        to="/"
        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
      >
        Return Home
      </Link>
    </div>
  );
}
