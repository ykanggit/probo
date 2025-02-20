import {
  Link,
  Outlet,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router";
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
import { graphql } from "react-relay";
import { useLazyLoadQuery } from "react-relay";
import { ConsoleLayoutBreadcrumbFrameworkOverviewQuery } from "./__generated__/ConsoleLayoutBreadcrumbFrameworkOverviewQuery.graphql";
import { ConsoleLayoutBreadcrumbPeopleOverviewQuery } from "./__generated__/ConsoleLayoutBreadcrumbPeopleOverviewQuery.graphql";
import { ConsoleLayoutBreadcrumbVendorOverviewQuery } from "./__generated__/ConsoleLayoutBreadcrumbVendorOverviewQuery.graphql";
import { ConsoleLayoutBreadcrumbControlOverviewQuery } from "./__generated__/ConsoleLayoutBreadcrumbControlOverviewQuery.graphql";

function BreadcrumbHome({ children }: { children: React.ReactNode }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {children}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function BreadcrumbFrameworkList() {
  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link to="/frameworks">Frameworks</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <Outlet />
    </>
  );
}

function BreadcrumbFrameworkOverview() {
  const { frameworkId } = useParams();
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
    { frameworkId: frameworkId! },
    { fetchPolicy: "store-or-network" },
  );

  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link to={`/frameworks/${data.framework.id}`}>
            {data.framework.name}
          </Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <Outlet />
    </>
  );
}

function BreadcrumbPeopleList() {
  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link to="/peoples">People</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <Outlet />
    </>
  );
}

function BreadcrumbPeopleOverview() {
  const { peopleId } = useParams();
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
    { fetchPolicy: "store-or-network" },
  );

  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link to={`/peoples/${data.people.id}`}>{data.people.fullName}</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <Outlet />
    </>
  );
}

function BreadcrumbVendorList() {
  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link to="/vendors">Vendors</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <Outlet />
    </>
  );
}

function BreadcrumbVendorOverview() {
  const { vendorId } = useParams();
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
    { fetchPolicy: "store-or-network" },
  );

  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link to={`/vendors/${data.vendor.id}`}>{data.vendor.name}</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
    </>
  );
}

function BreadcrumbControlOverview() {
  const { frameworkId, controlId } = useParams();
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
    { frameworkId: frameworkId!, controlId: controlId! },
    { fetchPolicy: "store-or-network" },
  );

  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link to={`/frameworks/${data.framework.id}`}>
            {data.framework.name}
          </Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link
            to={`/frameworks/${data.framework.id}/controls/${data.control.id}`}
          >
            {data.control.name}
          </Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <Outlet />
    </>
  );
}

export default function ConsoleLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <BreadcrumbHome>
              <Routes>
                <Route path="/frameworks" element={<BreadcrumbFrameworkList />}>
                  <Route
                    path="/frameworks/:frameworkId"
                    element={<BreadcrumbFrameworkOverview />}
                  />
                  <Route
                    path="/frameworks/:frameworkId/controls/:controlId"
                    element={<BreadcrumbControlOverview />}
                  />
                </Route>
                <Route path="/peoples" element={<BreadcrumbPeopleList />}>
                  <Route
                    path="/peoples/:peopleId"
                    element={<BreadcrumbPeopleOverview />}
                  />
                </Route>
                <Route path="/vendors" element={<BreadcrumbVendorList />}>
                  <Route
                    path="/vendors/:vendorId"
                    element={<BreadcrumbVendorOverview />}
                  />
                </Route>
              </Routes>
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
