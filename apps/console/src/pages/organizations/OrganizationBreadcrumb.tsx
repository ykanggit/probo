import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { ReactNode, Suspense } from "react";
import { graphql, useLazyLoadQuery } from "react-relay";
import { NavLink, Outlet, Route, Routes, To, useParams } from "react-router";

import { OrganizationBreadcrumbBreadcrumbFrameworkOverviewQuery } from "./__generated__/OrganizationBreadcrumbBreadcrumbFrameworkOverviewQuery.graphql";
import { OrganizationBreadcrumbBreadcrumbMitigationOverviewQuery } from "./__generated__/OrganizationBreadcrumbBreadcrumbMitigationOverviewQuery.graphql";
import { OrganizationBreadcrumbBreadcrumbPeopleOverviewQuery } from "./__generated__/OrganizationBreadcrumbBreadcrumbPeopleOverviewQuery.graphql";
import { OrganizationBreadcrumbBreadcrumbPolicyOverviewQuery } from "./__generated__/OrganizationBreadcrumbBreadcrumbPolicyOverviewQuery.graphql";
import { OrganizationBreadcrumbBreadcrumbVendorOverviewQuery } from "./__generated__/OrganizationBreadcrumbBreadcrumbVendorOverviewQuery.graphql";
import { OrganizationBreadcrumbOrganizationQuery } from "./__generated__/OrganizationBreadcrumbOrganizationQuery.graphql";
import { OrganizationBreadcrumbBreadcrumbMitigationViewQuery } from "./__generated__/OrganizationBreadcrumbBreadcrumbMitigationViewQuery.graphql";
import { OrganizationBreadcrumbBreadcrumbControlQuery } from "./__generated__/OrganizationBreadcrumbBreadcrumbControlQuery.graphql";

const New = () => {
  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>New</BreadcrumbPage>
      </BreadcrumbItem>
    </>
  );
};

const Edit = () => {
  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>Edit</BreadcrumbPage>
      </BreadcrumbItem>
    </>
  );
};

const BreadcrumbNavLink = ({
  to,
  children,
  className,
}: {
  to: To;
  children?: ReactNode;
  className?: string;
}) => {
  return (
    <BreadcrumbLink asChild>
      <NavLink to={to} end>
        {({ isActive }) => (
          <BreadcrumbPage
            className={cn(
              "text-gray-300",
              isActive && "text-gray-700",
              className
            )}
          >
            {children}
          </BreadcrumbPage>
        )}
      </NavLink>
    </BreadcrumbLink>
  );
};

function BreadcrumbHome() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbNavLink to="/">Home</BreadcrumbNavLink>
        </BreadcrumbItem>
        <Outlet />
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function BreadCrumbOrganization() {
  const { organizationId } = useParams();

  const data = useLazyLoadQuery<OrganizationBreadcrumbOrganizationQuery>(
    graphql`
      query OrganizationBreadcrumbOrganizationQuery($organizationId: ID!) {
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
    <Breadcrumb className="select-none">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbNavLink to={`/organizations/${organizationId}`}>
            {data.organization?.name || "Home"}
          </BreadcrumbNavLink>
        </BreadcrumbItem>
        <Outlet />
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
        <BreadcrumbNavLink to={`/organizations/${organizationId}/frameworks`}>
          Frameworks
        </BreadcrumbNavLink>
      </BreadcrumbItem>
      <Outlet />
    </>
  );
}

function BreadcrumbFrameworkOverview() {
  const { organizationId, frameworkId } = useParams();
  const data =
    useLazyLoadQuery<OrganizationBreadcrumbBreadcrumbFrameworkOverviewQuery>(
      graphql`
        query OrganizationBreadcrumbBreadcrumbFrameworkOverviewQuery(
          $frameworkId: ID!
        ) {
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
        <BreadcrumbNavLink
          to={`/organizations/${organizationId}/frameworks/${frameworkId}`}
        >
          {data.framework?.name}
        </BreadcrumbNavLink>
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
        <BreadcrumbNavLink to={`/organizations/${organizationId}/vendors`}>
          Vendors
        </BreadcrumbNavLink>
      </BreadcrumbItem>
      <Outlet />
    </>
  );
}

function BreadcrumbVendorOverview() {
  const { organizationId, vendorId } = useParams();
  const data =
    useLazyLoadQuery<OrganizationBreadcrumbBreadcrumbVendorOverviewQuery>(
      graphql`
        query OrganizationBreadcrumbBreadcrumbVendorOverviewQuery(
          $vendorId: ID!
        ) {
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
        <BreadcrumbNavLink
          to={`/organizations/${organizationId}/vendors/${data.vendor.id}`}
        >
          {data.vendor.name}
        </BreadcrumbNavLink>
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
        <BreadcrumbNavLink to={`/organizations/${organizationId}/people`}>
          People
        </BreadcrumbNavLink>
      </BreadcrumbItem>
      <Outlet />
    </>
  );
}

function BreadcrumbPeopleOverview() {
  const { organizationId, peopleId } = useParams();
  const data =
    useLazyLoadQuery<OrganizationBreadcrumbBreadcrumbPeopleOverviewQuery>(
      graphql`
        query OrganizationBreadcrumbBreadcrumbPeopleOverviewQuery(
          $peopleId: ID!
        ) {
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
        <BreadcrumbNavLink
          to={`/organizations/${organizationId}/people/${data.people.id}`}
        >
          {data.people.fullName}
        </BreadcrumbNavLink>
      </BreadcrumbItem>
      <Outlet />
    </>
  );
}

function BreadcrumbMitigationOverview() {
  const { organizationId, frameworkId, mitigationId } = useParams();
  const data =
    useLazyLoadQuery<OrganizationBreadcrumbBreadcrumbMitigationOverviewQuery>(
      graphql`
        query OrganizationBreadcrumbBreadcrumbMitigationOverviewQuery(
          $mitigationId: ID!
        ) {
          mitigation: node(id: $mitigationId) {
            id
            ... on Mitigation {
              name
            }
          }
        }
      `,
      { mitigationId: mitigationId! }
    );

  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbNavLink
          to={`/organizations/${organizationId}/frameworks/${frameworkId}/mitigations/${mitigationId}`}
        >
          {data.mitigation?.name}
        </BreadcrumbNavLink>
      </BreadcrumbItem>
      <Outlet />
    </>
  );
}

function BreadcrumbPolicyList() {
  const { organizationId } = useParams();
  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbNavLink to={`/organizations/${organizationId}/policies`}>
          Policies
        </BreadcrumbNavLink>
      </BreadcrumbItem>
      <Outlet />
    </>
  );
}

