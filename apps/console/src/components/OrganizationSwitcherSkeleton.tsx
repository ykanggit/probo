"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function OrganizationSwitcherSkeleton() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground gap-2.5"
        >
          <div className="size-8 items-center justify-center rounded-md bg-gray-300 animate-pulse" />
          <div className="flex flex-col items-start">
            <div className="py-[1px]">
              <div className="h-4.5 animate-pulse w-16 rounded-sm bg-gray-300" />
            </div>
            <div className="py-0.5">
              <div className="h-3 animate-pulse w-8 rounded-sm bg-gray-300" />
            </div>
          </div>
          <div className="ml-auto size-4 rounded-lg bg-gray-300 animate-pulse" />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
