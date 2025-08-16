import { useTranslate } from "@probo/i18n";
import { useOutletContext } from "react-router";
import { FilePreview } from "/components/documents/FilePreview";
import type { DocumentDetailPageDocumentFragment$data } from "../__generated__/DocumentDetailPageDocumentFragment.graphql";
import type { NodeOf } from "/types";

export default function FileTab() {
  const { __ } = useTranslate();
  
  const { version } = useOutletContext<{
    version: NodeOf<DocumentDetailPageDocumentFragment$data["versions"]>;
  }>();

  if (!version?.fileName) {
    return (
      <div className="p-6 text-center text-gray-500">
        {__("No file attached to this document version.")}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          {__("File Information")}
        </h2>
        <p className="text-gray-600">
          {__("Preview and download the file attached to this document version.")}
        </p>
      </div>

      <FilePreview
        documentVersionId={version.id}
        fileName={version.fileName}
        fileSize={version.fileSize}
        fileType={version.fileType}
      />
    </div>
  );
}
