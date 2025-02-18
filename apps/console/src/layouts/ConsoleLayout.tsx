import { Link, Outlet, useLocation } from "react-router";
import { AppSidebar } from "@/components/AppSidebar";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  BreadcrumbProvider,
  useBreadcrumb,
} from "@/contexts/BreadcrumbContext";
import { Toaster } from "@/components/ui/toaster";

function BreadcrumbNavigation() {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const { segments } = useBreadcrumb();

  const getBreadcrumbText = (segment: string, path: string) => {
    // Check if we have a custom segment name
    const fullPath = pathSegments
      .slice(0, pathSegments.indexOf(segment) + 1)
      .join("/");

    // Look for patterns like 'vendors/:id' in our segments
    const patternPath = fullPath.replace(/\/[^/]+$/, "/:id");
    if (segments[patternPath]) {
      return segments[patternPath];
    }

    // Default to capitalized segment
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {pathSegments.map((segment, index) => {
          const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
          const isLast = index === pathSegments.length - 1;

          return (
            <React.Fragment key={path}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>
                    {getBreadcrumbText(segment, path)}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={path}>{getBreadcrumbText(segment, path)}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default function ConsoleLayout() {
  return (
    <BreadcrumbProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <BreadcrumbNavigation />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <Outlet />
            <Toaster />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </BreadcrumbProvider>
  );
}
