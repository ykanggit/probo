import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";
import { CreateOrganizationPageSkeleton } from "./CreateOrganizationPage";
import { ControlOverviewPageSkeleton } from "./frameworks/controls/ControlOverviewPage";
import { CreateControlPageSkeleton } from "./frameworks/controls/CreateControlPage";
import { UpdateControlPageSkeleton } from "./frameworks/controls/UpdateControlPage";
import { CreateFrameworkPageSkeleton } from "./frameworks/CreateFrameworkPage";
import { UpdateFrameworkPageSkeleton } from "./frameworks/UpdateFrameworkPage";
import "./HomePage";
import { CreatePeoplePageSkeleton } from "./people/CreatePeoplePage";
import { PeopleListPageSkeleton } from "./people/PeopleListPage";
import { PeopleOverviewPageSkeleton } from "./people/PeopleOverviewPage";
import { CreatePolicyPageSkeleton } from "./policies/CreatePolicyPage";
import { PolicyListPageSkeleton } from "./policies/PolicyListPage";
import { PolicyOverviewPageSkeleton } from "./policies/PolicyOverviewPage";
import { UpdatePolicyPageSkeleton } from "./policies/UpdatePolicyPage";
import { SettingsPageSkeleton } from "./SettingsPage";
import { VendorListPage } from "./vendors/VendorListPage";
import { VendorOverviewPageSkeleton } from "./vendors/VendorOverviewPage";
import { ErrorBoundaryWithLocation } from "./ErrorBoundary";
import OrganizationLayout from "./OrganizationLayout";
import NoOrganizationLayout from "./NoOrganizationLayout";
import { FrameworkListPage } from "./frameworks/FrameworkListPage";
import { FrameworkPage } from "./frameworks/FrameworkPage";

const CreateOrganizationPage = lazy(() => import("./CreateOrganizationPage"));
const ControlOverviewPage = lazy(
  () => import("./frameworks/controls/ControlOverviewPage")
);
const CreateControlPage = lazy(
  () => import("./frameworks/controls/CreateControlPage")
);
const UpdateControlPage = lazy(
  () => import("./frameworks/controls/UpdateControlPage")
);
const CreateFrameworkPage = lazy(
  () => import("./frameworks/CreateFrameworkPage")
);
const UpdateFrameworkPage = lazy(
  () => import("./frameworks/UpdateFrameworkPage")
);
const HomePage = lazy(() => import("./HomePage"));
const CreatePeoplePage = lazy(() => import("./people/CreatePeoplePage"));
const PeopleListPage = lazy(() => import("./people/PeopleListPage"));
const PeopleOverviewPage = lazy(() => import("./people/PeopleOverviewPage"));
const CreatePolicyPage = lazy(() => import("./policies/CreatePolicyPage"));
const PolicyListPage = lazy(() => import("./policies/PolicyListPage"));
const PolicyOverviewPage = lazy(() => import("./policies/PolicyOverviewPage"));
const UpdatePolicyPage = lazy(() => import("./policies/UpdatePolicyPage"));
const SettingsPage = lazy(() => import("./SettingsPage"));

const VendorOverviewPage = lazy(() => import("./vendors/VendorOverviewPage"));

