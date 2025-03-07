import * as React from "react";
import { type LucideIcon } from "lucide-react";
import { useLocation } from "react-router";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const location = useLocation();
  const noOrganizationSelected = location.pathname === "/";

  if (noOrganizationSelected) {
    return (
      <SidebarGroup {...props}>
        <SidebarGroupContent>
          <SidebarMenu>
            {[1, 2].map((i) => (
              <SidebarMenuItem key={i}>
                <SidebarMenuButton size="sm" className="animate-pulse">
                  <div className="h-3 w-3 rounded-lg bg-gray-200" />
                  <div className="h-3 w-16 rounded-lg bg-gray-200 ml-2" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild={item.url !== "#"}
                size="sm"
                tooltip={item.title}
                className={
                  item.url === "#" ? "opacity-50 cursor-not-allowed" : ""
                }
              >
                {item.url !== "#" ? (
                  <a href={item.url}>
                    <item.icon />
                    <span className="font-medium">{item.title}</span>
                  </a>
                ) : (
                  <>
                    <item.icon />
                    <span className="font-medium">{item.title}</span>
                  </>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
