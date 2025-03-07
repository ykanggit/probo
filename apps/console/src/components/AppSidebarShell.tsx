import { useParams } from "react-router";
import { NavMain } from "./NavMain";
import { NavSecondary } from "./NavSecondary";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "./ui/sidebar";
import {
  BookOpen,
  Users,
  ToyBrick,
  LifeBuoy,
  Send,
  Settings,
  Building,
  FileText,
} from "lucide-react";
import { ReactNode } from "react";

interface AppSidebarShellProps extends React.ComponentProps<typeof Sidebar> {
  navUser: ReactNode;
  organizationSwitcher: ReactNode;
}

export function AppSidebarShell({
  navUser,
  organizationSwitcher,
  ...props
}: AppSidebarShellProps) {
  const { organizationId } = useParams();
  const navItems = getNavItems(organizationId);

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>{organizationSwitcher}</SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems.navMain} />
        <NavSecondary items={navItems.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>{navUser}</SidebarFooter>
    </Sidebar>
  );
}

function getNavItems(organizationId?: string) {
  // Always return the same structure, but with or without URLs depending on whether an organization is selected
  return {
    navMain: [
      {
        title: "Frameworks",
        url: organizationId
          ? `/organizations/${organizationId}/frameworks`
          : undefined,
        icon: BookOpen,
      },
      {
        title: "Organizations",
        icon: Building,
        url: organizationId
          ? `/organizations/${organizationId}/peoples`
          : undefined,
        items: organizationId
          ? [
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
            ]
          : [],
      },
      {
        title: "Policies",
        url: organizationId
          ? `/organizations/${organizationId}/policies`
          : undefined,
        icon: FileText,
      },
      {
        title: "Settings",
        url: organizationId
          ? `/organizations/${organizationId}/settings`
          : undefined,
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
