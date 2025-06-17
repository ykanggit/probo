import {
  Button,
  Dialog,
  DialogContent,
  IconArrowInbox,
  IconFilter,
} from "@probo/ui";
import { useTranslate } from "@probo/i18n";

type Props = {
  evidence: {
    filename: string;
    fileUrl?: string | null;
    mimeType: string;
  };
  onClose: () => void;
};

export function EvidencePreviewDialog({ evidence, onClose }: Props) {
  const { __ } = useTranslate();
  return (
    <Dialog defaultOpen title={evidence.filename} onClose={onClose}>
      <DialogContent padded>
        <p>
          {__(
            "Preview of the evidence file. You can view or download the file from here."
          )}
        </p>
        <EvidencePreviewContent evidence={evidence} />
      </DialogContent>
    </Dialog>
  );
}

function EvidencePreviewContent({ evidence }: Pick<Props, "evidence">) {
  const { __ } = useTranslate();

  if (!evidence.fileUrl) {
    return null;
  }

  if (evidence.mimeType.startsWith("image/")) {
    return (
      <img
        src={evidence.fileUrl}
        alt={evidence.filename}
        className="max-h-[70vh] object-contain"
      />
    );
  }

  if (evidence.mimeType.includes("pdf")) {
    return (
      <iframe
        src={evidence.fileUrl}
        className="w-full h-[70vh]"
        title={evidence.filename}
      />
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 justify-center">
      <IconFilter size={20} />
      <p className="text-secondary text-center">
        {__("Preview not availeeable for this file type") +
          " " +
          evidence.mimeType}
      </p>
      <Button asChild variant="secondary" icon={IconArrowInbox}>
        <a href={evidence.fileUrl} target="_blank">
          {__("Download File")}
        </a>
      </Button>
    </div>
  );
}
