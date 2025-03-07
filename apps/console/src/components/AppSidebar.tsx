import * as React from "react";
import { Suspense, useEffect } from "react";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
} from "react-relay";

import { NavUser } from "@/components/NavUser";
import { Sidebar } from "@/components/ui/sidebar";
import type { AppSidebarQuery as AppSidebarQueryType } from "./__generated__/AppSidebarQuery.graphql";
import { OrganizationSwitcher } from "@/components/OrganizationSwitcher";
import { AppSidebarShell } from "./AppSidebarShell";
import { AppSidebarSkeleton } from "./AppSidebarSkeleton";
import { NavMain } from "./NavMain";

const AppSidebarQuery = graphql`
  query AppSidebarQuery {
    viewer {
      id
      ...OrganizationSwitcher_organizations
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
    <AppSidebarShell
      organizationSwitcher={
        <OrganizationSwitcher organizations={data.viewer} />
      }
      navMain={<NavMain />}
      navUser={<NavUser viewer={data.viewer} />}
      {...props}
    />
  );
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const [queryRef, loadQuery] =
    useQueryLoader<AppSidebarQueryType>(AppSidebarQuery);

  useEffect(() => {
    loadQuery({});
  }, [loadQuery]);

  if (!queryRef) {
    return <AppSidebarSkeleton {...props} />;
  }

  return (
    <Suspense fallback={<AppSidebarSkeleton {...props} />}>
      <AppSidebarContent queryRef={queryRef} {...props} />
    </Suspense>
  );
}
