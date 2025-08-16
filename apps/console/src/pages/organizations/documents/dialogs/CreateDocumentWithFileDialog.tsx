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
  Dropzone,
  IconFolderUpload,
  IconTrashCan,
  useToast,
} from "@probo/ui";
import { type ReactNode, useState } from "react";
import { graphql, useMutation } from "react-relay";
import { useOrganizationId } from "/hooks/useOrganizationId";
import { useDocumentForm } from "/hooks/forms/useDocumentForm";
import { PeopleSelectField } from "/components/form/PeopleSelectField";
import type { CreateDocumentWithFileDialogMutation } from "./__generated__/CreateDocumentWithFileDialogMutation.graphql";
import { ControlledField } from "/components/form/ControlledField";
import { DocumentTypeOptions } from "/components/form/DocumentTypeOptions";

type Props = {
  trigger?: ReactNode;
  connection: string;
};

const createDocumentWithFileMutation = graphql`
  mutation CreateDocumentWithFileDialogMutation(
    $input: CreateDocumentWithFileInput!
    $connections: [ID!]!
  ) {
    createDocumentWithFile(input: $input) {
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
 * Dialog to create a document with file upload
 */
export function CreateDocumentWithFileDialog({ trigger, connection }: Props) {
  const { __ } = useTranslate();
  const organizationId = useOrganizationId();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const { control, handleSubmit, register, formState, reset } =
    useDocumentForm();
  const errors = formState.errors ?? {};
  const [createDocumentWithFile, isLoading] =
    useMutation<CreateDocumentWithFileDialogMutation>(createDocumentWithFileMutation);

  const onSubmit = handleSubmit((data) => {
    if (!selectedFile) {
      toast({
        title: __("Error"),
        description: __("Please select a file to upload."),
        variant: "error",
      });
      return;
    }

    createDocumentWithFile({
      variables: {
        input: {
          ...data,
          organizationId,
          file: null, // File will be handled via uploadables
        },
        connections: [connection!],
      },
      uploadables: {
        "input.file": selectedFile,
      },
      onCompleted: (_response, errors) => {
        if (errors && errors.length > 0) {
          toast({
            title: __("Error"),
            description: __("Failed to create document with file. Please try again."),
            variant: "error",
          });
          return;
        }
        
        toast({
          title: __("Success"),
          description: __("Document created successfully."),
          variant: "success",
        });
        
        dialogRef.current?.close();
        reset();
        setSelectedFile(null);
      },
      onError: (_error) => {
        toast({
          title: __("Error"),
          description: __("Failed to create document with file. Please try again."),
          variant: "error",
        });
      },
    });
  });

  const dialogRef = useDialogRef();

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Dialog
      ref={dialogRef}
      trigger={trigger}
      title={<Breadcrumb items={[__("Documents"), __("New Document")]} />}
    >
      <form onSubmit={onSubmit}>
        <DialogContent>
          {/* Document form */}
          <div className="py-5 px-6 space-y-4">
            <div>
              <Label htmlFor="title">
                {__("Title")}
              </Label>
              <Input
                id="title"
                type="text"
                placeholder={__("Enter document title")}
                aria-label={__("Title")}
                {...register("title")}
              />
              {errors.title && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="content">
                {__("Description")}
              </Label>
              <Textarea
                id="content"
                placeholder={__("Enter document description")}
                rows={4}
                aria-label={__("Description")}
                {...register("content")}
              />
              {errors.content && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.content.message}
                </p>
              )}
            </div>

            {/* File Upload Section */}
            <div className="space-y-3">
              <Label>{__("File Upload (Required)")}</Label>
              
              {!selectedFile ? (
                <div className="space-y-2">
                  <Dropzone
                    onDrop={handleFileSelect}
                    accept={{
                      'application/pdf': ['.pdf'],
                      'application/msword': ['.doc'],
                      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                      'text/plain': ['.txt'],
                      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
                    }}
                    maxSize={10} // 10MB
                    description={__("PDF, Word, Text, or Image files up to 10MB")}
                    isUploading={false}
                  />
                  <p className="text-xs text-gray-500 text-center">
                    {__("A file is required to create a document. You can create a simple text document by uploading a .txt file.")}
                  </p>
                </div>
              ) : (
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <IconFolderUpload className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(selectedFile.size)} • {selectedFile.type}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleFileRemove}
                      className="text-red-600 hover:text-red-700"
                    >
                      <IconTrashCan className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
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
          <Button 
            type="submit" 
            disabled={isLoading || !selectedFile}
            className="min-w-[140px]"
          >
            {isLoading ? __("Creating...") : __("Create Document")}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
