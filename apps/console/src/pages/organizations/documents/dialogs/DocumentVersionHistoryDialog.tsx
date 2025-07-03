import {
  Avatar,
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  IconArrowInbox,
  Markdown,
} from "@probo/ui";
import { graphql } from "relay-runtime";
import { useTranslate } from "@probo/i18n";
import { useState, type ReactNode } from "react";
import { useFragment } from "react-relay";
import type { DocumentVersionHistoryDialogFragment$key } from "./__generated__/DocumentVersionHistoryDialogFragment.graphql";
import type { DocumentVersionHistoryDialogExportPDFMutation } from "./__generated__/DocumentVersionHistoryDialogExportPDFMutation.graphql";
import clsx from "clsx";
import type { NodeOf } from "/types";
import type { DocumentDetailPageDocumentFragment$data } from "../__generated__/DocumentDetailPageDocumentFragment.graphql";
import { useMutationWithToasts } from "/hooks/useMutationWithToasts";

const historyFragment = graphql`
  fragment DocumentVersionHistoryDialogFragment on DocumentVersion {
    id
    version
    status
    content
    changelog
    publishedAt
    updatedAt
    publishedBy {
      fullName
    }
  }
`;

const exportPDFMutation = graphql`
  mutation DocumentVersionHistoryDialogExportPDFMutation(
    $documentVersionId: ID!
  ) {
    exportDocumentVersionPDF(input: { documentVersionId: $documentVersionId }) {
      data
    }
  }
`;

type Props = {
  document: DocumentDetailPageDocumentFragment$data;
  children?: ReactNode;
};

type Version = NodeOf<DocumentDetailPageDocumentFragment$data["versions"]>;

export function DocumentVersionHistoryDialog(props: Props) {
  const { __ } = useTranslate();
  const versions = props.document.versions.edges.map((edge) => edge.node);
  const [selectedVersion, setSelectedVersion] = useState<Version>(versions[0]);
  const [exportPDF, isExporting] =
    useMutationWithToasts<DocumentVersionHistoryDialogExportPDFMutation>(
      exportPDFMutation,
      {
        errorMessage: __("Failed to export PDF"),
        successMessage: __("PDF exported successfully"),
      }
    );

  const handleDownloadPDF = () => {
    exportPDF({
      variables: { documentVersionId: selectedVersion.id },
      onCompleted: (data) => {
        if (data.exportDocumentVersionPDF.data) {
          // Handle data URI format (data:application/pdf;base64,...)
          const dataUri = data.exportDocumentVersionPDF.data;

          // Extract base64 part from data URI
          const base64Data = dataUri.split(",")[1];

          // Convert base64 to blob and download
          const binaryString = atob(base64Data);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `${props.document.title}-v${selectedVersion.version}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      },
    });
  };

  return (
    <Dialog trigger={props.children}>
      <DialogContent className="flex" scrollableChildren>
        <aside className="p-6 overflow-y-auto w-60 flex-none space-y-2">
          <DialogTitle className="text-base text-txt-primary font-medium mb-4">
            {__("Version History")}
          </DialogTitle>
          {versions.map((version) => (
            <VersionItem
              key={version.id}
              document={props.document}
              version={version}
              active={selectedVersion === version}
              onSelect={setSelectedVersion}
            />
          ))}
        </aside>
        <main className="flex-1 px-12 py-8">
          <div className="mb-4">
            <Button
              onClick={handleDownloadPDF}
              icon={IconArrowInbox}
              variant="secondary"
              disabled={isExporting}
            >
              {isExporting ? __("Exporting...") : __("Download PDF")}
            </Button>
          </div>
          <Markdown content={selectedVersion.content} />
        </main>
      </DialogContent>
      <DialogFooter />
    </Dialog>
  );
}

function VersionItem(props: {
  document: DocumentDetailPageDocumentFragment$data;
  version: Version;
  active?: boolean;
  onSelect: (v: Version) => void;
}) {
  const version = useFragment<DocumentVersionHistoryDialogFragment$key>(
    historyFragment,
    props.version
  );
  const { dateTimeFormat } = useTranslate();
  return (
    <button
      onClick={() => props.onSelect(props.version)}
      className={clsx(
        "flex items-center gap-2 py-2 px-[10px] w-full hover:bg-tertiary-hover cursor-pointer rounded",
        props.active && "bg-tertiary-pressed"
      )}
    >
      <Avatar
        name={version.publishedBy?.fullName ?? props.document.owner.fullName}
        size="l"
      />
      <div className="text-start space-y-[2px] w-full overflow-hidden">
        <div className="text-sm text-txt-primary whitespace-nowrap overflow-hidden text-ellipsis">
          {version.publishedBy?.fullName ?? props.document.owner.fullName}
        </div>
        <div className="text-xs text-txt-secondary whitespace-nowrap overflow-hidden text-ellipsis">
          {dateTimeFormat(version.publishedAt ?? version.updatedAt)}
        </div>
      </div>
    </button>
  );
}
