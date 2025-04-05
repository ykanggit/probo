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
          className="data-[state=open]:bg-accent data-[state=open]:text-accent animate-pulse"
        >
          <div className="bg-subtle-bg size-9 rounded-full animate-pulse" />
          <div className="flex-1 space-y-[3px] animate-pulse">
            <div className="h-3.5 w-20 rounded-sm bg-subtle-bg" />
            <div className="h-3.5 w-30 rounded-sm bg-subtle-bg" />
          </div>
          <div className="ml-auto size-4 rounded-lg bg-subtle-bg" />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
