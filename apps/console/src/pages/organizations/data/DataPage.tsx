import {
  Button,
  IconPlusLarge,
  PageHeader,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  ActionDropdown,
  DropdownItem,
  IconTrashCan,
  Avatar,
} from "@probo/ui";
import { useTranslate } from "@probo/i18n";
import { usePageTitle } from "@probo/hooks";
import {
  usePaginationFragment,
  usePreloadedQuery,
  type PreloadedQuery,
} from "react-relay";
import { useOrganizationId } from "/hooks/useOrganizationId";
import { CreateDatumDialog } from "./dialogs/CreateDatumDialog";
import { useDeleteDatum, dataQuery } from "../../../hooks/graph/DatumGraph";
import type { DatumGraphListQuery } from "/hooks/graph/__generated__/DatumGraphListQuery.graphql";
import { faviconUrl } from "@probo/helpers";
import type { NodeOf } from "/types";
import type {
  DataPageFragment$data,
  DataPageFragment$key,
} from "./__generated__/DataPageFragment.graphql";
import { SortableTable } from "/components/SortableTable";

const paginatedDataFragment = graphql`
  fragment DataPageFragment on Organization
  @refetchable(queryName: "DataListQuery")
  @argumentDefinitions(
    first: { type: "Int", defaultValue: 10 }
    orderBy: { type: "DatumOrder", defaultValue: null }
    after: { type: "CursorKey", defaultValue: null }
    before: { type: "CursorKey", defaultValue: null }
    last: { type: "Int", defaultValue: null }
  ) {
    data(
      first: $first
      after: $after
      last: $last
      before: $before
      orderBy: $orderBy
    ) @connection(key: "DataPage_data") {
      __id
      edges {
        node {
          id
          name
          dataClassification
          owner {
            fullName
          }
          vendors(first: 50) {
            edges {
              node {
                id
                name
                websiteUrl
              }
            }
          }
          createdAt
        }
      }
    }
  }
`;

type DataEntry = NodeOf<DataPageFragment$data["data"]>;

type Props = {
  queryRef: PreloadedQuery<DatumGraphListQuery>;
};

export default function DataPage(props: Props) {
  const { __ } = useTranslate();
  const organizationId = useOrganizationId();

  const data = usePreloadedQuery(dataQuery, props.queryRef);
  const pagination = usePaginationFragment(
    paginatedDataFragment,
    data.node as DataPageFragment$key
  );

  const dataEntries = pagination.data.data.edges.map((edge) => edge.node);
  const connectionId = pagination.data.data.__id;

  usePageTitle(__("Data"));

  return (
    <div className="space-y-6">
      <PageHeader
        title={__("Data")}
        description={__(
          "Manage your organization's data assets and their classifications."
        )}
      >
        <CreateDatumDialog
          connection={connectionId}
          organizationId={organizationId}
        >
          <Button icon={IconPlusLarge}>{__("Add data")}</Button>
        </CreateDatumDialog>
      </PageHeader>
      <SortableTable {...pagination}>
        <Thead>
          <Tr>
            <Th>{__("Name")}</Th>
            <Th>{__("Classification")}</Th>
            <Th>{__("Owner")}</Th>
            <Th>{__("Vendors")}</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {dataEntries.map((entry) => (
            <DataRow key={entry.id} entry={entry} connectionId={connectionId} />
          ))}
        </Tbody>
      </SortableTable>
    </div>
  );
}

function DataRow({
  entry,
  connectionId,
}: {
  entry: DataEntry;
  connectionId: string;
}) {
  const organizationId = useOrganizationId();
  const { __ } = useTranslate();
  const deleteDatum = useDeleteDatum(entry, connectionId);
  const vendors = entry.vendors?.edges.map((edge) => edge.node) ?? [];

  return (
    <Tr to={`/organizations/${organizationId}/data/${entry.id}`}>
      <Td>{entry.name}</Td>
      <Td>
        <Badge variant="info">{entry.dataClassification}</Badge>
      </Td>
      <Td>{entry.owner?.fullName ?? __("Unassigned")}</Td>
      <Td>
        {vendors.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {vendors.slice(0, 3).map((vendor) => (
              <Badge
                key={vendor.id}
                variant="neutral"
                className="flex items-center gap-1"
              >
                <Avatar
                  name={vendor.name}
                  src={faviconUrl(vendor.websiteUrl)}
                  size="s"
                />
                <span className="text-xs">{vendor.name}</span>
              </Badge>
            ))}
            {vendors.length > 3 && (
              <Badge variant="neutral" className="text-xs">
                +{vendors.length - 3}
              </Badge>
            )}
          </div>
        ) : (
          <span className="text-txt-secondary text-sm">{__("None")}</span>
        )}
      </Td>
      <Td noLink width={50} className="text-end">
        <ActionDropdown>
          <DropdownItem
            onClick={deleteDatum}
            variant="danger"
            icon={IconTrashCan}
          >
            {__("Delete")}
          </DropdownItem>
        </ActionDropdown>
      </Td>
    </Tr>
  );
}
