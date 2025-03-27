import { cn } from "@/lib/utils";
import { FC, ReactNode } from "react";

export interface PageHeaderProps {
  title: ReactNode;
  actions?: ReactNode;
  description?: ReactNode;
}

export function PageHeaderShell({
  className,
  title,
  actions,
  description,
}: PageHeaderProps & { className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      {actions ? (
        <div className="flex items-center justify-between">
          {title}
          {actions}
        </div>
      ) : (
        title
      )}
      {description}
    </div>
  );
}

export function PageHeader({
  className,
  title,
  actions,
  description,
}: PageHeaderProps & { className?: string }) {
  return (
    <PageHeaderShell
      className={className}
      title={<PageHeading>{title}</PageHeading>}
      description={<PageDescription>{description}</PageDescription>}
      actions={actions}
    />
  );
}

export function PageHeading({
  children,
  className,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <h1 className={cn("text-3xl font-medium", className)}>{children}</h1>;
}

const PageHeadingSkeleton: FC = () => {
  return (
    <div className="py-[3px] w-2/5">
      <div className="bg-muted animate rounded-lg h-7.5" />
    </div>
  );
};

export function PageDescription({
  children,
  className,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "text-md text-muted-foreground whitespace-pre-wrap",
        className
      )}
    >
      {children}
    </div>
  );
}

export function PageDescriptionSkeleton() {
  return (
    <div className="py-[5px]">
      <div className="bg-muted animate rounded-md w-100 h-4.5" />
    </div>
  );
}

export const PageHeaderSkeleton: FC<{
  className?: string;
  title?: string;
  actions?: ReactNode;
  description?: ReactNode;
  withDescription?: boolean;
}> = ({ className, title, actions, description, withDescription = false }) => {
  return (
    <PageHeaderShell
      className={className}
      title={
        title ? <PageHeading>{title}</PageHeading> : <PageHeadingSkeleton />
      }
      description={
        description ? (
          <PageDescription>{description}</PageDescription>
        ) : withDescription ? (
          <PageDescriptionSkeleton />
        ) : null
      }
      actions={actions}
    />
  );
};
