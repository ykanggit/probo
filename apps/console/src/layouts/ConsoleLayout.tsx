import { Link, Outlet, Route, Routes, useParams } from "react-router";
import { AppSidebar } from "@/components/AppSidebar";
import React, { Suspense } from "react";
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
import { ConsoleLayoutBreadcrumbPolicyOverviewQuery } from "./__generated__/ConsoleLayoutBreadcrumbPolicyOverviewQuery.graphql";

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
  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>Update</BreadcrumbPage>
      </BreadcrumbItem>
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
      query ConsoleLayoutBreadcrumbControlOverviewQuery($controlId: ID!) {
        control: node(id: $controlId) {
          id
          ... on Control {
            name
          }
        }
      }
    `,
    { controlId: controlId! }
  );

  return (
    <>
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
  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>Create Control</BreadcrumbPage>
      </BreadcrumbItem>
    </>
  );
}

function BreadcrumbPolicyList() {
  const { organizationId } = useParams();
  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link to={`/organizations/${organizationId}/policies`}>Policies</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <Outlet />
    </>
  );
}

function BreadcrumbCreatePolicy() {
  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>Create Policy</BreadcrumbPage>
      </BreadcrumbItem>
    </>
  );
}

function BreadcrumbPolicyOverview() {
  const { organizationId, policyId } = useParams();
  const data = useLazyLoadQuery<ConsoleLayoutBreadcrumbPolicyOverviewQuery>(
    graphql`
      query ConsoleLayoutBreadcrumbPolicyOverviewQuery($policyId: ID!) {
        policy: node(id: $policyId) {
          id
          ... on Policy {
            name
          }
        }
      }
    `,
    { policyId: policyId! },
    { fetchPolicy: "store-or-network" }
  );

  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link to={`/organizations/${organizationId}/policies/${policyId}`}>
            {data.policy?.name}
          </Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <Outlet />
    </>
  );
}

function BreadcrumbUpdatePolicy() {
  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>Update</BreadcrumbPage>
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
            <Suspense>
              <BreadcrumbHome>
                {showBreadcrumb && (
                  <Routes>
                    <Route path="organizations/:organizationsId">
                      <Route
                        path="frameworks"
                        element={<BreadcrumbFrameworkList />}
                      >
                        <Route
                          path=":frameworkId"
                          element={
                            <Suspense>
                              <BreadcrumbFrameworkOverview />
                            </Suspense>
                          }
                        >
                          <Route
                            path="controls/create"
                            element={<BreadcrumbCreateControl />}
                          />
                          <Route
                            path="controls/:controlId"
                            element={
                              <Suspense>
                                <BreadcrumbControlOverview />
                              </Suspense>
                            }
                          />
                          <Route
                            path="update"
                            element={<BreadcrumbUpdateFramework />}
                          />
                        </Route>
                        <Route
                          path="create"
                          element={<BreadcrumbCreateFramework />}
                        />
                      </Route>
                      <Route path="peoples" element={<BreadcrumbPeopleList />}>
                        <Route
                          path=":peopleId"
                          element={
                            <Suspense>
                              <BreadcrumbPeopleOverview />
                            </Suspense>
                          }
                        />
                        <Route
                          path="create"
                          element={<BreadcrumbCreatePeople />}
                        />
                      </Route>
                      <Route path="vendors" element={<BreadcrumbVendorList />}>
                        <Route
                          path=":vendorId"
                          element={
                            <Suspense>
                              <BreadcrumbVendorOverview />
                            </Suspense>
                          }
                        />
                      </Route>
                      <Route path="policies" element={<BreadcrumbPolicyList />}>
                        <Route
                          path=":policyId"
                          element={
                            <Suspense>
                              <BreadcrumbPolicyOverview />
                            </Suspense>
                          }
                        >
                          <Route
                            path="update"
                            element={<BreadcrumbUpdatePolicy />}
                          />
                        </Route>
                        <Route
                          path="create"
                          element={<BreadcrumbCreatePolicy />}
                        />
                      </Route>
                    </Route>
                  </Routes>
                )}
              </BreadcrumbHome>
            </Suspense>
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
