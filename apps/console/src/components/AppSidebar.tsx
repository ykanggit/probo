import * as React from "react";
import { Suspense, useEffect } from "react";
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
import { url } from "inspector";
const staticData = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Frameworks",
      url: "/frameworks",
      icon: BookOpen,
    },
    {
      title: "Organizations",
      icon: Building,
      url: "/peoples",
      items: [
        {
          title: "Peoples",
          url: "/peoples",
          icon: Users,
        },
        {
          title: "Vendors",
          url: "/vendors",
          icon: ToyBrick,
        },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
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
  const data = usePreloadedQuery(AppSidebarQuery, queryRef);

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <TeamSwitcher organizations={data.viewer} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={staticData.navMain} />
        <NavSecondary items={staticData.navSecondary} className="mt-auto" />
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
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="size-8 rounded-lg bg-muted animate-pulse" />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                  </span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={staticData.navMain} />
        <NavSecondary items={staticData.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="h-8 w-8 rounded-lg bg-muted animate-pulse" />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                  </span>
                  <span className="truncate text-xs">
                    <div className="h-3 w-32 animate-pulse rounded bg-muted" />
                  </span>
                </div>
              </a>
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
