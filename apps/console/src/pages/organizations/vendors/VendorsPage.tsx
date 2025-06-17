import {
  Button,
  IconPlusLarge,
  PageHeader,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  RiskBadge,
  Badge,
  ActionDropdown,
  DropdownItem,
  IconTrashCan,
} from "@probo/ui";
import { useTranslate } from "@probo/i18n";
import { usePageTitle } from "@probo/hooks";
import {
  usePaginationFragment,
  usePreloadedQuery,
  type PreloadedQuery,
} from "react-relay";
import { useOrganizationId } from "/hooks/useOrganizationId";
import { faviconUrl } from "@probo/helpers";
import type { NodeOf } from "/types";
import { CreateVendorDialog } from "./dialogs/CreateVendorDialog";
import {
  paginatedVendorsFragment,
  useDeleteVendor,
  vendorsQuery,
} from "/hooks/graph/VendorGraph";
import type { VendorGraphListQuery } from "/hooks/graph/__generated__/VendorGraphListQuery.graphql";
import type {
  VendorGraphPaginatedFragment$data,
  VendorGraphPaginatedFragment$key,
} from "/hooks/graph/__generated__/VendorGraphPaginatedFragment.graphql";
import { SortableTable } from "/components/SortableTable";

type Vendor = NodeOf<VendorGraphPaginatedFragment$data["vendors"]>;

type Props = {
  queryRef: PreloadedQuery<VendorGraphListQuery>;
};

export default function VendorsPage(props: Props) {
  const { __ } = useTranslate();
  const organizationId = useOrganizationId();

  const data = usePreloadedQuery(vendorsQuery, props.queryRef);
  const pagination = usePaginationFragment(
    paginatedVendorsFragment,
    data.node as VendorGraphPaginatedFragment$key
  );

  const vendors = pagination.data.vendors?.edges.map((edge) => edge.node);
  const connectionId = pagination.data.vendors.__id;

  usePageTitle(__("Vendors"));

  return (
    <div className="space-y-6">
      <PageHeader
        title={__("Vendors")}
        description={__(
          "Vendors are third-party services that your company uses. Add them to keep track of their risk and compliance status."
        )}
      >
        <CreateVendorDialog
          connection={connectionId}
          organizationId={organizationId}
        >
          <Button icon={IconPlusLarge}>{__("Add vendor")}</Button>
        </CreateVendorDialog>
      </PageHeader>
      <SortableTable {...pagination}>
        <Thead>
          <Tr>
            <Th>{__("Vendor")}</Th>
            <Th>{__("Accessed At")}</Th>
            <Th>{__("Data Risk")}</Th>
            <Th>{__("Business Risk")}</Th>
            <Th>{__("Compliance status")}</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {vendors?.map((vendor) => (
            <VendorRow
              key={vendor.id}
              vendor={vendor}
              organizationId={organizationId}
              connectionId={connectionId}
            />
          ))}
        </Tbody>
      </SortableTable>
    </div>
  );
}

function VendorRow({
  vendor,
  organizationId,
  connectionId,
}: {
  vendor: Vendor;
  organizationId: string;
  connectionId: string;
}) {
  const { __, dateFormat } = useTranslate();
  const latestAssessment = vendor.riskAssessments?.edges[0]?.node;
  const isExpired = latestAssessment
    ? new Date(latestAssessment.expiresAt) < new Date()
    : false;

  const deleteVendor = useDeleteVendor(vendor, connectionId);

  return (
    <>
      <Tr to={`/organizations/${organizationId}/vendors/${vendor.id}/overview`}>
        <Td>
          <div className="flex gap-2 items-center">
            <Avatar name={vendor.name} src={faviconUrl(vendor.websiteUrl)} />
            <div>{vendor.name}</div>
          </div>
        </Td>
        <Td>
          {latestAssessment?.assessedAt
            ? dateFormat(latestAssessment.assessedAt, {
                day: "2-digit",
                weekday: "short",
                month: "short",
              })
            : __("Not assessed")}
        </Td>
        <Td>
          <RiskBadge level={latestAssessment?.dataSensitivity ?? "NONE"} />
        </Td>
        <Td>
          <RiskBadge level={latestAssessment?.businessImpact ?? "NONE"} />
        </Td>
        <Td>
          <Badge variant={isExpired ? "danger" : "warning"}>
            {isExpired ? __("Late") : __("In progress")}
          </Badge>
        </Td>
        <Td noLink width={50} className="text-end">
          <ActionDropdown>
            <DropdownItem
              onClick={deleteVendor}
              variant="danger"
              icon={IconTrashCan}
            >
              {__("Delete")}
            </DropdownItem>
          </ActionDropdown>
        </Td>
      </Tr>
    </>
  );
}
