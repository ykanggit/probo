import { Outlet, useMatch } from "react-router";
import { AppSidebar } from "@/components/AppSidebar";
import { Suspense } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { BreadCrumb } from "./OrganizationBreadcrumb";
import { cn } from "@/lib/utils";

export default function OrganizationLayout() {
  const controlMatch = useMatch(
    "organizations/:organizationId/frameworks/:frameworkId/controls/*"
  );
  const frameworkMatch = useMatch(
    "organizations/:organizationId/frameworks/:frameworkId"
  );

  return (
    <SidebarProvider>
      <Suspense>
        <AppSidebar className="p-4" />
      </Suspense>
      <SidebarInset>
        <div
          className={cn(
            "p-8 h-screen overflow-auto",
            controlMatch || frameworkMatch
              ? "w-full"
              : "mx-auto w-lg md:w-xl lg:w-3xl xl:w-4xl 2xl:w-5xl"
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
