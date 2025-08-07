import { useTranslate } from "@probo/i18n";
import {
  Badge,
  Breadcrumb,
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  Input,
  Label,
  PropertyRow,
  Textarea,
  useDialogRef,
} from "@probo/ui";
import { type ReactNode } from "react";
import { graphql } from "relay-runtime";
import { useOrganizationId } from "/hooks/useOrganizationId";
import { useDocumentForm } from "/hooks/forms/useDocumentForm";
import { useMutationWithToasts } from "/hooks/useMutationWithToasts";
import { PeopleSelectField } from "/components/form/PeopleSelectField";
import type { CreateDocumentDialogMutation } from "./__generated__/CreateDocumentDialogMutation.graphql";
import { ControlledField } from "/components/form/ControlledField";
import { DocumentTypeOptions } from "/components/form/DocumentTypeOptions";

type Props = {
  trigger?: ReactNode;
  connection: string;
};

const createDocumentMutation = graphql`
  mutation CreateDocumentDialogMutation(
    $input: CreateDocumentInput!
    $connections: [ID!]!
  ) {
    createDocument(input: $input) {
      documentEdge @prependEdge(connections: $connections) {
        node {
          id
          ...DocumentsPageRowFragment
        }
      }
    }
  }
`;

/**
 * Dialog to create or update a document
 */
export function CreateDocumentDialog({ trigger, connection }: Props) {
  const { __ } = useTranslate();
  const organizationId = useOrganizationId();

  const { control, handleSubmit, register, formState, reset } =
    useDocumentForm();
  const errors = formState.errors ?? {};
  const [createDocument, isLoading] =
    useMutationWithToasts<CreateDocumentDialogMutation>(createDocumentMutation);

  const onSubmit = handleSubmit((data) => {
    createDocument({
      variables: {
        input: {
          ...data,
          organizationId,
        },
        connections: [connection!],
      },
      successMessage: __("Document created successfully."),
      errorMessage: __("Failed to create document. Please try again."),
      onSuccess: () => {
        dialogRef.current?.close();
        reset();
      },
    });
  });

  const dialogRef = useDialogRef();

  return (
    <Dialog
      ref={dialogRef}
      trigger={trigger}
      title={<Breadcrumb items={[__("Documents"), __("New Document")]} />}
    >
      <form onSubmit={onSubmit}>
        <DialogContent className="grid grid-cols-[1fr_420px]">
          <div className="py-8 px-10 space-y-4">
            <Input
              id="title"
              aria-label={__("Title")}
              required
              variant="title"
              placeholder={__("Document title")}
              {...register("title")}
            />
            <Textarea
              id="content"
              variant="ghost"
              autogrow
              placeholder={__("Add description")}
              aria-label={__("Description")}
              {...register("content")}
            />
          </div>
          {/* Properties form */}
          <div className="py-5 px-6 bg-subtle">
            <Label>{__("Properties")}</Label>
            <PropertyRow label={__("Status")}>
              <Badge variant="neutral" size="md">
                {__("Draft")}
              </Badge>
            </PropertyRow>

            <PropertyRow
              id="documentType"
              label={__("Type")}
              error={errors.documentType?.message}
            >
              <ControlledField
                control={control}
                name="documentType"
                type="select"
              >
                <DocumentTypeOptions />
              </ControlledField>
            </PropertyRow>

            <PropertyRow
              id="ownerId"
              label={__("Owner")}
              error={errors.ownerId?.message}
            >
              <PeopleSelectField
                name="ownerId"
                control={control}
                organizationId={organizationId}
              />
            </PropertyRow>
          </div>
        </DialogContent>
        <DialogFooter>
          <Button type="submit" disabled={isLoading}>
            {__("Create document")}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
