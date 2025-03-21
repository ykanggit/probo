import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function PageHeader({
  className,
  children,
  title,
  actions,
  description,
}: {
  className?: string;
  children?: ReactNode;
  title: string;
  actions?: ReactNode;
  description?: string;
}) {
  return (
    <div className={cn("space-y-6", className)}>
      {actions ? (
        <div className="flex items-center justify-between">
          <PageHeading title={title} />
          {actions}
        </div>
      ) : (
        <PageHeading title={title} />
      )}
      {description && <PageDescription>{description}</PageDescription>}
      {children}
    </div>
  );
}

export function PageHeading({
  title,
  className,
}: {
  className?: string;
  title: string;
}) {
  return <h1 className={cn("text-3xl font-medium", className)}>{title}</h1>;
}

export function PageDescription({
  children,
  className,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <p className={cn("text-lg text-muted-foreground", className)}>{children}</p>
  );
}
