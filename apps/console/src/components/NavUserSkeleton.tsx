"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavUserSkeleton() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive
          disabled
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground animate-pulse"
        >
          <div className="bg-gray-400 size-9 rounded-full animate-pulse" />
          <div className="flex-1 space-y-[3px] animate-pulse">
            <div className="h-3.5 w-20 rounded-sm bg-gray-400" />
            <div className="h-3.5 w-30 rounded-sm bg-gray-400" />
          </div>
          <div className="ml-auto size-4 rounded-lg bg-gray-400" />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
