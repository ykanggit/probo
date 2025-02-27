import { Link, Outlet, Route, Routes, useParams } from "react-router";
import { AppSidebar } from "@/components/AppSidebar";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { graphql, useLazyLoadQuery } from "react-relay";
import { ConsoleLayoutBreadcrumbFrameworkOverviewQuery } from "./__generated__/ConsoleLayoutBreadcrumbFrameworkOverviewQuery.graphql";
import { ConsoleLayoutBreadcrumbPeopleOverviewQuery } from "./__generated__/ConsoleLayoutBreadcrumbPeopleOverviewQuery.graphql";
import { ConsoleLayoutBreadcrumbVendorOverviewQuery } from "./__generated__/ConsoleLayoutBreadcrumbVendorOverviewQuery.graphql";
import { ConsoleLayoutBreadcrumbControlOverviewQuery } from "./__generated__/ConsoleLayoutBreadcrumbControlOverviewQuery.graphql";
import { ConsoleLayoutOrganizationQuery } from "./__generated__/ConsoleLayoutOrganizationQuery.graphql";
import { ConsoleLayoutBreadcrumbCreateControlQuery } from "./__generated__/ConsoleLayoutBreadcrumbCreateControlQuery.graphql";
import { ConsoleLayoutBreadcrumbUpdateFrameworkQuery } from "./__generated__/ConsoleLayoutBreadcrumbUpdateFrameworkQuery.graphql";

function BreadcrumbHome({ children }: { children: React.ReactNode }) {
  const { organizationId } = useParams();

  // If there's no organizationId, we're on the create organization page
  if (!organizationId) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Create Organization</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  const data = useLazyLoadQuery<ConsoleLayoutOrganizationQuery>(
    graphql`
      query ConsoleLayoutOrganizationQuery($organizationId: ID!) {
        organization: node(id: $organizationId) {
          ... on Organization {
            name
          }
        }
      }
    `,
    { organizationId: organizationId! },
    { fetchPolicy: "store-or-network" }
  );

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to={`/organizations/${organizationId}`}>
              {data.organization?.name || "Home"}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {children}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function BreadcrumbFrameworkList() {
  const { organizationId } = useParams();
  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link to={`/organizations/${organizationId}/frameworks`}>
            Frameworks
          </Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <Outlet />
    </>
  );
}

function BreadcrumbCreateFramework() {
  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>Create</BreadcrumbPage>
      </BreadcrumbItem>
    </>
  );
}

function BreadcrumbFrameworkOverview() {
  const { organizationId, frameworkId } = useParams();
  const data = useLazyLoadQuery<ConsoleLayoutBreadcrumbFrameworkOverviewQuery>(
    graphql`
      query ConsoleLayoutBreadcrumbFrameworkOverviewQuery($frameworkId: ID!) {
        framework: node(id: $frameworkId) {
          id
          ... on Framework {
            name
          }
        }
      }
    `,
    { frameworkId: frameworkId! }
  );

  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link
            to={`/organizations/${organizationId}/frameworks/${frameworkId}`}
          >
            {data.framework?.name}
          </Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <Outlet />
    </>
  );
}

function BreadcrumbUpdateFramework() {
  const { organizationId, frameworkId } = useParams();
  const data = useLazyLoadQuery<ConsoleLayoutBreadcrumbUpdateFrameworkQuery>(
    graphql`
      query ConsoleLayoutBreadcrumbUpdateFrameworkQuery($frameworkId: ID!) {
        framework: node(id: $frameworkId) {
          id
          ... on Framework {
            name
          }
        }
      }
    `,
    { frameworkId: frameworkId! },
    { fetchPolicy: "store-or-network" }
  );

  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink
          asChild
          className="max-w-[160px] truncate"
          aria-label={data.framework?.name}
        >
          <Link
            to={`/organizations/${organizationId}/frameworks/${frameworkId}`}
          >
            {data.framework?.name}
          </Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>Update</BreadcrumbPage>
      </BreadcrumbItem>
      <Outlet />
    </>
  );
}

function BreadcrumbVendorList() {
  const { organizationId } = useParams();
  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link to={`/organizations/${organizationId}/vendors`}>Vendors</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <Outlet />
    </>
  );
}

