import { Outlet } from "react-router";
import { AppSidebar } from "@/components/AppSidebar";
import { Suspense } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { BreadCrumb } from "./OrganizationBreadcrumb";

export default function OrganizationLayout() {
  return (
    <SidebarProvider>
      <Suspense>
        <AppSidebar className="p-4" />
      </Suspense>
      <SidebarInset>
        <div className="mx-auto w-lg md:w-xl lg:w-3xl xl:w-4xl 2xl:w-5xl p-8">
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
