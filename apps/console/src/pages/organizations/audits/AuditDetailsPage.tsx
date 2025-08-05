import {
  ConnectionHandler,
  usePreloadedQuery,
  type PreloadedQuery,
} from "react-relay";
import {
  auditNodeQuery,
  useDeleteAudit,
  useUpdateAudit,
  useUploadAuditReport,
  useDeleteAuditReport,
} from "../../../hooks/graph/AuditGraph";
import {
  ActionDropdown,
  Badge,
  Breadcrumb,
  Button,
  DropdownItem,
  Field,
  IconTrashCan,
  Option,
  Input,
  Dropzone,
  Card,
  IconArrowInbox,
  useConfirm,
  useToast,
} from "@probo/ui";
import { useTranslate } from "@probo/i18n";
import { useOrganizationId } from "/hooks/useOrganizationId";
import { ControlledField } from "/components/form/ControlledField";
import { useFormWithSchema } from "/hooks/useFormWithSchema";
import z from "zod";
import { getAuditStateLabel, getAuditStateVariant, auditStates, fileSize, sprintf } from "@probo/helpers";
import type { AuditGraphNodeQuery } from "/hooks/graph/__generated__/AuditGraphNodeQuery.graphql";

const updateAuditSchema = z.object({
  validFrom: z.string().optional(),
  validUntil: z.string().optional(),
  state: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "REJECTED", "OUTDATED"]),
});

type Props = {
  queryRef: PreloadedQuery<AuditGraphNodeQuery>;
};

export default function AuditDetailsPage(props: Props) {
  const audit = usePreloadedQuery<AuditGraphNodeQuery>(auditNodeQuery, props.queryRef);
  const auditEntry = audit.node;
  const { __, dateFormat } = useTranslate();
  const organizationId = useOrganizationId();

  if (!auditEntry || !auditEntry.id || !auditEntry.framework) {
    return <div>{__("Audit not found")}</div>;
  }

  const deleteAudit = useDeleteAudit(
    { id: auditEntry.id!, framework: { name: auditEntry.framework!.name } },
    ConnectionHandler.getConnectionID(organizationId, "AuditsPage_audits")
  );

  const { control, formState, handleSubmit, register, reset } = useFormWithSchema(updateAuditSchema, {
    defaultValues: {
      validFrom: auditEntry.validFrom?.split('T')[0] || "",
      validUntil: auditEntry.validUntil?.split('T')[0] || "",
      state: auditEntry.state || "NOT_STARTED",
    },
  });

  const updateAudit = useUpdateAudit();
  const [uploadAuditReport, isUploading] = useUploadAuditReport();
  const deleteAuditReport = useDeleteAuditReport();
  const confirm = useConfirm();
  const { toast } = useToast();

  const onSubmit = handleSubmit(async (formData) => {
    if (!auditEntry.id) return;

    try {
      const formatDatetime = (dateString?: string) => {
        if (!dateString) return undefined;
        return `${dateString}T00:00:00Z`;
      };

      await updateAudit({
        id: auditEntry.id,
        validFrom: formatDatetime(formData.validFrom),
        validUntil: formatDatetime(formData.validUntil),
        state: formData.state,
      });
      reset(formData);
      toast({
        title: __("Success"),
        description: __("Audit updated successfully"),
        variant: "success",
      });
    } catch (error) {
      toast({
        title: __("Error"),
        description: error instanceof Error ? error.message : __("Failed to update audit"),
        variant: "error",
      });
    }
  });

  const handleDeleteReport = () => {
    if (!auditEntry.report || !auditEntry.id) return;

    confirm(
      async () => {
        await deleteAuditReport({ auditId: auditEntry.id! });
      },
      {
        message: sprintf(
          __(
            'This will permanently delete the audit report "%s". This action cannot be undone.'
          ),
          auditEntry.report.filename
        ),
      }
    );
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          {
            label: __("Audits"),
            to: `/organizations/${organizationId}/audits`,
          },
          {
            label: auditEntry.framework?.name ?? __("Unknown Audit"),
          },
        ]}
      />

      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="text-2xl">{auditEntry.framework?.name}</div>
          <Badge variant={getAuditStateVariant(auditEntry.state || "NOT_STARTED")}>
            {getAuditStateLabel(__, auditEntry.state || "NOT_STARTED")}
          </Badge>
        </div>
        <ActionDropdown variant="secondary">
          <DropdownItem
            variant="danger"
            icon={IconTrashCan}
            onClick={deleteAudit}
          >
            {__("Delete")}
          </DropdownItem>
        </ActionDropdown>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form onSubmit={onSubmit} className="space-y-6">
          <ControlledField
            control={control}
            name="state"
            type="select"
            label={__("State")}
          >
            {auditStates.map((state) => (
              <Option key={state} value={state}>
                {getAuditStateLabel(__, state)}
              </Option>
            ))}
          </ControlledField>

          <Field label={__("Valid From")}>
            <Input {...register("validFrom")} type="date" />
          </Field>

          <Field label={__("Valid Until")}>
            <Input {...register("validUntil")} type="date" />
          </Field>

          <div className="flex justify-end">
            {formState.isDirty && (
              <Button type="submit" disabled={formState.isSubmitting}>
                {formState.isSubmitting ? __("Updating...") : __("Update")}
              </Button>
            )}
          </div>
        </form>

        <Card padded className="mt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{__("Audit Report")}</h3>

                        {auditEntry.report ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-success-50 border border-success-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <IconArrowInbox className="text-success-600" size={20} />
                    <div className="flex-1">
                      <p className="font-medium text-success-900">
                        {auditEntry.report.filename}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-success-700">
                        <span>
                          {fileSize(__, auditEntry.report.size)}
                        </span>
                        <span>
                          {__("Uploaded")} {dateFormat(auditEntry.report.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ActionDropdown>
                    <DropdownItem
                      onClick={() => {
                        if (auditEntry.report?.downloadUrl) {
                          window.open(auditEntry.report.downloadUrl, '_blank');
                        }
                      }}
                      icon={IconArrowInbox}
                    >
                      {__("Download")}
                    </DropdownItem>
                    <DropdownItem
                      variant="danger"
                      icon={IconTrashCan}
                      onClick={handleDeleteReport}
                    >
                      {__("Delete")}
                    </DropdownItem>
                  </ActionDropdown>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-neutral-600">
                  {__("Upload the final audit report document (PDF recommended)")}
                </p>
                <Dropzone
                  description={__("Only PDF, DOCX files up to 25MB are allowed")}
                  isUploading={isUploading}
                  onDrop={async (files) => {
                    if (files.length > 0 && auditEntry.id) {
                      await uploadAuditReport({
                        auditId: auditEntry.id,
                        file: files[0],
                      });
                      window.location.reload();
                    }
                  }}
                  accept={{
                    "application/pdf": [".pdf"],
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                      [".docx"],
                  }}
                  maxSize={25}
                />
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