function BreadcrumbPolicyOverview() {
  const { organizationId, policyId } = useParams();
  const data =
    useLazyLoadQuery<OrganizationBreadcrumbBreadcrumbPolicyOverviewQuery>(
      graphql`
        query OrganizationBreadcrumbBreadcrumbPolicyOverviewQuery(
          $policyId: ID!
        ) {
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
        <BreadcrumbNavLink
          to={`/organizations/${organizationId}/policies/${policyId}`}
        >
          {data.policy?.name}
        </BreadcrumbNavLink>
      </BreadcrumbItem>
      <Outlet />
    </>
  );
}

function BreadcrumbMitigationList() {
  const { organizationId } = useParams();

  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbNavLink to={`/organizations/${organizationId}/mitigations`}>
          Mitigations
        </BreadcrumbNavLink>
      </BreadcrumbItem>
      <Outlet />
    </>
  );
}

function BreadcrumbMitigationView() {
  const { organizationId, mitigationId } = useParams();
  const data =
    useLazyLoadQuery<OrganizationBreadcrumbBreadcrumbMitigationViewQuery>(
      graphql`
        query OrganizationBreadcrumbBreadcrumbMitigationViewQuery(
          $mitigationId: ID!
        ) {
          mitigation: node(id: $mitigationId) {
            id
            ... on Mitigation {
              name
              category
            }
          }
        }
      `,
      { mitigationId: mitigationId! }
    );

  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbNavLink
          to={`/organizations/${organizationId}/mitigations#${data.mitigation.category}`}
        >
          {data.mitigation.category}
        </BreadcrumbNavLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbNavLink
          to={`/organizations/${organizationId}/mitigations/${mitigationId}`}
        >
          {data.mitigation.name}
        </BreadcrumbNavLink>
      </BreadcrumbItem>
    </>
  );
}

function BreadcrumbControl() {
  const { organizationId, frameworkId, controlId } = useParams();
  const data = useLazyLoadQuery<OrganizationBreadcrumbBreadcrumbControlQuery>(
    graphql`
      query OrganizationBreadcrumbBreadcrumbControlQuery($controlId: ID!) {
        control: node(id: $controlId) {
          id
          ... on Control {
            referenceId
          }
        }
      }
    `,
    { controlId: controlId! },
    { fetchPolicy: "store-or-network" }
  );
  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbNavLink
          to={`/organizations/${organizationId}/frameworks/${frameworkId}/controls/${controlId}`}
        >
          {data.control?.referenceId}
        </BreadcrumbNavLink>
      </BreadcrumbItem>
    </>
  );
}

function BreadcrumbRiskList() {
  const { organizationId } = useParams();
  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbNavLink to={`/organizations/${organizationId}/risks`}>
          Risks
        </BreadcrumbNavLink>
      </BreadcrumbItem>
      <Outlet />
    </>
  );
}

export function BreadCrumb() {
  return (
    <Routes>
      <Route
        element={
          <Suspense>
            <BreadCrumbOrganization />
          </Suspense>
        }
      >
        <Route path="mitigations" element={<BreadcrumbMitigationList />}>
          <Route path="new" element={<New />} />
          <Route
            path=":mitigationId"
            element={
              <Suspense>
                <BreadcrumbMitigationView />
              </Suspense>
            }
          />
        </Route>
        <Route path="risks" element={<BreadcrumbRiskList />}>
          <Route path="new" element={<New />} />
        </Route>
        <Route path="frameworks" element={<BreadcrumbFrameworkList />}>
          <Route
            path=":frameworkId"
            element={
              <Suspense>
                <BreadcrumbFrameworkOverview />
              </Suspense>
            }
          >
            <Route
              path="controls/:controlId"
              element={
                <Suspense>
                  <BreadcrumbControl />
                </Suspense>
              }
            />
            <Route
              path="mitigations/:mitigationId"
              element={
                <Suspense>
                  <BreadcrumbMitigationOverview />
                </Suspense>
              }
            >
              <Route path="update" element={<Edit />} />
            </Route>
            <Route path="update" element={<Edit />} />
          </Route>
          <Route path="create" element={<New />} />
        </Route>
        <Route path="people" element={<BreadcrumbPeopleList />}>
          <Route
            path=":peopleId"
            element={
              <Suspense>
                <BreadcrumbPeopleOverview />
              </Suspense>
            }
          />
          <Route path="create" element={<New />} />
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
            <Route path="update" element={<Edit />} />
          </Route>
          <Route path="create" element={<New />} />
        </Route>
        <Route
          path="settings"
          element={
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Settings</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          }
        />
      </Route>

      <Route path="*" element={<BreadcrumbHome />}>
        <Route
          path="create"
          element={
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Create Organization</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          }
        />
      </Route>
    </Routes>
  );
}
