import * as React from "react";
import { Suspense, useEffect } from "react";
import { useParams } from "react-router";
import {
  BookOpen,
  Users,
  ToyBrick,
  Command,
  LifeBuoy,
  Send,
  Settings,
  Building,
} from "lucide-react";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
} from "react-relay";

import { NavMain } from "@/components/NavMain";
import { NavSecondary } from "@/components/NavSecondary";
import { NavUser } from "@/components/NavUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { AppSidebarQuery as AppSidebarQueryType } from "./__generated__/AppSidebarQuery.graphql";
import { TeamSwitcher } from "@/components/TeamSwitcher";

function getNavItems(organizationId: string) {
  return {
    navMain: [
      {
        title: "Frameworks",
        url: `/organizations/${organizationId}/frameworks`,
        icon: BookOpen,
      },
      {
        title: "Organizations",
        icon: Building,
        url: `/organizations/${organizationId}/peoples`,
        items: [
          {
            title: "Peoples",
            url: `/organizations/${organizationId}/peoples`,
            icon: Users,
          },
          {
            title: "Vendors",
            url: `/organizations/${organizationId}/vendors`,
            icon: ToyBrick,
          },
        ],
      },
      {
        title: "Settings",
        url: `/organizations/${organizationId}/settings`,
        icon: Settings,
      },
    ],
    navSecondary: [
      {
        title: "Support",
        url: "#",
        icon: LifeBuoy,
      },
      {
        title: "Feedback",
        url: "#",
        icon: Send,
      },
    ],
  };
}

const AppSidebarQuery = graphql`
  query AppSidebarQuery {
    viewer {
      id
      ...TeamSwitcher_organizations
      ...NavUser_viewer
    }
  }
`;

function AppSidebarContent({
  queryRef,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  queryRef: PreloadedQuery<AppSidebarQueryType>;
}) {
  const { organizationId } = useParams();
  const data = usePreloadedQuery(AppSidebarQuery, queryRef);
  const navItems = getNavItems(organizationId!);

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <TeamSwitcher organizations={data.viewer} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems.navMain} />
        <NavSecondary items={navItems.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser viewer={data.viewer} />
      </SidebarFooter>
    </Sidebar>
  );
}

function AppSidebarFallback(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="h-8 w-8 rounded-lg bg-sidebar-muted" />
              <div className="flex-1 space-y-1">
                <div className="h-4 w-3/4 rounded-lg bg-sidebar-muted" />
                <div className="h-3 w-1/2 rounded-lg bg-sidebar-muted" />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {Array.from({ length: 3 }).map((_, i) => (
            <SidebarMenuItem key={i}>
              <SidebarMenuButton>
                <div className="h-4 w-4 rounded-lg bg-sidebar-muted" />
                <div className="h-4 w-24 rounded-lg bg-sidebar-muted" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="h-8 w-8 rounded-lg bg-sidebar-muted" />
              <div className="flex-1 space-y-1">
                <div className="h-4 w-3/4 rounded-lg bg-sidebar-muted" />
                <div className="h-3 w-1/2 rounded-lg bg-sidebar-muted" />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const [queryRef, loadQuery] =
    useQueryLoader<AppSidebarQueryType>(AppSidebarQuery);

  useEffect(() => {
    loadQuery({});
  }, [loadQuery]);

  if (!queryRef) {
    return <AppSidebarFallback {...props} />;
  }

  return (
    <Suspense fallback={<AppSidebarFallback {...props} />}>
      <AppSidebarContent queryRef={queryRef} {...props} />
    </Suspense>
  );
}
