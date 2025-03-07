"use client";

import { ChevronsUpDown } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-slate-400 text-gray-100 animate-pulse" />
          </Avatar>
          <div className="grid flex-1">
            <div className="py-[3px]">
              <div className="h-3.5 animate-pulse w-20 rounded-sm bg-slate-500" />
            </div>
            <div className="py-[3px]">
              <div className="h-3.5 animate-pulse w-30 rounded-sm bg-slate-500" />
            </div>
          </div>
          <ChevronsUpDown className="ml-auto size-4" />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
