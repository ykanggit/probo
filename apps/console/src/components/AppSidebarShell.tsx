import { NavSecondary } from "./NavSecondary";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "./ui/sidebar";
import { ReactNode } from "react";

interface AppSidebarShellProps extends React.ComponentProps<typeof Sidebar> {
  navUser: ReactNode;
  navMain: ReactNode;
  organizationSwitcher: ReactNode;
}

export function AppSidebarShell({
  navUser,
  navMain,
  organizationSwitcher,
  ...props
}: AppSidebarShellProps) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>{organizationSwitcher}</SidebarHeader>
      <SidebarContent>
        {navMain}
        <NavSecondary className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>{navUser}</SidebarFooter>
    </Sidebar>
  );
}
