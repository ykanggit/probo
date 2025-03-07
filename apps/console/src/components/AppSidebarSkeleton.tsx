import { AppSidebarShell } from "./AppSidebarShell";
import { NavUserSkeleton } from "./NavUserSkeleton";
import { OrganizationSwitcherSkeleton } from "./OrganizationSwitcherSkeleton";
import { Sidebar } from "./ui/sidebar";

export function AppSidebarSkeleton(
  props: React.ComponentProps<typeof Sidebar>
) {
  return (
    <AppSidebarShell
      organizationSwitcher={<OrganizationSwitcherSkeleton />}
      navUser={<NavUserSkeleton />}
      {...props}
    />
  );
}
