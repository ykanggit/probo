import { Route, Routes } from "react-router";
import { VendorListPage } from "./vendors/VendorListPage";
import OrganizationLayout from "./OrganizationLayout";
import NoOrganizationLayout from "./NoOrganizationLayout";
import { FrameworkListPage } from "./frameworks/FrameworkListPage";
import { FrameworkPage } from "./frameworks/FrameworkPage";
import { PeopleListPage } from "./people/PeopleListPage";
import { CreatePeoplePage } from "./people/CreatePeoplePage";
import { PeoplePage } from "./people/PeoplePage";
import { CreateFrameworkPage } from "./frameworks/CreateFrameworkPage";
import { UpdateFrameworkPage } from "./frameworks/UpdateFrameworkPage";
import { CreateControlPage } from "./frameworks/controls/CreateControlPage";
import { ControlPage } from "./frameworks/controls/ControlPage";
import { UpdateControlPage } from "./frameworks/controls/UpdateControlPage";
import { VendorPage } from "./vendors/VendorPage";
import { PolicyListPage } from "./policies/PolicyListPage";
import { CreatePolicyPage } from "./policies/CreatePolicyPage";
import { PolicyPage } from "./policies/PolicyPage";
import { UpdatePolicyPage } from "./policies/UpdatePolicyPage";
import { SettingsPage } from "./SettingsPage";
import { CreateOrganizationPage } from "./CreateOrganizationPage";
import HomePage from "./HomePage";

export function OrganizationsRoutes() {
  return (
    <Routes>
      <Route path=":organizationId/*" element={<OrganizationLayout />}>
        <Route index element={<HomePage />} />
        <Route path="people" element={<PeopleListPage />} />
        <Route path="people/create" element={<CreatePeoplePage />} />
        <Route path="people/:peopleId" element={<PeoplePage />} />
        <Route path="vendors" element={<VendorListPage />} />
        <Route path="frameworks" element={<FrameworkListPage />} />
        <Route path="frameworks/create" element={<CreateFrameworkPage />} />
        <Route path="frameworks/:frameworkId" element={<FrameworkPage />} />
        <Route
          path="frameworks/:frameworkId/update"
          element={<UpdateFrameworkPage />}
        />
        <Route
          path="frameworks/:frameworkId/controls/create"
          element={<CreateControlPage />}
        />
        <Route
          path="frameworks/:frameworkId/controls/:controlId"
          element={<ControlPage />}
        />
        <Route
          path="frameworks/:frameworkId/controls/:controlId/update"
          element={<UpdateControlPage />}
        />
        <Route path="vendors/:vendorId" element={<VendorPage />} />
        <Route path="policies" element={<PolicyListPage />} />
        <Route path="policies/create" element={<CreatePolicyPage />} />
        <Route path="policies/:policyId" element={<PolicyPage />} />
        <Route
          path="policies/:policyId/update"
          element={<UpdatePolicyPage />}
        />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<NoOrganizationLayout />}>
        <Route path="create" element={<CreateOrganizationPage />} />
      </Route>
    </Routes>
  );
}
