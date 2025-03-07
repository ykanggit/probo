import { AppSidebarShell } from "./AppSidebarShell";
import { NavMainSkeleton } from "./NavMainSkeleton";
import { NavUserSkeleton } from "./NavUserSkeleton";
import { OrganizationSwitcherSkeleton } from "./OrganizationSwitcherSkeleton";
import { Sidebar } from "./ui/sidebar";

export function AppSidebarSkeleton(
  props: React.ComponentProps<typeof Sidebar>
) {
  return (
    <AppSidebarShell
      organizationSwitcher={<OrganizationSwitcherSkeleton />}
      navMain={<NavMainSkeleton />}
      navUser={<NavUserSkeleton />}
      {...props}
    />
  );
}
