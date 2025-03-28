import { Route, Routes } from "react-router";
import NotFoundPage from "../NotFoundPage";
import { CreateOrganizationPage } from "./CreateOrganizationPage";
import HomePage from "./HomePage";
import NoOrganizationLayout from "./NoOrganizationLayout";
import OrganizationLayout from "./OrganizationLayout";
import { SettingsPage } from "./SettingsPage";
import { CreateFrameworkPage } from "./frameworks/CreateFrameworkPage";
import { FrameworkListPage } from "./frameworks/FrameworkListPage";
import { FrameworkPage } from "./frameworks/FrameworkPage";
import { UpdateFrameworkPage } from "./frameworks/UpdateFrameworkPage";
import { ControlPage } from "./frameworks/controls/ControlPage";
import { MitigationPage } from "./mitigations/MitigationPage";
import { MitigationListPage } from "./mitigations/MitigationListPage";
import { CreatePeoplePage } from "./people/CreatePeoplePage";
import { PeopleListPage } from "./people/PeopleListPage";
import { PeoplePage } from "./people/PeoplePage";
import { CreatePolicyPage } from "./policies/CreatePolicyPage";
import { PolicyListPage } from "./policies/PolicyListPage";
import { PolicyPage } from "./policies/PolicyPage";
import { UpdatePolicyPage } from "./policies/UpdatePolicyPage";
import { VendorListPage } from "./vendors/VendorListPage";
import { VendorPage } from "./vendors/VendorPage";

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
        <Route path="frameworks/:frameworkId/*">
          <Route element={<FrameworkPage />}>
            <Route index />
            <Route path="controls/:controlId" element={<ControlPage />} />
          </Route>
          <Route path="update" element={<UpdateFrameworkPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="mitigations" element={<MitigationListPage />} />
        <Route path="mitigations/:mitigationId" element={<MitigationPage />} />
        <Route path="vendors/:vendorId" element={<VendorPage />} />
        <Route path="policies" element={<PolicyListPage />} />
        <Route path="policies/create" element={<CreatePolicyPage />} />
        <Route path="policies/:policyId" element={<PolicyPage />} />
        <Route
          path="policies/:policyId/update"
          element={<UpdatePolicyPage />}
        />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route path="*" element={<NoOrganizationLayout />}>
        <Route path="create" element={<CreateOrganizationPage />} />
      </Route>
    </Routes>
  );
}
