import { Outlet, useMatch } from "react-router";
import { AppSidebar } from "@/components/AppSidebar";
import { Suspense } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { BreadCrumb } from "./OrganizationBreadcrumb";
import { cn } from "@/lib/utils";

export default function OrganizationLayout() {
  const match = useMatch(
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
            "p-8",
            match
              ? "w-full"
              : "mx-auto w-lg md:w-xl lg:w-3xl xl:w-4xl 2xl:w-5xl"
          )}
        >
          <header className="flex shrink-0 items-center gap-2">
            <BreadCrumb />
          </header>
          <div className="mt-7 w-full">
            <Outlet />
          </div>
        </div>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}
