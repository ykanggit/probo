"use client";

import { useState, useEffect } from "react";
import { ChevronsUpDown, Plus } from "lucide-react";
import { graphql, useFragment } from "react-relay";
import { useOrganization } from "@/contexts/OrganizationContext";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  TeamSwitcher_organizations$key,
  TeamSwitcher_organizations$data,
} from "./__generated__/TeamSwitcher_organizations.graphql";

export const teamSwitcherFragment = graphql`
  fragment TeamSwitcher_organizations on User {
    organizations {
      id
      name
      logoUrl
    }
  }
`;

// Extended type to include plan field until Relay compiler generates the types
type Organization = TeamSwitcher_organizations$data["organizations"][0] & {
  plan?: string;
};

export function TeamSwitcher({
  organizations,
}: {
  organizations: TeamSwitcher_organizations$key;
}) {
  const { isMobile } = useSidebar();
  const data = useFragment(teamSwitcherFragment, organizations);
  const { currentOrganization, setCurrentOrganization } = useOrganization();

  useEffect(() => {
    if (
      data.organizations &&
      data.organizations.length > 0 &&
      !currentOrganization
    ) {
      // Type assertion to include plan field
      setCurrentOrganization(data.organizations[0] as Organization);
    }
  }, [data.organizations, currentOrganization, setCurrentOrganization]);

  // If no organizations or data is still loading
  if (!currentOrganization) {
    return null;
  }

  // Convert logoUrl to a React component
  const LogoComponent = ({
    org,
    className,
  }: {
    org: Organization;
    className?: string;
  }) => {
    if (org.logoUrl) {
      return <img src={org.logoUrl} alt={org.name} className={className} />;
    }
    return null;
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <LogoComponent org={currentOrganization} className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {currentOrganization.name}
                </span>
                <span className="truncate text-xs">Free</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Organizations
            </DropdownMenuLabel>
            {data.organizations.map((org: Organization, index: number) => (
              <DropdownMenuItem
                key={org.id}
                onClick={() => setCurrentOrganization(org)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <LogoComponent org={org} className="size-4 shrink-0" />
                </div>
                {org.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                Add organization
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
