import { Card, Spinner } from "@probo/ui";
import { useOutletContext } from "react-router";
import { TrustCenterAuditsCard } from "/components/trustCenter/TrustCenterAuditsCard";
import { useTrustCenterAuditUpdate } from "/hooks/graph/TrustCenterAuditGraph";
import type { TrustCenterAuditsCardFragment$key } from "/components/trustCenter/__generated__/TrustCenterAuditsCardFragment.graphql";

type ContextType = {
  organization: {
    audits?: {
      edges: Array<{
        node: TrustCenterAuditsCardFragment$key;
      }>;
    };
  };
};

export default function TrustCenterAuditsTab() {
  const { organization } = useOutletContext<ContextType>();
  const [updateAuditVisibility, isUpdatingAudits] = useTrustCenterAuditUpdate();

  const audits = (organization.audits?.edges ?? []).map((edge) => edge.node);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {isUpdatingAudits && <Spinner />}
      </div>
      <Card padded>
        <TrustCenterAuditsCard
          audits={audits}
          params={{}}
          disabled={isUpdatingAudits}
          onToggleVisibility={updateAuditVisibility}
          variant="table"
        />
      </Card>
    </div>
  );
}
