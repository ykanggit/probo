import { Route, Routes } from "react-router";
import NotFoundPage from "../NotFoundPage";
import { CreateOrganizationPage } from "./CreateOrganizationPage";
import HomePage from "./HomePage";
import NoOrganizationLayout from "./NoOrganizationLayout";
import OrganizationLayout from "./OrganizationLayout";
import { SettingsPage } from "./SettingsPage";
import { CreateFrameworkPage } from "./frameworks/CreateFrameworkPage";
import { FrameworkLayout } from "./frameworks/FrameworkLayout";
import { FrameworkListPage } from "./frameworks/FrameworkListPage";
import { FrameworkPage } from "./frameworks/FrameworkPage";
import { UpdateFrameworkPage } from "./frameworks/UpdateFrameworkPage";
import { ControlPage } from "./frameworks/controls/ControlPage";
import { EditMitigationPage } from "./mitigations/EditMitigationPage";
import { MitigationListPage } from "./mitigations/MitigationListPage";
import { MitigationNewPage } from "./mitigations/MitigationNewPage";
import { MitigationPage } from "./mitigations/MitigationPage";
import { CreatePeoplePage } from "./people/CreatePeoplePage";
import { PeopleListPage } from "./people/PeopleListPage";
import { PeoplePage } from "./people/PeoplePage";
import { CreatePolicyPage } from "./policies/CreatePolicyPage";
import { PolicyListPage } from "./policies/PolicyListPage";
import { PolicyPage } from "./policies/PolicyPage";
import { UpdatePolicyPage } from "./policies/UpdatePolicyPage";
import { NewRiskPage } from "./risks/NewRiskPage";
import { RiskListPage } from "./risks/RiskListPage";
import ShowRiskView from "./risks/ShowRiskView";
import { VendorListPage } from "./vendors/VendorListPage";
import { VendorPage } from "./vendors/VendorPage";

export function OrganizationsRoutes() {
  return (
    <Routes>
      <Route path=":organizationId/*" element={<OrganizationLayout />}>
        <Route index element={<HomePage />} />
        <Route path="people" element={<PeopleListPage />} />
        <Route path="people/new" element={<CreatePeoplePage />} />
        <Route path="people/:peopleId" element={<PeoplePage />} />
        <Route path="vendors" element={<VendorListPage />} />
        <Route path="frameworks" element={<FrameworkListPage />} />
        <Route path="frameworks/new" element={<CreateFrameworkPage />} />
        <Route path="frameworks/:frameworkId/*">
          <Route element={<FrameworkLayout />}>
            <Route index element={<FrameworkPage />} />
            <Route path="controls/:controlId" element={<ControlPage />} />
          </Route>
          <Route path="edit" element={<UpdateFrameworkPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="mitigations" element={<MitigationListPage />} />
        <Route path="mitigations/new" element={<MitigationNewPage />} />
        <Route path="mitigations/:mitigationId" element={<MitigationPage />} />
        <Route
          path="mitigations/:mitigationId/edit"
          element={<EditMitigationPage />}
        />
        <Route path="vendors/:vendorId" element={<VendorPage />} />
        <Route path="policies" element={<PolicyListPage />} />
        <Route path="policies/new" element={<CreatePolicyPage />} />
        <Route path="policies/:policyId" element={<PolicyPage />} />
        <Route path="policies/:policyId/edit" element={<UpdatePolicyPage />} />
        <Route path="risks" element={<RiskListPage />} />
        <Route path="risks/new" element={<NewRiskPage />} />
        <Route path="risks/:riskId" element={<ShowRiskView />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route path="*" element={<NoOrganizationLayout />}>
        <Route path="new" element={<CreateOrganizationPage />} />
      </Route>
    </Routes>
  );
}
