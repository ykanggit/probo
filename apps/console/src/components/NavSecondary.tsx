import * as React from "react";

import { LifeBuoy, Send } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navItems = [
  {
    title: "Support",
    url: "mailto:support@getprobo.com",
    icon: LifeBuoy,
  },
  {
    title: "Feedback",
    url: "#",
    icon: Send,
  },
];

export function NavSecondary(
  props: React.ComponentPropsWithoutRef<typeof SidebarGroup>,
) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {navItems.map((item) => (
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
