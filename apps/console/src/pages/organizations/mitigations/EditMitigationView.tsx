import { Suspense, useEffect, useState } from "react";
import {
  graphql,
  PreloadedQuery,
  useMutation,
  usePreloadedQuery,
  useQueryLoader,
} from "react-relay";
import { useParams, useNavigate } from "react-router";
import { PageTemplate } from "@/components/PageTemplate";
import { useToast } from "@/hooks/use-toast";
import { EditMitigationViewUpdateMitigationMutation } from "./__generated__/EditMitigationViewUpdateMitigationMutation.graphql";
import { EditableField } from "@/components/EditableField";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { EditMitigationViewSkeleton } from "./EditMitigationPage";
import { EditMitigationViewQuery } from "./__generated__/EditMitigationViewQuery.graphql";

const editMitigationQuery = graphql`
  query EditMitigationViewQuery($mitigationId: ID!) {
    node(id: $mitigationId) {
      ... on Mitigation {
        id
        name
        description
        category
        importance
      }
    }
  }
`;

const updateMitigationMutation = graphql`
  mutation EditMitigationViewUpdateMitigationMutation(
    $input: UpdateMitigationInput!
  ) {
    updateMitigation(input: $input) {
      mitigation {
        id
        name
        description
      }
    }
  }
`;

function EditMitigationViewContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<EditMitigationViewQuery>;
}) {
  const { organizationId } = useParams<{
    organizationId: string;
  }>();
  const { mitigationId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { node: mitigation } = usePreloadedQuery(editMitigationQuery, queryRef);
  const [formData, setFormData] = useState({
    name: mitigation.name ?? "",
    description: mitigation.description ?? "",
    category: mitigation.category ?? "",
    importance: mitigation.importance,
  });

  const [commit, isInFlight] =
    useMutation<EditMitigationViewUpdateMitigationMutation>(
      updateMitigationMutation
    );

  const handleFieldChange = (field: keyof typeof formData, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    commit({
      variables: {
        input: {
          id: mitigationId!,
          name: formData.name,
          description: formData.description,
          category: formData.category,
          importance: formData.importance,
        },
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
          `/organizations/${organizationId}/mitigations/${mitigationId}`
        );
      },
      onError(error) {
        toast({
          title: "Error",
          description: error.message || "Failed to update framework",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <PageTemplate
      title="Edit Mitigation"
      description="Edit a mitigation. You will be able to link it to control and risks"
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

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="text-sm">Importance</Label>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleFieldChange("importance", "MANDATORY")}
                  className={cn(
                    "rounded-full cursor-pointer px-4 py-1 text-sm transition-colors",
                    formData.importance === "MANDATORY"
                      ? "bg-danger-bg text-danger ring ring-danger-b"
                      : "bg-invert-bg hover:bg-h-invert-bg"
                  )}
                >
                  Mandatory
                </button>
                <button
                  type="button"
                  onClick={() => handleFieldChange("importance", "PREFERRED")}
                  className={cn(
                    "rounded-full cursor-pointer px-4 py-1 text-sm transition-colors",
                    formData.importance === "PREFERRED"
                      ? "bg-warning-bg text-warning ring ring-warning-b"
                      : "bg-invert-bg hover:bg-h-invert-bg"
                  )}
                >
                  Preferred
                </button>
                <button
                  type="button"
                  onClick={() => handleFieldChange("importance", "ADVANCED")}
                  className={cn(
                    "rounded-full cursor-pointer px-4 py-1 text-sm transition-colors",
                    formData.importance === "ADVANCED"
                      ? "bg-info-bg text-info ring ring-info-b"
                      : "bg-invert-bg hover:bg-h-invert-bg"
                  )}
                >
                  Advanced
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                navigate(
                  `/organizations/${organizationId}/mitigations/${mitigationId}`
                )
              }
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isInFlight}>
              {isInFlight ? "Updating..." : "Update Mitigation"}
            </Button>
          </div>
        </form>
      </Card>
    </PageTemplate>
  );
}

export default function EditMitigationView() {
  const { mitigationId } = useParams();
  const [queryRef, loadQuery] =
    useQueryLoader<EditMitigationViewQuery>(editMitigationQuery);

  useEffect(() => {
    if (mitigationId) {
      loadQuery({ mitigationId });
    }
  }, [mitigationId, loadQuery]);

  if (!queryRef) {
    return <EditMitigationViewSkeleton />;
  }

  return (
    <Suspense fallback={<EditMitigationViewSkeleton />}>
      <EditMitigationViewContent queryRef={queryRef} />
    </Suspense>
  );
}
