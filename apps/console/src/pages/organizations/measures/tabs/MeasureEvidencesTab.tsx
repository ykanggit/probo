import { useNavigate, useOutletContext, useParams } from "react-router";
import type { MeasureEvidencesTabFragment$key } from "./__generated__/MeasureEvidencesTabFragment.graphql";
import { useTranslate } from "@probo/i18n";
import { usePageTitle } from "@probo/hooks";
import {
  ActionDropdown,
  DropdownItem,
  Dropzone,
  IconArrowInbox,
  IconTrashCan,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useConfirm,
} from "@probo/ui";
import { graphql } from "relay-runtime";
import { useFragment, useMutation, useRefetchableFragment } from "react-relay";
import { SortableTable } from "/components/SortableTable";
import type { MeasureEvidencesTabFragment_evidence$key } from "./__generated__/MeasureEvidencesTabFragment_evidence.graphql";
import { fileSize, fileType, promisifyMutation, sprintf } from "@probo/helpers";
import { EvidencePreviewDialog } from "../dialog/EvidencePreviewDialog";
import { useOrganizationId } from "/hooks/useOrganizationId";

export const evidencesFragment = graphql`
  fragment MeasureEvidencesTabFragment on Measure
  @refetchable(queryName: "MeasureEvidencesTabQuery")
  @argumentDefinitions(
    first: { type: "Int", defaultValue: 50 }
    order: { type: "EvidenceOrder", defaultValue: null }
    after: { type: "CursorKey", defaultValue: null }
    before: { type: "CursorKey", defaultValue: null }
    last: { type: "Int", defaultValue: null }
  ) {
    id
    evidences(
      first: $first
      after: $after
      last: $last
      before: $before
      orderBy: $order
    ) @connection(key: "MeasureEvidencesTabFragment_evidences") {
      __id
      edges {
        node {
          id
          filename
          fileUrl
          mimeType
          ...MeasureEvidencesTabFragment_evidence
        }
      }
    }
  }
`;

export const evidenceFragment = graphql`
  fragment MeasureEvidencesTabFragment_evidence on Evidence {
    id
    filename
    size
    type
    createdAt
    fileUrl
    mimeType
  }
`;

const uploadEvidenceMutation = graphql`
  mutation MeasureEvidencesTabUploadMutation(
    $input: UploadMeasureEvidenceInput!
    $connections: [ID!]!
  ) {
    uploadMeasureEvidence(input: $input) {
      evidenceEdge @appendEdge(connections: $connections) {
        node {
          id
          ...MeasureEvidencesTabFragment_evidence
        }
      }
    }
  }
`;

const deleteEvidenceMutation = graphql`
  mutation MeasureEvidencesTabDeleteMutation(
    $input: DeleteEvidenceInput!
    $connections: [ID!]!
  ) {
    deleteEvidence(input: $input) {
      deletedEvidenceId @deleteEdge(connections: $connections)
    }
  }
`;

export default function MeasureEvidencesTab() {
  const { measure } = useOutletContext<{
    measure: MeasureEvidencesTabFragment$key & { id: string; name: string };
  }>();
  const { evidenceId } = useParams<{ evidenceId: string }>();
  const [data, refetch] = useRefetchableFragment(evidencesFragment, measure);
  const connectionId = data.evidences.__id;
  const evidences = data.evidences?.edges?.map((edge) => edge.node) ?? [];
  const navigate = useNavigate();
  const { __ } = useTranslate();
  const [mutate, isUpdating] = useMutation(uploadEvidenceMutation);
  const evidence = evidences.find((e) => e.id === evidenceId);
  const organizationId = useOrganizationId();

  usePageTitle(measure.name + " - " + __("Evidences"));

  const handleDrop = (files: File[]) => {
    for (const file of files) {
      mutate({
        variables: {
          connections: [connectionId],
          input: {
            measureId: measure.id,
            file: null,
          },
        },
        uploadables: {
          "input.file": file,
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      <Dropzone
        description={__(
          "Only PDF, DOCX, XLSX, PPTX, JPG, PNG, WEBP files up to 10MB are allowed",
        )}
        isUploading={isUpdating}
        onDrop={handleDrop}
        accept={{
          "application/pdf": [".pdf"],
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            [".docx"],
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
            ".xlsx",
          ],
          "application/vnd.openxmlformats-officedocument.presentationml.presentation":
            [".pptx"],
          "image/jpeg": [".jpg", ".jpeg"],
          "image/png": [".png"],
          "image/webp": [".webp"],
        }}
        maxSize={10}
      />
      <SortableTable refetch={refetch}>
        <Thead>
          <Tr>
            <Th>{__("Evidence name")}</Th>
            <Th>{__("Type")}</Th>
            <Th>{__("File size")}</Th>
            <Th>{__("Created at")}</Th>
            <Th width={50}></Th>
          </Tr>
        </Thead>
        <Tbody>
          {evidences.map((evidence) => (
            <EvidenceRow
              key={evidence.id}
              evidenceKey={evidence}
              measureId={measure.id}
              organizationId={organizationId}
              connectionId={connectionId}
            />
          ))}
        </Tbody>
      </SortableTable>
      {evidence && (
        <EvidencePreviewDialog
          key={evidence?.id}
          onClose={() =>
            navigate(
              `/organizations/${organizationId}/measures/${measure.id}/evidences`,
            )
          }
          evidence={evidence}
        />
      )}
    </div>
  );
}

function EvidenceRow(props: {
  evidenceKey: MeasureEvidencesTabFragment_evidence$key;
  measureId: string;
  organizationId: string;
  connectionId: string;
}) {
  const evidence = useFragment(evidenceFragment, props.evidenceKey);
  const { __, dateFormat } = useTranslate();

  const [mutate, isDeleting] = useMutation(deleteEvidenceMutation);
  const confirm = useConfirm();

  const handleDelete = () => {
    confirm(
      () => {
        return promisifyMutation(mutate)({
          variables: {
            connections: [props.connectionId],
            input: {
              evidenceId: evidence.id,
            },
          },
        });
      },
      {
        message: sprintf(
          __(
            'This will permanently delete the evidence "%s". This action cannot be undone.',
          ),
          evidence.filename,
        ),
      },
    );
  };

  return (
    <Tr
      to={`/organizations/${props.organizationId}/measures/${props.measureId}/evidences/${evidence.id}`}
    >
      <Td>{evidence.filename}</Td>
      <Td>{fileType(__, evidence)}</Td>
      <Td>{fileSize(__, evidence.size)}</Td>
      <Td>{dateFormat(evidence.createdAt)}</Td>
      <Td noLink>
        <div className="flex gap-2">
          <ActionDropdown>
            <DropdownItem asChild>
              <a href={evidence.fileUrl ?? ""} target="_blank">
                <IconArrowInbox size={16} />
                {__("Download")}
              </a>
            </DropdownItem>
            <DropdownItem
              variant="danger"
              icon={IconTrashCan}
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {__("Delete")}
            </DropdownItem>
          </ActionDropdown>
        </div>
      </Td>
    </Tr>
  );
}
