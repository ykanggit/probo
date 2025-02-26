"use client";

import { useState, useEffect } from "react";
import { ChevronsUpDown, Plus } from "lucide-react";
import { graphql, useFragment } from "react-relay";
import { Link, useNavigate, useParams } from "react-router";

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
    organizations(first: 25) @connection(key: "TeamSwitcher_organizations") {
      __id
      edges {
        node {
          id
          name
          logoUrl
        }
      }
    }
  }
`;

type Organization =
  TeamSwitcher_organizations$data["organizations"]["edges"][0]["node"];

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

export function TeamSwitcher({
  organizations,
}: {
  organizations: TeamSwitcher_organizations$key;
}) {
  const { isMobile } = useSidebar();
  const data = useFragment(teamSwitcherFragment, organizations);
  const navigate = useNavigate();
  const { organizationId } = useParams();
  const [currentOrganization, setCurrentOrganization] =
    useState<Organization | null>(null);

  useEffect(() => {
    if (data.organizations && data.organizations.edges.length > 0) {
      const org = data.organizations.edges.find(
        (edge) => edge.node.id === organizationId
      );
      if (org) {
        setCurrentOrganization(org.node);
      }
    }
  }, [data.organizations, organizationId]);

  if (!currentOrganization) {
    return null;
  }

  const handleOrganizationSwitch = (org: Organization) => {
    navigate(`/organizations/${org.id}`);
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
            {data.organizations.edges.map((edge, index) => (
              <DropdownMenuItem
                key={edge.node.id}
                onClick={() => handleOrganizationSwitch(edge.node)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <LogoComponent org={edge.node} className="size-4 shrink-0" />
                </div>
                {edge.node.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                to="/organizations/create"
                className="gap-2 p-2 cursor-pointer"
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Plus className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">
                  Add organization
                </div>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
