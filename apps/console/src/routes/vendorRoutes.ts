import { lazy } from "@probo/react-lazy";
import { loadQuery } from "react-relay";
import type { AppRoute } from "/routes.tsx";
import { relayEnvironment } from "/providers/RelayProviders";
import { PageSkeleton } from "/components/skeletons/PageSkeleton";
import { vendorNodeQuery, vendorsQuery } from "/hooks/graph/VendorGraph";
import { LinkCardSkeleton } from "/components/skeletons/LinkCardSkeleton";

export const vendorRoutes = [
  {
    path: "vendors",
    fallback: PageSkeleton,
    queryLoader: ({ organizationId }) =>
      loadQuery(relayEnvironment, vendorsQuery, { organizationId }),
    Component: lazy(() => import("/pages/organizations/vendors/VendorsPage")),
  },
  {
    path: "vendors/:vendorId",
    fallback: PageSkeleton,
    queryLoader: ({ vendorId, organizationId }) =>
      loadQuery(relayEnvironment, vendorNodeQuery, {
        vendorId,
        organizationId,
      }),
    Component: lazy(
      () => import("../pages/organizations/vendors/VendorDetailPage")
    ),
    children: [
      {
        path: "overview",
        fallback: LinkCardSkeleton,
        Component: lazy(
          () => import("../pages/organizations/vendors/tabs/VendorOverviewTab")
        ),
      },
      {
        path: "certifications",
        fallback: LinkCardSkeleton,
        Component: lazy(
          () =>
            import(
              "../pages/organizations/vendors/tabs/VendorCertificationsTab"
            )
        ),
      },
      {
        path: "compliance",
        fallback: LinkCardSkeleton,
        Component: lazy(
          () =>
            import("../pages/organizations/vendors/tabs/VendorComplianceTab")
        ),
      },
      {
        path: "risks",
        fallback: LinkCardSkeleton,
        Component: lazy(
          () =>
            import(
              "../pages/organizations/vendors/tabs/VendorRiskAssessmentTab"
            )
        ),
      },
      {
        path: "contacts",
        fallback: LinkCardSkeleton,
        Component: lazy(
          () =>
            import("../pages/organizations/vendors/tabs/VendorContactsTab")
        ),
      },
    ],
  },
] satisfies AppRoute[];
