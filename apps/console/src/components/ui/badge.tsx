import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-active-b focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary-bg text-invert",
        secondary: "bg-secondary-bg border border-low-b",
        info: "bg-info-bg text-info border-info-b",
        success: "bg-success-bg text-success border-success-b",
        warning: "bg-warning-bg text-warning border-warning-b",
        destructive: "bg-danger-bg text-danger border-danger-b",
        outline: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
