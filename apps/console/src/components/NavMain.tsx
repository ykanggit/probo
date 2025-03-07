"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import { Link, useLocation, useParams } from "react-router";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url?: string;
    icon: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const location = useLocation();
  const { organizationId } = useParams();

  const noOrganizationSelected = organizationId === undefined;

  if (noOrganizationSelected) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>
          <div className="h-4 w-28 rounded-md bg-gray-200 animate-pulse" />
        </SidebarGroupLabel>
        <SidebarMenu className="space-y-1.5">
          {/* First item - simple item */}
          <SidebarMenuItem>
            <SidebarMenuButton className="animate-pulse">
              <div className="h-4 w-4 rounded-md bg-gray-200" />
              <div className="h-4 w-32 rounded-md bg-gray-200 ml-2" />
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Second item - with dropdown */}
          <SidebarMenuItem>
            <SidebarMenuButton className="animate-pulse">
              <div className="h-4 w-4 rounded-md bg-gray-200" />
              <div className="h-4 w-28 rounded-md bg-gray-200 ml-2" />
              <div className="ml-auto">
                <div className="h-4 w-4 rounded-md bg-gray-200" />
              </div>
            </SidebarMenuButton>
            <SidebarMenuSub>
              {[1, 2].map((i) => (
                <SidebarMenuSubItem key={i}>
                  <SidebarMenuSubButton className="animate-pulse pl-8">
                    <div className="h-3 w-20 rounded-md bg-gray-200" />
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </SidebarMenuItem>

          {/* Third item - simple item */}
          <SidebarMenuItem>
            <SidebarMenuButton className="animate-pulse">
              <div className="h-4 w-4 rounded-md bg-gray-200" />
              <div className="h-4 w-24 rounded-md bg-gray-200 ml-2" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  const isItemActive = (item: { url?: string; items?: { url: string }[] }) => {
    if (item.url && location.pathname.startsWith(item.url)) {
      return true;
    }

    if (item.items?.length) {
      return item.items.some((subItem) =>
        location.pathname.startsWith(subItem.url)
      );
    }

    return false;
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-gray-500 pl-3">
        Compliance
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const active = isItemActive(item) || item.isActive;

          return (
            <Collapsible key={item.title} asChild defaultOpen={active}>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  data-active={active ? "true" : undefined}
                >
                  <Link to={item.url ?? "#"}>
                    <item.icon
                      className={active ? "text-lime-9" : "text-lime-6"}
                    />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className="data-[state=open]:rotate-90">
                        <ChevronRight />
                        <span className="sr-only">Toggle</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => {
                          const subItemActive = location.pathname.startsWith(
                            subItem.url
                          );

                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                data-active={subItemActive ? "true" : undefined}
                                className={
                                  subItemActive
                                    ? "text-primary"
                                    : "text-gray-600"
                                }
                              >
                                <Link to={subItem.url}>
                                  <span className="font-medium">
                                    {subItem.title}
                                  </span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
