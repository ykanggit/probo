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
          className="data-[state=open]:bg-accent-bg data-[state=open]:text-accent gap-2.5"
        >
          <div className="size-8 items-center justify-center rounded-md bg-subtle-bg animate-pulse" />
          <div className="flex flex-col items-start">
            <div className="py-[1px]">
              <div className="h-4.5 animate-pulse w-16 rounded-sm bg-subtle-bg" />
            </div>
            <div className="py-0.5">
              <div className="h-3 animate-pulse w-8 rounded-sm bg-subtle-bg" />
            </div>
          </div>
          <div className="ml-auto size-4 rounded-lg bg-subtle-bg animate-pulse" />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
