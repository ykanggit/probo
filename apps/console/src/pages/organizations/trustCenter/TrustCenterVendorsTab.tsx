import { Card, Spinner } from "@probo/ui";
import { useOutletContext } from "react-router";
import { TrustCenterVendorsCard } from "/components/trustCenter/TrustCenterVendorsCard";
import { useTrustCenterVendorUpdate } from "/hooks/graph/TrustCenterVendorGraph";
import type { TrustCenterVendorsCardFragment$key } from "/components/trustCenter/__generated__/TrustCenterVendorsCardFragment.graphql";

type ContextType = {
  organization: {
    vendors?: {
      edges: Array<{
        node: TrustCenterVendorsCardFragment$key;
      }>;
    };
  };
};

export default function TrustCenterVendorsTab() {
  const { organization } = useOutletContext<ContextType>();
  const [updateVendorVisibility, isUpdatingVendors] = useTrustCenterVendorUpdate();

  const vendors = organization.vendors?.edges?.map((edge) => edge.node) || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {isUpdatingVendors && <Spinner />}
      </div>
      <Card padded>
        <TrustCenterVendorsCard
          vendors={vendors}
          params={{}}
          disabled={isUpdatingVendors}
          onToggleVisibility={updateVendorVisibility}
          variant="table"
        />
      </Card>
    </div>
  );
}
