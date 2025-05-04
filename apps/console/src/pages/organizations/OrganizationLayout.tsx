import { Outlet, useMatch } from "react-router";
import { AppSidebar } from "@/components/AppSidebar";
import { Suspense } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { BreadCrumb } from "./OrganizationBreadcrumb";
import { cn } from "@/lib/utils";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function OrganizationLayout() {
  const controlMatch = useMatch(
    "organizations/:organizationId/frameworks/:frameworkId/controls/*",
  );
  const frameworkMatch = useMatch(
    "organizations/:organizationId/frameworks/:frameworkId",
  );

  return (
    <SidebarProvider>
      <ErrorBoundary>
        <Suspense>
          <AppSidebar className="p-4" />
        </Suspense>
      </ErrorBoundary>
      <SidebarInset>
        <div
          className={cn(
            "p-8 h-screen overflow-auto",
            controlMatch || frameworkMatch
              ? "w-full"
              : "mx-auto w-2xl md:w-3xl lg:w-5xl xl:w-6xl 2xl:w-7xl",
          )}
        >
          <header className="flex shrink-0 items-center gap-2 mb-7">
            <BreadCrumb />
          </header>
          <div className="w-full">
            <Outlet />
          </div>
        </div>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}
