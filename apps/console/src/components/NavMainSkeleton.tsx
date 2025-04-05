"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMainSkeleton() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="pl-3">
        <div className="py-0.5">
          <div className="h-3 w-24 rounded-sm bg-subtle-bg animate-pulse" />
        </div>
      </SidebarGroupLabel>
      <SidebarMenu className="space-y-1.5">
        <SidebarMenuItem>
          <SidebarMenuButton className="animate-pulse">
            <div className="h-4 w-4 rounded-md bg-lime-5" />
            <div className="py-[3px]">
              <div className="h-3.5 w-32 rounded-md bg-subtle-bg" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton className="animate-pulse">
            <div className="h-4 w-4 rounded-md bg-lime-6" />
            <div className="py-[3px]">
              <div className="h-3.5 w-32 rounded-md bg-subtle-bg" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton className="animate-pulse">
            <div className="h-4 w-4 rounded-md bg-lime-6" />
            <div className="py-[3px]">
              <div className="h-3.5 w-32 rounded-md bg-subtle-bg" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton className="animate-pulse">
            <div className="h-4 w-4 rounded-md bg-lime-6" />
            <div className="py-[3px]">
              <div className="h-3.5 w-32 rounded-md bg-subtle-bg" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