export function OrganizationsRoutes() {
  return (
    <Routes>
      <Route path=":organizationId/*" element={<OrganizationLayout />}>
        <Route
          index
          element={
            <Suspense>
              <ErrorBoundaryWithLocation>
                <HomePage />
              </ErrorBoundaryWithLocation>
            </Suspense>
          }
        />
        <Route
          path="people"
          element={
            <Suspense fallback={<PeopleListPageSkeleton />}>
              <ErrorBoundaryWithLocation>
                <PeopleListPage />
              </ErrorBoundaryWithLocation>
            </Suspense>
          }
        />
        <Route
          path="people/create"
          element={
            <Suspense fallback={<CreatePeoplePageSkeleton />}>
              <ErrorBoundaryWithLocation>
                <CreatePeoplePage />
              </ErrorBoundaryWithLocation>
            </Suspense>
          }
        />
        <Route
          path="people/:peopleId"
          element={
            <Suspense fallback={<PeopleOverviewPageSkeleton />}>
              <ErrorBoundaryWithLocation>
                <PeopleOverviewPage />
              </ErrorBoundaryWithLocation>
            </Suspense>
          }
        />
        <Route path="vendors" element={<VendorListPage />} />
        <Route path="frameworks" element={<FrameworkListPage />} />
        <Route
          path="frameworks/create"
          element={
            <Suspense fallback={<CreateFrameworkPageSkeleton />}>
              <ErrorBoundaryWithLocation>
                <CreateFrameworkPage />
              </ErrorBoundaryWithLocation>
            </Suspense>
          }
        />
        <Route path="frameworks/:frameworkId" element={<FrameworkPage />} />
        <Route
          path="frameworks/:frameworkId/update"
          element={
            <Suspense fallback={<UpdateFrameworkPageSkeleton />}>
              <ErrorBoundaryWithLocation>
                <UpdateFrameworkPage />
              </ErrorBoundaryWithLocation>
            </Suspense>
          }
        />
        <Route
          path="frameworks/:frameworkId/controls/create"
          element={
            <Suspense fallback={<CreateControlPageSkeleton />}>
              <ErrorBoundaryWithLocation>
                <CreateControlPage />
              </ErrorBoundaryWithLocation>
            </Suspense>
          }
        />
        <Route
          path="frameworks/:frameworkId/controls/:controlId"
          element={
            <Suspense fallback={<ControlOverviewPageSkeleton />}>
              <ErrorBoundaryWithLocation>
                <ControlOverviewPage />
              </ErrorBoundaryWithLocation>
            </Suspense>
          }
        />
        <Route
          path="frameworks/:frameworkId/controls/:controlId/update"
          element={
            <Suspense fallback={<UpdateControlPageSkeleton />}>
              <ErrorBoundaryWithLocation>
                <UpdateControlPage />
              </ErrorBoundaryWithLocation>
            </Suspense>
          }
        />
        <Route
          path="vendors/:vendorId"
          element={
            <Suspense fallback={<VendorOverviewPageSkeleton />}>
              <ErrorBoundaryWithLocation>
                <VendorOverviewPage />
              </ErrorBoundaryWithLocation>
            </Suspense>
          }
        />
        {/* Policy Routes */}
        <Route
          path="policies"
          element={
            <Suspense fallback={<PolicyListPageSkeleton />}>
              <ErrorBoundaryWithLocation>
                <PolicyListPage />
              </ErrorBoundaryWithLocation>
            </Suspense>
          }
        />
        <Route
          path="policies/create"
          element={
            <Suspense fallback={<CreatePolicyPageSkeleton />}>
              <ErrorBoundaryWithLocation>
                <CreatePolicyPage />
              </ErrorBoundaryWithLocation>
            </Suspense>
          }
        />
        <Route
          path="policies/:policyId"
          element={
            <Suspense fallback={<PolicyOverviewPageSkeleton />}>
              <ErrorBoundaryWithLocation>
                <PolicyOverviewPage />
              </ErrorBoundaryWithLocation>
            </Suspense>
          }
        />
        <Route
          path="policies/:policyId/update"
          element={
            <Suspense fallback={<UpdatePolicyPageSkeleton />}>
              <ErrorBoundaryWithLocation>
                <UpdatePolicyPage />
              </ErrorBoundaryWithLocation>
            </Suspense>
          }
        />
        <Route
          path="settings"
          element={
            <Suspense fallback={<SettingsPageSkeleton />}>
              <ErrorBoundaryWithLocation>
                <SettingsPage />
              </ErrorBoundaryWithLocation>
            </Suspense>
          }
        />
      </Route>

      <Route path="*" element={<NoOrganizationLayout />}>
        <Route
          path="create"
          element={
            <Suspense fallback={<CreateOrganizationPageSkeleton />}>
              <ErrorBoundaryWithLocation>
                <CreateOrganizationPage />
              </ErrorBoundaryWithLocation>
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}