function BreadcrumbVendorOverview() {
  const { organizationId, vendorId } = useParams();
  const data = useLazyLoadQuery<ConsoleLayoutBreadcrumbVendorOverviewQuery>(
    graphql`
      query ConsoleLayoutBreadcrumbVendorOverviewQuery($vendorId: ID!) {
        vendor: node(id: $vendorId) {
          id
          ... on Vendor {
            name
          }
        }
      }
    `,
    { vendorId: vendorId! },
    { fetchPolicy: "store-or-network" }
  );

  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link
            to={`/organizations/${organizationId}/vendors/${data.vendor.id}`}
          >
            {data.vendor.name}
          </Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <Outlet />
    </>
  );
}

function BreadcrumbPeopleList() {
  const { organizationId } = useParams();
  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link to={`/organizations/${organizationId}/peoples`}>People</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <Outlet />
    </>
  );
}

function BreadcrumbCreatePeople() {
  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>Create</BreadcrumbPage>
      </BreadcrumbItem>
    </>
  );
}

function BreadcrumbPeopleOverview() {
  const { organizationId, peopleId } = useParams();
  const data = useLazyLoadQuery<ConsoleLayoutBreadcrumbPeopleOverviewQuery>(
    graphql`
      query ConsoleLayoutBreadcrumbPeopleOverviewQuery($peopleId: ID!) {
        people: node(id: $peopleId) {
          id
          ... on People {
            fullName
          }
        }
      }
    `,
    { peopleId: peopleId! },
    { fetchPolicy: "store-or-network" }
  );

  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link
            to={`/organizations/${organizationId}/peoples/${data.people.id}`}
          >
            {data.people.fullName}
          </Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <Outlet />
    </>
  );
}

function BreadcrumbControlOverview() {
  const { organizationId, frameworkId, controlId } = useParams();
  const data = useLazyLoadQuery<ConsoleLayoutBreadcrumbControlOverviewQuery>(
    graphql`
      query ConsoleLayoutBreadcrumbControlOverviewQuery(
        $frameworkId: ID!
        $controlId: ID!
      ) {
        framework: node(id: $frameworkId) {
          id
          ... on Framework {
            name
          }
        }
        control: node(id: $controlId) {
          id
          ... on Control {
            name
          }
        }
      }
    `,
    { frameworkId: frameworkId!, controlId: controlId! }
  );

  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link
            to={`/organizations/${organizationId}/frameworks/${frameworkId}`}
          >
            {data.framework?.name}
          </Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link
            to={`/organizations/${organizationId}/frameworks/${frameworkId}/controls/${controlId}`}
          >
            {data.control?.name}
          </Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
    </>
  );
}

function BreadcrumbCreateControl() {
  const { organizationId, frameworkId } = useParams();
  const data = useLazyLoadQuery<ConsoleLayoutBreadcrumbCreateControlQuery>(
    graphql`
      query ConsoleLayoutBreadcrumbCreateControlQuery($frameworkId: ID!) {
        framework: node(id: $frameworkId) {
          ... on Framework {
            name
          }
        }
      }
    `,
    { frameworkId: frameworkId! }
  );

  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link
            to={`/organizations/${organizationId}/frameworks/${frameworkId}`}
          >
            {data.framework?.name}
          </Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>Create Control</BreadcrumbPage>
      </BreadcrumbItem>
    </>
  );
}

export default function ConsoleLayout() {
  const { organizationId } = useParams();
  const showBreadcrumb = !!organizationId;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <BreadcrumbHome>
              {showBreadcrumb && (
                <Routes>
                  <Route
                    path="frameworks"
                    element={<BreadcrumbFrameworkList />}
                  >
                    <Route
                      path=":frameworkId"
                      element={<BreadcrumbFrameworkOverview />}
                    >
                      <Route
                        path="controls/create"
                        element={<BreadcrumbCreateControl />}
                      />
                      <Route
                        path="controls/:controlId"
                        element={<BreadcrumbControlOverview />}
                      />
                    </Route>
                    <Route
                      path=":frameworkId/update"
                      element={<BreadcrumbUpdateFramework />}
                    />
                    <Route
                      path="create"
                      element={<BreadcrumbCreateFramework />}
                    />
                  </Route>
                  <Route path="peoples" element={<BreadcrumbPeopleList />}>
                    <Route
                      path=":peopleId"
                      element={<BreadcrumbPeopleOverview />}
                    />
                    <Route path="create" element={<BreadcrumbCreatePeople />} />
                  </Route>
                  <Route path="vendors" element={<BreadcrumbVendorList />}>
                    <Route
                      path=":vendorId"
                      element={<BreadcrumbVendorOverview />}
                    />
                  </Route>
                </Routes>
              )}
            </BreadcrumbHome>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="w-full max-w-[1000px] px-6">
            <Outlet />
          </div>
          <Toaster />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
