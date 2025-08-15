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
  Checkbox,
  IconCrossLargeX,
  IconSignature,
  IconCheckmark1,
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
import { useList, usePageTitle } from "@probo/hooks";
import { sprintf, getDocumentTypeLabel } from "@probo/helpers";
import { CreateDocumentDialog } from "./dialogs/CreateDocumentDialog";
import type { DocumentsPageRowFragment$key } from "./__generated__/DocumentsPageRowFragment.graphql";
import { SortableTable, SortableTh } from "/components/SortableTable";
import { PublishDocumentsDialog } from "./dialogs/PublishDocumentsDialog.tsx";
import { SignatureDocumentsDialog } from "./dialogs/SignatureDocumentsDialog.tsx";

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

  const documents = pagination.data.documents.edges
    .map((edge) => edge.node)
    .filter((document) => document != null);
  const connectionId = pagination.data.documents.__id;
  const [sendSigningNotifications] = useSendSigningNotificationsMutation();
  const { list: selection, toggle, clear, reset } = useList<string>([]);

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
          {selection.length === 0 ? (
            <Tr>
              <Th>
                <Checkbox
                  checked={selection.length === documents.length && documents.length > 0}
                  onChange={() => reset(documents.map((d) => d?.id).filter(Boolean))}
                />
              </Th>
              <SortableTh field="TITLE">{__("Name")}</SortableTh>
              <Th>{__("Status")}</Th>
              <SortableTh field="DOCUMENT_TYPE">{__("Type")}</SortableTh>
              <Th>{__("Owner")}</Th>
              <Th>{__("Last update")}</Th>
              <Th>{__("Signatures")}</Th>
              <Th></Th>
            </Tr>
          ) : (
            <Tr>
              <Th colspan={8}>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    {sprintf(__("%s documents selected"), selection.length)} -
                    <button
                      onClick={clear}
                      className="flex gap-1 items-center hover:text-txt-primary"
                    >
                      <IconCrossLargeX size={12} />
                      {__("Clear selection")}
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <PublishDocumentsDialog
                      documentIds={selection}
                      onSave={clear}
                    >
                      <Button icon={IconCheckmark1}>{__("Publish")}</Button>
                    </PublishDocumentsDialog>
                    <SignatureDocumentsDialog
                      documentIds={selection}
                      onSave={clear}
                    >
                      <Button variant="secondary" icon={IconSignature}>
                        {__("Request signature")}
                      </Button>
                    </SignatureDocumentsDialog>
                  </div>
                </div>
              </Th>
            </Tr>
          )}
        </Thead>
        <Tbody>
          {documents.map((document) => (
            <DocumentRow
              checked={selection.includes(document.id)}
              onCheck={() => toggle(document.id)}
              key={document.id}
              document={document}
              organizationId={organization.id}
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
    controls(first: 1) {
      edges {
        node {
          id
          name
        }
      }
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
  checked,
  onCheck,
}: {
  document: DocumentsPageRowFragment$key;
  organizationId: string;
  checked: boolean;
  onCheck: () => void;
}) {
  const document = useFragment<DocumentsPageRowFragment$key>(
    rowFragment,
    documentKey
  );
  
  // Safety check: if document is null, don't render
  if (!document) {
    return null;
  }
  
  const lastVersion = document.versions.edges[0]?.node;
  if (!lastVersion) {
    return null;
  }
  const isDraft = lastVersion.status === "DRAFT";
  const { __, dateFormat } = useTranslate();
  const signatures = lastVersion.signatures?.edges?.map((edge) => edge.node) ?? [];
  const signedCount = signatures.filter(
    (signature) => signature.state === "SIGNED"
  ).length;
  const [deleteDocument] = useDeleteDocumentMutation();
  const confirm = useConfirm();

    const handleDelete = () => {
    const linkedControls = document.controls?.edges?.map(edge => edge.node) ?? [];
    const hasLinkedControls = linkedControls.length > 0;
    
    if (hasLinkedControls) {
      // Document has linked controls - show informational message with OK button only
      alert(__('You have linked controls. Unlink before delete.'));
    } else {
      // No linked controls - proceed with normal deletion
      confirm(
        () =>
          deleteDocument({
            variables: {
              input: { documentId: document.id },
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
    }
  };

  return (
    <Tr to={`/organizations/${organizationId}/documents/${document.id}`}>
      <Td noLink>
        <Checkbox checked={checked} onChange={onCheck} />
      </Td>
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
