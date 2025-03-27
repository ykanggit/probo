import { Suspense, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  graphql,
  useMutation,
  usePreloadedQuery,
  PreloadedQuery,
  useQueryLoader,
} from "react-relay";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  MitigationState,
  MitigationImportance,
  UpdateMitigationViewUpdateMitigationMutation,
} from "./__generated__/UpdateMitigationViewUpdateMitigationMutation.graphql";
import { PageTemplate } from "@/components/PageTemplate";
import { MitigationViewSkeleton } from "./MitigationPage";

const updateMitigationMutation = graphql`
  mutation UpdateMitigationViewUpdateMitigationMutation(
    $input: UpdateMitigationInput!
  ) {
    updateMitigation(input: $input) {
      mitigation {
        id
        name
        description
        category
        importance
        state
      }
    }
  }
`;

const updateMitigationQuery = graphql`
  query UpdateMitigationViewQuery($mitigationId: ID!) {
    node(id: $mitigationId) {
      ... on Mitigation {
        id
        name
        description
        category
        importance
        state
      }
    }
  }
`;

function EditableField({
  label,
  value,
  onChange,
  type = "text",
  helpText,
  required,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  helpText?: string;
  required?: boolean;
  multiline?: boolean;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={label} className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
        {helpText && (
          <div className="relative flex items-center">
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">{helpText}</span>
          </div>
        )}
      </div>
      {multiline ? (
        <Textarea
          id={label}
          value={value}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            onChange(e.target.value)
          }
          className={cn(
            "w-full resize-none",
            required && !value && "border-red-500"
          )}
          placeholder={`Enter ${label.toLowerCase()}`}
          rows={4}
        />
      ) : (
        <Input
          id={label}
          type={type}
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value)
          }
          className={cn("w-full", required && !value && "border-red-500")}
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      )}
    </div>
  );
}

function UpdateMitigationViewContent({
  queryRef,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queryRef: PreloadedQuery<any>;
}) {
  const { organizationId, frameworkId, mitigationId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const data = usePreloadedQuery(updateMitigationQuery, queryRef);
  const [editedFields, setEditedFields] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    state: "",
    importance: "",
  });

  useEffect(() => {
    if (data.node) {
      setFormData({
        name: data.node.name || "",
        description: data.node.description || "",
        category: data.node.category || "",
        state: data.node.state || "",
        importance: data.node.importance || "",
      });
    }
  }, [data.node]);

  const [commit, isInFlight] =
    useMutation<UpdateMitigationViewUpdateMitigationMutation>(
      updateMitigationMutation
    );

  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setEditedFields((prev) => new Set(prev).add(field));
  };

  const handleCancel = () => {
    navigate(
      `/organizations/${organizationId}/frameworks/${frameworkId}/mitigations/${mitigationId}`
    );
  };

  const hasChanges = editedFields.size > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.category) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const input: {
      id: string;
      name?: string;
      description?: string;
      category?: string;
      state?: MitigationState;
      importance?: MitigationImportance;
    } = {
      id: mitigationId!,
    };

    if (editedFields.has("name")) {
      input.name = formData.name;
    }
    if (editedFields.has("description")) {
      input.description = formData.description;
    }
    if (editedFields.has("category")) {
      input.category = formData.category;
    }
    if (editedFields.has("state")) {
      input.state = formData.state as MitigationState;
    }
    if (editedFields.has("importance")) {
      input.importance = formData.importance as MitigationImportance;
    }

    commit({
      variables: {
        input,
      },
      onCompleted(data, errors) {
        if (errors) {
          toast({
            title: "Error",
            description: errors[0]?.message || "Failed to update mitigation",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Success",
          description: "Mitigation updated successfully",
        });

        navigate(
          `/organizations/${organizationId}/frameworks/${frameworkId}/mitigations/${mitigationId}`
        );
      },
      onError(error) {
        toast({
          title: "Error",
          description: error.message || "Failed to update mitigation",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <PageTemplate
      title="Update Mitigation"
      description="Update the mitigation details"
    >
      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <EditableField
            label="Name"
            value={formData.name}
            onChange={(value) => handleFieldChange("name", value)}
            required
          />

          <EditableField
            label="Description"
            value={formData.description}
            onChange={(value) => handleFieldChange("description", value)}
            required
            multiline
            helpText="Provide a detailed description of the mitigation"
          />

          <EditableField
            label="Category"
            value={formData.category}
            onChange={(value) => handleFieldChange("category", value)}
            required
          />

          <div className="space-y-2">
            <Label htmlFor="importance" className="text-sm font-medium">
              Importance
            </Label>
            <Select
              value={formData.importance}
              onValueChange={(value) => handleFieldChange("importance", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select importance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MANDATORY">Mandatory</SelectItem>
                <SelectItem value="PREFERRED">Preferred</SelectItem>
                <SelectItem value="ADVANCED">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="state" className="text-sm font-medium">
              State
            </Label>
            <Select
              value={formData.state}
              onValueChange={(value) => handleFieldChange("state", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NOT_STARTED">Not Started</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="NOT_APPLICABLE">Not Applicable</SelectItem>
                <SelectItem value="IMPLEMENTED">Implemented</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isInFlight || !hasChanges}>
              {isInFlight ? "Updating..." : "Update Mitigation"}
            </Button>
          </div>
        </form>
      </Card>
    </PageTemplate>
  );
}

export default function UpdateControlView() {
  const { mitigationId } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [queryRef, loadQuery] = useQueryLoader<any>(updateMitigationQuery);

  useEffect(() => {
    if (mitigationId) {
      loadQuery({ mitigationId });
    }
  }, [mitigationId, loadQuery]);

  if (!queryRef) {
    return <MitigationViewSkeleton />;
  }

  return (
    <Suspense fallback={<MitigationViewSkeleton />}>
      <UpdateMitigationViewContent queryRef={queryRef} />
    </Suspense>
  );
}
