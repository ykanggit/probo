"use client";

import { ChevronsUpDown } from "lucide-react";

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
          <div className="flex aspect-square size-8 items-center justify-center rounded-sm bg-slate-300 text-sidebar-primary-foreground animate-pulse" />
          <div className="grid text-left leading-tight">
            <div className="py-[1px]">
              <div className="h-4.5 animate-pulse w-15 rounded-sm bg-slate-400" />
            </div>
            <div className="py-0.5">
              <div className="h-3 animate-pulse w-8 rounded-sm bg-slate-400" />
            </div>
          </div>
          <ChevronsUpDown className="ml-auto" />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
