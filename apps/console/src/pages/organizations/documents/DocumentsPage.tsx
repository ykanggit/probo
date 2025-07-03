import { useTranslate } from "@probo/i18n";
import {
  PageHeader,
  Tbody,
  Thead,
  Tr,
  Th,
  Td,
  Avatar,
  Badge,
  IconTrashCan,
  Button,
  IconPlusLarge,
  useConfirm,
  ActionDropdown,
  DropdownItem,
  IconBell2,
} from "@probo/ui";
import {
  useFragment,
  usePaginationFragment,
  usePreloadedQuery,
  type PreloadedQuery,
} from "react-relay";
import { graphql } from "relay-runtime";
import type { DocumentGraphListQuery } from "/hooks/graph/__generated__/DocumentGraphListQuery.graphql";
import {
  documentsQuery,
  useDeleteDocumentMutation,
  useSendSigningNotificationsMutation,
} from "/hooks/graph/DocumentGraph";
import type { DocumentsPageListFragment$key } from "./__generated__/DocumentsPageListFragment.graphql";
import { usePageTitle } from "@probo/hooks";
import { sprintf, getDocumentTypeLabel } from "@probo/helpers";
import { CreateDocumentDialog } from "./dialogs/CreateDocumentDialog";
import type { DocumentsPageRowFragment$key } from "./__generated__/DocumentsPageRowFragment.graphql";
import { SortableTable, SortableTh } from "/components/SortableTable";

const documentsFragment = graphql`
  fragment DocumentsPageListFragment on Organization
  @refetchable(queryName: "DocumentsListQuery")
  @argumentDefinitions(
    first: { type: "Int", defaultValue: 50 }
    order: {
      type: "DocumentOrder"
      defaultValue: { field: TITLE, direction: ASC }
    }
    after: { type: "CursorKey", defaultValue: null }
    before: { type: "CursorKey", defaultValue: null }
    last: { type: "Int", defaultValue: null }
  ) {
    documents(
      first: $first
      after: $after
      last: $last
      before: $before
      orderBy: $order
    ) @connection(key: "DocumentsListQuery_documents") {
      __id
      edges {
        node {
          id
          ...DocumentsPageRowFragment
        }
      }
    }
  }
`;

type Props = {
  queryRef: PreloadedQuery<DocumentGraphListQuery>;
};

export default function DocumentsPage(props: Props) {
  const { __ } = useTranslate();

  const organization = usePreloadedQuery(
    documentsQuery,
    props.queryRef
  ).organization;
  const pagination = usePaginationFragment(
    documentsFragment,
    organization as DocumentsPageListFragment$key
  );

  const documents = pagination.data.documents.edges.map((edge) => edge.node);
  const connectionId = pagination.data.documents.__id;
  const [sendSigningNotifications] = useSendSigningNotificationsMutation();

  usePageTitle(__("Documents"));

  const handleSendSigningNotifications = () => {
    sendSigningNotifications({
      variables: {
        input: { organizationId: organization.id },
      },
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={__("Documents")}
        description={__("Manage your organization's documents")}
      >
        <div className="flex gap-2">
          <Button
            icon={IconBell2}
            variant="secondary"
            onClick={handleSendSigningNotifications}
          >
            {__("Send signing notifications")}
          </Button>
          <CreateDocumentDialog
            connection={connectionId}
            trigger={<Button icon={IconPlusLarge}>{__("New document")}</Button>}
          />
        </div>
      </PageHeader>
      <SortableTable {...pagination}>
        <Thead>
          <Tr>
            <SortableTh field="TITLE">{__("Name")}</SortableTh>
            <Th>{__("Status")}</Th>
            <SortableTh field="DOCUMENT_TYPE">{__("Type")}</SortableTh>
            <Th>{__("Owner")}</Th>
            <Th>{__("Last update")}</Th>
            <Th>{__("Signatures")}</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {documents.map((document) => (
            <DocumentRow
              key={document.id}
              document={document}
              organizationId={organization.id}
              connectionId={connectionId}
            />
          ))}
        </Tbody>
      </SortableTable>
    </div>
  );
}

const rowFragment = graphql`
  fragment DocumentsPageRowFragment on Document {
    id
    title
    description
    documentType
    updatedAt
    owner {
      id
      fullName
    }
    versions(first: 1) {
      edges {
        node {
          id
          status
          signatures(first: 100) {
            edges {
              node {
                id
                state
              }
            }
          }
        }
      }
    }
  }
`;

function DocumentRow({
  document: documentKey,
  organizationId,
  connectionId,
}: {
  document: DocumentsPageRowFragment$key;
  organizationId: string;
  connectionId: string;
}) {
  const document = useFragment<DocumentsPageRowFragment$key>(
    rowFragment,
    documentKey
  );
  const lastVersion = document.versions.edges[0].node;
  const isDraft = lastVersion.status === "DRAFT";
  const { __, dateFormat } = useTranslate();
  const signatures = lastVersion.signatures.edges.map((edge) => edge.node);
  const signedCount = signatures.filter(
    (signature) => signature.state === "SIGNED"
  ).length;
  const [deleteDocument] = useDeleteDocumentMutation();
  const confirm = useConfirm();

  const handleDelete = () => {
    confirm(
      () =>
        deleteDocument({
          variables: {
            input: { documentId: document.id },
            connections: [connectionId],
          },
        }),
      {
        message: sprintf(
          __(
            'This will permanently delete the document "%s". This action cannot be undone.'
          ),
          document.title
        ),
      }
    );
  };

  return (
    <Tr to={`/organizations/${organizationId}/documents/${document.id}`}>
      <Td>
        <div className="flex gap-4 items-center">
          <img
            src="/document.png"
            alt=""
            width={28}
            height={36}
            className="border-4 border-highlight rounded box-content"
          />
          {document.title}
        </div>
      </Td>
      <Td>
        <Badge variant={isDraft ? "neutral" : "success"}>
          {isDraft ? __("Draft") : __("Published")}
        </Badge>
      </Td>
      <Td>{getDocumentTypeLabel(__, document.documentType)}</Td>
      <Td>
        <div className="flex gap-2 items-center">
          <Avatar name={document.owner.fullName} />
          {document.owner.fullName}
        </div>
      </Td>
      <Td>
        {dateFormat(document.updatedAt, {
          year: "numeric",
          month: "short",
          day: "numeric",
          weekday: "short",
        })}
      </Td>
      <Td>
        {signedCount}/{signatures.length}
      </Td>
      <Td noLink width={50} className="text-end">
        <ActionDropdown>
          <DropdownItem
            variant="danger"
            icon={IconTrashCan}
            onClick={handleDelete}
          >
            {__("Delete")}
          </DropdownItem>
        </ActionDropdown>
      </Td>
    </Tr>
  );
}
